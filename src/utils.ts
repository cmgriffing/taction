import { ChoiceInput } from "./types";

export function renderTypedCore(
  stringInputs: string[],
  booleanInputs: string[],
  choiceInputs: ChoiceInput[],
  outputs: string[]
) {
  return `import * as core from '@actions/core'

type StringInputs = ${
    stringInputs.map((input) => `'${input}'`).join(" | ") || "''"
  }
type BooleanInputs = ${
    booleanInputs.map((input) => `'${input}'`).join(" | ") || "''"
  }

interface IChoiceInputs {
  ${choiceInputs
    .map((input) => `${input.name}: ${input.options.join(" | ")}`)
    .join("\n")}
}

type Outputs = ${outputs.map((output) => `'${output}'`).join(" | ") || "''"}

const typedCore = {
  ...core,
  getInput: (inputName: StringInputs): string => core.getInput(inputName),
  getBooleanInput: (inputName: BooleanInputs): boolean =>
    core.getBooleanInput(inputName),
  getNumberInput: (inputName: StringInputs): number => {
    const result = parseFloat(core.getInput(inputName))

    if (isNaN(result)) {
      throw new Error(\`Input \${inputName} is not a number\`)
    }

    return result
  },
  getChoiceInput<T extends keyof IChoiceInputs>(
    inputName: T
  ): IChoiceInputs[T] {
    return core.getInput(inputName) as IChoiceInputs[T]
  },
  setOutput: (outputName: Outputs, value: any) =>
    core.setOutput(outputName, value)
}

export default typedCore;
`;
}
