"use client";

import React from "react";
import { Box, Typography, Paper } from "@mui/material";

export default function DividendsPage() {
  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center', minHeight: 'calc(100vh - 64px)' }}>
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 4, 
          mt: 4, 
          width: '100%', 
          maxWidth: '800px', 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h4" component="h1" fontWeight="bold" mb={2}>
          Proventos (Dividendos)
        </Typography>
        <Typography color="text.secondary" mb={4}>
          Esta é a página de listagem de proventos recebidos por ativo.
        </Typography>

        <Box 
          sx={{ 
            p: 4, 
            bgcolor: 'grey.50', 
            borderRadius: 2,
            border: '1px dashed grey'
          }}
        >
          <Typography variant="h6" color="text.primary">
            Conteúdo da Tabela e Filtros Vêm Aqui
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={1}>
            A lógica de busca e paginação será implementada.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}