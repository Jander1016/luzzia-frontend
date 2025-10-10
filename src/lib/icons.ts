// Optimización de iconos - importar solo los que se usan
export { 
  TrendingUp,
  Zap,
  Users,
  BarChart3,
  Menu,
  X,
  Mail,
  Phone,
  MapPin,
  Send,
  Check,
  AlertCircle,
  Info,
  Bell,
  Settings
} from 'lucide-react'

// Re-export optimizado para reducir bundle size
export type IconComponent = React.ComponentType<{
  className?: string;
  size?: number | string;
}>