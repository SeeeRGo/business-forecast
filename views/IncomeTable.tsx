import Table from "@/components/Table";
import { ParsedIncomes } from "@/types";
import {
  createInputRenderer,
  createSelectRenderer,
  createTextAreaRenderer,
} from "@/utils/createInputRender";
import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import React from "react";
import { v4 as uuidv4 } from "uuid";

interface Props {
  incomes: ParsedIncomes[];
  headers: string[];
  setIncomes: (incomes: ParsedIncomes[]) => void;
  selectOptions: string[]
}
export const IncomeTable = ({ incomes, headers, setIncomes, selectOptions }: Props) => {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">
          Постоянные доходы
        </Typography>
        <Button
          sx={{ padding: 0 }}
          onClick={() => {
            const newIncome: ParsedIncomes = {
              dayOfMonth: 15,
              id: uuidv4(),
              income: 150000,
              description: "Новый доход",
              account: selectOptions.at(0) ?? '',
            };
            setIncomes([...incomes, newIncome]);
          }}
        >
          + Доход
        </Button>
      </div>
      {incomes.length ? (
        <div style={{ paddingBottom: 16 }}>
          <Table
            data={incomes.map(
              ({ dayOfMonth, income, description, account }) => [
                dayOfMonth,
                income,
                description,
                account,
                "",
              ]
            )}
            headers={headers}
            renderFuncs={[
              createInputRenderer(incomes, setIncomes, "dayOfMonth", {
                type: "number",
              }),
              createInputRenderer(incomes, setIncomes, "income", {
                type: "number",
              }),
              createTextAreaRenderer(incomes, setIncomes, "description"),
              createSelectRenderer(
                incomes,
                setIncomes,
                "account",
                selectOptions
              ),
              (_, rowNumber) => (
                <>
                  <button
                    onClick={() => {
                      const newIncomes = [...incomes];
                      newIncomes.splice(rowNumber, 1);
                      setIncomes(newIncomes);
                    }}
                  >
                    <Delete fontSize="inherit" />
                  </button>
                </>
              ),
            ]}
          />
        </div>
      ) : null}
    </div>
  );
};
