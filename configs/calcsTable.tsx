import { Balance } from "@/components/Balance";
import { BUDGET_ENTRY_KEYS } from "@/constants";
import { setCalcs } from "@/events/calcs";
import { ParsedBudgetEntry, RenderFunc } from "@/types";
import { calculateBalances } from "@/utils/calculateBalances";
import { createBudgetEntry } from "@/utils/createBudgetEntry";
import { createInputRenderer, createSelectRenderer, createTextAreaRenderer } from "@/utils/createInputRender";
import { ArrowDownward, ArrowUpward, ContentCopy, Delete } from "@mui/icons-material";
import { Checkbox } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { v4 as uuidv4 } from "uuid";

export const calcTableRenderFuncs = (
  calcs: ParsedBudgetEntry[],
  selectOptions: string[],
  categoryOptions: string[],
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
    <div>      
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
    </div>
  ),
  (value, rowIndex) => {
    return value instanceof Date ? (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
        <DatePicker
          value={value}
          sx={{
            ".MuiInputBase-input": {
              padding: 0,
              width: 90,
              maxWidth: 90,
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
  createSelectRenderer(
    calcs,
    setCalcs,
    BUDGET_ENTRY_KEYS.moneyMoveCategory,
    categoryOptions
  ),
  ...calcs[0].balances.map(
    () =>
      function CreateBalanceDisplay(value: string | number | boolean | Date) {
        return (
          <>{typeof value === "number" ? <Balance value={value} /> : value}</>
        );
      }
  ),
  (_, rowNumber) => (
    <div style={{ minWidth: 80 }}>
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
          const source = calcs[rowNumber];
          const newRow = createBudgetEntry(source);
          newCalcs.splice(rowNumber, 0, newRow);
          setCalcs(calculateBalances(newCalcs));
        }}
      >
        +Ряд <ArrowUpward fontSize="inherit" />
      </button>
      <button
        onClick={() => {
          const newCalcs = [...calcs];
          const source = calcs[rowNumber];
          const newRow = createBudgetEntry(source);
          newCalcs.splice(rowNumber + 1, 0, newRow);
          setCalcs(calculateBalances(newCalcs));
        }}
      >
        +Ряд <ArrowDownward fontSize="inherit" />
      </button>
    </div>
  ),
];