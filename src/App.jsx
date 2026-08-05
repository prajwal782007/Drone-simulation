import React from 'react';
import './App.css';
import { Play, Pause, RotateCcw } from 'lucide-react';
import useSimulationState from './hooks/useSimulationState';
import Simulation3D from './components/Simulation3D';
import StatsDashboard from './components/StatsDashboard';
import LogConsole from './components/LogConsole';
import NeuralNetworkViz from './components/NeuralNetworkViz';
import SensorFeeds from './components/SensorFeeds';
import PerceptionPipeline from './components/PerceptionPipeline';
import DecisionPanel from './components/DecisionPanel';

function App() {
  const { state, actions } = useSimulationState();

  return (
    <div className="app-container">
      {/* Top Header */}
      <div className="glass-panel top-panel">
        <div>
          <h1 className="text-gradient">Autonomous Drone Vision + LiDAR RL Training System</h1>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>
            Advanced Robotics Simulation Exhibition
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

      {/* Main 3D Simulation Panel */}
      <div className="glass-panel sim-panel scan-effect">
        <Simulation3D state={state} />
      </div>

      {/* Decision Panel (Live reasoning, RL inputs, scores) */}
      <DecisionPanel state={state} />

      {/* Sensor Feeds (Top Right) */}
      <SensorFeeds state={state} />

      {/* AI Perception Pipeline (Bottom Left) */}
      <PerceptionPipeline state={state} />

      {/* Neural Network Viz (Bottom Middle) */}
      <div className="nn-panel glass-panel">
        <h2>Neural Network</h2>
        <NeuralNetworkViz action={state.currentAction} isRunning={state.isRunning} />
      </div>

      {/* RL Dashboard Stats and Logs (Bottom Right) */}
      <div className="dashboard-panel glass-panel custom-scrollbar">
        <h2>RL Dashboard</h2>
        <StatsDashboard state={state} />
        <h2 style={{ marginTop: '12px' }}>System Logs</h2>
        <LogConsole logs={state.logs} />
      </div>

    </div>
  );
}

export default App;
