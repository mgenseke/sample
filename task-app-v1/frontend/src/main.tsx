import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";
import { AppProvider } from "./AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProvider>
      <NextUIProvider>
        <div className="light text-foreground bg-background font-mono app-shell">
          <App />
        </div>
      </NextUIProvider>
    </AppProvider>
  </StrictMode>
);
