import React from 'react';

const StatCard = ({ label, value, unit = '', status = 'neutral' }) => (
  <div className="stat-card">
    <div className="stat-label">{label}</div>
    <div className={`stat-value ${status}`}>
      {value} {unit}
    </div>
  </div>
);

export default function StatsDashboard({ state }) {
  const getSuccessStatus = (rate) => {
    if (rate > 80) return 'good';
    if (rate < 50) return 'bad';
    return 'neutral';
  };

  return (
    <>
      <div className="stats-grid">
        <StatCard label="Episode" value={state.episode} />
        <StatCard 
          label="Reward" 
          value={state.currentReward} 
          status={state.currentReward > 0 ? 'good' : state.currentReward < 0 ? 'bad' : 'neutral'} 
        />
        <StatCard label="Avg Reward" value={state.averageReward.toFixed(1)} />
        <StatCard label="Landing Acc" value={state.landingAccuracy.toFixed(1)} unit="%" />
        
        <StatCard label="Crash Rate" value={state.crashRate.toFixed(1)} unit="%" status={state.crashRate > 20 ? 'bad' : 'good'} />
        <StatCard label="Altitude" value={state.altitude.toFixed(2)} unit="m" />
        <StatCard label="Vertical Speed" value={state.verticalSpeed.toFixed(2)} unit="m/s" />
        <StatCard label="Current Height" value={state.altitude.toFixed(2)} unit="m" />
        
        <StatCard label="Surface Score" value={state.modelConfidence.toFixed(0)} status={state.modelConfidence > 75 ? 'good' : 'bad'} />
        <StatCard label="Obstacle Dist." value={(Math.random() * 5 + 2).toFixed(1)} unit="m" />
        <StatCard label="Training Prog." value={state.trainingProgress.toFixed(1)} unit="%" />
        <StatCard label="Policy Loss" value={state.policyLoss.toFixed(4)} />
        
        <StatCard label="Value Loss" value={state.valueLoss.toFixed(4)} />
        <StatCard label="Success Rate" value={state.successRate.toFixed(1)} unit="%" status={getSuccessStatus(state.successRate)} />
        <StatCard label="Inference Time" value={state.inferenceTime.toFixed(1)} unit="ms" />
        <StatCard label="Exploration" value={state.explorationRate.toFixed(3)} />
      </div>

      <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.3)', padding: '8px', borderRadius: '6px' }}>
        <h3 style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '4px', textTransform: 'uppercase' }}>Global Metrics</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
          <div>Total: <span style={{color:'var(--accent-blue)', fontWeight:'bold'}}>10000+</span></div>
          <div>Succ: <span style={{color:'var(--accent-green)', fontWeight:'bold'}}>{state.successfulLandings}</span></div>
          <div>Hard: <span style={{color:'var(--accent-orange)', fontWeight:'bold'}}>{state.hardLandings}</span></div>
          <div>Crash: <span style={{color:'var(--accent-red)', fontWeight:'bold'}}>{state.crashes}</span></div>
        </div>
      </div>
    </>
  );
}
