import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import type { RootState, AppDispatch } from '@store';
import { logout } from '@store/slices/authSlice';
import { Login, Register, ChangePassword } from '@pages/auth';
import { TaskList, TaskDetail, TaskForm } from '@pages/tasks';
import { UserManagement } from '@pages/admin';
import { Button, Modal } from '@shared/ui';
import './App.scss';

function App() {
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div className="app">
      <header className="app__header">
        <div className="app__header-content">
          <Link to="/" className="app__logo-link">
            <h1 className="app__logo">Task Board</h1>
          </Link>
          {user && (
            <div className="app__user">
              <span className="app__user-info">
                Welcome, <strong>{user.nickname}</strong> ({user.role})
              </span>
              <div className="app__user-actions">
                {user.role === 'ADMIN' && (
                  <Link to="/admin/users">
                    <Button variant="secondary" size="sm">
                      Manage Users
                    </Button>
                  </Link>
                )}
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={() => setIsChangePasswordOpen(true)}
                >
                  Change Password
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <Modal isOpen={isChangePasswordOpen} onClose={() => setIsChangePasswordOpen(false)}>
        <ChangePassword onClose={() => setIsChangePasswordOpen(false)} />
      </Modal>

      <main className="app__main">
        <Routes>
          <Route path="/" element={user ? <Navigate to="/tasks" /> : <Navigate to="/login" />} />
          <Route path="/login" element={user ? <Navigate to="/tasks" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/tasks" /> : <Register />} />
          <Route path="/tasks" element={user ? <TaskList /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id" element={user ? <TaskDetail /> : <Navigate to="/login" />} />
          <Route path="/tasks/new" element={user ? <TaskForm /> : <Navigate to="/login" />} />
          <Route path="/tasks/:id/edit" element={user ? <TaskForm /> : <Navigate to="/login" />} />
          <Route path="/admin/users" element={user?.role === 'ADMIN' ? <UserManagement /> : <Navigate to="/tasks" />} />
        </Routes>
      </main>
    </div>
  );
}


export default App;
