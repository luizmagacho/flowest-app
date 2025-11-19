"use client";

import React from "react";
import { Box, Typography, Stack, keyframes } from "@mui/material";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

import { QuoteContext } from "@/contexts/QuoteContext"; // (Assumindo que está correto)
import { ITickerTapeItem } from "@/services/ticker-tapes/type"; // (Assumindo que está correto)

interface TickerTapeProps {
  tickerTapeItems: ITickerTapeItem[];
  loading: boolean;
}

const marquee = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-50%); }
`;

const TickerItem: React.FC<{ item: ITickerTapeItem }> = ({ item }) => {
  const color =
    item.direction === "up"
      ? "success.main"
      : item.direction === "down"
      ? "error.main"
      : "text.secondary";
  const sign = item.direction === "up" ? "+" : "";

  const changeDisplay =
    typeof item.changePercent === "number"
      ? `${sign}${item.changePercent.toFixed(2)}%` // Adicionamos o 'sign' aqui
      : "---";

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={0.5}
      sx={{ color: color, px: 3 }}
    >
      <Typography variant="body2" component="span" sx={{ fontWeight: "bold" }}>
        {item.ticker}
      </Typography>
      <Typography variant="caption" component="span">
        {changeDisplay}
      </Typography>
      {item.direction === "up" && <ArrowDropUpIcon sx={{ mb: "2px" }} />}
      {item.direction === "down" && <ArrowDropDownIcon sx={{ mb: "2px" }} />}
    </Stack>
  );
};

export default function TickerTape({
  tickerTapeItems,
  loading,
}: TickerTapeProps) {
  // 5. Estado de Carregamento (Loading)
  // (Sem alterações aqui, "width: 100%" está correto)
  if (loading) {
    return (
      <Box
        sx={{
          width: "100%",
          bgcolor: "grey.900",
          color: "grey.500",
          textAlign: "center",
          py: 1.5,
          borderTop: 1,
          borderBottom: 1,
          borderColor: "grey.700",
          overflow: "hidden",
        }}
      >
        <Typography variant="caption">A carregar cotações...</Typography>
      </Box>
    );
  }

  if (!tickerTapeItems || tickerTapeItems.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        width: "100%",
        height: "40px",
        bgcolor: "grey.900",
        borderTop: 1,
        borderBottom: 1,
        borderColor: "grey.700",
        overflow: "hidden",
        position: "relative",
        py: 1,
      }}
    >
      <Box
        sx={{
          position: "absolute",
          whiteSpace: "nowrap",
          animation: `${marquee} 380s linear infinite`,
          "&:hover": {
            animationPlayState: "paused",
          },
        }}
      >
        {tickerTapeItems.map((item, index) => (
          <Box key={index} sx={{ display: "inline-block" }}>
            <TickerItem item={item} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}
