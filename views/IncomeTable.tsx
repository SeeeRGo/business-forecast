import Table from "@/components/Table";
import { ParsedConstantMoneyMove, ParsedIncomes } from "@/types";
import {
  createInputRenderer,
  createSelectRenderer,
} from "@/utils/createInputRender";
import { Delete } from "@mui/icons-material";
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
    <>
      <span>
        Постоянные доходы
        <button
          onClick={() => {
            const newIncome: ParsedIncomes = {
              dayOfMonth: 15,
              id: uuidv4(),
              income: 150000,
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
              .map(({ dayOfMonth, income, description, account }) => [
                dayOfMonth,
                income,
                description,
                account,
                "",
              ])}
            headers={headers}
            renderFuncs={[
              createInputRenderer(incomes, setIncomes, "dayOfMonth", {type: "number"}),
              createInputRenderer(incomes, setIncomes, "income", {type: "number"}),
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
                    <Delete fontSize='inherit' />
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
