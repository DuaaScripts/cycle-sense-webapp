"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { CalendarIcon, Plus } from "lucide-react"
import BackButton from "./back-button"

export default function CycleTracker({ speak, onNavigate }) {
  const [cycles, setCycles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [currentDate, setCurrentDate] = useState("")
  const [flow, setFlow] = useState("medium")
  const [symptoms, setSymptoms] = useState("")
  const [notes, setNotes] = useState("")

  useEffect(() => {
    // Load saved cycles from localStorage
    const savedCycles = localStorage.getItem("menstrualCycles")
    if (savedCycles) {
      setCycles(JSON.parse(savedCycles))
    }

    // Set current date
    const today = new Date()
    setCurrentDate(today.toISOString().split("T")[0])

    // Announce the component
    speak("Cycle tracker loaded. You can log your period, track symptoms, and view your history.")
  }, [speak])

  const saveCycles = (updatedCycles) => {
    localStorage.setItem("menstrualCycles", JSON.stringify(updatedCycles))
    setCycles(updatedCycles)
  }

  const handleAddCycle = () => {
    setShowForm(true)
    speak("Form opened. You can now log your cycle information.")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newCycle = {
      id: Date.now(),
      date: currentDate,
      flow,
      symptoms,
      notes,
    }

    const updatedCycles = [...cycles, newCycle]
    saveCycles(updatedCycles)

    // Reset form
    setFlow("medium")
    setSymptoms("")
    setNotes("")
    setShowForm(false)

    speak("Your cycle information has been saved successfully.")
  }

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  const handleVoiceCommand = (command) => {
    // This would be expanded in a real implementation
    if (command.toLowerCase().includes("add cycle")) {
      handleAddCycle()
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Cycle Tracker</h2>
      <p className="mb-6">Track your menstrual cycle and symptoms. Say "add cycle" to log a new entry.</p>

      <BackButton onClick={() => onNavigate("dashboard")} speak={speak} />

      <Button onClick={handleAddCycle} className="mb-6" aria-label="Add new cycle entry">
        <Plus className="mr-2 h-4 w-4" /> Add Cycle Entry
      </Button>

      {showForm && (
        <Card className="p-4 sm:p-6 mb-6 border-2 border-secondary">
          <h3 className="text-xl font-medium mb-4 text-primary">Log Cycle Information</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <div className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                  <Input
                    id="date"
                    type="date"
                    value={currentDate}
                    onChange={(e) => setCurrentDate(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Label>Flow Intensity</Label>
                <RadioGroup value={flow} onValueChange={setFlow} className="mt-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="light" id="flow-light" />
                    <Label htmlFor="flow-light">Light</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="flow-medium" />
                    <Label htmlFor="flow-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="heavy" id="flow-heavy" />
                    <Label htmlFor="flow-heavy">Heavy</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="symptoms">Symptoms</Label>
                <Input
                  id="symptoms"
                  placeholder="Cramps, headache, etc."
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  placeholder="Any additional notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:justify-start">
                <Button type="submit">Save Entry</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    speak("Form closed.")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </Card>
      )}

      <h3 className="text-xl font-medium mb-4 text-primary">Cycle History</h3>
      {cycles.length > 0 ? (
        <div className="space-y-4">
          {cycles.map((cycle) => (
            <Card key={cycle.id} className="p-4 border border-secondary">
              <div className="flex flex-col">
                <h4 className="font-bold">{formatDate(cycle.date)}</h4>
                <p>
                  <span className="font-medium">Flow:</span> {cycle.flow}
                </p>
                {cycle.symptoms && (
                  <p>
                    <span className="font-medium">Symptoms:</span> {cycle.symptoms}
                  </p>
                )}
                {cycle.notes && (
                  <p>
                    <span className="font-medium">Notes:</span> {cycle.notes}
                  </p>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p>No cycle data recorded yet. Add your first entry to start tracking.</p>
      )}
    </div>
  )
}

