// todo.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import Todo from './Todo';
import { expect, test, vi } from 'vitest';

test('renders not done todo with correct buttons', () => {
  const task = {
    text: 'Complete the React project',
    done: false,
  };

  const mockCompleteTodo = vi.fn();
  const mockDeleteTodo = vi.fn();

  render(
    <Todo
      todo={task}
      onClickDelete={mockDeleteTodo}
      onClickComplete={mockCompleteTodo}
    />
  );

  expect(screen.getByText('Complete the React project')).toBeInTheDocument();

  expect(screen.getByText('This todo is not done')).toBeInTheDocument();

  const setAsDoneButton = screen.getByText('Set as done');
  expect(setAsDoneButton).toBeInTheDocument();

  fireEvent.click(setAsDoneButton);
  expect(mockCompleteTodo).toHaveBeenCalledWith(task);
});
