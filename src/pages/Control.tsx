import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Fan, Thermometer, Shield, Wifi, Monitor } from "lucide-react"
import { useState } from "react"
import { useContext } from "react"
import { MyContext } from "@/components/Layout"
import { MqttClient } from "mqtt"

interface Device {
  id: string
  name: string
  type: string
  status: boolean
  icon: React.ReactNode
  location: string
  power: string
  lastSeen: string
}

interface DeviceCardProps {
  device: Device
  onToggle: (id: string) => void
}

//stud comment

function DeviceCard({ device, onToggle }: DeviceCardProps) {
  return (
    <Card className="relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 group">
      <div className={`absolute inset-0 bg-gradient-to-br ${device.status ? 'from-green-500/10 to-green-600/5' : 'from-red-500/10 to-red-600/5'} transition-all duration-300`}></div>
      
      <CardHeader className="relative pb-3">
        <div className="flex items-center justify-between">
          <div className={`p-2 rounded-lg transition-all duration-300 ${
            device.status 
              ? 'bg-gradient-success shadow-success-glow' 
              : 'bg-muted'
          }`}>
            {device.icon}
          </div>
          
          <Badge variant={device.status ? "default" : "secondary"} className={`${
            device.status 
              ? 'bg-gradient-success text-success-foreground shadow-success-glow' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {device.status ? 'Online' : 'Offline'}
          </Badge>
        </div>
        
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold text-foreground">
            {device.name}
          </CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {device.type} • {device.location}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="relative space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Power Usage</p>
            <p className="text-sm font-medium text-foreground">{device.power}</p>
          </div>
          <div className="space-y-1 text-right">
            <p className="text-sm text-muted-foreground">Last Seen</p>
            <p className="text-sm font-medium text-foreground">{device.lastSeen}</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="text-sm font-medium text-foreground">
            {device.status ? 'Turn Off' : 'Turn On'}
          </span>
          <Switch
            checked={device.status}
            onCheckedChange={() => onToggle(device.id)}
            className="data-[state=checked]:bg-gradient-success"
          />
        </div>
      </CardContent>
    </Card>
  )
}



export default function Control() {
  const {onlineStatus, client} = useContext(MyContext);

  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Smart Bulb',
      type: 'Lighting',
      status: true,
      icon: <Lightbulb className="h-4 w-4 text-white" />,
      location: 'Living Room',
      power: '12W',
      lastSeen: '2 min ago'
    },
    {
      id: '2',
      name: 'Ceiling Fan',
      type: 'Ventilation',
      status: true,
      icon: <Fan className="h-4 w-4 text-white" />,
      location: 'Bedroom',
      power: '45W',
      lastSeen: '5 min ago'
    },
    {
      id: '3',
      name: 'Smart Thermostat',
      type: 'HVAC',
      status: false,
      icon: <Thermometer className="h-4 w-4 text-white" />,
      location: 'Hallway',
      power: '8W',
      lastSeen: '1 min ago'
    },
    {
      id: '4',
      name: 'Security Camera',
      type: 'Security',
      status: false,
      icon: <Monitor className="h-4 w-4 text-white" />,
      location: 'Front Door',
      power: '15W',
      lastSeen: '30 sec ago'
    },
    {
      id: '5',
      name: 'Motion Sensor',
      type: 'Security',
      status: false,
      icon: <Shield className="h-4 w-4 text-white" />,
      location: 'Garage',
      power: '3W',
      lastSeen: '10 min ago'
    },
    {
      id: '6',
      name: 'WiFi Router',
      type: 'Network',
      status: false,
      icon: <Wifi className="h-4 w-4 text-white" />,
      location: 'Office',
      power: '22W',
      lastSeen: '1 min ago'
    }
  ])

 

  const handleToggle = (deviceId: string) => {
    setDevices(prevDevices =>
      prevDevices.map(function(device){
        if(device.id === deviceId)
          {
            device = { ...device, status: !device.status, lastSeen: 'Just now' };

            pushMqttMessage(device.status, device.id);
            
            return device;
          }
            else
              return device;
        }  
      )
    )
  }

  function pushMqttMessage(status : boolean, deviceId : String)
{
  //const {client} = useContext(MyContext);

  client.publish('WattAware_Command', 'VOLT_'+deviceId+'_RELAY_'+(status ? 'ON' :'OFF'), function() {
    console.log("Message is published!");
  });

}
  

  const onlineDevices = devices.filter(device => device.status).length
  const totalPower = devices
    .filter(device => device.status)
    .reduce((sum, device) => sum + parseInt(device.power), 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Device Control</h2>
        <p className="text-muted-foreground">Manage and monitor your IoT devices</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Online Devices</p>
                <p className="text-2xl font-bold text-foreground">{onlineDevices}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-success rounded-lg flex items-center justify-center shadow-success-glow">
                <Wifi className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Devices</p>
                <p className="text-2xl font-bold text-foreground">{devices.length}</p>
              </div>
              <div className="h-12 w-12 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Monitor className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Power</p>
                <p className="text-2xl font-bold text-foreground">{totalPower}W</p>
              </div>
              <div className="h-12 w-12 bg-gradient-warning rounded-lg flex items-center justify-center shadow-warning-glow">
                <Lightbulb className="h-6 w-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <DeviceCard
            key={device.id}
            device={device}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  )
}