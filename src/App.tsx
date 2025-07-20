import { useState, useEffect, useCallback } from 'react'
import { Sidebar } from './components/Sidebar'
import { TaskList } from './components/TaskList'
import { TaskDetail } from './components/TaskDetail'
import { Task, SortOption, FilterOption } from './types/task'
import { Toaster } from './components/ui/toaster'
import { useToast } from './hooks/use-toast'

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create a modern and responsive landing page for the new product launch',
    completed: false,
    priority: 'high',
    dueDate: '2024-01-25',
    category: 'Design',
    tags: ['ui', 'design', 'landing'],
    createdAt: '2024-01-20',
    estimatedTime: 240,
    subtasks: [
      { id: 's1', title: 'Create wireframes', completed: true },
      { id: 's2', title: 'Design mockups', completed: false },
      { id: 's3', title: 'Get feedback', completed: false }
    ]
  },
  {
    id: '2',
    title: 'Review pull requests',
    description: 'Review and merge pending pull requests from the development team',
    completed: true,
    priority: 'medium',
    dueDate: '2024-01-22',
    category: 'Development',
    tags: ['code', 'review'],
    createdAt: '2024-01-19',
    estimatedTime: 60
  },
  {
    id: '3',
    title: 'Update documentation',
    description: 'Update API documentation with new endpoints and examples',
    completed: false,
    priority: 'low',
    dueDate: '2024-01-28',
    category: 'Documentation',
    tags: ['docs', 'api'],
    createdAt: '2024-01-18',
    estimatedTime: 120
  },
  {
    id: '4',
    title: 'Team standup meeting',
    description: 'Daily standup meeting with the development team',
    completed: false,
    priority: 'medium',
    dueDate: '2024-01-20', // Overdue task
    category: 'Meeting',
    tags: ['meeting', 'team'],
    createdAt: '2024-01-20',
    estimatedTime: 30
  }
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeFilter, setActiveFilter] = useState<FilterOption>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<SortOption>('dueDate')
  const { toast } = useToast()

  // Check for overdue tasks and update them
  const checkOverdueTasks = useCallback(() => {
    const today = new Date().toISOString().split('T')[0]
    setTasks(prevTasks => 
      prevTasks.map(task => ({
        ...task,
        isOverdue: !task.completed && task.dueDate < today
      }))
    )
  }, [])

  // Check for overdue tasks on mount and every minute
  useEffect(() => {
    checkOverdueTasks()
    const interval = setInterval(checkOverdueTasks, 60000)
    return () => clearInterval(interval)
  }, [checkOverdueTasks])

  // Show notifications for overdue tasks
  useEffect(() => {
    const overdueTasks = tasks.filter(task => task.isOverdue && !task.completed)
    if (overdueTasks.length > 0) {
      toast({
        title: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''}`,
        description: `You have ${overdueTasks.length} task${overdueTasks.length > 1 ? 's' : ''} that need attention`,
        variant: "destructive",
      })
    }
  }, [tasks, toast])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'n':
            e.preventDefault()
            // Trigger new task creation
            break
          case 'f':
            e.preventDefault()
            // Focus search
            document.querySelector('input[placeholder*="Search"]')?.focus()
            break
          case '1':
            e.preventDefault()
            setActiveFilter('all')
            break
          case '2':
            e.preventDefault()
            setActiveFilter('today')
            break
          case '3':
            e.preventDefault()
            setActiveFilter('overdue')
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
    
    const task = tasks.find(t => t.id === taskId)
    if (task) {
      toast({
        title: task.completed ? "Task reopened" : "Task completed!",
        description: `"${task.title}" has been ${task.completed ? 'reopened' : 'marked as complete'}`,
      })
    }
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
    setSelectedTask(updatedTask)
  }

  const deleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId)
    setTasks(tasks.filter(task => task.id !== taskId))
    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }
    
    if (task) {
      toast({
        title: "Task deleted",
        description: `"${task.title}" has been deleted`,
      })
    }
  }

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setTasks([task, ...tasks])
    
    toast({
      title: "Task created!",
      description: `"${task.title}" has been added to your tasks`,
    })
  }

  const sortTasks = (tasksToSort: Task[]) => {
    return [...tasksToSort].sort((a, b) => {
      switch (sortBy) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 }
          return priorityOrder[b.priority] - priorityOrder[a.priority]
        }
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
  }

  const filteredTasks = sortTasks(tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    switch (activeFilter) {
      case 'today':
        return matchesSearch && task.dueDate === new Date().toISOString().split('T')[0]
      case 'overdue':
        return matchesSearch && task.isOverdue && !task.completed
      case 'completed':
        return matchesSearch && task.completed
      case 'pending':
        return matchesSearch && !task.completed
      default:
        return matchesSearch
    }
  }))

  const taskCounts = {
    all: tasks.length,
    today: tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length,
    overdue: tasks.filter(t => t.isOverdue && !t.completed).length
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        taskCounts={taskCounts}
      />
      
      <div className="flex-1 flex">
        <TaskList
          tasks={filteredTasks}
          selectedTask={selectedTask}
          onTaskSelect={setSelectedTask}
          onTaskToggle={toggleTask}
          onTaskAdd={addTask}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        
        {selectedTask && (
          <TaskDetail
            task={selectedTask}
            onTaskUpdate={updateTask}
            onTaskDelete={deleteTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
      
      <Toaster />
    </div>
  )
}

export default App