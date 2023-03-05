import { ComponentProps } from "react";
import { AccountSelect } from "../components/AccountSelect";
import { Input } from "../components/Input";
import { createOnChangeHandler } from "./createOnChangeHandler";

export const createInputRenderer = (
    state: any[][],
    setState: (newSt: any[][]) => void,
    fieldName: string,
    type: ComponentProps<typeof Input>['type']
  ) =>
  function CreatedInput(value, rowIndex) {
    return (
      <Input
        type={type}
        value={value}
        onChange={createOnChangeHandler(state, setState, rowIndex, fieldName)}
      />
    );
  }

export const createSelectRenderer =
  (
    state: any[],
    setState: (newSt: any[]) => void,
    fieldName: string
  ) =>
  function CreatedSelect(value, rowIndex) {
    return (
      <AccountSelect
        value={value}
        onChange={createOnChangeHandler(state, setState, rowIndex, fieldName)}
      />
    );
  }
