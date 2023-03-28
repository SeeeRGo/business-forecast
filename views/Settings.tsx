import { calculateBudget, sortBudgetEntries } from '@/utils/utils';
import React, { useEffect, useState } from 'react'
import { SavedBudgetEntry } from '@/types';
import { InitialBalancesSettings } from './InitialBalancesSettings';
import { supabase } from '@/utils/db';
import { differenceInCalendarMonths, format, isValid, parseISO } from 'date-fns';
import { ru } from "date-fns/locale";
import { Button, IconButton, Typography } from '@mui/material';
import add from 'date-fns/add';
import { useStore } from 'effector-react';
import { $calcs, $expenses, $incomes } from '@/stores/calcs';
import { setCalcs } from '@/events/calcs';
import { AddSingleRegularMoneyMove } from './AddSingleRegularMoneyMove';
import { Delete, SaveAs } from '@mui/icons-material';

export const Settings = () => {
  const calcs = useStore($calcs)
  const incomes = useStore($incomes)

  const expenses = useStore($expenses)

  const [variantName, setVariantName] = useState('');
  const [variantList, setVariantList] = useState<string[]>([]);

  useEffect( () => {
    supabase.from('calculations').select('name').order('id', { ascending: false }).then(({ data }) => setVariantList(data?.map(({ name }) => name) ?? []))
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
    <div style={{ display: "flex", flexDirection: "column", rowGap: "16px" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          columnGap: "16px",
        }}
      >
        <InitialBalancesSettings />
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
              <span key={i}>
                <Button
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
                <IconButton onClick={async () => {
              const { error } = await supabase
                .from("calculations")
                .update({ values: JSON.stringify(calcs) })
                .eq('name', name);
            }}><SaveAs /></IconButton>
                <IconButton onClick={async () => {
              const { error } = await supabase
                .from("calculations")
                .delete()
                .eq('name', name)
              setVariantList(variantList.filter(val => val === name))
            }}><Delete /></IconButton>
              </span>
            ))}
          </div>
        </div>
      </div>
      <AddSingleRegularMoneyMove />
    </div>
  );
}