"use client";

import React, { useState } from "react";

// Importações do Material-UI
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Input,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

interface UploadNoteModalProps {
  open: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => void;
}

export default function UploadNoteModal({
  open,
  onClose,
  onFileUpload,
}: UploadNoteModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUpload(selectedFile);
      setSelectedFile(null); // Limpa o estado após o envio
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Enviar Nota de Corretagem</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            py: 4,
          }}
        >
          <Button
            component="label"
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Selecionar Arquivo
            <Input
              type="file"
              hidden
              onChange={handleFileChange}
              inputProps={{
                accept: ".pdf,.xml,.zip",
              }}
            />
          </Button>
          {selectedFile && (
            <Typography variant="body2" sx={{ mt: 2 }}>
              Arquivo selecionado: <strong>{selectedFile.name}</strong>
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button
          onClick={handleUpload}
          variant="contained"
          disabled={!selectedFile}
        >
          Enviar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
