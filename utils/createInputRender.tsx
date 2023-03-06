import { ComponentProps } from "react";
import AccountSelect from "../components/AccountSelect";
import Input from "../components/Input";
import { AccountType } from "../types";
import { createOnChangeHandler } from "./createOnChangeHandler";

export const createInputRenderer = (
    state: any[],
    setState: (newSt: any[]) => void,
    fieldName: string,
    type?: ComponentProps<typeof Input>['type']
  ) =>
  function CreatedInput(value: string | number | boolean | Date, rowIndex: number) {
    return typeof value === 'string' || typeof value === 'number' ? (
      <Input
        type={type}
        value={value}
        onChange={createOnChangeHandler(state, setState, rowIndex, fieldName)}
      />
    ) : null;
  }

export const createSelectRenderer =
  (
    state: any[],
    setState: (newSt: any[]) => void,
    fieldName: string
  ) =>
  function CreatedSelect(value: string | number | boolean | Date, rowIndex: number) {
    return (
      <AccountSelect
        value={value as AccountType}
        onChange={createOnChangeHandler(state, setState, rowIndex, fieldName)}
      />
    );
  }
