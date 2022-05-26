import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

test('renders Covid Daily Cases', () => {
  render(<App />);
  const title = screen.getByText("Covid Daily Cases");
  expect(title).toBeInTheDocument();
});

test('renders Select', () => {
  render(<App />);
  const slider = screen.getByRole('slider')
  expect(slider.value).toBe("20")
})

test('renders Checkbox', () => {
  render(<App />);
  const checkBox = screen.getByRole("checkbox")
  expect(checkBox).toBeInTheDocument()
})

test('checkbox change value', () => {
  render(<App />);
  const slider = screen.getByRole('checkbox')
  fireEvent.click(slider)
  expect(slider.value).toBe("true")

})