import Table from "@/components/Table";
import React, { useEffect, useState } from "react";
import { calcTableRenderFuncs } from "@/configs/calcsTable";
import { IconButton, Typography } from "@mui/material";
import { DeleteSweep, Deselect, Sort } from "@mui/icons-material";
import { calculateBudget } from "@/utils/utils";
import { useStore } from "effector-react";
import { $calcHeaders, $calcs, $calcsData, $moneyMoveCategories, $selectOptions } from "@/stores/calcs";
import { setCalcs } from "@/events/calcs";

const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    const prevent = (ev: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown"].indexOf(ev.code) > -1) {
        ev.preventDefault();
      }
    };

    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);
    window.addEventListener("keydown", prevent);

    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
      window.removeEventListener("keydown", prevent);
    };
  }, [targetKey]);

  return keyPressed;
};

export const CalcsTable = () => {
  const calcs = useStore($calcs)
  const calcHeaders = useStore($calcHeaders)
  const selectOptions = useStore($selectOptions)

  const data = useStore($calcsData);

  const arrowUpPressed = useKeyPress("ArrowUp");
  const arrowDownPressed = useKeyPress("ArrowDown");
  const categories = useStore($moneyMoveCategories)

  useEffect(() => {
    if (arrowUpPressed) {
      const newData = [...data];
      const firstSelected = newData.findIndex(({ isSelected }) => isSelected);
      const lastSelected = newData
        .reverse()
        .findIndex(({ isSelected }) => isSelected);
      const endWindow = newData.length - lastSelected - 1;

      if (firstSelected > 0) {
        newData.reverse();
        const startWindow = firstSelected - 1;
        const start = newData[startWindow];
        const updatedData = newData.map((row, i) =>
          i >= firstSelected && i <= endWindow
            ? {
                ...row,
                isSelected: true,
                date: start?.date ?? row.date,
              }
            : row
        );
        updatedData.splice(startWindow, 1);
        updatedData.splice(endWindow, 0, start);

        setCalcs(updatedData);
      }
    }
  }, [arrowUpPressed]);

  useEffect(() => {
    if (arrowDownPressed) {
      const newData = [...data];
      const firstSelected = newData.findIndex(({ isSelected }) => isSelected);
      const lastSelected = newData
        .reverse()
        .findIndex(({ isSelected }) => isSelected);
      const endWindow = newData.length - lastSelected - 1;

      if (firstSelected > -1 && endWindow < newData.length - 1) {
        newData.reverse();
        const end = newData[endWindow + 1];
        const updatedData = newData.map((row, i) =>
          i >= firstSelected && i <= endWindow
            ? {
                ...row,
                isSelected: true,
                date: end?.date ?? row.date,
              }
            : row
        );
        updatedData.splice(endWindow + 1, 1);
        updatedData.splice(firstSelected, 0, end);
        setCalcs(updatedData);
      }
    }
  }, [arrowDownPressed]);

  return (
    <>
      {data.length ? (
        <Table
          data={data.map(
            ({
              isIncluded,
              isSelected,
              date,
              income,
              expense,
              comment,
              account,
              balances,
              moneyMoveCategory,
            }) => [
              isIncluded,
              isSelected,
              date,
              income,
              expense,
              comment,
              account,
              moneyMoveCategory,
              ...balances.map(({ balance }) => balance),
              "",
            ]
          )}
          headers={calcHeaders.map((header) =>
            header === "Выбор" ? (
              <span key={header} style={{ paddingBottom: 8 }}>
                {header}
                <IconButton
                  disableRipple
                  sx={{ padding: 0 }}
                  onClick={() => {
                    const reCalcs = calculateBudget(
                      calcs.filter(({ isSelected }) => !isSelected),
                      [],
                      [],
                      0
                    );
                    setCalcs(reCalcs);
                  }}
                >
                  <DeleteSweep />
                </IconButton>
                <IconButton
                  disableRipple
                  sx={{ padding: 0 }}
                  onClick={() => {
                    const reCalcs = calcs.map(({ isSelected, ...rest }) => ({
                      ...rest,
                      isSelected: false,
                    }));
                    setCalcs(reCalcs);
                  }}
                >
                  <Deselect />
                </IconButton>
              </span>
            ) : (
              <Typography key={header}>{header}</Typography>
            )
          )}
          rowStylingRules={[(row) => (row[0] ? {} : { opacity: 0.1 })]}
          calculateIsRowSelected={([_, isSelected]: any[]) => isSelected}
          renderFuncs={calcTableRenderFuncs(calcs, selectOptions, categories)}
        />
      ) : null}
    </>
  );
};
