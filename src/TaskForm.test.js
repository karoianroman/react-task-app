import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from './App';

jest.mock('./api', () => ({
  getTasks: jest.fn(() => Promise.resolve([])),
  createTask: jest.fn((task) =>
    Promise.resolve({
      id: 1,
      title: task.title,
      priority: task.priority,
      description: '',
      done: false,
    })
  ),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
}));

import { createTask, getTasks } from './api';

const renderApp = async () => {
  await act(async () => { render(<App />); });
  await screen.findByPlaceholderText('New task...');
};

const typeInInput = (input, value) => {
  fireEvent.change(input, { target: { value } });
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
    typeInInput(screen.getByPlaceholderText('New task...'), 'Buy milk');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add/i }));
    });
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        title: 'Buy milk',
        priority: 'medium',
      });
    });
  });

  test('очищає поле після додавання', async () => {
    await renderApp();
    const input = screen.getByPlaceholderText('New task...');
    typeInInput(input, 'Buy milk');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add/i }));
    });
    await waitFor(() => expect(input.value).toBe(''));
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
    typeInInput(screen.getByPlaceholderText('New task...'), 'Urgent task');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /add/i }));
    });
    await waitFor(() => {
      expect(createTask).toHaveBeenCalledWith({
        title: 'Urgent task',
        priority: 'high',
      });
    });
  });

  test('не надсилає пробіли як назву', async () => {
    await renderApp();
    typeInInput(screen.getByPlaceholderText('New task...'), '   ');
    fireEvent.click(screen.getByRole('button', { name: /add/i }));
    expect(createTask).not.toHaveBeenCalled();
  });
});
