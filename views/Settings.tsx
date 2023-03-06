import { baseUrl } from '@/constants';
import { parseCalcs } from '@/utils/parseCalcs';
import { calculateBudget } from '@/utils/utils';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
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
  const [variantList, setVariantList] = useState<string[]>([]);

  useEffect(() => {
    variantTable
      .where("name")
      .notEqual("")
      .toArray()
      .then((data) => setVariantList(data.map(({ name }) => name)));
  }, [])
  return (
    <>
      <label htmlFor="experimentLength">
        Добавить <input
          type={"number"}
          name="experimentLength"
          value={experimentLength}
          onChange={(ev) => {
            setExperimentLength(Math.floor(parseFloat(ev.target.value)));
          }}
        /> месяцев регулярных доходов и расходов
        <button
          onClick={async () => {
            const res = await axios.get(baseUrl);
            const parsedCalcs = parseCalcs(res.data.calcs);
            const reCalcs = calculateBudget(
              parsedCalcs,
              incomes,
              expenses,
              experimentLength
            );
            setCalcs(reCalcs);
          }}
        >
          Рассчитать
        </button>
      </label>
      <input value={variantName} onChange={(ev) => {
        setVariantName(ev.target.value)
      }} />
      <button
        onClick={async () => {
          await variantTable.add({
            name: variantName,
            entries: calcs,
          });
        }}
      >
        Save Variant
      </button>
      {variantList.map((name, i) => (
        <button key={i} onClick={async () => {
          const variants = await variantTable
            .where("name")
            .equals(name)
            .toArray()
          if (variants.length) {
            setCalcs(variants[0].entries)
          }
        }}>{`Load ${name} variant`}</button>
      ))}
      <button
        onClick={() => {
          const reCalcs = calculateBudget(calcs, [], [], 0);
          setCalcs(reCalcs);
        }}
      >
        Sort
      </button>
    </>
  )
}