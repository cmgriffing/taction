export type TypedValueType = "string" | "boolean" | "choice";

export interface ChoiceInput {
  name: string;
  options: string[];
}

export type InputMetadata = {
  required?: boolean;
  type?: TypedValueType;
};

export interface StringInputMetadata extends InputMetadata {
  type: "string";
}

export interface BooleanInputMetadata extends InputMetadata {
  type: "boolean";
}

export interface ChoiceInputMetadata extends InputMetadata {
  type: "choice";
  options: string[];
}
