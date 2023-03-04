import React from 'react';
import { createRoot } from 'react-dom/client';
import BasicComponent from './basic.component';
const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BasicComponent />
  </React.StrictMode>
);
