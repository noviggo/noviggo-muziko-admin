import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

import Loading from '../components/Loading';
import { getUrl } from '../slices/muzikoApi';

interface DeviceConnectionContextData {
  devicesConnection: HubConnection;
}

const DeviceConnectionContext = createContext<DeviceConnectionContextData>({} as DeviceConnectionContextData);

export const DeviceConnectionProvider: React.FC = ({ children }) => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  const connect = useCallback(async () => {
    const url = encodeURI(`${getUrl()}/muziko/hub/devices`);
    const createdConnection = new HubConnectionBuilder()
      .withUrl(url)
      .configureLogging(LogLevel.Error)
      .withAutomaticReconnect()
      .build();
    console.log('Device connection started');
    await createdConnection.start();
    setConnection(createdConnection);
  }, [HubConnectionBuilder, setConnection]);

  useEffect(() => {
    if (!connection) {
      connect();
    }
    return () => {
      const shutdownConnection = async () => {
        if (!connection) return;
        console.log('Device connection closed');
        connection.stop();
      };
      shutdownConnection();
    };
  }, [connect, connection]);
  if (!connection) return <Loading />;
  return (
    <DeviceConnectionContext.Provider
      value={{
        devicesConnection: connection,
      }}
    >
      {children}
    </DeviceConnectionContext.Provider>
  );
};

export function useDeviceConnection() {
  const context = useContext(DeviceConnectionContext);

  return context;
}
