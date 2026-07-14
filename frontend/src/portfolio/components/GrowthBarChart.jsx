import React from 'react';
import {
  Bar,
  BarChart,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

const BEFORE_COLOR = 'rgba(10, 10, 10, 0.22)';
const AFTER_COLOR = '#c9a227';

const GrowthBarChart = ({ before, after, metric }) => {
  const data = [
    { name: 'Before', value: before, fill: BEFORE_COLOR },
    { name: 'After', value: after, fill: AFTER_COLOR },
  ];

  return (
    <div className="pf-growth-chart">
      <ResponsiveContainer width="100%" height={168}>
        <BarChart data={data} margin={{ top: 20, right: 8, left: 8, bottom: 4 }}>
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: '#737373' }}
          />
          <YAxis hide domain={[0, (max) => Math.ceil(max * 1.15)]} />
          <Tooltip
            cursor={{ fill: 'rgba(201, 162, 39, 0.08)' }}
            formatter={(value) => [value.toLocaleString(), metric]}
            contentStyle={{
              borderRadius: 10,
              border: '1px solid rgba(10, 10, 10, 0.08)',
              fontSize: 12,
            }}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} barSize={52}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={entry.fill} />
            ))}
            <LabelList
              dataKey="value"
              position="top"
              formatter={(value) => value.toLocaleString()}
              style={{ fontSize: 12, fontWeight: 600, fill: '#525252' }}
            />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <p className="pf-growth-metric">{metric}</p>
    </div>
  );
};

export default GrowthBarChart;
