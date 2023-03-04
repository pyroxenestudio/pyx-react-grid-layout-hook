import '@testing-library/jest-dom';
import {render, screen, fireEvent} from '@testing-library/react';
import React from 'react';
import TestComponent from './pyxComponent';

test('loads and displays greeting', async () => {
  // ARRANGE
  render(<TestComponent />)
  expect(screen.queryByText('PATATA')).toBeInTheDocument();
})