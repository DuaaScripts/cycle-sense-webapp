"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Camera, Copy, FileText } from "lucide-react"
import BackButton from "./back-button"

export default function MedicineReader({ speak, onNavigate }) {
  const [capturedImage, setCapturedImage] = useState(null)
  const [extractedText, setExtractedText] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const fileInputRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    // Announce the component
    speak("Medicine reader loaded. You can take a photo of medicine packaging to have the label read aloud.")

    return () => {
      // Clean up camera stream when component unmounts
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [speak])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        speak('Camera activated. Point at medicine label and say "capture" or press the capture button.')
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please check permissions.")
      speak("Could not access camera. Please check permissions or upload an image instead.")
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext("2d")

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    // Get image data
    const imageDataUrl = canvas.toDataURL("image/png")
    setCapturedImage(imageDataUrl)

    // Stop camera after capturing
    stopCamera()

    speak("Image captured. Processing the text...")
    processImage(imageDataUrl)
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      setCapturedImage(event.target.result)
      speak("Image uploaded. Processing the text...")
      processImage(event.target.result)
    }
    reader.readAsDataURL(file)
  }

  const processImage = async (imageData) => {
    setIsProcessing(true)
    setError("")

    try {
      // In a real implementation, this would use a proper OCR service
      // For this prototype, we'll simulate OCR with a timeout and mock data
      setTimeout(() => {
        const mockMedicineText =
          "MEDICATION NAME: Ibuprofen\n" +
          "DOSAGE: 200mg\n" +
          "DIRECTIONS: Take 1-2 tablets every 4-6 hours as needed for pain.\n" +
          "WARNINGS: Do not use if you have had an allergic reaction to this product or aspirin.\n" +
          "EXPIRATION: 12/2025"

        setExtractedText(mockMedicineText)
        setIsProcessing(false)
        speak(`Medicine label detected. ${mockMedicineText.replace(/\n/g, ". ")}`)
      }, 2000)
    } catch (err) {
      console.error("Error processing image:", err)
      setError("Failed to process image. Please try again.")
      setIsProcessing(false)
      speak("Failed to process image. Please try again or upload a clearer image.")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(extractedText)
      .then(() => {
        speak("Text copied to clipboard.")
      })
      .catch((err) => {
        console.error("Failed to copy text:", err)
        speak("Failed to copy text to clipboard.")
      })
  }

  const resetReader = () => {
    setCapturedImage(null)
    setExtractedText("")
    setError("")
    speak("Medicine reader reset. You can take a new photo.")
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Medicine Label Reader</h2>
      <p className="mb-6">Take a photo of medicine packaging to have the label read aloud.</p>

      <BackButton onClick={() => onNavigate("dashboard")} speak={speak} />

      {!capturedImage ? (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Button onClick={startCamera} aria-label="Start camera">
              <Camera className="mr-2 h-4 w-4" /> Start Camera
            </Button>
            <Button variant="outline" onClick={() => fileInputRef.current?.click()} aria-label="Upload image">
              <FileText className="mr-2 h-4 w-4" /> Upload Image
            </Button>
            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileUpload} />
          </div>

          <div className="relative aspect-video bg-muted rounded-lg overflow-hidden border-2 border-secondary">
            <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            {videoRef.current?.srcObject && (
              <Button
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2"
                onClick={captureImage}
                aria-label="Capture image"
              >
                Capture
              </Button>
            )}
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between flex-wrap gap-2">
            <h3 className="text-xl font-medium text-primary">Captured Image</h3>
            <Button variant="outline" onClick={resetReader} aria-label="Take new photo">
              Take New Photo
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-4 overflow-hidden border border-secondary">
              <img
                src={capturedImage || "/placeholder.svg"}
                alt="Captured medicine label"
                className="w-full h-auto rounded-md"
              />
            </Card>

            <Card className="p-4 border border-secondary">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-primary">Extracted Text</h4>
                {extractedText && (
                  <Button variant="ghost" size="sm" onClick={copyToClipboard} aria-label="Copy text to clipboard">
                    <Copy className="h-4 w-4 mr-1" /> Copy
                  </Button>
                )}
              </div>

              {isProcessing ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                  <p>Processing image...</p>
                </div>
              ) : error ? (
                <div className="text-destructive py-4">{error}</div>
              ) : extractedText ? (
                <div className="whitespace-pre-line bg-muted p-4 rounded-md">{extractedText}</div>
              ) : (
                <p>No text extracted yet.</p>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

