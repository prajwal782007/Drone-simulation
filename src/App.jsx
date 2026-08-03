import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import useSimulationState from './hooks/useSimulationState';
import Simulation3D from './components/Simulation3D';
import StatsDashboard from './components/StatsDashboard';
import LogConsole from './components/LogConsole';
import Charts from './components/Charts';
import NeuralNetworkViz from './components/NeuralNetworkViz';

function App() {
  const { state, actions } = useSimulationState();

  return (
    <div className="app-container">
      {/* Top Panel */}
      <div className="glass-panel top-panel">
        <div>
          <h1 className="text-gradient">Autonomous Drone RL Training Simulator</h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            LiDAR Assisted Precision Landing
          </div>
        </div>
        
        <div className="status-indicator">
          <div className={`status-dot ${state.status === 'Training...' ? 'training' : ''}`}></div>
          {state.status}
        </div>

        <div className="controls">
          <button 
            className={`btn ${state.isRunning ? 'active' : ''}`} 
            onClick={actions.toggleTraining}
          >
            {state.isRunning ? <Pause size={18} /> : <Play size={18} />}
            {state.isRunning ? 'Pause' : 'Start Training'}
          </button>
          <button className="btn danger" onClick={actions.resetSimulation}>
            <RotateCcw size={18} />
            Reset
          </button>
        </div>
      </div>

      {/* Left Panel - 3D Simulation */}
      <div className="glass-panel left-panel scan-effect">
        <div className="lidar-overlay">
          <div className="label">LiDAR Distance</div>
          <div className="value">{state.lidarDistance.toFixed(2)} m</div>
        </div>
        <Simulation3D state={state} />
      </div>

      {/* Right Panel - Dashboard */}
      <div className="glass-panel right-panel custom-scrollbar">
        <h2>Training Dashboard</h2>
        <StatsDashboard state={state} />
        
        <h2 style={{ marginTop: '16px' }}>Neural Network</h2>
        <NeuralNetworkViz action={state.currentAction} isRunning={state.isRunning} />
        
        <div className="action-display">
          Decision: {state.currentAction}
        </div>
      </div>

      {/* Bottom Panel - Logs and Charts */}
      <div className="bottom-panel">
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2>Live Graphs</h2>
          <Charts history={state.history} />
        </div>
        
        <div className="glass-panel" style={{ padding: '20px' }}>
          <h2>System Logs</h2>
          <LogConsole logs={state.logs} />
        </div>
      </div>
    </div>
  );
}

export default App;
