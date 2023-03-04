import React from "react";
import { usePyxReactGridLayout } from "../dist/pyx-hooks";

const BasicComponent = () => {
  const {
    layout,
    items,
    resetLayout,
    insertLayout,
    updateLayout
  } = usePyxReactGridLayout({
    items: Array.of('Patata', 'cosa', 'Salud'),
    height: 4,
    rows: 4,
    col: 12
  });

  console.log('layout', layout);
  return (
    <>
      BASIC COMPONENT
    </>
  )
}

export default BasicComponent;