import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('App integration', () => {
  it('inserts values and performs inorder traversal', () => {
    render(<App />);
    const insertInput = screen.getByPlaceholderText(/Value to insert/i);
    const insertBtn = screen.getByRole('button', { name: /insert/i });

    ['5', '3', '7'].forEach((v) => {
      fireEvent.change(insertInput, { target: { value: v } });
      fireEvent.click(insertBtn);
    });

    fireEvent.click(screen.getByRole('button', { name: /inorder/i }));
    expect(screen.getByText(/Inorder/i)).toBeInTheDocument();
  });
});
