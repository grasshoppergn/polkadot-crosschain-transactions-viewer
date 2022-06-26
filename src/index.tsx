import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.scss";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route index element={<Navigate to="kusama" />} />
        <Route path=":chain" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
