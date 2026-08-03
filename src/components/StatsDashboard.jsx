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
        <StatCard label="Episode Number" value={state.episode} />
        <StatCard label="Training Progress" value={state.trainingProgress.toFixed(1)} unit="%" />
        
        <StatCard 
          label="Current Reward" 
          value={state.currentReward} 
          status={state.currentReward > 0 ? 'good' : state.currentReward < 0 ? 'bad' : 'neutral'} 
        />
        <StatCard label="Total Reward" value={state.totalReward} />
        
        <StatCard label="Altitude" value={state.altitude.toFixed(2)} unit="m" />
        <StatCard label="Vertical Velocity" value={state.verticalSpeed.toFixed(2)} unit="m/s" />
        
        <StatCard label="Surface Roughness" value={state.surfaceRoughness.toFixed(3)} />
        <StatCard label="Slope Angle" value={state.slope.toFixed(1)} unit="°" />

        <StatCard label="Landing Accuracy" value={state.landingAccuracy.toFixed(1)} unit="%" />
        <StatCard label="Success Rate" value={state.successRate.toFixed(1)} unit="%" status={getSuccessStatus(state.successRate)} />
        
        <StatCard label="Policy Loss" value={state.policyLoss.toFixed(4)} />
        <StatCard label="Value Loss" value={state.valueLoss.toFixed(4)} />
        
        <StatCard label="Model Confidence" value={state.modelConfidence.toFixed(1)} unit="%" status={state.modelConfidence > 75 ? 'good' : 'warning'} />
        <StatCard label="Inference Time" value={state.inferenceTime.toFixed(1)} unit="ms" />
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Global Performance Matrix</h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
          <div>Total Episodes: <span style={{color:'var(--accent-blue)', fontWeight:'bold'}}>10000+</span></div>
          <div>Success: <span style={{color:'var(--accent-green)', fontWeight:'bold'}}>{state.successfulLandings}</span></div>
          <div>Hard Land: <span style={{color:'var(--accent-orange)', fontWeight:'bold'}}>{state.hardLandings}</span></div>
          <div>Crashes: <span style={{color:'var(--accent-red)', fontWeight:'bold'}}>{state.crashes}</span></div>
        </div>
      </div>
    </>
  );
}
