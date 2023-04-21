import React, { useEffect, useState } from 'react'
import { InitialBalancesSettings } from './InitialBalancesSettings';
import { AddSingleRegularMoneyMove } from './AddSingleRegularMoneyMove';
import { VariantsMenu } from './VariantsMenu';
import { Button, IconButton, Menu, MenuItem } from '@mui/material';
import { Add } from '@mui/icons-material';
import { useStore } from 'effector-react';
import { $userId } from '@/stores/stores';
import { supabase } from '@/utils/db';
import { parseSavedVariant } from '@/utils/utils';

export const Settings = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [otherUsers, setUsers] = useState<{id: string, email: string}[]>([])
  const [otherVariants, setOtherVariants] = useState<string[]>([])
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const userId = useStore($userId)

  useEffect(() => {
    supabase.auth.admin.listUsers().then(({ data: { users } }) => {
      
        setUsers(users.filter(({ id, email }) => email && id !== userId).map(({ id, email }) => ({ id, email: email ?? '' })));
    })
  }, [userId])

  useEffect(() => {
    if(userId) {
      supabase.from('data').select('variant_name').contains('users_with_access', [userId]).order("id", { ascending: false })
      .then(({ data }) =>
      setOtherVariants(data?.map(({ variant_name }) => variant_name) ?? [])
      );
    }
  }, [userId])
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
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
      >
        Добавить пользователей
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
        {otherUsers.map(({ email, id }, i) => (
          <MenuItem key={i}>
            <Button
              onClick={async () => {
                await supabase.from('data').update({'users_with_access': [id]}).eq('user_id', userId)
                handleClose();
              }}
            >
              {email}
            </Button>
            <IconButton
              onClick={async () => {
                handleClose();
              }}
            >
              <Add />
            </IconButton>
          </MenuItem>
        ))}
      </Menu>
      {otherVariants.map((name, i) => (
        <Button
          key={i}
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
      ))}
    </div>
  );
}