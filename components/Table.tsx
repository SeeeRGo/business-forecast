import React, { CSSProperties } from 'react'
import { RenderFunc } from '../types'

interface Props<T> {
  data: T[]
  headers: string[]
  rowStylingRules?: Array<(row: T) => CSSProperties> 
  renderFuncs?: Array<RenderFunc | undefined>
}
const Table = <T extends any[]>({ headers, data, rowStylingRules = [], renderFuncs = [] }: Props<T>) => {
  return data.length ? (
    <table>
      <thead>
        {headers.map((value, i) => <th key={i}>{value}</th>)}
      </thead>
      <tbody>
        {data.map((row, i) => {
          return (
            <tr key={i} style={rowStylingRules.reduce(
              (acc, rules) => ({
                ...acc,
                ...rules(row),
              }),
              {}
            )}>
              {row?.map((value, index) => {
                const renderFunc = renderFuncs[index];
                return <td key={index}>{renderFunc ? renderFunc(value, i) : value}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  ) : null;
}

export default Table;
