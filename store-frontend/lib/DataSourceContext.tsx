'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

export type DataSourceMode = 'api' | 'mock';

interface DataSourceContextValue {
  mode: DataSourceMode;
  setMode: (mode: DataSourceMode) => void;
  isReady: boolean;
}

const STORAGE_KEY = 'belhos:data-source-mode';

const DataSourceContext = createContext<DataSourceContextValue | undefined>(undefined);

export const DataSourceProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<DataSourceMode>('api');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const storedMode = window.localStorage.getItem(STORAGE_KEY);
    if (storedMode === 'api' || storedMode === 'mock') {
      setModeState(storedMode);
    }
    setIsReady(true);
  }, []);

  const setMode = useCallback((nextMode: DataSourceMode) => {
    setModeState(nextMode);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, nextMode);
    }
    console.info('[DataSource] Mode changed', { mode: nextMode });
  }, []);

  const value = useMemo<DataSourceContextValue>(
    () => ({
      mode,
      setMode,
      isReady,
    }),
    [mode, setMode, isReady],
  );

  return <DataSourceContext.Provider value={value}>{children}</DataSourceContext.Provider>;
};

export const useDataSource = () => {
  const context = useContext(DataSourceContext);
  if (!context) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
};
