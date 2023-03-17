import { Balance } from "@/components/Balance";
import Table from "@/components/Table";
import { BUDGET_ENTRY_KEYS, timeInputFormat } from "@/constants";
import { IAccount, ParsedBudgetEntry } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import {
  createInputRenderer,
  createSelectRenderer,
} from "@/utils/createInputRender";
import { format, parse, parseISO } from "date-fns";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import ContentCopy from "@mui/icons-material/ContentCopy";
import { ArrowDownward, ArrowUpward } from "@mui/icons-material";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

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
      {data.length ? (
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
              console.log('value', value);
              
              return value instanceof Date ? (
                // <LocalizationProvider dateAdapter={AdapterDateFns}>
                //   <DatePicker label="Basic date picker"
                //   value={format(value, timeInputFormat)}
                //   onChange={(value) => {
                    
                //     let newCalcs = [...calcs];
  
                //     newCalcs[rowIndex] = {
                //       ...newCalcs[rowIndex],
                //       date: value ? parseISO(value) : newCalcs[rowIndex].date,
                //     };
  
                //     setCalcs(newCalcs);
                //   }}
                //   />
                // </LocalizationProvider>
                <>DATE</>
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
            
            ...data[0].balances.map(() => function CreateBalanceDisplay(value: string | number | boolean | Date) {
              return (
                <>
                  {typeof value === "number" ? <Balance value={value} /> : value}
                </>
              )
            } ),
            (_, rowNumber) => (
              <>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    newCalcs.splice(rowNumber, 1);
                    setCalcs(newCalcs);
                  }}
                >
                  <DeleteIcon fontSize='inherit' />
                </button>
                <button
                  onClick={() => {
                    const newCalcs = [...calcs];
                    const copy = calcs[rowNumber];
                    newCalcs.splice(rowNumber, 0, copy);
                    setCalcs(newCalcs);
                  }}
                >
                  <ContentCopy fontSize='inherit' />
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
                      balances: calcs[0].balances.map(({ balance, ...rest}) => ({
                        balance: 0,
                        ...rest
                      }))
                    };
                    newCalcs.splice(rowNumber, 0, newRow);
                    setCalcs(calculateBalances(newCalcs));
                  }}
                >
                  + Ряд <ArrowUpward fontSize='inherit' />
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
                      balances: calcs[0].balances.map(({ balance, ...rest}) => ({
                        balance: 0,
                        ...rest
                      }))
                    };
                    newCalcs.splice(rowNumber + 1, 0, newRow);
                    setCalcs(calculateBalances(newCalcs));
                  }}
                >
                  + Ряд <ArrowDownward fontSize='inherit' />
                </button>
              </>
            ),
          ]}
        />
      ) : null}
    </>
  );
};
