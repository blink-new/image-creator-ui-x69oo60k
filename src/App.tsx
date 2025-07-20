import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { TaskList } from './components/TaskList'
import { TaskDetail } from './components/TaskDetail'
import { Task } from './types/task'

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
    createdAt: '2024-01-20'
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
    createdAt: '2024-01-19'
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
    createdAt: '2024-01-18'
  },
  {
    id: '4',
    title: 'Team standup meeting',
    description: 'Daily standup meeting with the development team',
    completed: false,
    priority: 'medium',
    dueDate: '2024-01-21',
    category: 'Meeting',
    tags: ['meeting', 'team'],
    createdAt: '2024-01-20'
  }
]

function App() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const toggleTask = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ))
  }

  const updateTask = (updatedTask: Task) => {
    setTasks(tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    ))
    setSelectedTask(updatedTask)
  }

  const deleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    if (selectedTask?.id === taskId) {
      setSelectedTask(null)
    }
  }

  const addTask = (newTask: Omit<Task, 'id' | 'createdAt'>) => {
    const task: Task = {
      ...newTask,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split('T')[0]
    }
    setTasks([task, ...tasks])
  }

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (activeFilter) {
      case 'today':
        return matchesSearch && task.dueDate === new Date().toISOString().split('T')[0]
      case 'completed':
        return matchesSearch && task.completed
      case 'pending':
        return matchesSearch && !task.completed
      default:
        return matchesSearch
    }
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        taskCounts={{
          all: tasks.length,
          today: tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length,
          completed: tasks.filter(t => t.completed).length,
          pending: tasks.filter(t => !t.completed).length
        }}
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
    </div>
  )
}

export default App