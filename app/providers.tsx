"use client";

import React, { createContext, useCallback, useMemo, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  HydrationBoundary,
  QueryClient,
  QueryClientProvider,
  dehydrate,
} from "@tanstack/react-query";

import Modals from "@/components/modal";

import { ModalContext } from "@/types/modal.types";

/** Modal Provider */
type ModalsDispatch = {
  open: ({ Component, props }: ModalContext) => void;
  close: ({ Component }: ModalContext) => void;
  isOpen: ({ Component }: ModalContext) => boolean;
};

export const ModalsDispatchContext = createContext<ModalsDispatch>({
  open: () => {},
  close: () => {},
  isOpen: () => false,
});

export const ModalsStateContext = createContext<ModalContext[]>([]);

function ModalsProvider({ children }: { children: React.ReactNode }) {
  const [activatedModals, setActivatedModals] = useState<ModalContext[]>([]);

  const open = ({ Component, props }: ModalContext) => {
    setActivatedModals(modals => {
      return [...modals, { Component, props }];
    });
  };

  const close = ({ Component }: ModalContext) => {
    setActivatedModals(modals => {
      return modals.filter(modal => {
        return modal.Component !== Component;
      });
    });
  };

  const isOpen = useCallback(
    ({ Component }: ModalContext) =>
      !!activatedModals.map(modal => modal.Component === Component),
    [activatedModals],
  );

  const dispatch = useMemo(() => ({ open, close, isOpen }), [isOpen]);

  return (
    <ModalsStateContext.Provider value={activatedModals}>
      <ModalsDispatchContext.Provider value={dispatch}>
        {children}
        <Modals />
      </ModalsDispatchContext.Provider>
    </ModalsStateContext.Provider>
  );
}

/** Root Provider includes Tanstack Query */
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            refetchInterval: false,
            staleTime: 1000 * 60 * 10,
            retry: false,
            throwOnError: true,
          },
          mutations: {
            throwOnError: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <ModalsProvider>{children}</ModalsProvider>
      </HydrationBoundary>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
