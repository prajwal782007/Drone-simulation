import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function Charts({ history }) {
  const data = history.length > 0 ? history : [{ episode: 0, reward: 0, successRate: 0, loss: 1.5, crashCount: 0 }];

  const ChartWrapper = ({ title, dataKey, color, domain }) => (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h4 style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px', textAlign: 'center', textTransform: 'uppercase' }}>{title}</h4>
      <div style={{ flex: 1, minHeight: 0, width: '100%' }}>
        <ResponsiveContainer width="99%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
          <XAxis dataKey="episode" stroke="var(--text-muted)" fontSize={9} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--text-muted)" fontSize={9} domain={domain} tickLine={false} axisLine={false} />
          <Tooltip 
            contentStyle={{ backgroundColor: 'rgba(10, 14, 23, 0.9)', border: `1px solid ${color}`, borderRadius: '4px', fontSize: '10px' }}
            itemStyle={{ color: color }}
          />
          <Line 
            type="monotone" 
            dataKey={dataKey} 
            stroke={color} 
            strokeWidth={1.5} 
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px', height: '200px' }}>
      <ChartWrapper title="Avg Reward vs Episode" dataKey="reward" color="var(--accent-blue)" domain={['auto', 'auto']} />
      <ChartWrapper title="Success Rate (%)" dataKey="successRate" color="var(--accent-green)" domain={[0, 100]} />
      <ChartWrapper title="Policy Loss" dataKey="loss" color="var(--accent-orange)" domain={['auto', 'auto']} />
      <ChartWrapper title="Crash Count" dataKey="crashCount" color="var(--accent-red)" domain={['auto', 'auto']} />
    </div>
  );
}
