import { Balance } from "@/components/Balance";
import Table from "@/components/Table";
import { BUDGET_ENTRY_KEYS, timeInputFormat } from "@/constants";
import { IAccount, ParsedBudgetEntry } from "@/types";
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
  initialState?: IAccount[];
  setCalcs: (calcs: ParsedBudgetEntry[]) => void;
  selectOptions: string[]
}
export const CalcsTable = ({ calcs, headers, initialState, setCalcs, selectOptions }: Props) => {
  const data = calculateBalances(calcs, initialState)
  
  return (
    <>
      {calcs.length ? (
        <Table
          data={data.map(
            ({
              isIncluded,
              date,
              income,
              expense,
              comment,
              account,
              balances,
            }) => [
              isIncluded,
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
              {type: "number", min: 0}
            ),
            createInputRenderer(
              calcs,
              setCalcs,
              BUDGET_ENTRY_KEYS.expense,
              {type: "number", max: 0}
            ),
            createInputRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.comment),
            createSelectRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.account, selectOptions),
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
                      balances: calcs[0].balances.map(({ balance, ...rest}) => ({
                        balance: 0,
                        ...rest
                      }))
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
