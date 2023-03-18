import { calculateBudget, sortBudgetEntries } from '@/utils/utils';
import React, { useCallback, useEffect, useState } from 'react'
import { IAccount, ParsedBudgetEntry, ParsedExpenses, ParsedIncomes } from '@/types';
import { InitialBalancesSettings } from './InitialBalancesSettings';
import { supabase } from '@/utils/db';
import { add, differenceInCalendarMonths, format } from 'date-fns';
import { ru } from "date-fns/locale";

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
  const [experimentLength, setExperimentLength] = useState(0);
  const [offsetLength, setOffsetLength] = useState(0);
  const [variantList, setVariantList] = useState<string[]>([]);
  const calc = useCallback(() => {
    const reCalcs = calculateBudget(
      calcs,
      incomes,
      expenses,
      experimentLength,
      offsetLength
    );
    setCalcs(reCalcs);
    setOffsetLength(offsetLength + experimentLength)
  }, [calcs, incomes, expenses, experimentLength, offsetLength, setCalcs, setOffsetLength])

  useEffect( () => {
    supabase.from('calculations').select('name').then(({ data }) => setVariantList(data?.map(({ name }) => name) ?? []))
  }, [])
  const sortedCalcs = sortBudgetEntries(calcs);
  const earliestDate = sortedCalcs.at(0)?.date;
  const latestDate = sortedCalcs.at(-1)?.date;
  const earliestMonth = earliestDate ? format(earliestDate, 'LLLL', {locale: ru }) : 'Не удалось вычислить'
  const latestMonth = latestDate
    ? format(latestDate, "LLLL", { locale: ru })
    : "Не удалось вычислить";
  const nextDate = latestDate
    ? add(latestDate, { months: 1 })
    : undefined;
  const nextMonth = nextDate
    ? format(nextDate, "LLLL", { locale: ru })
    : undefined;
  const currentOffset =
    nextDate && earliestDate
      ? differenceInCalendarMonths(nextDate, earliestDate)
      : 0;
  
  return (
    <div style={{ display: "flex" }}>
      <InitialBalancesSettings
        accounts={calcInitial}
        updateAccounts={setCalcInitial}
      />
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div>Начальный месяц расчета - {earliestMonth} </div>
        <div>Конечный месяц расчета - {latestMonth} </div>
        <button onClick={() => {
          if(currentOffset) {
            const reCalcs = calculateBudget(
              calcs,
              incomes,
              expenses,
              1,
              currentOffset
            );
            setCalcs(reCalcs);
          }
        }}>Добавить {nextMonth}</button>
        <label htmlFor="experimentLength" style={{ paddingBottom: 8 }}>
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
        </label>
        <span style={{ paddingBottom: 8 }}>
          Сохранить вариант под названием
          <input
            value={variantName}
            onChange={(ev) => {
              setVariantName(ev.target.value);
            }}
          />
          <button
            onClick={async () => {
              const { error } = await supabase
                .from("calculations")
                .insert({ name: variantName, values: JSON.stringify(calcs) });
              setVariantList((val) => [...val, variantName]);
              setVariantName("");
            }}
          >
            Сохранить
          </button>
        </span>
        <span style={{ paddingBottom: variantList.length ? 8 : 0 }}>
          {variantList.map((name, i) => (
            <button
              key={i}
              style={{ marginRight: 8 }}
              onClick={async () => {
                const { data: variants } = await supabase
                  .from("calculations")
                  .select()
                  .eq("name", name);

                if (variants?.length) {
                  setCalcs(JSON.parse(variants[0].values));
                }
              }}
            >{`Load ${name} variant`}</button>
          ))}
        </span>
        <span style={{ paddingBottom: 8 }}>
          Расчёт варианта
          <button
            onClick={() => {
              const reCalcs = calculateBudget(calcs, [], [], 0);
              setCalcs(reCalcs);
            }}
          >
            Отсортировать по дате
          </button>
        </span>
      </div>
    </div>
  );
}