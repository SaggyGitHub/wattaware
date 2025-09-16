import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Battery, Bolt, Gauge, Zap } from "lucide-react"
import { useEffect, useState } from "react"

interface MetricCardProps {
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  gradient: string
  trend?: string
  progress?: number
}

function MetricCard({ title, value, unit, icon, gradient, trend, progress }: MetricCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`}></div>
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg bg-gradient-to-br ${gradient} shadow-glow`}>
            {icon}
          </div>
          {trend && (
            <span className="text-xs font-medium text-success">
              {trend}
            </span>
          )}
        </div>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="relative">
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-foreground">{value}</span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>
        {progress !== undefined && (
          <Progress value={progress} className="mt-3 h-2" />
        )}
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    current: 12.5,
    voltage: 220.3,
    power: 2756,
    energy: 156.8
  })

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        current: Number((prev.current + (Math.random() - 0.5) * 0.5).toFixed(1)),
        voltage: Number((prev.voltage + (Math.random() - 0.5) * 2).toFixed(1)),
        power: Math.round(prev.power + (Math.random() - 0.5) * 100),
        energy: Number((prev.energy + Math.random() * 0.1).toFixed(1))
      }))
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
        <p className="text-muted-foreground">Real-time monitoring of your IoT devices</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Current"
          value={metrics.current.toString()}
          unit="A"
          icon={<Bolt className="h-4 w-4 text-white" />}
          gradient="from-blue-500 to-blue-600"
          trend="+2.1%"
          progress={metrics.current * 4}
        />
        
        <MetricCard
          title="Voltage"
          value={metrics.voltage.toString()}
          unit="V"
          icon={<Zap className="h-4 w-4 text-white" />}
          gradient="from-purple-500 to-purple-600"
          trend="+0.5%"
          progress={(metrics.voltage / 240) * 100}
        />
        
        <MetricCard
          title="Power"
          value={metrics.power.toString()}
          unit="W"
          icon={<Gauge className="h-4 w-4 text-white" />}
          gradient="from-orange-500 to-orange-600"
          trend="+5.2%"
          progress={(metrics.power / 3000) * 100}
        />
        
        <MetricCard
          title="Energy"
          value={metrics.energy.toString()}
          unit="kWh"
          icon={<Battery className="h-4 w-4 text-white" />}
          gradient="from-green-500 to-green-600"
          trend="+12.8%"
          progress={(metrics.energy / 200) * 100}
        />
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="h-2 w-2 bg-gradient-success rounded-full shadow-success-glow animate-pulse"></div>
              System Status
            </CardTitle>
            <CardDescription>All systems operating normally</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Grid Connection</span>
              <span className="text-sm font-medium text-success">Connected</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Device Health</span>
              <span className="text-sm font-medium text-success">Excellent</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Last Update</span>
              <span className="text-sm font-medium text-muted-foreground">2 sec ago</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common device operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <button className="w-full p-3 bg-gradient-primary text-primary-foreground rounded-lg font-medium hover:shadow-glow transition-all duration-300">
              View All Devices
            </button>
            <button className="w-full p-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/80 transition-all duration-300">
              Download Report
            </button>
            <button className="w-full p-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-all duration-300">
              System Settings
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}