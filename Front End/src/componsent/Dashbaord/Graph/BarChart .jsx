import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

const uData = [4000, 3000, 2000, 2780, 1890, 2390, 3490.3422];
const pData = [2400, 1398, 9800, 3908, 4800, 3800, 4300,2323];
const xLabels = [
  ' A',
  ' B',
  ' C',
  ' D',
  ' E',
  ' F',
  ' G',
  ' H',
];

export default function SimpleBarChart() {
  return (
    <BarChart
      width={500}
      height={300}
      series={[
        { data: pData, label: 'pv', id: 'pvId' },
        { data: uData, label: 'uv', id: 'uvId' },
      ]}

      xAxis={[{ data: xLabels, scaleType: 'band' }]}
    />
  );
}