"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Navigation } from "lucide-react"
import BackButton from "./back-button"

export default function BinLocator({ speak, onNavigate }) {
  const [location, setLocation] = useState(null)
  const [nearbyBins, setNearbyBins] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Announce the component
    speak("Bin locator loaded. You can find nearby sanitary bins and restrooms.")
  }, [speak])

  const getCurrentLocation = () => {
    setIsLoading(true)
    setError("")

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setIsLoading(false)
      speak("Geolocation is not supported by your browser.")
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ latitude, longitude })
        speak("Location found. Searching for nearby bins and restrooms.")
        findNearbyBins(latitude, longitude)
      },
      (err) => {
        console.error("Error getting location:", err)
        setError("Unable to retrieve your location. Please check permissions.")
        setIsLoading(false)
        speak("Unable to retrieve your location. Please check permissions.")
      },
    )
  }

  const findNearbyBins = (latitude, longitude) => {
    // In a real implementation, this would call a maps API like Google Maps
    // For this prototype, we'll simulate with mock data
    setTimeout(() => {
      const mockBins = [
        {
          id: 1,
          name: "Public Restroom - Central Park",
          distance: "0.3 miles",
          address: "123 Park Avenue",
          hasSanitaryBin: true,
        },
        {
          id: 2,
          name: "Shopping Mall Restroom",
          distance: "0.5 miles",
          address: "456 Main Street",
          hasSanitaryBin: true,
        },
        {
          id: 3,
          name: "Coffee Shop Restroom",
          distance: "0.7 miles",
          address: "789 Broadway",
          hasSanitaryBin: true,
        },
        {
          id: 4,
          name: "Public Library Restroom",
          distance: "1.2 miles",
          address: "101 Library Lane",
          hasSanitaryBin: true,
        },
      ]

      setNearbyBins(mockBins)
      setIsLoading(false)

      const binList = mockBins.map((bin) => `${bin.name}, ${bin.distance} away`).join(". ")
      speak(`Found ${mockBins.length} nearby locations with sanitary bins. ${binList}`)
    }, 2000)
  }

  const getDirections = (bin) => {
    // In a real implementation, this would open maps with directions
    // For this prototype, we'll just announce it
    speak(`Getting directions to ${bin.name} at ${bin.address}, ${bin.distance} away.`)

    // This would typically open the native maps app or Google Maps
    if (location) {
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(bin.address)}`
      window.open(mapsUrl, "_blank")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Bin Locator</h2>
      <p className="mb-6">Find nearby sanitary bins and restrooms. Say "find bins" or press the button below.</p>

      <BackButton onClick={() => onNavigate("dashboard")} speak={speak} />

      <Button onClick={getCurrentLocation} disabled={isLoading} className="mb-6" aria-label="Find nearby bins">
        <MapPin className="mr-2 h-4 w-4" /> Find Nearby Bins
      </Button>

      {isLoading && (
        <Card className="p-6 mb-6 border border-secondary">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Finding nearby locations...</p>
          </div>
        </Card>
      )}

      {error && (
        <Card className="p-6 mb-6 border-destructive">
          <p className="text-destructive">{error}</p>
        </Card>
      )}

      {location && !isLoading && (
        <div className="mb-6">
          <p className="mb-2">Your current location:</p>
          <Card className="p-4 bg-muted border border-secondary">
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
          </Card>
        </div>
      )}

      {nearbyBins.length > 0 && (
        <div>
          <h3 className="text-xl font-medium mb-4 text-primary">Nearby Locations with Sanitary Bins</h3>
          <div className="space-y-4">
            {nearbyBins.map((bin) => (
              <Card key={bin.id} className="p-4 border border-secondary">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h4 className="font-bold">{bin.name}</h4>
                    <p className="text-sm text-muted-foreground">{bin.address}</p>
                    <p className="text-sm">{bin.distance} away</p>
                    {bin.hasSanitaryBin && <p className="text-sm text-primary mt-1">✓ Has sanitary bin</p>}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => getDirections(bin)}
                    aria-label={`Get directions to ${bin.name}`}
                    className="mt-2 sm:mt-0"
                  >
                    <Navigation className="h-4 w-4 mr-1" /> Directions
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

