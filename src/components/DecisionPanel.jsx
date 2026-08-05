import React from 'react';

const DecisionPanel = ({ state }) => {
  
  const getReasoningSteps = () => {
    const steps = [];
    if (state.droneState === 'generating' || state.droneState === 'takeoff') {
      steps.push({ text: 'Initializing System...', status: 'active' });
    } else if (state.droneState === 'scanning') {
      steps.push({ text: 'Scanning Environment...', status: 'done' });
      steps.push({ text: 'Obstacle Detected', status: 'done' });
      steps.push({ text: 'Searching Landing Zone', status: 'active' });
    } else if (state.droneState === 'moving') {
      steps.push({ text: 'Analyzing Surface...', status: 'done' });
      steps.push({ text: 'Checking Altitude...', status: 'done' });
      steps.push({ text: 'Calculating Landing Score', status: 'done' });
      steps.push({ text: 'Selecting Best Landing Point', status: 'done' });
      steps.push({ text: 'Moving', status: 'active' });
    } else if (state.droneState === 'descending') {
      steps.push({ text: 'Safe Area Found', status: 'done' });
      steps.push({ text: 'Descending Slowly', status: 'active' });
    } else if (state.droneState === 'landed') {
      steps.push({ text: 'Touchdown', status: 'done' });
      steps.push({ text: 'Landing Successful', status: 'done' });
    } else if (state.droneState === 'crashed') {
      steps.push({ text: 'Surface Unstable', status: 'error' });
      steps.push({ text: 'Crash Detected', status: 'error' });
    }
    return steps;
  };

  const reasoningSteps = getReasoningSteps();

  // Fake landing zones scores based on current state confidence
  const zones = [
    { name: 'Zone A (Grass)', score: state.droneState === 'moving' || state.droneState === 'descending' ? state.modelConfidence : 20 },
    { name: 'Zone B (Rock)', score: Math.max(5, state.modelConfidence - 40) },
    { name: 'Zone C (Concrete)', score: Math.max(10, state.modelConfidence - 15) },
    { name: 'Zone D (Water)', score: 5 },
  ];

  return (
    <div className="decision-panel glass-panel custom-scrollbar" style={{ padding: '12px' }}>
      
      <div>
        <h3>RL Inputs</h3>
        <div className="data-list">
          <div className="data-row"><span>Front Cam Features</span><span>OK</span></div>
          <div className="data-row"><span>Obstacle Distance</span><span>{(Math.random() * 5 + 2).toFixed(1)}m</span></div>
          <div className="data-row"><span>Bottom Cam Surface</span><span>{state.terrain.substring(0, 8)}</span></div>
          <div className="data-row"><span>Surface Roughness</span><span>{state.surfaceRoughness.toFixed(3)}</span></div>
          <div className="data-row"><span>LiDAR Altitude</span><span>{state.altitude.toFixed(2)}m</span></div>
          <div className="data-row"><span>Vertical Velocity</span><span>{state.verticalSpeed.toFixed(1)}m/s</span></div>
          <div className="data-row"><span>IMU Pitch/Roll</span><span>{(Math.random() * 2).toFixed(1)}/{(Math.random() * 2).toFixed(1)}</span></div>
        </div>
      </div>

      <div style={{ marginTop: '12px' }}>
        <h3>Landing Scores</h3>
        <div className="data-list">
          {zones.map((z, i) => (
            <div key={i} className="data-row" style={{ 
              backgroundColor: z.score === state.modelConfidence && z.score > 70 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(0,0,0,0.3)',
              border: z.score === state.modelConfidence && z.score > 70 ? '1px solid var(--accent-green)' : 'none'
            }}>
              <span>{z.name}</span>
              <span style={{ color: z.score > 75 ? 'var(--accent-green)' : z.score > 40 ? 'var(--accent-orange)' : 'var(--accent-red)' }}>
                {z.score.toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '12px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3>Live Reasoning</h3>
        <div className="data-list" style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', padding: '8px', borderRadius: '6px' }}>
          {reasoningSteps.map((step, i) => (
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'flex-start',
              color: step.status === 'active' ? 'var(--text-main)' : step.status === 'error' ? 'var(--accent-red)' : 'var(--text-muted)',
              marginBottom: '8px',
              animation: step.status === 'active' ? 'pulse-glow 1.5s infinite' : 'none'
            }}>
              <span style={{ marginRight: '8px', color: step.status === 'active' ? 'var(--accent-blue)' : step.status === 'error' ? 'var(--accent-red)' : 'var(--accent-green)' }}>
                {step.status === 'done' ? '✓' : step.status === 'error' ? '✗' : '➜'}
              </span>
              <span>{step.text}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DecisionPanel;
