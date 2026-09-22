import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MotionPreferences } from "./components/ui/MotionPreferences";
import App from "./app/App";
import { ConsentProvider } from "./features/consent/ConsentProvider";
import "./styles/index.css";

if (import.meta.env.PROD && window.location.hostname === "senzoft.com") {
  window.location.replace(`https://www.senzoft.com${window.location.pathname}${window.location.search}${window.location.hash}`);
} else {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <BrowserRouter>
        <MotionPreferences>
          <ConsentProvider><App /></ConsentProvider>
        </MotionPreferences>
      </BrowserRouter>
    </StrictMode>,
  );
}
