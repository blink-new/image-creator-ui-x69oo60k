import { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Task, Subtask } from '../types/task'
import { Plus, X, Clock } from 'lucide-react'

interface TaskFormProps {
  onSubmit: (task: Omit<Task, 'id' | 'createdAt'>) => void
}

export function TaskForm({ onSubmit }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'Other',
    tags: [] as string[],
    completed: false,
    estimatedTime: undefined as number | undefined,
    subtasks: [] as Subtask[]
  })

  const [tagInput, setTagInput] = useState('')
  const [subtaskInput, setSubtaskInput] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    onSubmit(formData)
    
    // Reset form
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'Other',
      tags: [],
      completed: false,
      estimatedTime: undefined,
      subtasks: []
    })
    setTagInput('')
    setSubtaskInput('')
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    })
  }

  const addSubtask = () => {
    if (subtaskInput.trim()) {
      const subtask: Subtask = {
        id: Date.now().toString(),
        title: subtaskInput.trim(),
        completed: false
      }
      setFormData({
        ...formData,
        subtasks: [...formData.subtasks, subtask]
      })
      setSubtaskInput('')
    }
  }

  const removeSubtask = (subtaskId: string) => {
    setFormData({
      ...formData,
      subtasks: formData.subtasks.filter(st => st.id !== subtaskId)
    })
  }

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  const handleSubtaskInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addSubtask()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Title *
        </label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter task title"
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Priority
          </label>
          <Select
            value={formData.priority}
            onValueChange={(value: 'low' | 'medium' | 'high') => 
              setFormData({ ...formData, priority: value })
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
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Due Date
          </label>
          <Input
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </label>
          <Select
            value={formData.category}
            onValueChange={(value) => setFormData({ ...formData, category: value })}
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
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            <Clock className="h-4 w-4 inline mr-1" />
            Estimated Time (minutes)
          </label>
          <Input
            type="number"
            value={formData.estimatedTime || ''}
            onChange={(e) => setFormData({ 
              ...formData, 
              estimatedTime: e.target.value ? parseInt(e.target.value) : undefined 
            })}
            placeholder="e.g. 60"
            min="0"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Tags
        </label>
        <div className="flex space-x-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={handleTagInputKeyPress}
            placeholder="Add a tag"
            className="flex-1"
          />
          <Button type="button" onClick={addTag} variant="outline" size="sm">
            Add
          </Button>
        </div>
        {formData.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Subtasks
        </label>
        <div className="flex space-x-2 mb-2">
          <Input
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            onKeyPress={handleSubtaskInputKeyPress}
            placeholder="Add a subtask"
            className="flex-1"
          />
          <Button type="button" onClick={addSubtask} variant="outline" size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        {formData.subtasks.length > 0 && (
          <div className="space-y-2">
            {formData.subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center space-x-2 p-2 border rounded">
                <span className="flex-1 text-sm">{subtask.title}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSubtask(subtask.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t">
        <Button type="submit" className="bg-primary hover:bg-primary/90">
          Create Task
        </Button>
      </div>
    </form>
  )
}