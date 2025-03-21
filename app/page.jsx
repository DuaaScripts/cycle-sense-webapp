"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import VoiceRecognition from "@/components/voice-recognition"
import Dashboard from "@/components/dashboard"
import CycleTracker from "@/components/cycle-tracker"
import Reminders from "@/components/reminders"
import MedicineReader from "@/components/medicine-reader"
import BinLocator from "@/components/bin-locator"
import HealthTips from "@/components/health-tips"
import DoctorConnect from "@/components/doctor-connect"

export default function Home() {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [lastCommand, setLastCommand] = useState("")
  const speechSynthesisRef = useRef(null)

  // Function to speak text aloud
  const speak = (text) => {
    if (isSpeaking) return

    setIsSpeaking(true)
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.rate = 1.0
    utterance.pitch = 1.0
    utterance.volume = 1.0

    utterance.onend = () => {
      setIsSpeaking(false)
    }

    speechSynthesis.speak(utterance)
    speechSynthesisRef.current = utterance
  }

  // Handle voice commands
  const handleVoiceCommand = (command) => {
    setLastCommand(command)
    const lowerCommand = command.toLowerCase()

    if (lowerCommand.includes("dashboard") || lowerCommand.includes("home")) {
      setActiveSection("dashboard")
      speak("Opening dashboard")
    } else if (lowerCommand.includes("cycle") || lowerCommand.includes("tracker")) {
      setActiveSection("cycleTracker")
      speak("Opening cycle tracker")
    } else if (lowerCommand.includes("reminder")) {
      setActiveSection("reminders")
      speak("Opening reminders")
    } else if (lowerCommand.includes("medicine") || lowerCommand.includes("label")) {
      setActiveSection("medicineReader")
      speak("Opening medicine label reader")
    } else if (lowerCommand.includes("bin") || lowerCommand.includes("locate")) {
      setActiveSection("binLocator")
      speak("Opening bin locator")
    } else if (lowerCommand.includes("health") || lowerCommand.includes("tips")) {
      setActiveSection("healthTips")
      speak("Opening health tips")
    } else if (lowerCommand.includes("doctor") || lowerCommand.includes("connect")) {
      setActiveSection("doctorConnect")
      speak("Opening doctor connection")
    } else if (lowerCommand.includes("help")) {
      speak(
        "Available commands: dashboard, cycle tracker, reminders, medicine reader, bin locator, health tips, and doctor connect",
      )
    } else {
      speak("Sorry, I didn't understand that command. Say help for available commands.")
    }
  }

  // Welcome message on first load
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem("hasVisitedBefore")

    if (!hasVisitedBefore) {
      setTimeout(() => {
        speak(
          "Welcome to Cycle Sense, your health assistant. Say dashboard, cycle tracker, reminders, medicine reader, bin locator, health tips, or doctor connect to navigate.",
        )
        localStorage.setItem("hasVisitedBefore", "true")
      }, 1000)
    } else {
      setTimeout(() => {
        speak("Welcome back to Cycle Sense.")
      }, 1000)
    }

    return () => {
      if (speechSynthesisRef.current) {
        speechSynthesis.cancel()
      }
    }
  }, [])

  // Render the active section
  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard onNavigate={setActiveSection} speak={speak} />
      case "cycleTracker":
        return <CycleTracker onNavigate={setActiveSection} speak={speak} />
      case "reminders":
        return <Reminders onNavigate={setActiveSection} speak={speak} />
      case "medicineReader":
        return <MedicineReader onNavigate={setActiveSection} speak={speak} />
      case "binLocator":
        return <BinLocator onNavigate={setActiveSection} speak={speak} />
      case "healthTips":
        return <HealthTips onNavigate={setActiveSection} speak={speak} />
      case "doctorConnect":
        return <DoctorConnect onNavigate={setActiveSection} speak={speak} />
      default:
        return <Dashboard onNavigate={setActiveSection} speak={speak} />
    }
  }

  return (
    <main className="min-h-screen p-4 bg-background">
      <div className="container mx-auto">
        <h1 className="sr-only">Health Assistant for Visually Impaired Women</h1>

        <Card className="p-4 mb-4 border-2 border-primary">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-primary">Cycle Sense</h2>
              <p className="text-muted-foreground">Voice-driven health management</p>
            </div>
            <VoiceRecognition onCommand={handleVoiceCommand} />
          </div>
          {lastCommand && (
            <div className="mt-2 p-2 bg-secondary rounded-md">
              <p>
                <span className="font-medium">Last command:</span> {lastCommand}
              </p>
            </div>
          )}
        </Card>

        <div className="my-8">{renderActiveSection()}</div>
      </div>
    </main>
  )
}

