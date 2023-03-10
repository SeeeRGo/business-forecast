export const createOnChangeHandler =
  (
    state: any[][],
    setState: (newSt: any[][]) => void,
    rowIndex: number,
    fieldName: string,
  ) =>
  (value: string) => {
    let newState = [...state];

    newState[rowIndex] = {
      ...newState[rowIndex],
      [fieldName]: value
    };

    setState(newState);
  };
  