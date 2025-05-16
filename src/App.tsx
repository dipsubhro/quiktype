// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'

import { BrowserRouter, Route, Routes } from "react-router-dom";
// import "./App.css";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
         <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
