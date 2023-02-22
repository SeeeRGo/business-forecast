import React, { FC } from 'react'

export const Table: FC<{data: string[][]}> = ({ data }) => data.length ? <table>
  <thead>
    {data[0].map(value => <th key={value}>{value}</th>)}
  </thead>
  <tbody>
    {data.slice(1).map(row => (
      <tr key={row.join()}>
        {row.map(value => <td key={value}>{value}</td>)}
      </tr>
    ))}
  </tbody>
</table> : null