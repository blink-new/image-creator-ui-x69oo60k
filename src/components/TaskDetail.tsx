import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Separator } from './ui/separator'
import { Task } from '../types/task'
import { 
  X,
  Calendar,
  Flag,
  Tag,
  Trash2,
  Save,
  Edit3
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

  const handleSave = () => {
    onTaskUpdate(editedTask)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedTask(task)
    setIsEditing(false)
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
          <h3 className="text-xl font-semibold text-gray-900">{task.title}</h3>
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
            <p className="text-gray-600">{formatDate(task.dueDate)}</p>
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