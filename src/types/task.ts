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
}

export interface TaskCounts {
  all: number
  today: number
  completed: number
  pending: number
}