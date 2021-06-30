import { Button, DialogActions, DialogContent, DialogContentText, Snackbar, TextField } from '@material-ui/core';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { useAddFolderMutation, useScanFolderMutation } from '../slices/muzikoApi';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';

export interface FolderDialogProps {
  open: boolean;
  onClose: () => void;
}

type Inputs = {
  path: string;
};

export function FolderDialog(props: FolderDialogProps) {
  const { onClose, open } = props;
  const [addFolder] = useAddFolderMutation();
  const [scanFolder] = useScanFolderMutation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async input => {
    const results = await addFolder(input.path)
      .unwrap()
      .catch(() => null);
    if (!results) return;
    reset();
    onClose();
    await scanFolder(results.id);
  };

  const handleClose = () => {
    onClose();
  };


  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>Set a path to monitor</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <DialogContentText>
              To monitor a folder for music, please enter full path to where it is stored here.
            </DialogContentText>
            <TextField
              {...register('path', { required: true })}
              autoFocus
              id="path"
              label="Folder Path"
              type="text"
              fullWidth
              error={errors.path ? true : false}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button color="primary" type="submit">
              Save
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
