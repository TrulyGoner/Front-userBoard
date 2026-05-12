export const STATUS_OPTIONS = [
  { value: 'TODO', label: 'TODO' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'DONE', label: 'Done' },
];

export const PRIORITY_OPTIONS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
];

export const VISIBILITY_OPTIONS = [
  { value: 'ONLY_ME', label: 'Only Me' },
  { value: 'LIST', label: 'List' },
  { value: 'ANYONE', label: 'Anyone' },
];

export const STATUS_VARIANTS: Record<string, string> = {
  TODO: 'default',
  IN_PROGRESS: 'warning',
  DONE: 'success',
};

export const PRIORITY_VARIANTS: Record<string, string> = {
  LOW: 'success',
  MEDIUM: 'warning',
  HIGH: 'danger',
};
