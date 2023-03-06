import { baseUrl } from '@/constants';
import { parseCalcs } from '@/utils/parseCalcs';
import { calculateBudget } from '@/utils/utils';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { variantTable } from "@/database.config";
import { ParsedBudgetEntry, ParsedConstantMoneyMove } from '@/types';

interface Props {
  incomes: ParsedConstantMoneyMove[]
  expenses: ParsedConstantMoneyMove[]
  calcs: ParsedBudgetEntry[]
  setCalcs: (calcs: ParsedBudgetEntry[]) => void
}
export const Settings = ({ incomes, expenses, calcs, setCalcs }: Props) => {
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
  useEffect(() => {
    variantTable
      .where("name")
      .notEqual("")
      .toArray()
      .then((data) => setVariantList(data.map(({ name }) => name)));
  }, [])
  return (
    <>
      <label htmlFor="experimentLength" style={{ paddingBottom: 8 }}>
        Добавить <input
          type={"number"}
          name="experimentLength"
          value={experimentLength}
          onChange={(ev) => {
            setExperimentLength(Math.floor(parseFloat(ev.target.value)));
          }}
        /> месяцев регулярных доходов и расходов
        <button
          onClick={calc}
        >
          Рассчитать
        </button>
      </label>
      <span style={{ paddingBottom: 8 }}>
        Сохранить вариант под названием
        <input value={variantName} onChange={(ev) => {
          setVariantName(ev.target.value)
        }} />
        <button
          onClick={async () => {
            await variantTable.add({
              name: variantName,
              entries: calcs,
            });
            setVariantList((val) => [...val, variantName])
            setVariantName('')
          }}
        >
          Сохранить
        </button>
      </span>
      <span style={{ paddingBottom: variantList.length ? 8 : 0 }}>
        {variantList.map((name, i) => (
          <button key={i} style={{ marginRight: 8 }} onClick={async () => {
            const variants = await variantTable
              .where("name")
              .equals(name)
              .toArray()
            if (variants.length) {
              setCalcs(variants[0].entries)
            }
          }}>{`Load ${name} variant`}</button>
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
    </>
  )
}