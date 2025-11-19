"use client";

import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from "@mui/material";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName?: string;
}

export default function DeleteConfirmationDialog({
  open,
  onClose,
  onConfirm,
  itemName = "item",
}: DeleteConfirmationDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Você tem certeza que deseja excluir este {itemName}? Esta ação não
          pode ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
