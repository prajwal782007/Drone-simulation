import React from 'react';

export default function NeuralNetworkViz({ action, isRunning }) {
  const inputs = ['LiDAR', 'Altitude', 'Velocity', 'Slope', 'Roughness'];
  const outputs = ['Move Left', 'Move Right', 'Hover', 'Descend', 'Land'];
  const hiddens = [0, 1, 2, 3, 4, 5, 6];

  const pulseClass = isRunning ? 'pulse-glow' : '';

  return (
    <div style={{ position: 'relative', width: '100%', height: '160px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '10px', display: 'flex' }}>
      
      {/* Labels Left */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '9px', color: 'var(--text-muted)', width: '60px', textAlign: 'right', paddingRight: '8px', textTransform: 'uppercase' }}>
        {inputs.map((lbl, i) => <span key={i}>{lbl}</span>)}
      </div>

      <div style={{ flexGrow: 1, position: 'relative' }}>
        <svg width="100%" height="100%" viewBox="0 0 200 140" preserveAspectRatio="none">
          {/* Connections */}
          {inputs.map((_, i) => (
            hiddens.map(h => (
              <line 
                key={`in-${i}-${h}`}
                x1="20" y1={14 + i * (112/4)} 
                x2="100" y2={10 + h * (120/6)}
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="1"
              />
            ))
          ))}
          {hiddens.map(h => (
            outputs.map((_, o) => (
              <line 
                key={`out-${h}-${o}`}
                x1="100" y1={10 + h * (120/6)} 
                x2="180" y2={14 + o * (112/4)}
                stroke="rgba(56, 189, 248, 0.15)"
                strokeWidth="1"
              />
            ))
          ))}

          {/* Nodes */}
          {inputs.map((_, i) => (
            <circle key={`node-in-${i}`} cx="20" cy={14 + i * (112/4)} r="4" fill="var(--text-muted)" className={pulseClass} style={{animationDelay: `${i * 0.1}s`}} />
          ))}
          {hiddens.map(h => (
            <circle key={`node-hid-${h}`} cx="100" cy={10 + h * (120/6)} r="5" fill="var(--accent-blue)" className={pulseClass} style={{animationDelay: `${h * 0.15}s`}} />
          ))}
          {outputs.map((lbl, o) => {
            const isActive = action === lbl || (action.includes('Moving') && lbl.includes(action.split(' ')[1]));
            return (
              <circle key={`node-out-${o}`} cx="180" cy={14 + o * (112/4)} r="6" fill={isActive ? "var(--accent-green)" : "var(--accent-blue)"} className={isActive ? 'pulse-glow' : ''} style={isActive ? {filter: 'drop-shadow(0 0 10px var(--accent-green))'} : {animationDelay: `${o * 0.1}s`}} />
            );
          })}
        </svg>
      </div>

      {/* Labels Right */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around', fontSize: '9px', color: 'var(--text-muted)', width: '70px', paddingLeft: '8px', textTransform: 'uppercase' }}>
        {outputs.map((lbl, i) => {
          const isActive = action === lbl || (action.includes('Moving') && lbl.includes(action.split(' ')[1]));
          return <span key={i} style={{ color: isActive ? 'var(--accent-green)' : 'inherit', fontWeight: isActive ? 'bold' : 'normal' }}>{lbl}</span>;
        })}
      </div>

    </div>
  );
}
