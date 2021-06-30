import Snackbar from '@material-ui/core/Snackbar';
import React, { useEffect } from 'react';

import { useDeviceConnection } from '../contexts/deviceConnectionContext';
import { Device } from '../entities/apiEntities';

export default function DeviceSnackbar() {
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const { devicesConnection } = useDeviceConnection();

  useEffect(() => {
    if (!devicesConnection) return;
    devicesConnection.on('DeviceConnected', (device: Device) => {
      setMessage(`${device.deviceId} connected`);
      setOpen(true);
    });
    devicesConnection.on('DeviceDisconnected', (device: Device) => {
      setMessage(`${device.deviceId} disconnected`);
      setOpen(true);
    });
    return () => {
    };
  }, [devicesConnection]);

  const handleClose = (event: React.SyntheticEvent | React.MouseEvent, reason?: string) => {
    if (reason === 'clickaway') return;
    setOpen(false);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      open={open}
      autoHideDuration={3000}
      onClose={handleClose}
      message={message}
    />
  );
}
