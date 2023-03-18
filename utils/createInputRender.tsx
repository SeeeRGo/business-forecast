import { TextField } from "@mui/material";
import { ComponentProps } from "react";
import AccountSelect from "../components/AccountSelect";
import Input from "../components/Input";
import { createOnChangeHandler } from "./createOnChangeHandler";

export const createInputRenderer = (
    state: any[],
    setState: (newSt: any[]) => void,
    fieldName: string,
    inputProps?: Pick<ComponentProps<typeof Input>, 'min' | 'max' | 'type'>
  ) =>
  function CreatedInput(value: string | number | boolean | Date, rowIndex: number) {
    return typeof value === "string" || typeof value === "number" ? (
      <Input
        value={value}
        onChange={createOnChangeHandler(state, setState, rowIndex, fieldName)}
        {...inputProps}
      />
    ) : null;
  }

export const createTextAreaRenderer = (
    state: any[],
    setState: (newSt: any[]) => void,
    fieldName: string,
    inputProps?: Pick<ComponentProps<typeof Input>, 'min' | 'max' | 'type'>,
  ) =>
  function CreatedTextArea(value: string | number | boolean | Date, rowIndex: number) {
    return typeof value === "string" ? (
      <TextField
        sx={{
          ".MuiInputBase-root": {
            padding: 0,
            minWidth: 300,
          },
        }}
        multiline
        maxRows={4}
        value={value}
        onChange={(ev) => {
          return createOnChangeHandler(
            state,
            setState,
            rowIndex,
            fieldName
          )(ev.target.value);
        }}
        {...inputProps}
      />
    ) : null;
  }

export const createSelectRenderer =
  (
    state: any[],
    setState: (newSt: any[]) => void,
    fieldName: string,
    options: string[]
  ) =>
  function CreatedSelect(value: string | number | boolean | Date, rowIndex: number) {
    return (
      <AccountSelect
        value={`${value}`}
        onChange={createOnChangeHandler(state, setState, rowIndex, fieldName)}
        options={options}
      />
    );
  }
