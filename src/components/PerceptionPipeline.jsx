import React from 'react';
import { Camera, Eye, Map, Image as ImageIcon, Zap, Cpu, BrainCircuit, Activity, Plane } from 'lucide-react';

const PerceptionPipeline = ({ state }) => {
  const isScanning = state.droneState === 'scanning' || state.droneState === 'moving';
  const isDeciding = state.droneState !== 'landed' && state.droneState !== 'crashed' && state.droneState !== 'generating';

  return (
    <div className="pipeline-panel glass-panel">
      <h2>AI Perception Pipeline</h2>
      
      <div style={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
        
        {/* Top Row: Sensors */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
          <div className={`pipeline-node ${isScanning ? 'active' : ''}`}>
            <Camera size={16} style={{margin: '0 auto', color: 'var(--accent-blue)'}} />
            <span>Front Cam</span>
          </div>
          <div className={`pipeline-node ${isScanning ? 'active' : ''}`}>
            <ImageIcon size={16} style={{margin: '0 auto', color: 'var(--accent-green)'}} />
            <span>Bottom Cam</span>
          </div>
          <div className={`pipeline-node ${isScanning ? 'active' : ''}`}>
            <Activity size={16} style={{margin: '0 auto', color: 'var(--accent-orange)'}} />
            <span>LiDAR</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', color: 'var(--text-muted)' }}>
          <div>↓</div>
          <div>↓</div>
          <div>↓</div>
        </div>

        {/* Second Row: Processing */}
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '16px 0' }}>
          <div className={`pipeline-node ${isScanning ? 'active' : ''}`}>
            <Eye size={16} style={{margin: '0 auto', color: 'var(--accent-blue)'}} />
            <span>Object Det.</span>
          </div>
          <div className={`pipeline-node ${isScanning ? 'active' : ''}`}>
            <Map size={16} style={{margin: '0 auto', color: 'var(--accent-green)'}} />
            <span>Surface Class.</span>
          </div>
          <div className={`pipeline-node ${isScanning ? 'active' : ''}`}>
            <Activity size={16} style={{margin: '0 auto', color: 'var(--accent-orange)'}} />
            <span>Altitude</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <div>↓</div>
        </div>

        {/* Third Row: Fusion & Network */}
        <div style={{ display: 'flex', justifyContent: 'space-around', margin: '16px 0' }}>
           <div className={`pipeline-node ${isDeciding ? 'active' : ''}`} style={{ width: '120px' }}>
            <Zap size={16} style={{margin: '0 auto', color: '#a855f7'}} />
            <span>Sensor Fusion</span>
          </div>
          <div className="pipeline-arrow" style={{ alignSelf: 'center' }}>→</div>
          <div className={`pipeline-node ${isDeciding ? 'active' : ''}`} style={{ width: '120px' }}>
            <BrainCircuit size={16} style={{margin: '0 auto', color: '#ec4899'}} />
            <span>RL Policy Net</span>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>
          <div>↓</div>
        </div>

        {/* Bottom Row: Output */}
        <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
           <div className={`pipeline-node ${state.currentAction ? 'active' : ''}`} style={{ width: '180px', borderColor: 'var(--accent-orange)' }}>
            <Plane size={16} style={{margin: '0 auto', color: 'var(--accent-orange)'}} />
            <span style={{color: 'var(--accent-orange)', fontWeight: 'bold'}}>{state.currentAction || 'WAITING'}</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PerceptionPipeline;
