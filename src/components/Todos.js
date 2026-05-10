import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  IconButton, 
  Snackbar, 
  Alert,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Divider,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { useAuth } from '../context/AuthContext';
import { useTodos } from '../context/TodoContext';

// TodoCard component to prevent re-renders
const TodoCard = React.memo(({ todo, onEdit, onToggle, onDelete }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#4caf50';
      default: return '#ff9800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Card 
      sx={{ 
        borderRadius: 2, 
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        position: 'relative',
        borderLeft: `4px solid ${getPriorityColor(todo.priority)}`,
        opacity: todo.completed ? 0.7 : 1,
        transition: 'all 0.3s ease'
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              textDecoration: todo.completed ? 'line-through' : 'none',
              color: todo.completed ? 'text.secondary' : 'text.primary',
              mb: 1
            }}
          >
            {todo.title}
          </Typography>
          <Chip 
            label={todo.priority} 
            size="small"
            sx={{ 
              bgcolor: getPriorityColor(todo.priority), 
              color: 'white',
              fontWeight: 600,
              textTransform: 'capitalize'
            }} 
          />
        </Box>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'text.secondary',
            mb: 2,
            textDecoration: todo.completed ? 'line-through' : 'none'
          }}
        >
          {todo.description}
        </Typography>
        
        {todo.dueDate && (
          <Typography 
            variant="caption" 
            sx={{ 
              display: 'block', 
              color: 'text.secondary',
              mb: 1
            }}
          >
            Due: {formatDate(todo.dueDate)}
          </Typography>
        )}
      </CardContent>
      
      <Divider />
      
      <CardActions sx={{ justifyContent: 'space-between', py: 1 }}>
        <IconButton 
          onClick={() => onToggle(todo._id)}
          color={todo.completed ? "success" : "default"}
        >
          {todo.completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
        </IconButton>
        
        <Box>
          <IconButton 
            onClick={() => onEdit(todo)}
            color="primary"
          >
            <EditIcon />
          </IconButton>
          <IconButton 
            onClick={() => onDelete(todo)}
            color="error"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardActions>
    </Card>
  );
});

const Todos = () => {
  const { token } = useAuth();
  const { todos, loading, error, fetchTodos, addTodo, updateTodo, toggleTodoCompletion, deleteTodo } = useTodos();
  
  const [newTodo, setNewTodo] = useState({ 
    title: '', 
    description: '', 
    priority: 'medium',
    dueDate: ''
  });
  
  const [editingTodo, setEditingTodo] = useState(null);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (token) {
      fetchTodos(token);
    }
  }, [token, fetchTodos]);

  useEffect(() => {
    if (error) {
      showNotification(error, 'error');
    }
  }, [error]);

  const handleCloseNotification = useCallback(() => {
    setNotification(prev => ({ ...prev, open: false }));
  }, []);

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity });
  }, []);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setNewTodo(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEditInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setEditingTodo(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await addTodo(token, newTodo);
      setNewTodo({ title: '', description: '', priority: 'medium', dueDate: '' });
      setOpenAddDialog(false);
      showNotification('New todo added successfully');
    } catch (err) {
      showNotification('Failed to add todo', 'error');
    }
  }, [token, newTodo, addTodo, showNotification]);

  const handleEdit = useCallback((todo) => {
    setEditingTodo(todo);
    setOpenEditDialog(true);
  }, []);

  const handleEditSubmit = useCallback(async (e) => {
    e.preventDefault();
    try {
      await updateTodo(token, editingTodo._id, {
        title: editingTodo.title,
        description: editingTodo.description,
        priority: editingTodo.priority,
        dueDate: editingTodo.dueDate
      });
      setOpenEditDialog(false);
      showNotification(`Todo "${editingTodo.title}" updated successfully`);
    } catch (err) {
      showNotification('Failed to update todo', 'error');
    }
  }, [token, editingTodo, updateTodo, showNotification]);

  const handleToggleCompletion = useCallback(async (todoId) => {
    try {
      await toggleTodoCompletion(token, todoId);
      showNotification('Todo status updated');
    } catch (err) {
      showNotification('Failed to update todo status', 'error');
    }
  }, [token, toggleTodoCompletion, showNotification]);

  const handleDeleteConfirm = useCallback((todo) => {
    setConfirmDelete(todo);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!confirmDelete) return;
    
    try {
      await deleteTodo(token, confirmDelete._id);
      setConfirmDelete(null);
      showNotification(`Todo "${confirmDelete.title}" deleted successfully`);
    } catch (err) {
      showNotification('Failed to delete todo', 'error');
    }
  }, [token, confirmDelete, deleteTodo, showNotification]);

  // Memoize the todo grid to prevent unnecessary re-renders
  const todoGrid = useMemo(() => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (todos.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Typography variant="h6" color="text.secondary">
            No todos found. Add one to get started!
          </Typography>
        </Box>
      );
    }
    
    return (
      <Grid container spacing={3}>
        {todos.map((todo) => (
          <Grid item xs={12} sm={6} md={4} key={todo._id}>
            <TodoCard 
              todo={todo}
              onEdit={handleEdit}
              onToggle={handleToggleCompletion}
              onDelete={handleDeleteConfirm}
            />
          </Grid>
        ))}
      </Grid>
    );
  }, [todos, loading, handleEdit, handleToggleCompletion, handleDeleteConfirm]);

  return (
    <Box 
      sx={{ 
        p: 4, 
        bgcolor: '#f5f7ff', 
        minHeight: '100vh', 
        width: '100%',
        boxSizing: 'border-box',
        backgroundImage: 'linear-gradient(135deg, #f5f7ff 0%, #e3eaff 100%)'
      }}
    >
      <Snackbar 
        open={notification.open} 
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity} 
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#3f51b5',
            letterSpacing: '0.5px',
            textShadow: '1px 1px 2px rgba(0,0,0,0.1)'
          }}
        >
          My Todo List
        </Typography>
        <Fab 
          color="primary" 
          aria-label="add" 
          onClick={() => setOpenAddDialog(true)}
          sx={{ boxShadow: '0 8px 16px rgba(63, 81, 181, 0.2)' }}
        >
          <AddIcon />
        </Fab>
      </Box>

      {todoGrid}

      {/* Add Todo Dialog */}
      <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#3f51b5', color: 'white', fontWeight: 'bold' }}>
          Create New Todo
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          <form onSubmit={handleAddSubmit}>
            <TextField
              autoFocus
              margin="dense"
              name="title"
              label="Title"
              fullWidth
              variant="outlined"
              value={newTodo.title}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="description"
              label="Description"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
              value={newTodo.description}
              onChange={handleInputChange}
              required
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
              <InputLabel>Priority</InputLabel>
              <Select
                name="priority"
                value={newTodo.priority}
                label="Priority"
                onChange={handleInputChange}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
            <TextField
              margin="dense"
              name="dueDate"
              label="Due Date"
              type="date"
              fullWidth
              variant="outlined"
              value={newTodo.dueDate}
              onChange={handleInputChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </form>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleAddSubmit} 
            variant="contained" 
            color="primary"
            disabled={!newTodo.title || !newTodo.description}
          >
            Add Todo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Todo Dialog */}
      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#3f51b5', color: 'white', fontWeight: 'bold' }}>
          Edit Todo
        </DialogTitle>
        <DialogContent sx={{ p: 3, mt: 2 }}>
          {editingTodo && (
            <form onSubmit={handleEditSubmit}>
              <TextField
                autoFocus
                margin="dense"
                name="title"
                label="Title"
                fullWidth
                variant="outlined"
                value={editingTodo.title}
                onChange={handleEditInputChange}
                required
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="description"
                label="Description"
                fullWidth
                variant="outlined"
                multiline
                rows={3}
                value={editingTodo.description}
                onChange={handleEditInputChange}
                required
                sx={{ mb: 2 }}
              />
              <FormControl fullWidth margin="dense" sx={{ mb: 2 }}>
                <InputLabel>Priority</InputLabel>
                <Select
                  name="priority"
                  value={editingTodo.priority}
                  label="Priority"
                  onChange={handleEditInputChange}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                name="dueDate"
                label="Due Date"
                type="date"
                fullWidth
                variant="outlined"
                value={editingTodo.dueDate || ''}
                onChange={handleEditInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </form>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
          <Button 
            onClick={handleEditSubmit} 
            variant="contained" 
            color="primary"
            disabled={!editingTodo || !editingTodo.title || !editingTodo.description}
          >
            Update Todo
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!confirmDelete} onClose={() => setConfirmDelete(null)}>
        <DialogTitle>Delete Todo</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{confirmDelete?.title}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>Cancel</Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Todos; 