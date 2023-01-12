import { ReactElement } from "react";

import { ThemeProvider } from "./theme";
import { ToastProvider } from "./toast";

type Props = {
  children: ReactElement;
}

export function MainProviders({ children }: Props) {
  return (
    <ThemeProvider>
      <ToastProvider>
        { children }
      </ToastProvider>
    </ThemeProvider>
  )
}