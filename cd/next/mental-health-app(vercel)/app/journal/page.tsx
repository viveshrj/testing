"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BookOpen, Sparkles } from "lucide-react"
import Link from "next/link"

export default function JournalPage() {
  const [entry, setEntry] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [journalEntries, setJournalEntries] = useState<any[]>([])

  useEffect(() => {
    const entries = localStorage.getItem("journalEntries")
    if (entries) {
      setJournalEntries(JSON.parse(entries))
    }
  }, [])

  const analyzeSentiment = async (text: string) => {
    // Simulate AI sentiment analysis
    const sentiments = ["positive", "negative", "neutral", "anxious", "hopeful", "sad", "excited"]
    const emotions = ["happy", "sad", "anxious", "calm", "frustrated", "grateful", "worried"]

    // Simple keyword-based analysis for demo
    const lowerText = text.toLowerCase()
    let sentiment = "neutral"
    let emotion = "calm"
    let confidence = 0.7

    if (lowerText.includes("happy") || lowerText.includes("great") || lowerText.includes("wonderful")) {
      sentiment = "positive"
      emotion = "happy"
      confidence = 0.9
    } else if (lowerText.includes("sad") || lowerText.includes("terrible") || lowerText.includes("awful")) {
      sentiment = "negative"
      emotion = "sad"
      confidence = 0.85
    } else if (lowerText.includes("anxious") || lowerText.includes("worried") || lowerText.includes("stress")) {
      sentiment = "anxious"
      emotion = "anxious"
      confidence = 0.8
    }

    return { sentiment, emotion, confidence }
  }

  const handleSaveEntry = async () => {
    if (!entry.trim()) return

    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const analysis = await analyzeSentiment(entry)

    const newEntry = {
      id: Date.now(),
      content: entry,
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
      sentiment: analysis.sentiment,
      emotion: analysis.emotion,
      confidence: analysis.confidence,
    }

    const updatedEntries = [newEntry, ...journalEntries]
    setJournalEntries(updatedEntries)
    localStorage.setItem("journalEntries", JSON.stringify(updatedEntries))

    setEntry("")
    setIsAnalyzing(false)
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100 text-green-800"
      case "negative":
        return "bg-red-100 text-red-800"
      case "anxious":
        return "bg-orange-100 text-orange-800"
      case "hopeful":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Journal</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <span>Write Your Entry</span>
              </CardTitle>
              <CardDescription>Express your thoughts and feelings. AI will analyze the sentiment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="How are you feeling today? What's on your mind?"
                value={entry}
                onChange={(e) => setEntry(e.target.value)}
                rows={12}
                className="resize-none"
              />

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">{entry.length} characters</div>
                <Button onClick={handleSaveEntry} disabled={!entry.trim() || isAnalyzing} className="min-w-[120px]">
                  {isAnalyzing ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    "Save Entry"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Entries</CardTitle>
              <CardDescription>Your journal entries with AI sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {journalEntries.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No journal entries yet. Start writing to see your sentiment analysis!
                  </p>
                ) : (
                  journalEntries.map((journalEntry) => (
                    <div key={journalEntry.id} className="p-4 bg-gray-50 rounded-lg space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{journalEntry.timestamp}</span>
                        <div className="flex space-x-2">
                          <Badge className={getSentimentColor(journalEntry.sentiment)}>{journalEntry.sentiment}</Badge>
                          <Badge variant="outline">{journalEntry.emotion}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-3">{journalEntry.content}</p>
                      <div className="text-xs text-gray-500">
                        Confidence: {Math.round(journalEntry.confidence * 100)}%
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {journalEntries.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Sentiment Insights</CardTitle>
              <CardDescription>AI-powered analysis of your emotional patterns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {journalEntries.filter((e) => e.sentiment === "positive").length}
                  </div>
                  <div className="text-sm text-green-700">Positive Entries</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {journalEntries.filter((e) => e.sentiment === "anxious").length}
                  </div>
                  <div className="text-sm text-orange-700">Anxious Entries</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-gray-600">
                    {journalEntries.filter((e) => e.sentiment === "neutral").length}
                  </div>
                  <div className="text-sm text-gray-700">Neutral Entries</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
