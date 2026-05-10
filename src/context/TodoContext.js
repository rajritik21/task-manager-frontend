import React, { createContext, useReducer, useContext, useCallback } from 'react';
import axios from 'axios';

const TodoContext = createContext();

// Define action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TODOS: 'SET_TODOS',
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO'
};

// Initial state
const initialState = {
  todos: [],
  loading: false,
  error: null
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case ACTIONS.SET_TODOS:
      return { ...state, todos: action.payload };
    case ACTIONS.ADD_TODO:
      return { ...state, todos: [action.payload, ...state.todos] };
    case ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo => 
          todo._id === action.payload._id ? action.payload : todo
        )
      };
    case ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo._id !== action.payload)
      };
    default:
      return state;
  }
};

export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Fetch all todos for the authenticated user
  const fetchTodos = useCallback(async (token) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    try {
      const response = await axios.get('http://localhost:5001/api/todos', {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: ACTIONS.SET_TODOS, payload: response.data });
    } catch (error) {
      console.error('Error fetching todos:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to fetch todos. Please try again.' });
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Add a new todo
  const addTodo = useCallback(async (token, todo) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    try {
      const response = await axios.post('http://localhost:5001/api/todos', todo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      dispatch({ type: ACTIONS.ADD_TODO, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error adding todo:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to add todo. Please check your inputs and try again.' });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Update a todo
  const updateTodo = useCallback(async (token, todoId, updatedTodo) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    try {
      const response = await axios.put(`http://localhost:5001/api/todos/${todoId}`, updatedTodo, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch({ type: ACTIONS.UPDATE_TODO, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error updating todo:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to update todo. Please try again.' });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Toggle todo completion status
  const toggleTodoCompletion = useCallback(async (token, todoId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    try {
      const response = await axios.patch(`http://localhost:5001/api/todos/${todoId}/toggle`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch({ type: ACTIONS.UPDATE_TODO, payload: response.data });
      return response.data;
    } catch (error) {
      console.error('Error toggling todo completion:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to update todo status. Please try again.' });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Delete a todo
  const deleteTodo = useCallback(async (token, todoId) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
    
    try {
      await axios.delete(`http://localhost:5001/api/todos/${todoId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      dispatch({ type: ACTIONS.DELETE_TODO, payload: todoId });
    } catch (error) {
      console.error('Error deleting todo:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to delete todo. Please try again.' });
      throw error;
    } finally {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
    }
  }, []);

  // Memoized value to prevent unnecessary re-renders
  const contextValue = {
    todos: state.todos,
    loading: state.loading,
    error: state.error,
    fetchTodos,
    addTodo,
    updateTodo,
    toggleTodoCompletion,
    deleteTodo
  };

  return (
    <TodoContext.Provider value={contextValue}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodos = () => useContext(TodoContext); 