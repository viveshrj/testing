"use client"
import { MessageSquare } from "lucide-react";
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Brain, BookOpen, Video, TrendingUp, Heart, Moon, Users } from "lucide-react"
import Link from "next/link"


export default function HomePage() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Heart className="mx-auto h-12 w-12 text-indigo-600" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">MindWell</h2>
            <p className="mt-2 text-sm text-gray-600">Your mental health companion</p>
          </div>
          <div className="space-y-4">
            <Link href="/auth">
              <Button className="w-full">Get Started</Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">MindWell</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Welcome, {user.name}</Badge>
              <Button
                variant="outline"
                onClick={() => {
                  localStorage.removeItem("user")
                  setUser(null)
                }}
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Mental Health Dashboard</h2>
          <p className="text-gray-600">Track your mood, practice CBT techniques, and monitor your progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/mood-tracker">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Mood Tracker</span>
                </CardTitle>
                <CardDescription>Log your daily mood with emojis and colors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2 mb-4">
                  <span className="text-2xl">😊</span>
                  <span className="text-2xl">😐</span>
                  <span className="text-2xl">😢</span>
                </div>
                <Button className="w-full">Track Mood</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/cbt-tools">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Brain className="h-5 w-5 text-purple-600" />
                  <span>CBT Tools</span>
                </CardTitle>
                <CardDescription>Cognitive behavioral therapy exercises and thought logs</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">• Thought Records</div>
                  <div className="text-sm text-gray-600">• Cognitive Exercises</div>
                  <div className="text-sm text-gray-600">• Behavioral Patterns</div>
                </div>
                <Button className="w-full">Start CBT</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/journal">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5 text-green-600" />
                  <span>AI Journal</span>
                </CardTitle>
                <CardDescription>Write daily entries with AI sentiment analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Latest sentiment:</div>
                  <Badge variant="outline" className="text-green-600">
                    Positive
                  </Badge>
                </div>
                <Button className="w-full">Write Entry</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  <span>Analytics</span>
                </CardTitle>
                <CardDescription>Visualize your mood patterns and progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-2xl font-bold text-green-600">↗️ Improving</div>
                  <div className="text-sm text-gray-600">7-day trend</div>
                </div>
                <Button className="w-full">View Analytics</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/telehealth">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Video className="h-5 w-5 text-red-600" />
                  <span>Telehealth</span>
                </CardTitle>
                <CardDescription>Schedule appointments with mental health professionals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm text-gray-600">Next appointment:</div>
                  <div className="font-medium">No appointments scheduled</div>
                </div>
                <Button className="w-full">Book Session</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/sleep-aid">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Moon className="h-5 w-5 text-indigo-600" />
                  <span>Sleep Aid</span>
                </CardTitle>
                <CardDescription>Sleep tracking, meditations, and relaxation sounds</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">• Sleep Timer</div>
                  <div className="text-sm text-gray-600">• Guided Meditations</div>
                  <div className="text-sm text-gray-600">• Relaxation Sounds</div>
                </div>
                <Button className="w-full">Sleep Better</Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/community">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Community</span>
                </CardTitle>
                <CardDescription>Connect with peers in anonymous support groups</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Active discussions:</div>
                  <Badge variant="outline" className="text-purple-600">
                    42 topics
                  </Badge>
                </div>
                <Button className="w-full">Join Community</Button>
              </CardContent>
            </Card>
          </Link>

          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
            <CardHeader>
              <CardTitle>Daily Tip</CardTitle>
              <CardDescription className="text-indigo-100">Mental health insight for today</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">
                "Take 5 minutes today to practice deep breathing. It can help reduce stress and improve focus."
              </p>
              <Button variant="secondary" className="w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
  
return (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {/* Other existing cards */}
    
    {/* Add this ChatMe card */}
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          ChatMe
        </CardTitle>
        <CardDescription>
          Talk to our friendly AI assistant
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Link href="/chat">
          <Button className="w-full">Chat</Button>
        </Link>
      </CardContent>
    </Card>
  </div>
)
}

