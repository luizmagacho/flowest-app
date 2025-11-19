// src/theme/ThemeRegistry.tsx
"use client";

import * as React from "react";
import createCache from "@emotion/cache";
import { useServerInsertedHTML } from "next/navigation";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import type { Theme } from "@mui/material/styles";
import type {
  EmotionCache,
  Options as EmotionCacheOptions,
} from "@emotion/cache";

// Defina o tipo para as props do ThemeRegistry
interface ThemeRegistryProps {
  options: EmotionCacheOptions;
  children: React.ReactNode;
  theme: Theme;
}

// Este componente é o que estávamos tentando importar antes.
// Agora o estamos criando corretamente.
function NextAppDirEmotionCacheProvider(props: {
  options: EmotionCacheOptions;
  CacheProvider: React.Provider<EmotionCache | null>;
  children: React.ReactNode;
}) {
  const { options, CacheProvider, children } = props;

  const [registry] = React.useState(() => {
    const cache = createCache(options);
    cache.compat = true;
    const prevInsert = cache.insert;
    let inserted: string[] = [];
    cache.insert = (...args) => {
      const serialized = args[1];
      if (cache.inserted[serialized.name] === undefined) {
        inserted.push(serialized.name);
      }
      return prevInsert(...args);
    };
    const flush = () => {
      const prevInserted = inserted;
      inserted = [];
      return prevInserted;
    };
    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = registry.flush();
    if (names.length === 0) {
      return null;
    }
    let styles = "";
    for (const name of names) {
      styles += registry.cache.inserted[name];
    }
    return (
      <style
        key={registry.cache.key}
        data-emotion={`${registry.cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{
          __html: styles,
        }}
      />
    );
  });

  return <CacheProvider value={registry.cache}>{children}</CacheProvider>;
}

// Este é o componente principal que você usará no layout
export default function ThemeRegistry(props: ThemeRegistryProps) {
  const { options, children, theme } = props;

  return (
    <NextAppDirEmotionCacheProvider
      options={options}
      CacheProvider={CacheProvider}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </NextAppDirEmotionCacheProvider>
  );
}
