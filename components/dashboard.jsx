"use client"

import { useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Calendar, Bell, FileText, MapPin, Heart, Phone } from "lucide-react"

export default function Dashboard({ onNavigate, speak }) {
  const features = [
    {
      id: "cycleTracker",
      name: "Cycle Tracker",
      icon: Calendar,
      description: "Track your menstrual cycle and symptoms",
    },
    { id: "reminders", name: "Reminders", icon: Bell, description: "Set personalized health reminders" },
    {
      id: "medicineReader",
      name: "Medicine Reader",
      icon: FileText,
      description: "Read medicine labels with your camera",
    },
    { id: "binLocator", name: "Bin Locator", icon: MapPin, description: "Find nearby sanitary bins" },
    { id: "healthTips", name: "Health Tips", icon: Heart, description: "Get reproductive health advice" },
    { id: "doctorConnect", name: "Doctor Connect", icon: Phone, description: "Connect with healthcare providers" },
  ]

  useEffect(() => {
    // Announce the dashboard when it loads
    speak("Dashboard loaded. You can say the name of any feature to navigate.")
  }, [speak])

  const handleFeatureClick = (featureId, featureName) => {
    onNavigate(featureId)
    speak(`Opening ${featureName}`)
  }

  const handleFeatureKeyPress = (e, featureId, featureName) => {
    if (e.key === "Enter" || e.key === " ") {
      onNavigate(featureId)
      speak(`Opening ${featureName}`)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Dashboard</h2>
      <p className="mb-6">Say the name of any feature to navigate or use the buttons below.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => (
          <Card
            key={feature.id}
            className="p-6 hover:bg-accent transition-colors cursor-pointer border-2 border-secondary"
            onClick={() => handleFeatureClick(feature.id, feature.name)}
            onKeyDown={(e) => handleFeatureKeyPress(e, feature.id, feature.name)}
            tabIndex={0}
            role="button"
            aria-label={`Open ${feature.name}`}
          >
            <div className="flex flex-col items-center text-center">
              <feature.icon className="h-12 w-12 mb-4 text-primary" />
              <h3 className="text-xl font-medium mb-2">{feature.name}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

