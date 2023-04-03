import React from 'react'
import { InitialBalancesSettings } from './InitialBalancesSettings';
import { AddSingleRegularMoneyMove } from './AddSingleRegularMoneyMove';
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