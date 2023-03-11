import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://urrsklmmmeccmlgvolif.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVycnNrbG1tbWVjY21sZ3ZvbGlmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzgzODk5MjQsImV4cCI6MTk5Mzk2NTkyNH0.chVRI6Av7B1q1VnE26E-e9YSpP9IfTSU2Ik9nzYVsvs"
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SessionContextProvider supabaseClient={supabase}>
      <App />
    </SessionContextProvider>
  </React.StrictMode>
);
