import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

// Мокаємо api.js щоб не робити реальних запитів
jest.mock('./api', () => ({
  getTasks: jest.fn(() => Promise.resolve([])),
  createTask: jest.fn((task) =>
    Promise.resolve({ id: 1, done: false, description: '', ...task })
  ),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

import { createTask, getTasks } from './api';

// Хелпер — рендеримо App і чекаємо поки завантажиться
const renderApp = async () => {
  render(<App />);
  // чекаємо поки зникне "Loading..."
  await screen.findByPlaceholderText('New task...');
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
    await renderApp();
    const input = screen.getByPlaceholderText('New task...');
    await userEvent.type(input, 'Buy milk');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(createTask).toHaveBeenCalledWith({
      title: 'Buy milk',
      priority: 'medium',
    });
  });

  test('очищає поле після додавання', async () => {
    await renderApp();
    const input = screen.getByPlaceholderText('New task...');
    await userEvent.type(input, 'Buy milk');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    await screen.findByPlaceholderText('New task...');
    expect(input.value).toBe('');
  });

  test('змінює пріоритет при кліку', async () => {
    await renderApp();
    const highBtn = screen.getByRole('button', { name: /high/i });
    fireEvent.click(highBtn);
    expect(highBtn.className).toMatch(/active/);
  });

  test('надсилає обраний пріоритет', async () => {
    await renderApp();
    fireEvent.click(screen.getByRole('button', { name: /high/i }));
    const input = screen.getByPlaceholderText('New task...');
    await userEvent.type(input, 'Urgent task');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(createTask).toHaveBeenCalledWith({
      title: 'Urgent task',
      priority: 'high',
    });
  });

  test('не надсилає пробіли як назву', async () => {
    await renderApp();
    const input = screen.getByPlaceholderText('New task...');
    await userEvent.type(input, '   ');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(createTask).not.toHaveBeenCalled();
  });
});
