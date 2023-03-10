import { Balance } from "@/components/Balance";
import Table from "@/components/Table";
import { BUDGET_ENTRY_KEYS, timeInputFormat } from "@/constants";
import { ParsedBudgetEntry } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import {
  createInputRenderer,
  createSelectRenderer,
} from "@/utils/createInputRender";
import { format, parse } from "date-fns";
import React from "react";

interface Props {
  calcs: ParsedBudgetEntry[];
  headers: string[];
  initialState?: ParsedBudgetEntry;
  setCalcs: (calcs: ParsedBudgetEntry[]) => void;
}
export const CalcsTable = ({ calcs, headers, initialState, setCalcs }: Props) => {

  return (
    <>
      {calcs.length ? (
        <Table
          data={calculateBalances(calcs, initialState).map(
            ({
              isIncluded,
              date,
              income,
              expense,
              comment,
              account,
              balanceIP,
              balanceOOO,
              balanceThird,
              balanceFourth,
            }) => [
              isIncluded,
              date,
              income,
              expense,
              comment,
              account,
              balanceIP,
              balanceOOO,
              balanceThird,
              balanceFourth,
              "",
            ]
          )}
          headers={headers}
          rowStylingRules={[
            (row) => (row[0] ? {} : { opacity: 0.1 }),
            (row) => ({
              backgroundColor:
                row[5] === "OOO"
                  ? "#76ff03"
                  : row[5] === "Third"
                  ? "#348feb"
                  : row[5] === "Fourth"
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
            (value, rowIndex) => {
              return value instanceof Date ? (
                <input
                  type={"date"}
                  value={format(value, timeInputFormat)}
                  onChange={(ev) => {
                    let newCalcs = [...calcs];

                    newCalcs[rowIndex] = {
                      ...newCalcs[rowIndex],
                      date: parse(ev.target.value, timeInputFormat, new Date()),
                    };

                    setCalcs(newCalcs);
                  }}
                />
              ) : (
                <>{value}</>
              );
            },
            createInputRenderer(
              calcs,
              setCalcs,
              BUDGET_ENTRY_KEYS.income,
              "number"
            ),
            createInputRenderer(
              calcs,
              setCalcs,
              BUDGET_ENTRY_KEYS.expense,
              "number"
            ),
            createInputRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.comment),
            createSelectRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.account),
            (value) => (
              <>
                {typeof value === "number" ? <Balance value={value} /> : value}
              </>
            ),
            (value) => (
              <>
                {typeof value === "number" ? <Balance value={value} /> : value}
              </>
            ),
            (value) => (
              <>
                {typeof value === "number" ? <Balance value={value} /> : value}
              </>
            ),
            (value) => (
              <>
                {typeof value === "number" ? <Balance value={value} /> : value}
              </>
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
                  Del
                </button>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    const copy = calcs[rowNumber];
                    newCalcs.splice(rowNumber, 0, copy);
                    setCalcs(newCalcs);
                  }}
                >
                  Copy
                </button>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    const newRow: ParsedBudgetEntry = {
                      isIncluded: true,
                      date: new Date(),
                      income: 0,
                      expense: 0,
                      comment: "",
                      account: "",
                      balanceIP: 0,
                      balanceOOO: 0,
                      balanceThird: 0,
                      balanceFourth: 0,
                    };
                    newCalcs.splice(rowNumber, 0, newRow);
                    setCalcs(calculateBalances(newCalcs));
                  }}
                >
                  Add Below
                </button>
              </>
            ),
          ]}
        />
      ) : null}
    </>
  );
};
