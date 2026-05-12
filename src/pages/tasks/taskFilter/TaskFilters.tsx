import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '@store/slices/tasksSlice';
import type { RootState, AppDispatch } from '@store';
import { Button, Input, Select } from '@shared/ui';
import { useDebounce } from '@shared/hooks';
import './TaskFilters.scss';

interface TaskFiltersProps {
  onFiltersChange?: () => void;
}

export const TaskFilters = ({ onFiltersChange }: TaskFiltersProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { pagination } = useSelector((state: RootState) => state.tasks);
  
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearchInput = useDebounce(searchInput, 500);
  
  const [filters, setFilters] = useState({
    status: [] as string[],
    priority: [] as string[],
    tag: '' as string,
    mine: 'all' as string,
    sort: 'updatedAt' as string,
    order: 'desc' as string,
    page: 1,
    pageSize: 10,
  });

  const handleStatusChange = (status: string) => {
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(status) 
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status],
      page: 1,
    }));
  };

  const handlePriorityChange = (priority: string) => {
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(priority)
        ? prev.priority.filter(p => p !== priority)
        : [...prev.priority, priority],
      page: 1,
    }));
  };

  const handleSearchChange = (q: string) => {
    setSearchInput(q);
  };

  const handleSortChange = (sort: string) => {
    setFilters(prev => ({
      ...prev,
      sort,
    }));
  };

  const handleOrderChange = (order: string) => {
    setFilters(prev => ({
      ...prev,
      order: order as 'asc' | 'desc',
    }));
  };

  const handleMineChange = (mine: string) => {
    setFilters(prev => ({
      ...prev,
      mine,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setFilters({
      status: [],
      priority: [],
      tag: '',
      mine: 'all',
      sort: 'updatedAt',
      order: 'desc',
      page: 1,
      pageSize: 10,
    });
  };

  useEffect(() => {
    const params: Record<string, unknown> = {
      page: filters.page,
      pageSize: filters.pageSize,
      sort: filters.sort,
      order: filters.order,
    };

    if (filters.status.length > 0) {
      params.status = filters.status;
    }
    if (filters.priority.length > 0) {
      params.priority = filters.priority;
    }
    if (debouncedSearchInput) {
      params.q = debouncedSearchInput;
    }
    if (filters.tag) {
      params.tag = filters.tag;
    }
    if (filters.mine !== 'all') {
      params.mine = filters.mine;
    }

    dispatch(fetchTasks(params));
    onFiltersChange?.();
  }, [filters, debouncedSearchInput, dispatch, onFiltersChange]);

  const hasActiveFilters = 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    searchInput || 
    filters.tag || 
    filters.mine !== 'all';

  return (
    <div className="task-filters">
      <div className="task-filters__section">
        <h3>Filters</h3>
        
        <div className="task-filters__group">
          <label className="task-filters__label" htmlFor="search-input">Search</label>
          <Input
            id="search-input"
            type="text"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>

        <fieldset className="task-filters__checkboxes">
          <legend className="task-filters__label">Status</legend>
          <div className="task-filters__options">
            {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
              <label key={status} className="task-filters__checkbox">
                <input
                  type="checkbox"
                  checked={filters.status.includes(status)}
                  onChange={() => handleStatusChange(status)}
                />
                {status}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="task-filters__checkboxes">
          <legend className="task-filters__label">Priority</legend>
          <div className="task-filters__options">
            {['LOW', 'MEDIUM', 'HIGH'].map(priority => (
              <label key={priority} className="task-filters__checkbox">
                <input
                  type="checkbox"
                  checked={filters.priority.includes(priority)}
                  onChange={() => handlePriorityChange(priority)}
                />
                {priority}
              </label>
            ))}
          </div>
        </fieldset>

        <div className="task-filters__checkboxes">
          <label className="task-filters__label" htmlFor="view-select">View</label>
          <Select
            id="view-select"
            options={[
              { value: 'all', label: 'All Tasks' },
              { value: 'created', label: 'My Created' },
              { value: 'assigned', label: 'Assigned to Me' },
              { value: 'involved', label: 'Involved' },
            ]}
            value={filters.mine}
            onChange={(e) => handleMineChange(e.target.value)}
          />
        </div>
      </div>

      <div className="task-filters__section">
        <h3>Sorting</h3>

        <div className="task-filters__group">
          <label className="task-filters__label" htmlFor="sort-select">Sort by</label>
          <Select
            id="sort-select"
            options={[
              { value: 'createdAt', label: 'Created Date' },
              { value: 'updatedAt', label: 'Updated Date' },
              { value: 'title', label: 'Title' },
            ]}
            value={filters.sort}
            onChange={(e) => handleSortChange(e.target.value)}
          />
        </div>

        <div className="task-filters__group">
          <label className="task-filters__label" htmlFor="order-select">Order</label>
          <Select
            id="order-select"
            options={[
              { value: 'asc', label: 'Ascending' },
              { value: 'desc', label: 'Descending' },
            ]}
            value={filters.order}
            onChange={(e) => handleOrderChange(e.target.value)}
          />
        </div>
      </div>

      <div className="task-filters__section">
        <h3>Pagination</h3>

        <div className="task-filters__group">
          <label className="task-filters__label" htmlFor="pagesize-select">Page Size</label>
          <Select
            id="pagesize-select"
            options={[
              { value: '10', label: '10 per page' },
              { value: '20', label: '20 per page' },
              { value: '50', label: '50 per page' },
            ]}
            value={String(filters.pageSize)}
            onChange={(e) => setFilters(prev => ({ ...prev, pageSize: parseInt(e.target.value), page: 1 }))}
          />
        </div>

        {hasActiveFilters && (
          <Button 
            variant="secondary" 
            size="sm"
            onClick={handleClearFilters}
          >
            Clear All Filters
          </Button>
        )}
      </div>

      {pagination.total > 0 && (
        <div className="task-filters__pagination">
          <div className="task-filters__pagination-info">
            Showing {(filters.page - 1) * filters.pageSize + 1} - {Math.min(filters.page * filters.pageSize, pagination.total)} of {pagination.total}
          </div>
          <div className="task-filters__pagination-buttons">
            <Button
              variant="secondary"
              size="sm"
              disabled={filters.page === 1}
              onClick={() => handlePageChange(filters.page - 1)}
            >
              Previous
            </Button>
            <span className="task-filters__pagination-current">
              Page {filters.page} of {Math.ceil(pagination.total / filters.pageSize)}
            </span>
            <Button
              variant="secondary"
              size="sm"
              disabled={filters.page * filters.pageSize >= pagination.total}
              onClick={() => handlePageChange(filters.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
