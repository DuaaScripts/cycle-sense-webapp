"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Heart, Search, ArrowRight } from "lucide-react"
import BackButton from "./back-button"

export default function HealthTips({ speak, onNavigate }) {
  const [query, setQuery] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResult, setSearchResult] = useState(null)
  const [commonTopics, setCommonTopics] = useState([])

  useEffect(() => {
    // Set up common topics
    const topics = [
      { id: 1, title: "Managing Menstrual Cramps", query: "menstrual cramps" },
      { id: 2, title: "Maintaining Hygiene During Period", query: "period hygiene" },
      { id: 3, title: "Understanding Discharge Types", query: "vaginal discharge" },
      { id: 4, title: "Signs of Infection", query: "reproductive infection" },
      { id: 5, title: "When to See a Doctor", query: "when to see gynecologist" },
    ]
    setCommonTopics(topics)

    // Announce the component
    speak("Health tips loaded. You can ask questions about reproductive health or explore common topics.")
  }, [speak])

  const handleSearch = (searchQuery) => {
    setQuery(searchQuery)
    setIsSearching(true)
    setSearchResult(null)

    speak(`Searching for information about ${searchQuery}`)

    // In a real implementation, this would call a health information API
    // For this prototype, we'll simulate with mock data
    setTimeout(() => {
      let result

      // Simple keyword matching for demo purposes
      if (searchQuery.includes("cramp")) {
        result = {
          title: "Managing Menstrual Cramps",
          content: `Menstrual cramps (dysmenorrhea) are throbbing or cramping pains in the lower abdomen. Many women experience cramps just before and during their periods.

To manage cramps:
1. Apply heat to your abdomen with a heating pad or hot water bottle
2. Take over-the-counter pain relievers like ibuprofen
3. Exercise regularly
4. Try relaxation techniques like yoga or meditation
5. Stay hydrated and avoid caffeine and alcohol
6. Consider dietary supplements like vitamin E, omega-3 fatty acids, or magnesium

If your cramps are severe and interfere with your daily activities, consult with a healthcare provider.`,
        }
      } else if (searchQuery.includes("hygiene") || searchQuery.includes("clean")) {
        result = {
          title: "Maintaining Hygiene During Period",
          content: `Maintaining proper hygiene during your period is important for comfort and preventing infections.

Tips for period hygiene:
1. Change your pad, tampon, or menstrual cup regularly (every 4-8 hours)
2. Wash your hands before and after changing menstrual products
3. Clean the genital area with plain water or mild soap during showers
4. Avoid douching or using scented products in the genital area
5. Wear clean, breathable cotton underwear
6. Dispose of used menstrual products properly in waste bins

Remember that menstruation is a natural process, and maintaining simple hygiene practices is sufficient.`,
        }
      } else if (searchQuery.includes("discharge")) {
        result = {
          title: "Understanding Discharge Types",
          content: `Vaginal discharge is a normal function of the female reproductive system. The color, consistency, and amount can change throughout your menstrual cycle.

Common discharge types:
1. Clear and stretchy: Often occurs during ovulation
2. White and creamy: Common at the beginning and end of your cycle
3. Brown or bloody: May occur at the beginning or end of your period
4. Yellow or green with odor: May indicate infection and requires medical attention
5. Thick, white, and itchy: May indicate a yeast infection

If you notice significant changes in your discharge, especially if accompanied by itching, strong odor, or pain, consult a healthcare provider.`,
        }
      } else {
        result = {
          title: "General Reproductive Health Information",
          content: `Reproductive health encompasses a range of topics related to the reproductive system and its functions.

Key aspects of reproductive health:
1. Menstrual health and hygiene
2. Contraception and family planning
3. Prevention and treatment of reproductive infections
4. Regular gynecological check-ups
5. Understanding your body's normal patterns

For specific concerns about your reproductive health, it's best to consult with a healthcare provider who can give personalized advice based on your medical history and symptoms.`,
        }
      }

      setSearchResult(result)
      setIsSearching(false)

      if (result) {
        speak(`${result.title}. ${result.content.substring(0, 200)}... Say "continue reading" to hear more.`)
      } else {
        speak("No specific information found for your query. Please try another search term.")
      }
    }, 1500)
  }

  const handleTopicClick = (topic) => {
    handleSearch(topic.query)
  }

  const continueReading = () => {
    if (searchResult) {
      speak(searchResult.content)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-primary">Health Tips</h2>
      <p className="mb-6">Ask questions about reproductive health or explore common topics.</p>

      <BackButton onClick={() => onNavigate("dashboard")} speak={speak} />

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 mb-6">
        <Input
          placeholder="Ask a health question..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && query.trim()) {
              handleSearch(query.trim())
            }
          }}
          aria-label="Health question search"
          className="flex-grow"
        />
        <Button
          onClick={() => handleSearch(query.trim())}
          disabled={!query.trim() || isSearching}
          aria-label="Search health tips"
          className="sm:flex-shrink-0"
        >
          <Search className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Search</span>
        </Button>
      </div>

      <h3 className="text-xl font-medium mb-4 text-primary">Common Topics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {commonTopics.map((topic) => (
          <Card
            key={topic.id}
            className="p-4 hover:bg-accent transition-colors cursor-pointer border border-secondary"
            onClick={() => handleTopicClick(topic)}
            tabIndex={0}
            role="button"
            aria-label={`Learn about ${topic.title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleTopicClick(topic)
              }
            }}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Heart className="h-5 w-5 mr-2 text-primary" />
                <span>{topic.title}</span>
              </div>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Card>
        ))}
      </div>

      {isSearching && (
        <Card className="p-6 mb-6 border border-secondary">
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
            <p>Searching for health information...</p>
          </div>
        </Card>
      )}

      {searchResult && (
        <Card className="p-6 border-2 border-secondary">
          <h3 className="text-xl font-bold mb-4 text-primary">{searchResult.title}</h3>
          <div className="whitespace-pre-line">
            {searchResult.content.split("\n\n").map((paragraph, index) => (
              <p key={index} className="mb-4">
                {paragraph}
              </p>
            ))}
          </div>
          <Button variant="outline" className="mt-4" onClick={continueReading} aria-label="Read this information aloud">
            Read Aloud
          </Button>
        </Card>
      )}
    </div>
  )
}

