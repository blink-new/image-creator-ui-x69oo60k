export interface Task {
  id: string
  title: string
  description: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate: string
  category: string
  tags: string[]
  createdAt: string
  attachments?: Attachment[]
  reminder?: string
  estimatedTime?: number // in minutes
  subtasks?: Subtask[]
  isOverdue?: boolean
}

export interface Attachment {
  id: string
  name: string
  url: string
  type: string
  size: number
}

export interface Subtask {
  id: string
  title: string
  completed: boolean
}

export interface TaskCounts {
  all: number
  today: number
  completed: number
  pending: number
  overdue: number
}

export type SortOption = 'dueDate' | 'priority' | 'created' | 'alphabetical'
export type FilterOption = 'all' | 'today' | 'overdue' | 'completed' | 'pending'