import Input from "@/components/Input";
import { setCalcs } from "@/events/calcs";
import { $calcs, $expenses, $incomes } from "@/stores/calcs";
import { SavedBudgetEntry } from "@/types";
import { supabase } from "@/utils/db";
import { calculateBudget, sortBudgetEntries } from "@/utils/utils";
import { Delete, Save, SaveAs } from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import { add, differenceInCalendarMonths, format, isValid, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import { useStore } from "effector-react";
import React, { useEffect, useState } from "react";

export const VariantsMenu = () => {
  const [variantList, setVariantList] = useState<string[]>([]);
  const [variantName, setVariantName] = useState("");

  const calcs = useStore($calcs);
  const incomes = useStore($incomes);

  const expenses = useStore($expenses);

  const sortedCalcs = sortBudgetEntries(calcs);
  const earliestDate = sortedCalcs.at(0)?.date;
  const latestDate = sortedCalcs.at(-1)?.date;
  const earliestMonth =
    earliestDate && isValid(earliestDate)
      ? format(earliestDate, "MMMM", { locale: ru })
      : "какого-то месяца";
  const latestMonth =
    latestDate && isValid(latestDate)
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

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    supabase
      .from("calculations")
      .select("name")
      .order("id", { ascending: false })
      .then(({ data }) => setVariantList(data?.map(({ name }) => name) ?? []));
  }, []);
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
              const { error } = await supabase.from("calculations").insert({
                name: variantName || "default",
                values: JSON.stringify(calcs),
              });
              setVariantList((val) => [...val, variantName]);
              setVariantName("");
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
                  .from("calculations")
                  .select()
                  .eq("name", name);

                if (variants?.length) {
                  setCalcs(
                    JSON.parse(variants[0].values).map(
                      (entry: SavedBudgetEntry) => ({
                        ...entry,
                        date: parseISO(entry.date),
                      })
                    )
                  );
                }
                handleClose();
              }}
            >
              {name}
            </Button>
            <IconButton
              onClick={async () => {
                const { error } = await supabase
                  .from("calculations")
                  .update({ values: JSON.stringify(calcs) })
                  .eq("name", name);
                handleClose();
              }}
            >
              <SaveAs />
            </IconButton>
            <IconButton
              onClick={async () => {
                const { error } = await supabase
                  .from("calculations")
                  .delete()
                  .eq("name", name);
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
