import { calculateBudget, sortBudgetEntries } from '@/utils/utils';
import React, { useCallback, useEffect, useState } from 'react'
import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes, SavedBudgetEntry } from '@/types';
import { InitialBalancesSettings } from './InitialBalancesSettings';
import { supabase } from '@/utils/db';
import { differenceInCalendarMonths, format, isValid, parseISO } from 'date-fns';
import { ru } from "date-fns/locale";
import { Button, Typography } from '@mui/material';
import add from 'date-fns/add';

interface Props {
  incomes: ParsedIncomes[]
  expenses: ParsedExpenses[]
  calcs: ParsedBudgetEntry[]
  calcInitial: IAccount[]
  setCalcInitial: (values: IAccount[]) => void
  setCalcs: (calcs: ParsedBudgetEntry[]) => void
}

export const Settings = ({ incomes, expenses, calcs, setCalcs, calcInitial, setCalcInitial }: Props) => {
  const [variantName, setVariantName] = useState('');
  const [variantList, setVariantList] = useState<string[]>([]);

  useEffect( () => {
    supabase.from('calculations').select('name').then(({ data }) => setVariantList(data?.map(({ name }) => name) ?? []))
  }, [])
  const sortedCalcs = sortBudgetEntries(calcs);
  const earliestDate = sortedCalcs.at(0)?.date;
  const latestDate = sortedCalcs.at(-1)?.date;
  const earliestMonth =
    earliestDate && isValid(earliestDate)
      ? format(earliestDate, "MMMM", { locale: ru })
      : "какого-то месяца";
  const latestMonth = latestDate && isValid(latestDate)
    ? format(latestDate, "LLLL", { locale: ru })
    : "какой-то месяц";
  const nextDate =
    latestDate && isValid(latestDate)
      ? add(latestDate, { months: 1 })
      : undefined;
  const nextMonth =
    nextDate && isValid(nextDate)
      ? format(nextDate, "LLLL", { locale: ru })
      : undefined;
  const currentOffset =
    nextDate && earliestDate && isValid(earliestDate) && isValid(nextDate)
      ? differenceInCalendarMonths(nextDate, earliestDate)
      : 0;
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        columnGap: "16px",
      }}
    >
      <InitialBalancesSettings
        accounts={calcInitial}
        updateAccounts={setCalcInitial}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Typography variant="h6">
          Расчет с {earliestMonth} по {latestMonth}
        </Typography>
        <Button
          onClick={() => {
            if (currentOffset) {
              const reCalcs = calculateBudget(
                calcs,
                incomes,
                expenses,
                1,
                currentOffset
              );
              setCalcs(reCalcs);
            }
          }}
        >
          Добавить {nextMonth}
        </Button>
        {/* <label htmlFor="experimentLength" style={{ paddingBottom: 8 }}>
          Добавить{" "}
          <input
            type={"number"}
            name="experimentLength"
            value={experimentLength}
            onChange={(ev) => {
              setExperimentLength(Math.floor(parseFloat(ev.target.value)));
            }}
          />{" "}
          месяцев регулярных доходов и расходов
          <button onClick={calc}>Рассчитать</button>
        </label> */}
      </div>
      <div style={{ paddingBottom: 8 }}>
        <Typography variant="h6">Название варианта:</Typography>
        <input
          value={variantName}
          onChange={(ev) => {
            setVariantName(ev.target.value);
          }}
        />
        <Button
          onClick={async () => {
            const { error } = await supabase
              .from("calculations")
              .insert({ name: variantName, values: JSON.stringify(calcs) });
            setVariantList((val) => [...val, variantName]);
            setVariantName("");
          }}
        >
          Сохранить
        </Button>
      </div>
      <div style={{ paddingBottom: variantList.length ? 8 : 0 }}>
        <Typography variant="h6">Загрузить вариант</Typography>
        <div>
          {variantList.map((name, i) => (
            <Button
              key={i}
              onClick={async () => {
                const { data: variants } = await supabase
                  .from("calculations")
                  .select()
                  .eq("name", name);

                if (variants?.length) {
                  setCalcs(JSON.parse(variants[0].values).map((entry: SavedBudgetEntry) => ({
                    ...entry,
                    date: parseISO(entry.date)
                  })));
                }
              }}
            >
              {name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}