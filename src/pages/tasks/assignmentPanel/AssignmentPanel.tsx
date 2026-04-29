import { useReducer } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { assignTask, approveAssignment, rejectAssignment } from '@store/slices/tasksSlice';
import type { RootState, AppDispatch } from '@store';
import { Button, Select, ErrorAlert } from '@shared/ui';
import { useUsers } from '@shared/hooks';
import type { Task } from '@shared/types';
import './AssignmentPanel.scss';

interface AssignmentPanelProps {
  task: Task;
  currentUserId?: string;
}

interface AssignmentState {
  selectedUserId: string;
  rejectReason: string;
  showRejectForm: boolean;
  error: string | null;
}

type AssignmentAction = 
  | { type: 'SET_SELECTED_USER_ID'; payload: string }
  | { type: 'SET_REJECT_REASON'; payload: string }
  | { type: 'TOGGLE_REJECT_FORM' }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'RESET_REJECT_FORM' };

const initialState = (assigneeId?: string): AssignmentState => ({
  selectedUserId: assigneeId || '',
  rejectReason: '',
  showRejectForm: false,
  error: null,
});

const assignmentReducer = (state: AssignmentState, action: AssignmentAction): AssignmentState => {
  switch (action.type) {
    case 'SET_SELECTED_USER_ID':
      return { ...state, selectedUserId: action.payload };
    case 'SET_REJECT_REASON':
      return { ...state, rejectReason: action.payload };
    case 'TOGGLE_REJECT_FORM':
      return { ...state, showRejectForm: !state.showRejectForm };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'RESET_REJECT_FORM':
      return { ...state, showRejectForm: false, rejectReason: '' };
    default:
      return state;
  }
};

export const AssignmentPanel = ({ task, currentUserId }: AssignmentPanelProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.tasks);
  const { users, error: usersError } = useUsers();
  const [state, dispatchAction] = useReducer(assignmentReducer, task.assigneeId, initialState);

  const isCreator = currentUserId === task.creatorId;
  const isAssignee = currentUserId === task.assigneeId;
  const isPending = task.assignmentStatus === 'PENDING';

  const handleAssign = () => {
    if (!state.selectedUserId) return;
    dispatch(assignTask({ id: task.id, assigneeId: state.selectedUserId }));
  };

  const handleApprove = () => {
    dispatch(approveAssignment(task.id));
  };

  const handleRejectClick = () => {
    dispatchAction({ type: 'TOGGLE_REJECT_FORM' });
  };

  const handleRejectSubmit = () => {
    if (!state.rejectReason.trim()) {
      dispatchAction({ type: 'SET_ERROR', payload: 'Please provide a reason' });
      return;
    }
    dispatch(rejectAssignment({ id: task.id, reason: state.rejectReason }));
    dispatchAction({ type: 'RESET_REJECT_FORM' });
  };

  const displayError = state.error || usersError;

  return (
    <div className="assignment-panel">
      <h3>Assignment Management</h3>

      {displayError && <ErrorAlert error={displayError} onClear={() => dispatchAction({ type: 'SET_ERROR', payload: null })} />}

      <div className="assignment-panel__info">
        {task.assignee ? (
          <div className="assignment-panel__detail">
            <strong>Assigned to:</strong> {task.assignee.nickname}
            {isPending && <span className="assignment-panel__badge">Pending</span>}
            {task.assignmentStatus === 'APPROVED' && <span className="assignment-panel__badge assignment-panel__badge--approved">Approved</span>}
            {task.assignmentStatus === 'REJECTED' && <span className="assignment-panel__badge assignment-panel__badge--rejected">Rejected</span>}
          </div>
        ) : (
          <div className="assignment-panel__detail">
            <strong>Not assigned</strong>
          </div>
        )}
      </div>

      {isCreator && !task.assignee && (
        <div className="assignment-panel__assign-form">
          <Select
            label="Select user to assign"
            options={users.map(u => ({ value: u.id, label: u.nickname }))}
            value={state.selectedUserId}
            onChange={(e) => dispatchAction({ type: 'SET_SELECTED_USER_ID', payload: e.target.value })}
          />
          <Button 
            variant="primary" 
            onClick={handleAssign}
            disabled={!state.selectedUserId || loading}
          >
            Assign Task
          </Button>
        </div>
      )}

      {!task.assignee && currentUserId && !isCreator && (
        <Button 
          variant="secondary" 
          onClick={() => {
            dispatchAction({ type: 'SET_SELECTED_USER_ID', payload: currentUserId });
            dispatch(assignTask({ id: task.id, assigneeId: currentUserId }));
          }}
          disabled={loading}
        >
          Assign to Me
        </Button>
      )}

      {isAssignee && isPending && (
        <div className="assignment-panel__actions">
          <Button 
            variant="primary" 
            onClick={handleApprove}
            disabled={loading}
          >
            Approve Assignment
          </Button>
          <Button 
            variant="danger" 
            onClick={handleRejectClick}
            disabled={loading}
          >
            Reject Assignment
          </Button>
        </div>
      )}

      {state.showRejectForm && (
        <div className="assignment-panel__reject-form">
          <textarea
            placeholder="Provide a reason for rejection"
            value={state.rejectReason}
            onChange={(e) => dispatchAction({ type: 'SET_REJECT_REASON', payload: e.target.value })}
            className="assignment-panel__textarea"
          />
          <div className="assignment-panel__reject-actions">
            <Button 
              variant="danger" 
              onClick={handleRejectSubmit}
              disabled={!state.rejectReason.trim() || loading}
            >
              Submit Rejection
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                dispatchAction({ type: 'RESET_REJECT_FORM' });
                dispatchAction({ type: 'SET_ERROR', payload: null });
              }}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
