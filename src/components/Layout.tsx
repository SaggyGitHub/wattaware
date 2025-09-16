import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Menu } from "lucide-react"
import {useEffect, useState} from "react"
import mqtt from "mqtt"
import {createContext, useContext} from "react"



interface LayoutProps {
  children: React.ReactNode
}

export const MyContext = createContext(null);


export function Layout({ children }: LayoutProps) {
  const [onlineStatus, setOnlineStatus] = useState(false);
  const [client, setClient] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Replace with your HiveMQ Cloud broker details
    const brokerUrl = 'wss://a42c469e30964f098bc759076eef1240.s1.eu.hivemq.cloud:8884/mqtt'; 
    const options = {
      username: 'Saggy',
      password: '0407FirstPin',
      clientId: `WattAware_Web-${Math.random().toString(16).substr(2, 8)}`, // Unique client ID
      rejectUnauthorized: false // Set to true in production with proper certificates
    };

    const mqttClient = mqtt.connect(brokerUrl, options);

    mqttClient.on('connect', () => {
      console.log('Connected to MQTT broker');
      setClient(mqttClient);
      // Subscribe to a topic after successful connection
      mqttClient.subscribe('Online_Status', (err) => {
        if (!err) {
          console.log('Subscribed to Online_Status');
        }
      });

      mqttClient.subscribe('WattAware_Control_Status', (err) => {
        if (!err) {
          console.log('Subscribed to WattAware_Control_Status');
        }
      });
    });

    mqttClient.on('message', (topic, message) => {
       console.log(`Received message on ${topic}: ${message.toString()}`);
        //setMessages((prevMessages) => [...prevMessages, message.toString()]);
        if(message.toString() == "system_online")
          setOnlineStatus(true);
        else
          setOnlineStatus(false);
     });

    mqttClient.on('error', (err) => {
      console.error('MQTT Error:', err);
    });

    mqttClient.on('close', () => {
      console.log('MQTT connection closed');
      setClient(null);
    });

    return () => {
      // Disconnect on component unmount
      if (client) {
        client.end();
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount

  const contextValue = {onlineStatus, client}
 
  return (
    <MyContext.Provider value={contextValue}>
      <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <Menu className="h-4 w-4" />
              </SidebarTrigger>
              <div>
                <h1 className="text-xl font-semibold text-foreground">Control Center</h1>
                <p className="text-sm text-muted-foreground">Manage your connected devices</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {
                onlineStatus && <div className="h-2 w-2 bg-gradient-success rounded-full shadow-success-glow animate-pulse"></div>    
              }
              {
                !onlineStatus && <div className="h-2 w-2 bg-red-500 rounded-full shadow-success-glow"></div> 
              }
              <span className={`text-sm ${onlineStatus ? 'text-success' : 'text-red-500'}`}>
                {onlineStatus ? 'System Online' : 'System Offline'}
              </span>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 p-6">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
    </MyContext.Provider>
    )
}