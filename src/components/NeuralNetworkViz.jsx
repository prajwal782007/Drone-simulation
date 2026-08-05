import React from 'react';

export default function NeuralNetworkViz({ action, isRunning }) {
  const inputs = ['Front Cam', 'Bottom Cam', 'LiDAR', 'IMU'];
  const outputs = ['Hover', 'Move L', 'Move R', 'Move F', 'Rotate', 'Descend', 'Land'];
  const hiddens = [0, 1, 2, 3, 4, 5, 6, 7];

  const pulseClass = isRunning ? 'pulse-glow' : '';

  const getActiveOutput = () => {
    if (!action) return 'Hover';
    if (action.includes('Left')) return 'Move L';
    if (action.includes('Right')) return 'Move R';
    if (action.includes('Forward')) return 'Move F';
    return action;
  };

  const activeOut = getActiveOutput();

  return (
    <div style={{ position: 'relative', width: '100%', flex: 1, background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '10px', display: 'flex' }}>
      
      {/* Labels Left */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '0.65rem', color: 'var(--text-muted)', width: '70px', textAlign: 'right', paddingRight: '8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
        {inputs.map((lbl, i) => <span key={i}>{lbl}</span>)}
      </div>

      <div style={{ flexGrow: 1, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 160" preserveAspectRatio="none">
          {/* Connections */}
          {inputs.map((_, i) => (
            hiddens.map(h => (
              <line 
                key={`in-${i}-${h}`}
                x1="20" y1={25 + i * (110/3)} 
                x2="100" y2={10 + h * (140/7)}
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="1"
              />
            ))
          ))}
          {hiddens.map(h => (
            outputs.map((_, o) => (
              <line 
                key={`out-${h}-${o}`}
                x1="100" y1={10 + h * (140/7)} 
                x2="180" y2={15 + o * (130/6)}
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="1"
              />
            ))
          ))}

          {/* Nodes */}
          {inputs.map((_, i) => (
            <circle key={`node-in-${i}`} cx="20" cy={25 + i * (110/3)} r="4" fill="var(--text-muted)" className={pulseClass} style={{animationDelay: `${i * 0.1}s`}} />
          ))}
          {hiddens.map(h => (
            <circle key={`node-hid-${h}`} cx="100" cy={10 + h * (140/7)} r="5" fill="var(--accent-blue)" className={pulseClass} style={{animationDelay: `${h * 0.15}s`}} />
          ))}
          {outputs.map((lbl, o) => {
            const isActive = activeOut === lbl;
            return (
              <circle key={`node-out-${o}`} cx="180" cy={15 + o * (130/6)} r="5" fill={isActive ? "var(--accent-green)" : "var(--accent-blue)"} className={isActive ? 'pulse-glow' : ''} style={isActive ? {filter: 'drop-shadow(0 0 10px var(--accent-green))'} : {animationDelay: `${o * 0.1}s`}} />
            );
          })}
        </svg>
      </div>

      {/* Labels Right */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '0.65rem', color: 'var(--text-muted)', width: '70px', paddingLeft: '8px', textTransform: 'uppercase', fontFamily: 'monospace' }}>
        {outputs.map((lbl, i) => {
          const isActive = activeOut === lbl;
          return <span key={i} style={{ color: isActive ? 'var(--accent-green)' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' }}>{lbl}</span>;
        })}
      </div>

    </div>
  );
}
