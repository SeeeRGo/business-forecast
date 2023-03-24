import React, { CSSProperties } from 'react'
import MuiTable from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { RenderFunc } from '../types'

interface Props<T> {
  data: T[]
  headers: React.ReactNode[]
  rowStylingRules?: Array<(row: T) => CSSProperties> 
  renderFuncs?: Array<RenderFunc | undefined>
  calculateIsRowSelected?: (row: T) => boolean
}
const Table = <T extends any[]>({ headers, data, rowStylingRules = [], renderFuncs = [], calculateIsRowSelected = () => false }: Props<T>) => {
  return data.length ? (
    <TableContainer>
      <MuiTable stickyHeader>
        <TableHead>
          <TableRow>
            {headers.map((value, i) => <TableCell key={i} padding='checkbox'>{value}</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, i) => {
            return (
              <TableRow 
                key={i}
                hover
                selected={calculateIsRowSelected(row)}
                sx={{
                  borderBottomColor: 'black',
                  ...rowStylingRules.reduce(
                  (acc, rules) => ({
                    ...acc,
                    ...rules(row),
                  }),
                  {}
                )}}>
                {row?.map((value, index) => {
                  const renderFunc = renderFuncs[index];
                  return <TableCell sx={{ borderBottomColor: 'black'}} padding='checkbox' key={index}>{renderFunc ? renderFunc(value, i) : value}</TableCell>;
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </MuiTable>
    </TableContainer>
  ) : null;
}

export default Table;
