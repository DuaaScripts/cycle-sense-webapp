"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, User, MapPin } from "lucide-react"
import BackButton from "./back-button"

export default function DoctorConnect({ speak, onNavigate }) {
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState(null)
  const [date, setDate] = useState(null)
  const [timeSlot, setTimeSlot] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)

  useEffect(() => {
    // Set up mock doctors
    const mockDoctors = [
      {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "Gynecologist",
        location: "Women's Health Clinic, 123 Main St",
        distance: "1.2 miles",
        availableDays: ["Monday", "Wednesday", "Friday"],
      },
      {
        id: 2,
        name: "Dr. Maria Rodriguez",
        specialty: "Obstetrician/Gynecologist",
        location: "Community Health Center, 456 Oak Ave",
        distance: "2.5 miles",
        availableDays: ["Tuesday", "Thursday", "Saturday"],
      },
      {
        id: 3,
        name: "Dr. James Wilson",
        specialty: "Reproductive Endocrinologist",
        location: "Fertility Center, 789 Pine Blvd",
        distance: "3.8 miles",
        availableDays: ["Monday", "Tuesday", "Thursday"],
      },
    ]
    setDoctors(mockDoctors)

    // Announce the component
    speak("Doctor connect loaded. You can find and book appointments with healthcare providers.")
  }, [speak])

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor)
    setShowForm(true)
    speak(`Selected ${doctor.name}, ${doctor.specialty}. Now you can choose an appointment date and time.`)
  }

  const getAvailableTimeSlots = () => {
    // In a real implementation, this would fetch actual availability
    return ["9:00 AM", "10:00 AM", "11:00 AM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM"]
  }

  const handleBookAppointment = (e) => {
    e.preventDefault()

    // In a real implementation, this would send the booking to a backend
    setTimeout(() => {
      setBookingConfirmed(true)
      speak(
        `Appointment confirmed with ${selectedDoctor.name} on ${format(date, "MMMM do")} at ${timeSlot}. You will receive a confirmation call at ${phone}.`,
      )
    }, 1500)
  }

  const resetBooking = () => {
    setSelectedDoctor(null)
    setDate(null)
    setTimeSlot("")
    setName("")
    setPhone("")
    setShowForm(false)
    setBookingConfirmed(false)
    speak("Booking form reset. You can select another doctor.")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Doctor Connect</h2>
      <p className="mb-6">Find and book appointments with healthcare providers.</p>

      <BackButton onClick={() => onNavigate("dashboard")} speak={speak} />

      {bookingConfirmed ? (
        <Card className="p-6 border-primary border-2">
          <div className="text-center">
            <h3 className="text-xl font-bold text-primary mb-4">Appointment Confirmed!</h3>
            <p className="mb-2">You have scheduled an appointment with:</p>
            <p className="font-bold mb-4">{selectedDoctor.name}</p>

            <div className="mb-4">
              <p>
                <span className="font-medium">Date:</span> {format(date, "MMMM do, yyyy")}
              </p>
              <p>
                <span className="font-medium">Time:</span> {timeSlot}
              </p>
              <p>
                <span className="font-medium">Location:</span> {selectedDoctor.location}
              </p>
            </div>

            <p className="text-sm text-muted-foreground mb-6">
              A confirmation will be sent to your phone. Please arrive 15 minutes before your appointment.
            </p>

            <Button onClick={resetBooking}>Book Another Appointment</Button>
          </div>
        </Card>
      ) : showForm && selectedDoctor ? (
        <Card className="p-4 sm:p-6 mb-6 border-2 border-secondary">
          <div className="flex justify-between items-start mb-6 flex-wrap gap-2">
            <h3 className="text-xl font-bold text-primary">Book Appointment</h3>
            <Button variant="ghost" size="sm" onClick={resetBooking}>
              Cancel
            </Button>
          </div>

          <div className="mb-6">
            <h4 className="font-medium mb-2">{selectedDoctor.name}</h4>
            <p className="text-sm text-muted-foreground">{selectedDoctor.specialty}</p>
            <p className="text-sm text-muted-foreground">{selectedDoctor.location}</p>
          </div>

          <form onSubmit={handleBookAppointment}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Your Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="w-full" />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full"
                />
              </div>

              <div>
                <Label>Appointment Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Select date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="timeSlot">Appointment Time</Label>
                <Select value={timeSlot} onValueChange={setTimeSlot} required>
                  <SelectTrigger id="timeSlot" className="w-full">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableTimeSlots().map((slot) => (
                      <SelectItem key={slot} value={slot}>
                        {slot}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={!date || !timeSlot || !name || !phone}>
                Book Appointment
              </Button>
            </div>
          </form>
        </Card>
      ) : (
        <div>
          <h3 className="text-xl font-medium mb-4 text-primary">Available Healthcare Providers</h3>
          <div className="space-y-4">
            {doctors.map((doctor) => (
              <Card
                key={doctor.id}
                className="p-4 hover:bg-accent transition-colors cursor-pointer border border-secondary"
                onClick={() => handleDoctorSelect(doctor)}
                tabIndex={0}
                role="button"
                aria-label={`Select ${doctor.name}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleDoctorSelect(doctor)
                  }
                }}
              >
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <User className="h-5 w-5 mr-2 text-primary" />
                      <h4 className="font-bold">{doctor.name}</h4>
                    </div>
                    <p className="text-sm mb-1">{doctor.specialty}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{doctor.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{doctor.distance} away</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-sm mb-1">Available on:</p>
                    <div className="flex flex-wrap gap-1">
                      {doctor.availableDays.map((day) => (
                        <span key={day} className="text-xs bg-muted px-2 py-1 rounded-full">
                          {day}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

