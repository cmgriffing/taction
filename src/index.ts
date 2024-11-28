#!/bin/node

import fs from "fs";
import yaml from "yaml";
import { program } from "commander";

program
  .name("taction")
  .description(
    "CLI utility to make authoring GitHub Actions easier and more type-safe"
  )
  .version("0.1.0");

program
  .command("types")
  .description(
    "Parse the an action.yml file and generate typescript types for the inputs and outputs"
  )
  .argument("infile", "path of action.yml file to parse")
  .argument("outfile", "path of typed core file to output")
  .action(async (infile, outfile, options) => {
    try {
      const yamlText = await fs.promises.readFile(infile, "utf8");
      const actionYaml = yaml.parse(yamlText);

      const stringInputs: string[] = [];
      const booleanInputs: string[] = [];
      const outputs: string[] = [];

      const inputsSection: Record<
        string,
        { required?: boolean; type?: TypedValueType }
      > = actionYaml.inputs || {};
      const outputsSection: Record<
        string,
        { required?: boolean; type?: TypedValueType }
      > = actionYaml.outputs || {};

      Object.entries(inputsSection).forEach(([key, input]) => {
        if (input.type === "boolean") {
          booleanInputs.push(key);
        } else {
          stringInputs.push(key);
        }
      });

      Object.entries(outputsSection).forEach(([key, output]) => {
        outputs.push(key);
      });

      const typedCore = renderTypedCore(stringInputs, booleanInputs, outputs);

      await fs.promises.writeFile(outfile, typedCore);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse();

type TypedValueType = "string" | "boolean";

function renderTypedCore(
  stringInputs: string[],
  booleanInputs: string[],
  outputs: string[]
) {
  return `import * as core from '@actions/core'

type StringInputs = ${
    stringInputs.map((input) => `'${input}'`).join(" | ") || "''"
  }
type BooleanInputs = ${
    booleanInputs.map((input) => `'${input}'`).join(" | ") || "''"
  }

type Outputs = ${outputs.map((output) => `'${output}'`).join(" | ") || "''"}

const typedCore = {
  ...core,
  getInput: (inputName: StringInputs): string => core.getInput(inputName),
  getBooleanInput: (inputName: BooleanInputs): boolean =>
    core.getBooleanInput(inputName),
  setOutput: (outputName: Outputs, value: any) =>
    core.setOutput(outputName, value)
}

export default typedCore;
`;
}
