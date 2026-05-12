import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import type { RootState } from '@store';
import { API_BASE_URL, API_ENDPOINTS } from '@shared/config';
import type { User } from '@shared/types';

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
}

export const useUsers = (): UseUsersReturn => {
  const { token } = useSelector((state: RootState) => state.auth);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) return;

    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.USERS.LIST}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data);
      } catch {
        setError('Failed to load users list');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  return { users, loading, error };
};
