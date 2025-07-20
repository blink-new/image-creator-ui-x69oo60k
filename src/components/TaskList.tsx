import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Checkbox } from './ui/checkbox'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { TaskForm } from './TaskForm'
import { Task, SortOption } from '../types/task'
import { 
  Search,
  Plus,
  Calendar,
  Flag,
  MoreHorizontal,
  ArrowUpDown,
  Clock,
  AlertTriangle
} from 'lucide-react'

interface TaskListProps {
  tasks: Task[]
  selectedTask: Task | null
  onTaskSelect: (task: Task) => void
  onTaskToggle: (taskId: string) => void
  onTaskAdd: (task: Omit<Task, 'id' | 'createdAt'>) => void
  searchQuery: string
  onSearchChange: (query: string) => void
  sortBy: SortOption
  onSortChange: (sort: SortOption) => void
}

export function TaskList({ 
  tasks, 
  selectedTask, 
  onTaskSelect, 
  onTaskToggle, 
  onTaskAdd,
  searchQuery,
  onSearchChange,
  sortBy,
  onSortChange
}: TaskListProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const isOverdue = (task: Task) => {
    const today = new Date().toISOString().split('T')[0]
    return !task.completed && task.dueDate < today
  }

  const getEstimatedTimeText = (minutes?: number) => {
    if (!minutes) return null
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const handleAddTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    onTaskAdd(taskData)
    setIsAddDialogOpen(false)
  }

  const sortOptions = [
    { value: 'dueDate', label: 'Due Date' },
    { value: 'priority', label: 'Priority' },
    { value: 'created', label: 'Created' },
    { value: 'alphabetical', label: 'Alphabetical' }
  ]

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create New Task</DialogTitle>
              </DialogHeader>
              <TaskForm onSubmit={handleAddTask} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Search and Sort */}
        <div className="flex space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
            <SelectTrigger className="w-40">
              <ArrowUpDown className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task List */}
      <div className="flex-1 overflow-y-auto">
        {tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-lg font-medium mb-2">No tasks found</h3>
            <p className="text-sm">Create your first task to get started</p>
          </div>
        ) : (
          <div className="p-4 space-y-2">
            {tasks.map((task) => {
              const taskIsOverdue = isOverdue(task)
              const completedSubtasks = task.subtasks?.filter(s => s.completed).length || 0
              const totalSubtasks = task.subtasks?.length || 0
              
              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all hover:shadow-sm group ${
                    selectedTask?.id === task.id
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : taskIsOverdue
                      ? 'border-red-200 bg-red-50/50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${task.completed ? 'opacity-60' : ''}`}
                  onClick={() => onTaskSelect(task)}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onTaskToggle(task.id)}
                      className="mt-1"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h3 className={`font-medium ${
                            task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                          }`}>
                            {task.title}
                          </h3>
                          {taskIsOverdue && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {task.description}
                      </p>
                      
                      {/* Subtasks Progress */}
                      {totalSubtasks > 0 && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                            <span>Subtasks</span>
                            <span>{completedSubtasks}/{totalSubtasks}</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div 
                              className="bg-primary h-1.5 rounded-full transition-all"
                              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                            />
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            <Flag className="h-3 w-3 mr-1" />
                            {task.priority}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          {task.estimatedTime && (
                            <Badge variant="outline" className="text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              {getEstimatedTimeText(task.estimatedTime)}
                            </Badge>
                          )}
                        </div>
                        
                        <div className={`flex items-center text-xs ${
                          taskIsOverdue ? 'text-red-600 font-medium' : 'text-gray-500'
                        }`}>
                          <Calendar className="h-3 w-3 mr-1" />
                          {formatDate(task.dueDate)}
                          {taskIsOverdue && ' (Overdue)'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}