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

const DEFAULT_MODE: DataSourceMode = 'mock';

const resolveHealthCheckUrl = (): string | null => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

  try {
    const url = new URL(apiUrl);
    const trimmedPath = url.pathname.replace(/\/$/, '');

    if (trimmedPath.endsWith('/api')) {
      url.pathname = `${trimmedPath.slice(0, -4)}/health`;
    } else {
      url.pathname = `${trimmedPath}/health`;
    }

    return url.toString();
  } catch (error) {
    console.warn('[DataSource] Unable to construct health check URL from NEXT_PUBLIC_API_URL', error);
    return null;
  }
};

export const DataSourceProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setModeState] = useState<DataSourceMode>(DEFAULT_MODE);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    let isCancelled = false;

    const commitMode = (nextMode: DataSourceMode) => {
      if (isCancelled) {
        return;
      }

      setModeState(nextMode);
    };

    const persistMode = (nextMode: DataSourceMode) => {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, nextMode);
      }
    };

    const markReady = () => {
      if (!isCancelled) {
        setIsReady(true);
      }
    };

    const storedMode = window.localStorage.getItem(STORAGE_KEY);
    if (storedMode === 'mock') {
      commitMode('mock');
      markReady();
      return () => {
        isCancelled = true;
      };
    }

    if (storedMode === 'api') {
      markReady();

      const healthCheckUrl = resolveHealthCheckUrl();
      if (!healthCheckUrl) {
        persistMode(DEFAULT_MODE);
        commitMode(DEFAULT_MODE);
        return () => {
          isCancelled = true;
        };
      }

      void fetch(healthCheckUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`Health check failed with status ${response.status}`);
          }

          commitMode('api');
        })
        .catch((error) => {
          console.warn('[DataSource] API mode unavailable during hydration, falling back to mock', error);
          persistMode(DEFAULT_MODE);
          commitMode(DEFAULT_MODE);
        });

      return () => {
        isCancelled = true;
      };
    }

    persistMode(DEFAULT_MODE);
    commitMode(DEFAULT_MODE);
    markReady();

    return () => {
      isCancelled = true;
    };
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
