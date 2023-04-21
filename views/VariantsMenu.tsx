import Input from "@/components/Input";
import { setCalcs } from "@/events/calcs";
import { $calcs, $expenses, $incomes, $initialBalances } from "@/stores/calcs";
import { $userId } from "@/stores/stores";
import { supabase } from "@/utils/db";
import { calculateBudget, parseSavedVariant, sortBudgetEntries } from "@/utils/utils";
import { Delete, Save, SaveAs } from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { add, differenceInCalendarMonths, format, isValid } from "date-fns";
import { ru } from "date-fns/locale";
import { useStore } from "effector-react";
import React, { useEffect, useState } from "react";

export const VariantsMenu = () => {
  const [variantList, setVariantList] = useState<string[]>([]);
  const [variantName, setVariantName] = useState("");
  const userId = useStore($userId);

  const calcs = useStore($calcs);
  const incomes = useStore($incomes);

  const expenses = useStore($expenses);
  
  const initialBalances = useStore($initialBalances)

  const sortedCalcs = sortBudgetEntries(calcs);
  const earliestDate = sortedCalcs.at(0)?.date;
  const latestDate = sortedCalcs.at(-1)?.date;
  // const earliestMonth =
  //   earliestDate && isValid(earliestDate)
  //     ? format(earliestDate, "MMMM", { locale: ru })
  //     : "какого-то месяца";
  // const latestMonth =
  //   latestDate && isValid(latestDate)
  //     ? format(latestDate, "LLLL", { locale: ru })
  //     : "какой-то месяц";
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if(userId) {
      supabase
        .from("data")
        .select("variant_name")
        .eq("user_id", userId)
        .order("id", { ascending: false })
        .then(({ data }) =>
          setVariantList(data?.map(({ variant_name }) => variant_name) ?? [])
        );
    }
  }, [userId]);
  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Меню действий
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem
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
        </MenuItem>
        <Divider />
        <MenuItem style={{ paddingBottom: 8 }}>
          <Input
            label={"Название варианта"}
            value={variantName}
            onChange={(value) => {
              setVariantName(value);
            }}
          />
          <IconButton
            onClick={async () => {
              if(userId) {
                const { error } = await supabase.from("data").insert({
                  variant_name: variantName || "default",
                  user_id: userId,
                  calcs: JSON.stringify(calcs),
                  initial_balances: JSON.stringify(initialBalances),
                  expenses: JSON.stringify(expenses),
                  incomes: JSON.stringify(incomes),
                });
                setVariantList((val) => [...val, variantName]);
                setVariantName("");
              }
            }}
          >
            <Save />
          </IconButton>
        </MenuItem>
        <Divider />
        {variantList.map((name, i) => (
          <MenuItem key={i}>
            <Button
              onClick={async () => {
                const { data: variants } = await supabase
                  .from("data")
                  .select()
                  .eq("variant_name", name);
                if (variants?.length) {
                  parseSavedVariant(variants[0])
                }
                handleClose();
              }}
            >
              {name}
            </Button>
            <IconButton
              onClick={async () => {
                const { error } = await supabase
                  .from("data")
                  .update({ 
                    calcs: JSON.stringify(calcs),
                    initial_balances: JSON.stringify(initialBalances),
                    expenses: JSON.stringify(expenses),
                    incomes: JSON.stringify(incomes),
                   })
                  .eq("variant_name", name);
                handleClose();
              }}
            >
              <SaveAs />
            </IconButton>
            <IconButton
              onClick={async () => {
                const { error } = await supabase
                  .from("data")
                  .delete()
                  .eq("variant_name", name);
                setVariantList(variantList.filter((val) => val !== name));
                handleClose();
              }}
            >
              <Delete />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};
