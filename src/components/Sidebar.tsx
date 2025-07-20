import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { 
  Calendar,
  CheckCircle2,
  Clock,
  Home,
  Settings,
  User,
  AlertTriangle
} from 'lucide-react'
import { TaskCounts, FilterOption } from '../types/task'

interface SidebarProps {
  activeFilter: FilterOption
  onFilterChange: (filter: FilterOption) => void
  taskCounts: TaskCounts
}

export function Sidebar({ activeFilter, onFilterChange, taskCounts }: SidebarProps) {
  const menuItems = [
    { id: 'all' as FilterOption, label: 'All Tasks', icon: Home, count: taskCounts.all },
    { id: 'today' as FilterOption, label: 'Today', icon: Calendar, count: taskCounts.today },
    { id: 'overdue' as FilterOption, label: 'Overdue', icon: AlertTriangle, count: taskCounts.overdue, urgent: true },
    { id: 'pending' as FilterOption, label: 'Pending', icon: Clock, count: taskCounts.pending },
    { id: 'completed' as FilterOption, label: 'Completed', icon: CheckCircle2, count: taskCounts.completed },
  ]

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* User Profile */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-gray-900">John Doe</h3>
            <p className="text-sm text-gray-500">john@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = activeFilter === item.id
            const isUrgent = item.urgent && item.count > 0
            
            return (
              <Button
                key={item.id}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start h-11 ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : isUrgent
                    ? "text-red-700 hover:bg-red-50"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => onFilterChange(item.id)}
              >
                <Icon className={`h-4 w-4 mr-3 ${isUrgent ? 'text-red-500' : ''}`} />
                <span className="flex-1 text-left">{item.label}</span>
                <Badge 
                  variant={isActive ? "secondary" : "outline"}
                  className={`ml-2 ${
                    isActive 
                      ? "bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30" 
                      : isUrgent
                      ? "bg-red-100 text-red-700 border-red-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {item.count}
                </Badge>
              </Button>
            )
          })}
        </div>

        {/* Categories */}
        <div className="mt-8">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Categories
          </h4>
          <div className="space-y-1">
            {['Design', 'Development', 'Documentation', 'Meeting'].map((category) => (
              <Button
                key={category}
                variant="ghost"
                className="w-full justify-start h-9 text-gray-600 hover:bg-gray-100"
              >
                <div className="w-3 h-3 rounded-full bg-primary mr-3" />
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Shortcuts
          </h4>
          <div className="space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>New task</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘N</kbd>
            </div>
            <div className="flex justify-between">
              <span>Search</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘F</kbd>
            </div>
            <div className="flex justify-between">
              <span>All tasks</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘1</kbd>
            </div>
            <div className="flex justify-between">
              <span>Today</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘2</kbd>
            </div>
            <div className="flex justify-between">
              <span>Overdue</span>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">⌘3</kbd>
            </div>
          </div>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-600 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4 mr-3" />
          Settings
        </Button>
      </div>
    </div>
  )
}