import { useState, useEffect, useCallback, useRef } from 'react';

const TERRAINS = ['Grass', 'Road', 'Sand', 'Rock', 'Water', 'Concrete', 'Trees', 'Buildings', 'Random obstacles'];

export default function useSimulationState() {
  const [isRunning, setIsRunning] = useState(false);
  
  const [state, setState] = useState({
    episode: 0,
    currentReward: 0,
    averageReward: 0,
    totalReward: 0,
    successRate: 0,
    crashRate: 0,
    altitude: 10.0,
    verticalSpeed: 0,
    lidarDistance: 10.0,
    landingAccuracy: 0,
    policyLoss: 1.5,
    valueLoss: 0.8,
    explorationRate: 1.0,
    modelConfidence: 12,
    inferenceTime: 4.2,
    surfaceRoughness: 0,
    slope: 0,
    pointCloudDensity: 0,
    trainingProgress: 0,
    status: 'Initializing...',
    currentAction: 'Hover',
    successfulLandings: 0,
    crashes: 0,
    hardLandings: 0,
    terrain: 'Grass',
    droneState: 'hovering', // generating, takeoff, hovering, scanning, moving, descending, landed, crashed
    dronePos: { x: 0, z: 0 },
    targetPos: { x: 0, z: 0 },
    targetRadius: 0,
    terrainSeed: 0,
    logs: [],
    history: []
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const addLog = useCallback((msg, type = 'info') => {
    setState(prev => {
      const newLogs = [...prev.logs, { id: Date.now() + Math.random(), time: new Date().toLocaleTimeString(), msg, type }];
      if (newLogs.length > 100) newLogs.shift();
      return { ...prev, logs: newLogs };
    });
  }, []);

  const resetSimulation = useCallback(() => {
    setIsRunning(false);
    setState(prev => ({
      ...prev,
      episode: 0,
      currentReward: 0,
      averageReward: 0,
      totalReward: 0,
      trainingProgress: 0,
      successRate: 0,
      crashRate: 0,
      altitude: 10.0,
      successfulLandings: 0,
      crashes: 0,
      hardLandings: 0,
      status: 'Initializing...',
      logs: [],
      history: []
    }));
    addLog('Simulation reset', 'warning');
  }, [addLog]);

  const toggleTraining = useCallback(() => {
    setIsRunning(prev => {
      const next = !prev;
      if (next) {
        setState(s => ({ ...s, status: 'Training...' }));
        addLog('Training started', 'success');
      } else {
        setState(s => ({ ...s, status: 'Paused' }));
        addLog('Training paused', 'warning');
      }
      return next;
    });
  }, [addLog]);

  useEffect(() => {
    if (!isRunning) return;
    
    let active = true;
    let timeoutId;
    
    const wait = (ms) => new Promise(res => { timeoutId = setTimeout(res, ms); });

    const runEpisodeLoop = async () => {
      while (active) {
        const s = stateRef.current;
        const episode = s.episode + 1;
        
        let successProb = 0.15;
        if (episode > 20 && episode <= 100) successProb = 0.45;
        else if (episode > 100 && episode <= 500) successProb = 0.70;
        else if (episode > 500) successProb = 0.95;

        // Breakdown outcomes
        const rand = Math.random();
        let outcome = 'crash'; // 5% base crash
        if (rand < successProb * 0.8) outcome = 'success';
        else if (rand < successProb) outcome = 'hard_landing';

        const terrain = TERRAINS[Math.floor(Math.random() * TERRAINS.length)];
        const terrainSeed = Math.random();

        // 1. GENERATING TERRAIN
        addLog(`Episode ${episode}`, 'info');
        addLog('Generating Terrain...', 'info');
        setState(prev => ({ ...prev, episode, terrain, terrainSeed, droneState: 'generating', status: 'Resetting Environment' }));
        await wait(1000);
        if (!active) break;
        
        // 2. TAKEOFF / HOVER
        addLog('Terrain Ready', 'success');
        setState(prev => ({ ...prev, droneState: 'takeoff', altitude: 10, lidarDistance: 10, currentAction: 'Hover', dronePos: {x: 0, z: 0}, targetRadius: 0 }));
        await wait(1000);
        if (!active) break;

        // SEARCH LOOP
        let searchAttempts = Math.floor(Math.random() * 3) + 1;
        let foundSafeZone = false;

        for (let i = 0; i < searchAttempts; i++) {
          // SCANNING
          addLog('Scanning Surface...', 'info');
          addLog('LiDAR Active', 'info');
          setState(prev => ({ ...prev, droneState: 'scanning', pointCloudDensity: 800 + Math.random() * 500 }));
          await wait(800);
          if (!active) break;
          
          addLog('Point Cloud Generated', 'success');
          addLog(`Detected ${Math.floor(1000 + Math.random() * 500)} Points`, 'info');
          
          // EVALUATING
          addLog('Calculating Surface Roughness...', 'info');
          const zoneAScore = Math.floor(20 + Math.random() * 70);
          const zoneBScore = Math.floor(20 + Math.random() * 70);
          const zoneCScore = Math.floor(20 + Math.random() * 70);
          await wait(800);
          if (!active) break;

          addLog('Landing Zone Score', 'warning');
          addLog(`Zone A : ${zoneAScore}`, 'info');
          addLog(`Zone B : ${zoneBScore}`, 'info');
          addLog(`Zone C : ${zoneCScore}`, 'info');

          const bestScore = Math.max(zoneAScore, zoneBScore, zoneCScore);
          
          if (bestScore > 75 || i === searchAttempts - 1) {
            foundSafeZone = bestScore > 75;
            addLog('Best Landing Zone Selected', 'success');
            setState(prev => ({ 
              ...prev, 
              surfaceRoughness: Math.random() * 0.2, 
              slope: Math.random() * 10,
              modelConfidence: bestScore,
              inferenceTime: 1.2 + Math.random(),
              targetPos: { x: (Math.random() - 0.5) * 8, z: (Math.random() - 0.5) * 8 },
              targetRadius: 1.5
            }));
            await wait(500);
            break;
          } else {
            addLog('Unsafe Surface', 'error');
            addLog('Zone Rejected', 'warning');
            const dirs = ['Moving Left', 'Moving Right', 'Moving Forward'];
            const moveAct = dirs[Math.floor(Math.random() * dirs.length)];
            addLog(moveAct, 'info');
            setState(prev => ({ 
              ...prev, 
              droneState: 'moving', 
              currentAction: moveAct,
              dronePos: { x: prev.dronePos.x + (Math.random()-0.5)*4, z: prev.dronePos.z + (Math.random()-0.5)*4 }
            }));
            await wait(1500);
            if (!active) break;
          }
        }
        if (!active) break;

        // MOVING TO TARGET
        addLog('Moving To Target', 'info');
        setState(prev => ({ 
          ...prev, 
          droneState: 'moving', 
          currentAction: 'Hover',
          dronePos: { x: prev.targetPos.x, z: prev.targetPos.z }
        }));
        await wait(1500);
        if (!active) break;

        // DESCENDING
        addLog('Descending', 'warning');
        setState(prev => ({ ...prev, droneState: 'descending', currentAction: 'Descend' }));
        
        let alt = 10;
        while (alt > 2) {
          alt -= 2;
          addLog(`Altitude: ${alt.toFixed(1)}`, 'info');
          setState(prev => ({ ...prev, altitude: alt, verticalSpeed: -2, lidarDistance: alt }));
          await wait(400);
          if (!active) break;
        }
        if (!active) break;

        // LANDING RESULT
        if (outcome === 'success') {
          addLog(`Altitude: 0.8`, 'info');
          setState(prev => ({ ...prev, altitude: 0.8, verticalSpeed: -0.5, lidarDistance: 0.8 }));
          await wait(400);
          addLog('Touchdown', 'info');
          addLog('LANDING SUCCESSFUL', 'success');
          addLog('Reward +100', 'success');
          setState(prev => ({ 
            ...prev, 
            droneState: 'landed', 
            altitude: 0, 
            lidarDistance: 0,
            verticalSpeed: 0,
            currentAction: 'Land',
            successfulLandings: prev.successfulLandings + 1,
            landingAccuracy: 80 + Math.random() * 20,
            currentReward: 100,
            totalReward: prev.totalReward + 100
          }));
        } else if (outcome === 'hard_landing') {
          addLog('Drone Tilt Detected', 'warning');
          addLog('Hard Landing', 'warning');
          addLog('Reward -20', 'error');
          setState(prev => ({ 
            ...prev, 
            droneState: 'landed', 
            altitude: 0, 
            lidarDistance: 0,
            verticalSpeed: 0,
            currentAction: 'Land',
            hardLandings: prev.hardLandings + 1,
            landingAccuracy: 40 + Math.random() * 30,
            currentReward: -20,
            totalReward: prev.totalReward - 20
          }));
        } else {
          // crash
          addLog('Unexpected Rock', 'error');
          addLog('Recovery Failed', 'error');
          addLog('CRASH', 'error');
          addLog('Reward -120', 'error');
          setState(prev => ({ 
            ...prev, 
            droneState: 'crashed', 
            altitude: 0, 
            lidarDistance: 0,
            verticalSpeed: -10,
            currentAction: 'Hover',
            crashes: prev.crashes + 1,
            landingAccuracy: Math.random() * 20,
            currentReward: -120,
            totalReward: prev.totalReward - 120
          }));
        }

        // UPDATE METRICS
        setState(prev => {
          const totalGames = prev.successfulLandings + prev.hardLandings + prev.crashes;
          const newAvgReward = prev.totalReward / Math.max(1, totalGames);
          const newSuccessRate = (prev.successfulLandings / Math.max(1, totalGames)) * 100;
          const newCrashRate = (prev.crashes / Math.max(1, totalGames)) * 100;
          const progress = Math.min(100, (episode / 1000) * 100);

          const newHistory = [...prev.history, {
            episode,
            reward: newAvgReward,
            successRate: newSuccessRate,
            loss: Math.max(0.01, prev.policyLoss * 0.98),
            crashCount: prev.crashes
          }];
          if (newHistory.length > 50) newHistory.shift();

          return {
            ...prev,
            averageReward: newAvgReward,
            successRate: newSuccessRate,
            crashRate: newCrashRate,
            trainingProgress: progress,
            policyLoss: Math.max(0.01, prev.policyLoss * 0.98),
            valueLoss: Math.max(0.01, prev.valueLoss * 0.98),
            explorationRate: Math.max(0.01, prev.explorationRate * 0.99),
            history: newHistory
          };
        });

        await wait(2500); // Wait before next episode
      }
    };

    runEpisodeLoop();

    return () => {
      active = false;
      clearTimeout(timeoutId);
    };
  }, [isRunning, addLog]);

  return { state, actions: { toggleTraining, resetSimulation } };
}
