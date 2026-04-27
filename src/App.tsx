import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '@store';
import { logout } from '@store/slices/authSlice';
import { Login, Register } from '@pages/auth';
import { TaskList, TaskDetail, TaskForm } from '@pages/tasks';
import { Button } from '@shared/ui';
import './App.scss';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <h1 className="app__logo">Task Board</h1>
          {user && (
            <div className="app__user">
              <span className="app__user-info">
                Welcome, <strong>{user.nickname}</strong> ({user.role})
              </span>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleLogout}
              >
                Logout
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="app__main">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/tasks" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/tasks" /> : <Register />} />
          <Route path="/tasks" element={user ? <TaskList /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={user ? <TaskDetail /> : <Navigate to="/login" />} />
          <Route path="/tasks/new" element={user ? <TaskForm /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id/edit" element={user ? <TaskForm /> : <Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
