import Table from "@/components/Table";
import { setIncomes } from "@/events/calcs";
import { $incomeHeaders, $incomes, $moneyMoveCategories, $selectOptions } from "@/stores/calcs";
import { ParsedIncomes } from "@/types";
import {
  createInputRenderer,
  createSelectRenderer,
  createTextAreaRenderer,
} from "@/utils/createInputRender";
import { Delete } from "@mui/icons-material";
import { Button, Typography } from "@mui/material";
import { useStore } from "effector-react";
import React from "react";
import { v4 as uuidv4 } from "uuid";

export const IncomeTable = () => {
  const selectOptions = useStore($selectOptions)

  const incomes = useStore($incomes)
  const incomeHeaders = useStore($incomeHeaders)
  const categories = useStore($moneyMoveCategories)

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
              moneyMoveCategory: categories.at(0) ?? '',
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
              ({ dayOfMonth, income, description, account, moneyMoveCategory }) => [
                dayOfMonth,
                income,
                description,
                account,
                moneyMoveCategory,
                "",
              ]
            )}
            headers={incomeHeaders}
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
              createSelectRenderer(
                incomes,
                setIncomes,
                'moneyMoveCategory',
                categories,
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
