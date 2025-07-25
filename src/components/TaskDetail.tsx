import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Checkbox } from './ui/checkbox'
import { Progress } from './ui/progress'
import { Task, Subtask } from '../types/task'
import { 
  X,
  Calendar,
  Flag,
  Tag,
  Trash2,
  Save,
  Edit3,
  Plus,
  Clock,
  Paperclip,
  CheckSquare,
  AlertTriangle
} from 'lucide-react'

interface TaskDetailProps {
  task: Task
  onTaskUpdate: (task: Task) => void
  onTaskDelete: (taskId: string) => void
  onClose: () => void
}

export function TaskDetail({ task, onTaskUpdate, onTaskDelete, onClose }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task>(task)
  const [newSubtask, setNewSubtask] = useState('')

  const handleSave = () => {
    onTaskUpdate(editedTask)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
  }

  const addSubtask = () => {
    if (newSubtask.trim()) {
      const subtask: Subtask = {
        id: Date.now().toString(),
        title: newSubtask.trim(),
        completed: false
      }
      setEditedTask({
        ...editedTask,
        subtasks: [...(editedTask.subtasks || []), subtask]
      })
      setNewSubtask('')
    }
  }

  const toggleSubtask = (subtaskId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks?.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    })
  }

  const removeSubtask = (subtaskId: string) => {
    setEditedTask({
      ...editedTask,
      subtasks: editedTask.subtasks?.filter(st => st.id !== subtaskId)
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const isOverdue = () => {
    const today = new Date().toISOString().split('T')[0]
    return !task.completed && task.dueDate < today
  }

  const getEstimatedTimeText = (minutes?: number) => {
    if (!minutes) return 'Not set'
    if (minutes < 60) return `${minutes} minutes`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours} hours`
  }

  const completedSubtasks = editedTask.subtasks?.filter(st => st.completed).length || 0
  const totalSubtasks = editedTask.subtasks?.length || 0
  const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0

  return (
    <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Task Details</h2>
          <div className="flex items-center space-x-2">
            {!isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Input
              value={editedTask.title}
              onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
              placeholder="Task title"
              className="font-medium"
            />
            <div className="flex space-x-2">
              <Button onClick={handleSave} size="sm" className="bg-primary hover:bg-primary/90">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
              {isOverdue() && (
                <AlertTriangle className="h-5 w-5 text-red-500" />
              )}
            </div>
            {isOverdue() && (
              <Badge variant="destructive" className="text-xs">
                Overdue
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Description */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Description
          </label>
          {isEditing ? (
            <Textarea
              value={editedTask.description}
              onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
              placeholder="Task description"
              rows={4}
            />
          ) : (
            <p className="text-gray-600 leading-relaxed">
              {task.description || 'No description provided'}
            </p>
          )}
        </div>

        <Separator />

        {/* Subtasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-medium text-gray-700">
              <CheckSquare className="h-4 w-4 inline mr-1" />
              Subtasks ({completedSubtasks}/{totalSubtasks})
            </label>
          </div>
          
          {totalSubtasks > 0 && (
            <div className="mb-4">
              <Progress value={subtaskProgress} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(subtaskProgress)}% complete
              </p>
            </div>
          )}

          <div className="space-y-2 mb-3">
            {editedTask.subtasks?.map((subtask) => (
              <div key={subtask.id} className="flex items-center space-x-2 p-2 rounded border">
                <Checkbox
                  checked={subtask.completed}
                  onCheckedChange={() => toggleSubtask(subtask.id)}
                />
                <span className={`flex-1 text-sm ${
                  subtask.completed ? 'line-through text-gray-500' : 'text-gray-900'
                }`}>
                  {subtask.title}
                </span>
                {isEditing && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSubtask(subtask.id)}
                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          {isEditing && (
            <div className="flex space-x-2">
              <Input
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                placeholder="Add subtask..."
                className="text-sm"
                onKeyPress={(e) => e.key === 'Enter' && addSubtask()}
              />
              <Button onClick={addSubtask} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Priority */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            <Flag className="h-4 w-4 inline mr-1" />
            Priority
          </label>
          {isEditing ? (
            <Select
              value={editedTask.priority}
              onValueChange={(value: 'low' | 'medium' | 'high') => 
                setEditedTask({ ...editedTask, priority: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge className={getPriorityColor(task.priority)}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            <Calendar className="h-4 w-4 inline mr-1" />
            Due Date
          </label>
          {isEditing ? (
            <Input
              type="date"
              value={editedTask.dueDate}
              onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
            />
          ) : (
            <p className={`text-gray-600 ${isOverdue() ? 'text-red-600 font-medium' : ''}`}>
              {formatDate(task.dueDate)}
              {isOverdue() && ' (Overdue)'}
            </p>
          )}
        </div>

        {/* Estimated Time */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            <Clock className="h-4 w-4 inline mr-1" />
            Estimated Time
          </label>
          {isEditing ? (
            <Input
              type="number"
              value={editedTask.estimatedTime || ''}
              onChange={(e) => setEditedTask({ 
                ...editedTask, 
                estimatedTime: e.target.value ? parseInt(e.target.value) : undefined 
              })}
              placeholder="Minutes"
              min="0"
            />
          ) : (
            <p className="text-gray-600">{getEstimatedTimeText(task.estimatedTime)}</p>
          )}
        </div>

        {/* Category */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            <Tag className="h-4 w-4 inline mr-1" />
            Category
          </label>
          {isEditing ? (
            <Select
              value={editedTask.category}
              onValueChange={(value) => setEditedTask({ ...editedTask, category: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Design">Design</SelectItem>
                <SelectItem value="Development">Development</SelectItem>
                <SelectItem value="Documentation">Documentation</SelectItem>
                <SelectItem value="Meeting">Meeting</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant="outline">{task.category}</Badge>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>

        {/* Attachments */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            <Paperclip className="h-4 w-4 inline mr-1" />
            Attachments
          </label>
          {task.attachments && task.attachments.length > 0 ? (
            <div className="space-y-2">
              {task.attachments.map((attachment) => (
                <div key={attachment.id} className="flex items-center space-x-2 p-2 border rounded">
                  <Paperclip className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{attachment.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(attachment.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No attachments</p>
          )}
        </div>

        <Separator />

        {/* Metadata */}
        <div className="space-y-3">
          <div>
            <span className="text-sm font-medium text-gray-700">Created:</span>
            <p className="text-sm text-gray-600">
              {new Date(task.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <span className="text-sm font-medium text-gray-700">Status:</span>
            <p className="text-sm text-gray-600">
              {task.completed ? 'Completed' : 'Pending'}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <Button
          variant="destructive"
          className="w-full"
          onClick={() => {
            if (confirm('Are you sure you want to delete this task?')) {
              onTaskDelete(task.id)
            }
          }}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Task
        </Button>
      </div>
    </div>
  )
}