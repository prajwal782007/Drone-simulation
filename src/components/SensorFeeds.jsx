import React, { useEffect, useState, useRef } from 'react';

const SensorFeeds = ({ state }) => {
  const [frontCameraObjects, setFrontCameraObjects] = useState([]);
  const lidarCanvasRef = useRef(null);

  // Simulate dynamic object detection in front camera
  useEffect(() => {
    if (state.droneState === 'scanning' || state.droneState === 'moving') {
      const objects = ['Tree', 'Building', 'Obstacle', 'Vehicle', 'Bird'];
      const detections = [];
      const numDetections = Math.floor(Math.random() * 3) + 1;
      
      for (let i = 0; i < numDetections; i++) {
        detections.push({
          id: i,
          type: objects[Math.floor(Math.random() * objects.length)],
          confidence: Math.floor(80 + Math.random() * 19),
          x: Math.floor(10 + Math.random() * 60), // percentage
          y: Math.floor(10 + Math.random() * 60), // percentage
          w: Math.floor(15 + Math.random() * 20),
          h: Math.floor(15 + Math.random() * 30),
        });
      }
      setFrontCameraObjects(detections);
    } else {
      setFrontCameraObjects([]);
    }
  }, [state.droneState, state.terrainSeed]);

  // Simulate LiDAR graph
  useEffect(() => {
    const canvas = lidarCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Simple noise graph
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const noise = state.droneState === 'hovering' ? 2 : 10;
    
    for (let x = 0; x < width; x += 5) {
      const y = height / 2 + (Math.random() - 0.5) * noise + (state.altitude * 2);
      if (x === 0) ctx.moveTo(x, Math.max(0, Math.min(height, y)));
      else ctx.lineTo(x, Math.max(0, Math.min(height, y)));
    }
    ctx.stroke();
    
    // Draw horizontal beam line
    ctx.strokeStyle = 'rgba(34, 197, 94, 0.5)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();

  }, [state.altitude, state.droneState]);

  // Determine bottom camera background color based on surface
  const getSurfaceColor = () => {
    if (state.terrain.includes('Water')) return 'rgba(59, 130, 246, 0.5)'; // Blue
    if (state.terrain.includes('Rock')) return 'rgba(120, 113, 108, 0.5)'; // Brown
    if (state.terrain.includes('Concrete') || state.terrain.includes('Road')) return 'rgba(156, 163, 175, 0.5)'; // Gray
    if (state.terrain.includes('Sand')) return 'rgba(234, 179, 8, 0.4)'; // Yellow
    if (state.modelConfidence > 80) return 'rgba(34, 197, 94, 0.4)'; // Green
    if (state.modelConfidence > 50) return 'rgba(234, 179, 8, 0.4)'; // Yellow
    return 'rgba(239, 68, 68, 0.4)'; // Red
  };

  return (
    <div className="sensors-panel glass-panel custom-scrollbar" style={{ padding: '12px' }}>
      <h2>Live Sensor Feeds</h2>
      
      {/* Front Camera */}
      <div className="sensor-feed">
        <div className="sensor-feed-title">
          <span>Camera 1: Front RGB</span>
          <span style={{color: 'var(--accent-green)'}}>● REC</span>
        </div>
        <div className="sensor-feed-content" style={{ 
          background: 'linear-gradient(to bottom, #3b82f644, #0f172a)',
          position: 'relative'
        }}>
          {frontCameraObjects.map(obj => (
            <div key={obj.id} style={{
              position: 'absolute',
              left: `${obj.x}%`,
              top: `${obj.y}%`,
              width: `${obj.w}%`,
              height: `${obj.h}%`,
              border: '2px solid var(--accent-orange)',
              backgroundColor: 'rgba(245, 158, 11, 0.1)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{
                background: 'var(--accent-orange)',
                color: '#000',
                fontSize: '0.6rem',
                padding: '2px 4px',
                fontWeight: 'bold',
                alignSelf: 'flex-start'
              }}>
                {obj.type} {obj.confidence}%
              </div>
            </div>
          ))}
          {/* Static noise overlay */}
          <div style={{
            position: 'absolute', inset: 0, 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.1%22/%3E%3C/svg%3E")'
          }}></div>
        </div>
      </div>

      {/* Bottom Camera */}
      <div className="sensor-feed">
        <div className="sensor-feed-title">
          <span>Camera 2: Bottom Semantic</span>
          <span style={{color: 'var(--accent-green)'}}>● REC</span>
        </div>
        <div className="sensor-feed-content" style={{ 
          backgroundColor: getSurfaceColor(),
          backgroundImage: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.8) 100%)',
          position: 'relative'
        }}>
          {/* Safe landing circle overlay */}
          {state.modelConfidence > 75 && (
            <div style={{
              position: 'absolute',
              width: '60%',
              height: '60%',
              border: '2px dashed var(--accent-green)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'pulse-glow 2s infinite'
            }}>
              <span style={{ color: 'var(--accent-green)', fontWeight: 'bold', fontSize: '0.8rem', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px'}}>
                SAFE ZONE: {state.modelConfidence}
              </span>
            </div>
          )}
          
          <div style={{
            position: 'absolute', inset: 0, 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22 opacity=%220.15%22/%3E%3C/svg%3E")'
          }}></div>
        </div>
      </div>

      {/* LiDAR */}
      <div className="sensor-feed">
        <div className="sensor-feed-title">
          <span>Sensor 3: LiDAR Altitude</span>
          <span style={{color: 'var(--accent-green)'}}>ACTV</span>
        </div>
        <div className="sensor-feed-content" style={{ flexDirection: 'column', padding: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginBottom: '8px' }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>CURRENT HEIGHT</div>
            <div style={{ fontSize: '1.2rem', color: 'var(--accent-green)', fontWeight: 'bold' }}>{state.altitude.toFixed(2)}m</div>
          </div>
          <div style={{ flex: 1, width: '100%', position: 'relative' }}>
             <canvas ref={lidarCanvasRef} width={250} height={100} style={{ width: '100%', height: '100%', filter: 'drop-shadow(0 0 5px var(--accent-green))' }} />
             {/* Vertical laser sweep */}
             <div style={{
               position: 'absolute',
               left: '50%',
               top: 0,
               bottom: 0,
               width: '2px',
               background: 'rgba(34, 197, 94, 0.8)',
               boxShadow: '0 0 10px var(--accent-green)',
               transform: 'translateX(-50%)',
               animation: 'blink 0.5s infinite alternate'
             }}></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default SensorFeeds;
