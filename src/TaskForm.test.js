import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

jest.mock('./api', () => ({
  getTasks: jest.fn(() => Promise.resolve([])),
  createTask: jest.fn((task) =>
    Promise.resolve({ id: 1, done: false, description: '', ...task })
  ),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

import { createTask, getTasks } from './api';

const renderApp = async () => {
  const user = userEvent.setup();
  render(<App />);
  await screen.findByPlaceholderText('New task...');
  return { user };
};

describe('TaskForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getTasks.mockResolvedValue([]);
  });

  test('рендерить поле вводу і кнопку ADD', async () => {
    await renderApp();
    expect(screen.getByPlaceholderText('New task...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add/i })).toBeInTheDocument();
  });

  test('рендерить кнопки пріоритету LOW / MED / HIGH', async () => {
    await renderApp();
    expect(screen.getByRole('button', { name: /low/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /med/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /high/i })).toBeInTheDocument();
  });

  test('не викликає createTask якщо поле порожнє', async () => {
    await renderApp();
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(createTask).not.toHaveBeenCalled();
  });

  test('викликає createTask з правильними даними', async () => {
    const { user } = await renderApp();
    await user.type(screen.getByPlaceholderText('New task...'), 'Buy milk');
    await user.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        title: 'Buy milk',
        priority: 'medium',
      });
    });
  });

  test('очищає поле після додавання', async () => {
    const { user } = await renderApp();
    const input = screen.getByPlaceholderText('New task...');
    await user.type(input, 'Buy milk');
    await user.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => expect(input.value).toBe(''));
  });

  test('змінює пріоритет при кліку', async () => {
    const { user } = await renderApp();
    const highBtn = screen.getByRole('button', { name: /high/i });
    await user.click(highBtn);
    expect(highBtn.className).toMatch(/active/);
  });

  test('надсилає обраний пріоритет', async () => {
    const { user } = await renderApp();
    await user.click(screen.getByRole('button', { name: /high/i }));
    await user.type(screen.getByPlaceholderText('New task...'), 'Urgent task');
    await user.click(screen.getByRole('button', { name: /add/i }));
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        title: 'Urgent task',
        priority: 'high',
      });
    });
  });

  test('не надсилає пробіли як назву', async () => {
    const { user } = await renderApp();
    await user.type(screen.getByPlaceholderText('New task...'), '   ');
    await user.click(screen.getByRole('button', { name: /add/i }));
    expect(createTask).not.toHaveBeenCalled();
  });
});