"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"

export default function VoiceRecognition({ onCommand }) {
  const [isListening, setIsListening] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const recognitionRef = useRef(null)

  useEffect(() => {
    // Check if browser supports speech recognition
    if (!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)) {
      setErrorMessage("Speech recognition is not supported in this browser.")
      return
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    recognitionRef.current = new SpeechRecognition()
    recognitionRef.current.continuous = true
    recognitionRef.current.interimResults = false
    recognitionRef.current.lang = "en-US"

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[event.results.length - 1][0].transcript.trim()
      if (transcript) {
        onCommand(transcript)
      }
    }

    recognitionRef.current.onerror = (event) => {
      console.error("Speech recognition error:", event.error)
      setErrorMessage(`Error: ${event.error}`)
      setIsListening(false)
    }

    recognitionRef.current.onend = () => {
      // Restart recognition if it was still supposed to be listening
      if (isListening) {
        try {
          recognitionRef.current.start()
        } catch (error) {
          console.error("Failed to restart recognition:", error)
        }
      }
    }

    // Start listening automatically
    startListening()

    // Clean up
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [onCommand])

  const startListening = () => {
    try {
      if (recognitionRef.current) {
        recognitionRef.current.start()
        setIsListening(true)
        setErrorMessage("")
      }
    } catch (error) {
      console.error("Failed to start recognition:", error)
      setErrorMessage("Failed to start voice recognition.")
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Button
        onClick={toggleListening}
        variant={isListening ? "default" : "outline"}
        size="lg"
        className={`rounded-full h-16 w-16 flex items-center justify-center ${isListening ? "bg-primary text-primary-foreground" : "border-2 border-primary text-primary"}`}
        aria-label={isListening ? "Stop voice recognition" : "Start voice recognition"}
      >
        {isListening ? <Mic className="h-8 w-8" /> : <MicOff className="h-8 w-8" />}
      </Button>
      <span className="mt-2 text-sm">{isListening ? "Listening..." : "Click to enable voice"}</span>
      {errorMessage && <p className="text-destructive mt-2">{errorMessage}</p>}
    </div>
  )
}

