"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Shield, AlertTriangle, TrendingUp, BookOpen } from "lucide-react"
import Link from "next/link"

export default function AdminPage() {
  const [moodData, setMoodData] = useState<any[]>([])
  const [journalData, setJournalData] = useState<any[]>([])
  const [crisisIncidents, setCrisisIncidents] = useState<any[]>([])
  const [communityPosts, setCommunityPosts] = useState<any[]>([])
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [password, setPassword] = useState("")

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem("adminAuth")
    if (adminAuth === "authenticated") {
      setIsAuthorized(true)
      loadAdminData()
    }
  }, [])

  const handleAdminLogin = () => {
    // Simple password check (in production, use proper authentication)
    if (password === "admin123") {
      setIsAuthorized(true)
      localStorage.setItem("adminAuth", "authenticated")
      loadAdminData()
    } else {
      alert("Invalid password")
    }
  }

  const loadAdminData = () => {
    // Load anonymized data from localStorage
    const moods = JSON.parse(localStorage.getItem("moodHistory") || "[]")
    const journals = JSON.parse(localStorage.getItem("journalEntries") || "[]")
    const incidents = JSON.parse(localStorage.getItem("crisisIncidents") || "[]")
    const posts = JSON.parse(localStorage.getItem("communityPosts") || "[]")

    // Anonymize data
    const anonymizedMoods = moods.map((entry: any, index: number) => ({
      ...entry,
      userId: `user_${(index % 10) + 1}`, // Simulate multiple users
      id: entry.id,
    }))

    const anonymizedJournals = journals.map((entry: any, index: number) => ({
      ...entry,
      userId: `user_${(index % 10) + 1}`,
      content: entry.content.length > 100 ? entry.content.substring(0, 100) + "..." : entry.content,
    }))

    setMoodData(anonymizedMoods)
    setJournalData(anonymizedJournals)
    setCrisisIncidents(incidents)
    setCommunityPosts(posts)
  }

  const getMoodTrends = () => {
    if (moodData.length === 0) return { average: 0, trend: "stable" }

    const average = moodData.reduce((sum, entry) => sum + entry.mood, 0) / moodData.length

    // Calculate trend (simplified)
    const recent = moodData.slice(0, Math.floor(moodData.length / 2))
    const older = moodData.slice(Math.floor(moodData.length / 2))

    if (recent.length === 0 || older.length === 0) return { average: average.toFixed(1), trend: "stable" }

    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood, 0) / recent.length
    const olderAvg = older.reduce((sum, entry) => sum + entry.mood, 0) / older.length

    let trend = "stable"
    if (recentAvg > olderAvg + 0.3) trend = "improving"
    else if (recentAvg < olderAvg - 0.3) trend = "declining"

    return { average: average.toFixed(1), trend }
  }

  const getSentimentDistribution = () => {
    const distribution: { [key: string]: number } = {}
    journalData.forEach((entry) => {
      distribution[entry.sentiment] = (distribution[entry.sentiment] || 0) + 1
    })
    return distribution
  }

  const getUnresolvedIncidents = () => {
    return crisisIncidents.filter((incident) => !incident.resolved)
  }

  const markIncidentResolved = (incidentId: number) => {
    const updatedIncidents = crisisIncidents.map((incident) =>
      incident.id === incidentId ? { ...incident, resolved: true } : incident,
    )
    setCrisisIncidents(updatedIncidents)
    localStorage.setItem("crisisIncidents", JSON.stringify(updatedIncidents))
  }

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-red-600" />
              <span>Admin Access</span>
            </CardTitle>
            <CardDescription>Enter admin password to access dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              type="password"
              placeholder="Admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded-md"
              onKeyPress={(e) => e.key === "Enter" && handleAdminLogin()}
            />
            <Button onClick={handleAdminLogin} className="w-full">
              Login
            </Button>
            <p className="text-xs text-gray-500 text-center">Demo password: admin123</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const moodTrends = getMoodTrends()
  const sentimentDist = getSentimentDistribution()
  const unresolvedIncidents = getUnresolvedIncidents()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-red-600" />
                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("adminAuth")
                setIsAuthorized(false)
              }}
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127</div>
              <p className="text-xs text-gray-500 mt-1">+12 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Average Mood</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{moodTrends.average}/5</div>
              <p className="text-xs text-gray-500 mt-1 capitalize">{moodTrends.trend}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Crisis Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{unresolvedIncidents.length}</div>
              <p className="text-xs text-gray-500 mt-1">Unresolved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Community Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{communityPosts.length}</div>
              <p className="text-xs text-gray-500 mt-1">Total discussions</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mood-trends">Mood Trends</TabsTrigger>
            <TabsTrigger value="crisis-alerts">Crisis Alerts</TabsTrigger>
            <TabsTrigger value="flagged-content">Flagged Content</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    <span>Mood Distribution</span>
                  </CardTitle>
                  <CardDescription>User mood patterns across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((mood) => {
                      const count = moodData.filter((entry) => entry.mood === mood).length
                      const percentage = moodData.length > 0 ? ((count / moodData.length) * 100).toFixed(1) : 0
                      const labels = ["Terrible", "Poor", "Okay", "Good", "Excellent"]
                      const colors = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-400", "bg-green-500"]

                      return (
                        <div key={mood} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${colors[mood - 1]}`}></div>
                            <span>{labels[mood - 1]}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{count}</span>
                            <Badge variant="secondary">{percentage}%</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5 text-green-600" />
                    <span>Journal Sentiment</span>
                  </CardTitle>
                  <CardDescription>Emotional patterns from journal analysis</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(sentimentDist).map(([sentiment, count]) => {
                      const total = Object.values(sentimentDist).reduce((a: any, b: any) => a + b, 0)
                      const percentage = total > 0 ? (((count as number) / total) * 100).toFixed(1) : 0
                      const colors: { [key: string]: string } = {
                        positive: "bg-green-500",
                        negative: "bg-red-500",
                        anxious: "bg-orange-500",
                        neutral: "bg-gray-500",
                        hopeful: "bg-blue-500",
                      }

                      return (
                        <div key={sentiment} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${colors[sentiment] || "bg-gray-500"}`}></div>
                            <span className="capitalize">{sentiment}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{count}</span>
                            <Badge variant="secondary">{percentage}%</Badge>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="mood-trends" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Anonymized Mood Data</CardTitle>
                <CardDescription>Recent mood entries across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {moodData.slice(0, 20).map((entry, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{entry.userId}</Badge>
                        <span className="text-2xl">{["😢", "😔", "😐", "😊", "😄"][entry.mood - 1]}</span>
                        <span className="font-medium">
                          {["Terrible", "Poor", "Okay", "Good", "Excellent"][entry.mood - 1]}
                        </span>
                      </div>
                      <div className="text-sm text-gray-500">{new Date(entry.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="crisis-alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span>Crisis Incidents</span>
                </CardTitle>
                <CardDescription>Flagged content requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {crisisIncidents.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No crisis incidents reported</p>
                  ) : (
                    crisisIncidents.map((incident) => (
                      <div
                        key={incident.id}
                        className={`p-4 rounded-lg border ${
                          incident.resolved ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Badge variant={incident.resolved ? "default" : "destructive"}>
                              {incident.resolved ? "Resolved" : "Urgent"}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {new Date(incident.timestamp).toLocaleString()}
                            </span>
                          </div>
                          {!incident.resolved && (
                            <Button
                              size="sm"
                              onClick={() => markIncidentResolved(incident.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 bg-white p-2 rounded border">{incident.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="flagged-content" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Community Posts</CardTitle>
                <CardDescription>Posts that require moderation review</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {communityPosts.filter((post) => post.flagged).length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No flagged posts</p>
                  ) : (
                    communityPosts
                      .filter((post) => post.flagged)
                      .map((post) => (
                        <div key={post.id} className="p-4 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium">{post.title}</h4>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge variant="destructive">Flagged</Badge>
                                <span className="text-sm text-gray-500">by {post.author}</span>
                                <span className="text-sm text-gray-500">
                                  {new Date(post.timestamp).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 bg-white p-2 rounded border">{post.content}</p>
                        </div>
                      ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
