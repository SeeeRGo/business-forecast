import { Balance } from "@/components/Balance";
import Table from "@/components/Table";
import { BUDGET_ENTRY_KEYS, timeInputFormat } from "@/constants";
import { IAccount, ParsedBudgetEntry } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import {
  createInputRenderer,
  createSelectRenderer,
} from "@/utils/createInputRender";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { format, parse, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import de from "date-fns/locale/de";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

interface Props {
  calcs: ParsedBudgetEntry[];
  headers: string[];
  initialState?: IAccount[];
  setCalcs: (calcs: ParsedBudgetEntry[]) => void;
  selectOptions: string[];
}

const useKeyPress = (targetKey) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    window.addEventListener("keydown", (ev) => {
      ev.preventDefault()
      downHandler(ev)
    });
    window.addEventListener("keyup", (ev) => {
      ev.preventDefault()
      upHandler(ev);
    });

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]);

  return keyPressed;
};

export const CalcsTable = ({
  calcs,
  headers,
  initialState,
  setCalcs,
  selectOptions,
}: Props) => {
  const data = calculateBalances(calcs, initialState);

  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");

  useEffect(() => {
    if (arrowUpPressed) {
      const newData = [...data];
      const firstSelected = newData.findIndex(({ isSelected }) => isSelected);
      const lastSelected = newData
        .reverse()
        .findIndex(({ isSelected }) => isSelected);
      const endWindow = newData.length - lastSelected - 1;

      if (firstSelected > 0) {
        newData.reverse();
        const startWindow = firstSelected - 1;
        const start = newData[startWindow];
        const updatedData = newData.map((row, i) =>
          i >= firstSelected && i <= endWindow
            ? {
                ...row,
                isSelected: true,
                date: start?.date ?? row.date,
              }
            : row
        );
        updatedData.splice(startWindow, 1);
        updatedData.splice(endWindow, 0, start);

        setCalcs(updatedData);
      }
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      const newData = [...data];
      const firstSelected = newData.findIndex(({ isSelected }) => isSelected);
      const lastSelected = newData
        .reverse()
        .findIndex(({ isSelected }) => isSelected);
      const endWindow = newData.length - lastSelected - 1;

      if (firstSelected > -1 && endWindow < newData.length - 1) {
        newData.reverse();
        const end = newData[endWindow + 1];
        const updatedData = newData
          .map((row, i) => i >= firstSelected && i <= endWindow ? ({
            ...row,
            isSelected: true,
            date: end?.date ?? row.date,
          }) : row);
        updatedData.splice(endWindow + 1, 1);
        updatedData.splice(firstSelected, 0, end);
        setCalcs(updatedData);
      }
    }
  }, [arrowDownPressed]);

  return (
    <>
      {data.length ? (
        <Table
          data={data.map(
            ({
              isIncluded,
              isSelected,
              date,
              income,
              expense,
              comment,
              account,
              balances,
            }) => [
              isIncluded,
              isSelected,
              date,
              income,
              expense,
              comment,
              account,
              ...balances.map(({ balance }) => balance),
              "",
            ]
          )}
          headers={headers}
          rowStylingRules={[
            (row) => (row[0] ? {} : { opacity: 0.1 }),
            (row) => ({
              backgroundColor:
                row[5] === selectOptions[1]
                  ? "#76ff03"
                  : row[5] === selectOptions[2]
                  ? "#348feb"
                  : row[5] === selectOptions[3]
                  ? "#fade0a"
                  : "",
            }),
          ]}
          renderFuncs={[
            (value, rowIndex) => (
              <input
                type={"checkbox"}
                checked={!!value}
                onChange={(ev) => {
                  let newCalcs = [...calcs];

                  newCalcs[rowIndex] = {
                    ...newCalcs[rowIndex],
                    isIncluded: ev.target.checked,
                  };

                  setCalcs(newCalcs);
                }}
              />
            ),
            (value, rowIndex) => (
              <input
                type={"checkbox"}
                checked={!!value}
                onChange={(ev) => {
                  let newCalcs = [...calcs];

                  newCalcs[rowIndex] = {
                    ...newCalcs[rowIndex],
                    isSelected: ev.target.checked,
                  };

                  setCalcs(newCalcs);
                }}
              />
            ),
            (value, rowIndex) => {
              return value instanceof Date ? (
                <LocalizationProvider
                  dateAdapter={AdapterDateFns}
                  adapterLocale={de}
                >
                  <DatePicker
                    value={value}
                    onChange={(val) => {
                      let newCalcs = [...calcs];

                      newCalcs[rowIndex] = {
                        ...newCalcs[rowIndex],
                        date: val ? val : newCalcs[rowIndex].date,
                      };

                      setCalcs(newCalcs);
                    }}
                  />
                </LocalizationProvider>
              ) : (
                <>{value}</>
              );
            },
            createInputRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.income, {
              type: "number",
              min: 0,
            }),
            createInputRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.expense, {
              type: "number",
              max: 0,
            }),
            createInputRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.comment),
            createSelectRenderer(
              calcs,
              setCalcs,
              BUDGET_ENTRY_KEYS.account,
              selectOptions
            ),

            ...data[0].balances.map(
              () =>
                function CreateBalanceDisplay(
                  value: string | number | boolean | Date
                ) {
                  return (
                    <>
                      {typeof value === "number" ? (
                        <Balance value={value} />
                      ) : (
                        value
                      )}
                    </>
                  );
                }
            ),
            (_, rowNumber) => (
              <>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    newCalcs.splice(rowNumber, 1);
                    setCalcs(newCalcs);
                  }}
                >
                  <DeleteIcon fontSize="inherit" />
                </button>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    const copy = calcs[rowNumber];
                    newCalcs.splice(rowNumber, 0, { ...copy, id: uuidv4() });
                    setCalcs(newCalcs);
                  }}
                >
                  <ContentCopy fontSize="inherit" />
                </button>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    const copy = calcs[rowNumber];
                    const newRow: ParsedBudgetEntry = {
                      isIncluded: true,
                      date: copy.date,
                      income: 0,
                      expense: 0,
                      comment: "",
                      account: "",
                      id: uuidv4(),
                      balances: calcs[0].balances.map(
                        ({ balance, ...rest }) => ({
                          balance: 0,
                          ...rest,
                        })
                      ),
                    };
                    newCalcs.splice(rowNumber, 0, newRow);
                    setCalcs(calculateBalances(newCalcs));
                  }}
                >
                  + Ряд <ArrowUpward fontSize="inherit" />
                </button>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    const copy = calcs[rowNumber];
                    const newRow: ParsedBudgetEntry = {
                      isIncluded: true,
                      date: copy.date,
                      income: 0,
                      expense: 0,
                      comment: "",
                      account: "",
                      id: uuidv4(),
                      balances: calcs[0].balances.map(
                        ({ balance, ...rest }) => ({
                          balance: 0,
                          ...rest,
                        })
                      ),
                    };
                    newCalcs.splice(rowNumber + 1, 0, newRow);
                    setCalcs(calculateBalances(newCalcs));
                  }}
                >
                  + Ряд <ArrowDownward fontSize="inherit" />
                </button>
              </>
            ),
          ]}
        />
      ) : null}
    </>
  );
};
