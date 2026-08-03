import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setAttendanceUserName } from "./infra/auth/attendance-user-storage";

setAttendanceUserName(import.meta.env.VITE_ATENDIMENTO_NOM_USUARIO);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
