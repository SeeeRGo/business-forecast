import { calculateBudget, sortBudgetEntries } from '@/utils/utils';
import React, { useEffect, useState } from 'react'
import { SavedBudgetEntry } from '@/types';
import { InitialBalancesSettings } from './InitialBalancesSettings';
import { supabase } from '@/utils/db';
import { differenceInCalendarMonths, format, isValid, parseISO } from 'date-fns';
import { ru } from "date-fns/locale";
import { Button, IconButton, Input, Typography } from '@mui/material';
import add from 'date-fns/add';
import { useStore } from 'effector-react';
import { $calcs, $expenses, $incomes } from '@/stores/calcs';
import { setCalcs } from '@/events/calcs';
import { AddSingleRegularMoneyMove } from './AddSingleRegularMoneyMove';
import { Delete, Save, SaveAs } from '@mui/icons-material';
import { CategoryTargetsReport } from './CategoryTargetsReport';
import { VariantsMenu } from './VariantsMenu';

export const Settings = () => {
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
        <VariantsMenu />
      </div>
      <AddSingleRegularMoneyMove />
    </div>
  );
}