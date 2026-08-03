import React, { useEffect, useRef } from 'react';

export default function LogConsole({ logs }) {
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="log-console custom-scrollbar">
      {logs.map((log) => (
        <div key={log.id} className={`log-entry ${log.type}`}>
          <span className="timestamp">[{log.time}]</span>
          <span>{log.msg}</span>
        </div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
