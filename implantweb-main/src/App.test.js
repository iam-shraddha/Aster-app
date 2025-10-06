import { render, screen } from '@testing-library/react';
import App from './App';

test('renders welcome message', () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to Implant/i);  // Updated to match your text
  expect(linkElement).toBeInTheDocument();
});

test('does not render learn react link', () => {
  render(<App />);
  const linkElement = screen.queryByText(/learn react/i);  // Using queryByText to avoid failing the test
  expect(linkElement).toBeNull();  // Ensure it does not exist
});
