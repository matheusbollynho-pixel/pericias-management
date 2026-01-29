import { useEffect, useState } from 'react';

interface LogEntry {
  time: string;
  message: string;
  type: 'log' | 'error' | 'warn';
}

export default function DebugConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    // Capturar console.log, console.error, console.warn
    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    console.log = (...args: any[]) => {
      originalLog(...args);
      setLogs(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '),
        type: 'log'
      }].slice(-20)); // Manter últimos 20 logs
    };

    console.error = (...args: any[]) => {
      originalError(...args);
      setLogs(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '),
        type: 'error'
      }].slice(-20));
    };

    console.warn = (...args: any[]) => {
      originalWarn(...args);
      setLogs(prev => [...prev, {
        time: new Date().toLocaleTimeString(),
        message: args.map(a => typeof a === 'object' ? JSON.stringify(a, null, 2) : String(a)).join(' '),
        type: 'warn'
      }].slice(-20));
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, []);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg z-50"
      >
        Mostrar Console
      </button>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-4 max-h-96 overflow-y-auto z-50 font-mono text-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Console Debug</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setLogs([])}
            className="bg-gray-700 px-2 py-1 rounded"
          >
            Limpar
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="bg-gray-700 px-2 py-1 rounded"
          >
            Fechar
          </button>
        </div>
      </div>
      <div className="space-y-1">
        {logs.map((log, i) => (
          <div
            key={i}
            className={`p-2 rounded ${
              log.type === 'error' ? 'bg-red-900/50' :
              log.type === 'warn' ? 'bg-yellow-900/50' :
              'bg-gray-800'
            }`}
          >
            <span className="text-gray-400">[{log.time}]</span>{' '}
            <span className="whitespace-pre-wrap break-all">{log.message}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500 text-center py-4">Nenhum log ainda</div>
        )}
      </div>
    </div>
  );
}
