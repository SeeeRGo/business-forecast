import { Balance } from "@/components/Balance";
import { BUDGET_ENTRY_KEYS } from "@/constants";
import { ParsedBudgetEntry, RenderFunc } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import { createInputRenderer, createSelectRenderer, createTextAreaRenderer } from "@/utils/createInputRender";
import { ArrowDownward, ArrowUpward, ContentCopy, Delete } from "@mui/icons-material";
import { Checkbox, Typography } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { de } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

export const calcTableRenderFuncs = (
  calcs: ParsedBudgetEntry[],
  setCalcs: (entries: ParsedBudgetEntry[]) => void,
  selectOptions: string[],
  data: ParsedBudgetEntry[]
): Array<RenderFunc | undefined> => [
  (value, rowIndex) => (
    <Checkbox
      disableRipple
      sx={{
        padding: 0,
      }}
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
    <Checkbox
      disableRipple
      sx={{
        padding: 0,
      }}
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
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={de}>
        <DatePicker
          value={value}
          sx={{
            ".MuiInputBase-input": {
              padding: 0,
              maxWidth: 100,
            },
          }}
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
  createTextAreaRenderer(calcs, setCalcs, BUDGET_ENTRY_KEYS.comment),
  createSelectRenderer(
    calcs,
    setCalcs,
    BUDGET_ENTRY_KEYS.account,
    selectOptions
  ),

  ...data[0].balances.map(
    () =>
      function CreateBalanceDisplay(value: string | number | boolean | Date) {
        return (
          <>{typeof value === "number" ? <Balance value={value} /> : value}</>
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
        <Delete fontSize="inherit" />
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
            isSelected: false,
            date: copy.date,
            income: 0,
            expense: 0,
            comment: "",
            account: "",
            id: uuidv4(),
            balances: calcs[0].balances.map(({ balance, ...rest }) => ({
              balance: 0,
              ...rest,
            })),
          };
          newCalcs.splice(rowNumber, 0, newRow);
          setCalcs(calculateBalances(newCalcs));
        }}
      >
        +Ряд <ArrowUpward fontSize="inherit" />
      </button>
      <button
        onClick={() => {
          const newCalcs = [...calcs];
          const copy = calcs[rowNumber];
          const newRow: ParsedBudgetEntry = {
            isIncluded: true,
            isSelected: false,
            date: copy.date,
            income: 0,
            expense: 0,
            comment: "",
            account: "",
            id: uuidv4(),
            balances: calcs[0].balances.map(({ balance, ...rest }) => ({
              balance: 0,
              ...rest,
            })),
          };
          newCalcs.splice(rowNumber + 1, 0, newRow);
          setCalcs(calculateBalances(newCalcs));
        }}
      >
        +Ряд <ArrowDownward fontSize="inherit" />
      </button>
    </>
  ),
];