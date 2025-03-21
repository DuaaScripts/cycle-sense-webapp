"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Bell, Plus, Trash2 } from "lucide-react"
import BackButton from "./back-button"

export default function Reminders({ speak, onNavigate }) {
  const [reminders, setReminders] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState("")
  const [time, setTime] = useState("")
  const [frequency, setFrequency] = useState("once")
  const [isActive, setIsActive] = useState(true)
  const [activeNotifications, setActiveNotifications] = useState([])

  useEffect(() => {
    // Load saved reminders from localStorage
    const savedReminders = localStorage.getItem("healthReminders")
    if (savedReminders) {
      setReminders(JSON.parse(savedReminders))
    }

    // Set default time to current time
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    setTime(`${hours}:${minutes}`)

    // Announce the component
    speak(
      "Reminders loaded. You can set reminders for medication, changing sanitary products, or other health routines.",
    )

    // Check for reminders that need to be triggered
    const checkInterval = setInterval(checkReminders, 60000) // Check every minute

    return () => {
      clearInterval(checkInterval)
      // Clear any active notifications
      activeNotifications.forEach((notificationId) => {
        clearTimeout(notificationId)
      })
    }
  }, [speak, activeNotifications])

  const saveReminders = (updatedReminders) => {
    localStorage.setItem("healthReminders", JSON.stringify(updatedReminders))
    setReminders(updatedReminders)
  }

  const handleAddReminder = () => {
    setShowForm(true)
    speak("Form opened. You can now set a new reminder.")
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newReminder = {
      id: Date.now(),
      title,
      time,
      frequency,
      isActive,
      lastTriggered: null,
    }

    const updatedReminders = [...reminders, newReminder]
    saveReminders(updatedReminders)

    // Reset form
    setTitle("")
    setFrequency("once")
    setIsActive(true)
    setShowForm(false)

    speak(`Reminder for ${title} has been set successfully.`)
    scheduleReminder(newReminder)
  }

  const handleDeleteReminder = (id) => {
    const updatedReminders = reminders.filter((reminder) => reminder.id !== id)
    saveReminders(updatedReminders)
    speak("Reminder deleted.")
  }

  const toggleReminderActive = (id) => {
    const updatedReminders = reminders.map((reminder) => {
      if (reminder.id === id) {
        return { ...reminder, isActive: !reminder.isActive }
      }
      return reminder
    })
    saveReminders(updatedReminders)

    const reminder = reminders.find((r) => r.id === id)
    if (reminder) {
      speak(`Reminder ${reminder.isActive ? "deactivated" : "activated"}.`)
    }
  }

  const checkReminders = () => {
    const now = new Date()
    const currentHours = now.getHours()
    const currentMinutes = now.getMinutes()
    const currentTimeString = `${String(currentHours).padStart(2, "0")}:${String(currentMinutes).padStart(2, "0")}`

    reminders.forEach((reminder) => {
      if (reminder.isActive && reminder.time === currentTimeString) {
        // Check if it's a repeating reminder or if it hasn't been triggered yet
        if (reminder.frequency !== "once" || !reminder.lastTriggered) {
          triggerReminder(reminder)
        }
      }
    })
  }

  const scheduleReminder = (reminder) => {
    if (!reminder.isActive) return

    const [hours, minutes] = reminder.time.split(":").map(Number)
    const now = new Date()
    const reminderTime = new Date()
    reminderTime.setHours(hours, minutes, 0, 0)

    // If the time has already passed today, schedule for tomorrow
    if (reminderTime < now) {
      reminderTime.setDate(reminderTime.getDate() + 1)
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime()

    const notificationId = setTimeout(() => {
      triggerReminder(reminder)
    }, timeUntilReminder)

    setActiveNotifications((prev) => [...prev, notificationId])
  }

  const triggerReminder = (reminder) => {
    speak(`Reminder: ${reminder.title}`)

    // Update the last triggered time
    const updatedReminders = reminders.map((r) => {
      if (r.id === reminder.id) {
        return { ...r, lastTriggered: new Date().toISOString() }
      }
      return r
    })
    saveReminders(updatedReminders)

    // If it's a repeating reminder, schedule the next one
    if (reminder.frequency !== "once") {
      scheduleNextReminder(reminder)
    }
  }

  const scheduleNextReminder = (reminder) => {
    // This would be expanded in a real implementation to handle different frequencies
    // For now, we'll just reschedule daily reminders for the next day
    if (reminder.frequency === "daily") {
      const updatedReminder = { ...reminder, lastTriggered: new Date().toISOString() }
      scheduleReminder(updatedReminder)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Reminders</h2>
      <p className="mb-6">Set reminders for medication, changing sanitary products, or other health routines.</p>

      <BackButton onClick={() => onNavigate("dashboard")} speak={speak} />

      <Button onClick={handleAddReminder} className="mb-6" aria-label="Add new reminder">
        <Plus className="mr-2 h-4 w-4" /> Add Reminder
      </Button>

      {showForm && (
        <Card className="p-4 sm:p-6 mb-6 border-2 border-secondary">
          <h3 className="text-xl font-medium mb-4 text-primary">Set New Reminder</h3>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Reminder Title</Label>
                <Input
                  id="title"
                  placeholder="Change sanitary pad"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger id="frequency" className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="once">Once</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="active" checked={isActive} onCheckedChange={setIsActive} />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex flex-col xs:flex-row space-y-2 xs:space-y-0 xs:space-x-2 sm:justify-start">
                <Button type="submit">Save Reminder</Button>
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

      <h3 className="text-xl font-medium mb-4 text-primary">Your Reminders</h3>
      {reminders.length > 0 ? (
        <div className="space-y-4">
          {reminders.map((reminder) => (
            <Card key={reminder.id} className="p-4 border border-secondary">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div className="flex items-center">
                  <Bell className={`mr-2 h-5 w-5 ${reminder.isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <div>
                    <h4 className="font-bold">{reminder.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {reminder.time} • {reminder.frequency}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <Switch
                    checked={reminder.isActive}
                    onCheckedChange={() => toggleReminderActive(reminder.id)}
                    aria-label={`Toggle ${reminder.title} reminder`}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteReminder(reminder.id)}
                    aria-label={`Delete ${reminder.title} reminder`}
                  >
                    <Trash2 className="h-5 w-5 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <p>No reminders set yet. Add your first reminder to get started.</p>
      )}
    </div>
  )
}

