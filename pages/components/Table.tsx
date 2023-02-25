import React, { FC } from 'react'


interface Props<T = string> {
  data: Array<T[]>
  renderFuncs?: Array<RenderFunc | undefined>
}
export const Table = <T,>({ data, renderFuncs = [] }: Props<T>) => data.length ? <table>
  <thead>
    {data[0].map((value, i) => <th key={i}>{value}</th>)}
  </thead>
  <tbody>
    {data.slice(1).map((row, i) => (
      <tr key={`${i}`}>
        {row.map((value, index) => <td key={index}>{ renderFuncs[index] ? renderFuncs[index](value, i + 1) : value}</td>)}
      </tr>
    ))}
  </tbody>
</table> : null