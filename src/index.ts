#! /usr/bin/env node

import fs from "fs";
import yaml from "yaml";
import { program } from "commander";

import type {
  ChoiceInput,
  StringInputMetadata,
  BooleanInputMetadata,
  ChoiceInputMetadata,
  InputMetadata,
} from "./types";
import { renderTypedCore } from "./utils";

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
      const choiceInputs: ChoiceInput[] = [];
      const outputs: string[] = [];

      const inputsSection: Record<
        string,
        StringInputMetadata | BooleanInputMetadata | ChoiceInputMetadata
      > = actionYaml.inputs || {};
      const outputsSection: Record<string, InputMetadata> =
        actionYaml.outputs || {};

      Object.entries(inputsSection).forEach(([key, input]) => {
        if (input.type === "boolean") {
          booleanInputs.push(key);
        } else if (input.type === "choice") {
          const choiceInput: ChoiceInput = {
            name: key,
            options: input.options || [],
          };
          choiceInputs.push(choiceInput);
        } else {
          stringInputs.push(key);
        }
      });

      Object.entries(outputsSection).forEach(([key, output]) => {
        outputs.push(key);
      });

      const typedCore = renderTypedCore(
        stringInputs,
        booleanInputs,
        choiceInputs,
        outputs
      );

      await fs.promises.writeFile(outfile, typedCore);

      console.log(`Generated typed GitHub Actions core at ${outfile}`);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  });

program.parse();
