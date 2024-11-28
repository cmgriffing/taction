# Taction

Taction is a CLI utility to make authoring GitHub Actions easier and more type-safe. It parses an action.yml file and generates typescript types for the inputs and outputs. More commands may be added in the future.

## Installation

```bash
npm install -g taction
# or
yarn global add taction
# or
pnpm add -g taction
```

### Without Global Install

```bash
npm install --save-dev taction
# or
yarn add --dev taction
# or
pnpm add --dev taction
```

### Without Installing

```bash
npx taction types ./action.yml ./src/typed-core.ts
# or
pnpm dlx taction types ./action.yml ./src/typed-core.ts
```

## Usage

### `taction types <infile> <outfile>`

Parse an action.yml file and generate typescript types for the inputs and outputs

```bash
taction types action.yml typed-core.ts
```

#### Arguments

- `infile`: path of action.yml file to parse
- `outfile`: path of typed core file to output

### Importing the Typed Core

Import the typed core in your typescript file and use it instead of the core module. The keys will now be typed and will error out if you misspell a key or try to use one that is not an input or output.

```typescript
import typedCore from "./typed-core";

const myInput = typedCore.getInput("myInput");
const myBooleanInput = typedCore.getBooleanInput("myBooleanInput");
typedCore.setOutput("myOutput", "value");
```

#### Typed Core

The typed core is a wrapper of the core module with the following modifications:

- `getInput(inputName: StringInputs): string`
- `getBooleanInput(inputName: BooleanInputs): boolean`
- `setOutput(outputName: Outputs, value: any)`

`StringInputs` and `BooleanInputs` are the union of all the inputs that are strings and booleans respectively.

`Outputs` is the union of all the outputs.

## License

MIT © Chris Griffing
