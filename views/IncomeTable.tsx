import Table from "@/components/Table";
import { ParsedConstantMoneyMove } from "@/types";
import {
  createInputRenderer,
  createSelectRenderer,
} from "@/utils/createInputRender";
import React from "react";

interface Props {
  incomes: ParsedConstantMoneyMove[];
  headers: string[];
  setIncomes: (incomes: ParsedConstantMoneyMove[]) => void;
  selectOptions: string[]
}
export const IncomeTable = ({ incomes, headers, setIncomes, selectOptions }: Props) => {
  return (
    <>
      <span>
        Постоянные доходы
        <button
          onClick={() => {
            const newIncome: ParsedConstantMoneyMove = {
              dayOfMonth: 15,
              income: 150000,
              expense: 0,
              description: "Новый доход",
              account: "OOO",
            };
            setIncomes([...incomes, newIncome]);
          }}
        >
          Добавить постоянный доход
        </button>
      </span>
      {incomes.length ? (
        <div style={{ paddingBottom: 16 }}>
          <Table
            data={incomes
              .map(({ dayOfMonth, income, expense, description, account }) => [
                dayOfMonth,
                income,
                expense,
                description,
                account,
                "",
              ])}
            headers={headers}
            renderFuncs={[
              createInputRenderer(incomes, setIncomes, "dayOfMonth", {type: "number"}),
              createInputRenderer(incomes, setIncomes, "income", {type: "number"}),
              createInputRenderer(incomes, setIncomes, "expense", {type: "number"}),
              createInputRenderer(incomes, setIncomes, "description"),
              createSelectRenderer(incomes, setIncomes, "account", selectOptions),
              (_, rowNumber) => (
                <>
                  <button
                    onClick={() => {
                      const newIncomes = [...incomes];
                      newIncomes.splice(rowNumber, 1);
                      setIncomes(newIncomes);
                    }}
                  >
                    Del
                  </button>
                </>
              ),
            ]}
          />
        </div>
      ) : null}
    </>
  );
};
