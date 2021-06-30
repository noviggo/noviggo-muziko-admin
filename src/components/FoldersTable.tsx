import { faPlus, faSyncAlt, faTimes } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Snackbar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { formatDistanceToNow } from 'date-fns';
import { useConfirm } from 'material-ui-confirm';
import React, { useEffect, useState } from 'react';

import { Folder } from '../entities/apiEntities';
import { getUrl, useDeleteFolderMutation, useGetAllFoldersQuery, useScanFolderMutation } from '../slices/muzikoApi';
import colors from '../styles/colors.module.scss';
import { FolderDialog } from './FolderDialog';
import Loading from './Loading';
import { HubConnection, HubConnectionBuilder, HubConnectionState, LogLevel } from '@microsoft/signalr';

const useStyles = makeStyles({
  table: {
    minWidth: 800,
  },
});

function FolderRow(entity: Folder) {
  const [deleteFolder] = useDeleteFolderMutation();
  const [scanFolder] = useScanFolderMutation();
  const [lastSynced, setLastSynced] = useState('');
  const confirm = useConfirm();
  const [hubConnection, setHubConnection] = useState<HubConnection>();
  const [folder, setFolder] = useState<Folder>(entity);

  useEffect(() => {
    setLastSynced(
      folder.lastSyncDate ? formatDistanceToNow(new Date(folder.lastSyncDate), { addSuffix: true }) : 'Not synced'
    );
    const interval = setInterval(() => {
      setLastSynced(
        folder.lastSyncDate ? formatDistanceToNow(new Date(folder.lastSyncDate), { addSuffix: true }) : 'Not synced'
      );
    }, 10000);
    return () => {
      clearInterval(interval);
    };
  }, [folder]);

  useEffect(() => {
    const createHubConnection = async () => {
      const url = encodeURI(`${getUrl()}/muziko/hub/folders?folderId=${folder.id}`);
      const hubConnection = new HubConnectionBuilder()
        .withUrl(url)
        .configureLogging(LogLevel.Error)
        .withAutomaticReconnect()
        .build();
      try {
        await hubConnection.start();
        hubConnection.on('Updated', (folder: Folder) => {
          setFolder(folder);
        });
      } catch (err) {
        alert(err);
        console.log('Error while establishing connection: ' + { err });
      }
      setHubConnection(hubConnection);
    };
    createHubConnection();
    return () => {
      if (hubConnection) hubConnection.stop();
    };
  }, []);

  const handleDelete = () => {
    confirm({ description: 'This action is permanent!' }).then(() => {
      deleteFolder(folder.id);
    });
  };

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {folder.path}
      </TableCell>
      <TableCell component="th" scope="row">
        {folder.totalTracks ? folder.totalTracks.toLocaleString('en-US') : 0}
      </TableCell>
      <TableCell component="th" scope="row">
        {folder.status}
      </TableCell>
      <TableCell width={'200px'}>{lastSynced}</TableCell>
      <TableCell width={'200px'}>
        <Button
          className="me-3"
          color="primary"
          variant="contained"
          aria-label="sync"
          onClick={() => {
            scanFolder(folder.id);
          }}
        >
          <FontAwesomeIcon icon={faSyncAlt} />
        </Button>
        <Button
          style={{ backgroundColor: colors.accent }}
          color="inherit"
          variant="contained"
          aria-label="delete"
          onClick={handleDelete}
        >
          <FontAwesomeIcon icon={faTimes} />
        </Button>
      </TableCell>
    </TableRow>
  );
}

export default function FoldersTable() {
  const classes = useStyles();
  const { data, isLoading } = useGetAllFoldersQuery({});
  const [newFolderOpen, setNewFolderOpen] = React.useState(false);

  const handleNewFolderOpen = () => {
    setNewFolderOpen(true);
  };

  const handleNewFolderClose = () => {
    setNewFolderOpen(false);
  };

  if (isLoading) return <Loading />;
  return (
    <div className="container my-5">
      <div className="d-flex mb-1 align-items-center">
        <h4 className="me-auto">Music folders</h4>
        <IconButton aria-label="add path" onClick={handleNewFolderOpen}>
          <FontAwesomeIcon icon={faPlus} fixedWidth size={'sm'} />
        </IconButton>
      </div>
      <TableContainer component={Paper}>
        <Table className={classes.table} aria-label="folder table">
          <TableHead>
            <TableRow>
              <TableCell>Path</TableCell>
              <TableCell>Total Tracks</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Synced</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {data ? (
            <TableBody>
              {data.map(folder => (
                <FolderRow key={folder.id} {...folder} />
              ))}
            </TableBody>
          ) : (
            <TableBody></TableBody>
          )}
        </Table>
      </TableContainer>
      <FolderDialog open={newFolderOpen} onClose={handleNewFolderClose} />
    </div>
  );
}
