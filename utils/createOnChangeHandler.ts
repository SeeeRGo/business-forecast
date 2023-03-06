import { ChangeEvent } from "react";

export const createOnChangeHandler =
  (
    state: any[][],
    setState: (newSt: any[][]) => void,
    rowIndex: number,
    fieldName: string,
  ) =>
  (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let newState = [...state];

    newState[rowIndex] = {
      ...newState[rowIndex],
      [fieldName]: ev.target.value
    };

    setState(newState);
  };