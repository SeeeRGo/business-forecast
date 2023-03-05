import React, { CSSProperties, FC } from 'react'
import { RenderFunc } from '../types'


interface Props<T = string[]> {
  data: T[]
  headers: string[]
  rowStylingRules?: Array<(row: T) => CSSProperties> 
  renderFuncs?: Array<RenderFunc | undefined>
}
export const Table = <T extends React.ReactNode>({ headers, data, rowStylingRules = [], renderFuncs = [] }: Props<T>) => data.length ? <table>
  <thead>
    {headers.map((value, i) => <th key={i}>{value}</th>)}
  </thead>
  <tbody>
    {data.map((row, i) => {
      return (
        <tr key={`${i}`} style={rowStylingRules.reduce(
          (acc, rules) => ({
            ...acc,
            ...rules(row),
          }),
          {}
        )}>
          {row?.map((value, index) => <td key={index}>{renderFuncs[index] ? renderFuncs[index](value, i + 1) : value}</td>)}
        </tr>
      )
    })}
  </tbody>
</table> : null