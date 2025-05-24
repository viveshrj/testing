"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

const moods = [
  { emoji: "😄", label: "Excellent", value: 5, color: "bg-green-500" },
  { emoji: "😊", label: "Good", value: 4, color: "bg-green-400" },
  { emoji: "😐", label: "Okay", value: 3, color: "bg-yellow-400" },
  { emoji: "😔", label: "Poor", value: 2, color: "bg-orange-400" },
  { emoji: "😢", label: "Terrible", value: 1, color: "bg-red-500" },
]

export default function MoodTrackerPage() {
  const [selectedMood, setSelectedMood] = useState<number | null>(null)
  const [notes, setNotes] = useState("")
  const [moodHistory, setMoodHistory] = useState<any[]>([])

  useEffect(() => {
    const history = localStorage.getItem("moodHistory")
    if (history) {
      setMoodHistory(JSON.parse(history))
    }
  }, [])

  const handleSaveMood = () => {
    if (selectedMood === null) return

    const newEntry = {
      id: Date.now(),
      mood: selectedMood,
      notes,
      date: new Date().toISOString(),
      timestamp: new Date().toLocaleString(),
    }

    const updatedHistory = [newEntry, ...moodHistory]
    setMoodHistory(updatedHistory)
    localStorage.setItem("moodHistory", JSON.stringify(updatedHistory))

    setSelectedMood(null)
    setNotes("")
  }

  const getMoodData = (value: number) => {
    return moods.find((mood) => mood.value === value)
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
              <Calendar className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Mood Tracker</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Select your current mood and add any notes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-medium mb-4 block">Choose your mood</Label>
                <div className="grid grid-cols-5 gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        selectedMood === mood.value
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">{mood.emoji}</div>
                      <div className="text-xs font-medium text-gray-700">{mood.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="notes" className="text-base font-medium">
                  Notes (optional)
                </Label>
                <Textarea
                  id="notes"
                  placeholder="What's on your mind? Any specific thoughts or events affecting your mood?"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-2"
                  rows={4}
                />
              </div>

              <Button onClick={handleSaveMood} className="w-full" disabled={selectedMood === null}>
                Save Mood Entry
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Mood History</CardTitle>
              <CardDescription>Your mood entries from the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {moodHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No mood entries yet. Start tracking your mood today!</p>
                ) : (
                  moodHistory.slice(0, 10).map((entry) => {
                    const moodData = getMoodData(entry.mood)
                    return (
                      <div key={entry.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl">{moodData?.emoji}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <Badge variant="outline">{moodData?.label}</Badge>
                            <span className="text-sm text-gray-500">{entry.timestamp}</span>
                          </div>
                          {entry.notes && <p className="text-sm text-gray-700">{entry.notes}</p>}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
