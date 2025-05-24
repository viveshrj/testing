"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Moon, Play, Pause, Volume2, Clock, Sunrise } from "lucide-react"
import Link from "next/link"

const meditations = [
  {
    id: 1,
    title: "Deep Sleep Meditation",
    duration: "30 min",
    type: "youtube",
    url: "https://www.youtube.com/embed/1ZYbU82GVz4",
    description: "Guided meditation for deep, restful sleep",
  },
  {
    id: 2,
    title: "Body Scan for Sleep",
    duration: "20 min",
    type: "youtube",
    url: "https://www.youtube.com/embed/15q17_VLnV8",
    description: "Progressive muscle relaxation",
  },
  {
    id: 3,
    title: "Anxiety Relief Sleep",
    duration: "25 min",
    type: "youtube",
    url: "https://www.youtube.com/embed/aEqlQvczMJQ",
    description: "Calm anxious thoughts before bed",
  },
]

const soundscapes = [
  { id: 1, name: "Rain", file: "rain.mp3", icon: "🌧️" },
  { id: 2, name: "Ocean Waves", file: "ocean.mp3", icon: "🌊" },
  { id: 3, name: "Forest", file: "forest.mp3", icon: "🌲" },
  { id: 4, name: "White Noise", file: "whitenoise.mp3", icon: "📻" },
  { id: 5, name: "Thunderstorm", file: "thunder.mp3", icon: "⛈️" },
  { id: 6, name: "Fireplace", file: "fireplace.mp3", icon: "🔥" },
]

const affirmations = [
  "I am peaceful and ready for restful sleep",
  "My mind is calm and my body is relaxed",
  "I release all worries from today",
  "I am grateful for this moment of rest",
  "Tomorrow brings new opportunities",
  "I am safe and at peace",
]

export default function SleepAidPage() {
  const [sleepTimer, setSleepTimer] = useState({ hours: 0, minutes: 0, seconds: 0 })
  const [isTracking, setIsTracking] = useState(false)
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [currentSound, setCurrentSound] = useState<any>(null)
  const [volume, setVolume] = useState([50])
  const [isPlaying, setIsPlaying] = useState(false)
  const [alarmTime, setAlarmTime] = useState("")
  const [selectedAffirmation, setSelectedAffirmation] = useState(affirmations[0])
  const [sleepHistory, setSleepHistory] = useState<any[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const history = localStorage.getItem("sleepHistory")
    if (history) {
      setSleepHistory(JSON.parse(history))
    }
  }, [])

  useEffect(() => {
    if (isTracking && startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date()
        const diff = now.getTime() - startTime.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)
        setSleepTimer({ hours, minutes, seconds })
      }, 1000)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isTracking, startTime])

  const startSleepTracking = () => {
    setStartTime(new Date())
    setIsTracking(true)
    setSleepTimer({ hours: 0, minutes: 0, seconds: 0 })
  }

  const stopSleepTracking = () => {
    if (startTime) {
      const endTime = new Date()
      const duration = endTime.getTime() - startTime.getTime()
      const hours = Math.floor(duration / (1000 * 60 * 60))
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))

      const sleepEntry = {
        id: Date.now(),
        date: startTime.toISOString(),
        duration: { hours, minutes },
        quality: 0, // Can be set by user later
        notes: "",
      }

      const updatedHistory = [sleepEntry, ...sleepHistory]
      setSleepHistory(updatedHistory)
      localStorage.setItem("sleepHistory", JSON.stringify(updatedHistory))
    }

    setIsTracking(false)
    setStartTime(null)
    setSleepTimer({ hours: 0, minutes: 0, seconds: 0 })
  }

  const playSound = (sound: any) => {
    if (currentSound?.id === sound.id && isPlaying) {
      setIsPlaying(false)
      if (audioRef.current) {
        audioRef.current.pause()
      }
    } else {
      setCurrentSound(sound)
      setIsPlaying(true)
      // In a real app, you would load the actual audio file
      // For demo purposes, we'll simulate audio playback
    }
  }

  const setAlarm = () => {
    if (alarmTime) {
      const alarm = {
        id: Date.now(),
        time: alarmTime,
        affirmation: selectedAffirmation,
        active: true,
      }

      const alarms = JSON.parse(localStorage.getItem("alarms") || "[]")
      alarms.push(alarm)
      localStorage.setItem("alarms", JSON.stringify(alarms))

      setAlarmTime("")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900">
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4 text-white hover:bg-white/10">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Moon className="h-6 w-6 text-blue-300" />
              <h1 className="text-2xl font-bold text-white">Sleep Aid</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm">
            <TabsTrigger value="tracker" className="text-white data-[state=active]:bg-white/20">
              Sleep Tracker
            </TabsTrigger>
            <TabsTrigger value="meditation" className="text-white data-[state=active]:bg-white/20">
              Meditation
            </TabsTrigger>
            <TabsTrigger value="sounds" className="text-white data-[state=active]:bg-white/20">
              Soundscapes
            </TabsTrigger>
            <TabsTrigger value="alarm" className="text-white data-[state=active]:bg-white/20">
              Smart Alarm
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-300" />
                    <span>Sleep Timer</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">Track your sleep duration</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="text-center">
                    <div className="text-6xl font-mono font-bold mb-4">
                      {String(sleepTimer.hours).padStart(2, "0")}:{String(sleepTimer.minutes).padStart(2, "0")}:
                      {String(sleepTimer.seconds).padStart(2, "0")}
                    </div>
                    <div className="text-blue-200">{isTracking ? "Sleep in progress..." : "Ready to track sleep"}</div>
                  </div>

                  <div className="flex space-x-4">
                    {!isTracking ? (
                      <Button onClick={startSleepTracking} className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Start Sleep Tracking
                      </Button>
                    ) : (
                      <Button onClick={stopSleepTracking} className="flex-1 bg-red-600 hover:bg-red-700">
                        Stop & Save
                      </Button>
                    )}
                  </div>

                  {startTime && (
                    <div className="text-center text-sm text-blue-200">
                      Started at: {startTime.toLocaleTimeString()}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Sleep History</CardTitle>
                  <CardDescription className="text-blue-100">Your recent sleep patterns</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {sleepHistory.length === 0 ? (
                      <p className="text-blue-200 text-center py-4">No sleep data yet. Start tracking tonight!</p>
                    ) : (
                      sleepHistory.slice(0, 5).map((entry) => (
                        <div key={entry.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div>
                            <div className="font-medium">{new Date(entry.date).toLocaleDateString()}</div>
                            <div className="text-sm text-blue-200">
                              {entry.duration.hours}h {entry.duration.minutes}m
                            </div>
                          </div>
                          <Badge variant="outline" className="border-blue-300 text-blue-300">
                            Sleep
                          </Badge>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="meditation" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meditations.map((meditation) => (
                <Card key={meditation.id} className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                  <CardHeader>
                    <CardTitle className="text-lg">{meditation.title}</CardTitle>
                    <CardDescription className="text-blue-100">{meditation.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="aspect-video bg-black/20 rounded-lg flex items-center justify-center">
                      <iframe
                        src={meditation.url}
                        title={meditation.title}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="border-blue-300 text-blue-300">
                        {meditation.duration}
                      </Badge>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sounds" className="mt-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Volume2 className="h-5 w-5 text-blue-300" />
                  <span>Relaxation Soundscapes</span>
                </CardTitle>
                <CardDescription className="text-blue-100">Choose calming sounds to help you sleep</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {soundscapes.map((sound) => (
                    <button
                      key={sound.id}
                      onClick={() => playSound(sound)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        currentSound?.id === sound.id && isPlaying
                          ? "border-blue-400 bg-blue-500/20"
                          : "border-white/20 hover:border-white/40 bg-white/5"
                      }`}
                    >
                      <div className="text-3xl mb-2">{sound.icon}</div>
                      <div className="text-sm font-medium">{sound.name}</div>
                      {currentSound?.id === sound.id && isPlaying && (
                        <div className="mt-2">
                          <Pause className="h-4 w-4 mx-auto text-blue-300" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {currentSound && (
                  <div className="space-y-4 p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Now Playing: {currentSound.name}</span>
                      <Button
                        size="sm"
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm">Volume: {volume[0]}%</Label>
                      <Slider value={volume} onValueChange={setVolume} max={100} step={1} className="w-full" />
                    </div>
                  </div>
                )}

                <audio ref={audioRef} loop>
                  {currentSound && <source src={`/sounds/${currentSound.file}`} type="audio/mpeg" />}
                </audio>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alarm" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Sunrise className="h-5 w-5 text-yellow-300" />
                    <span>Smart Alarm</span>
                  </CardTitle>
                  <CardDescription className="text-blue-100">Wake up with positive affirmations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="alarm-time">Alarm Time</Label>
                    <Input
                      id="alarm-time"
                      type="time"
                      value={alarmTime}
                      onChange={(e) => setAlarmTime(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Morning Affirmation</Label>
                    <div className="space-y-2">
                      {affirmations.map((affirmation, index) => (
                        <button
                          key={index}
                          onClick={() => setSelectedAffirmation(affirmation)}
                          className={`w-full p-3 text-left rounded-lg border transition-all ${
                            selectedAffirmation === affirmation
                              ? "border-blue-400 bg-blue-500/20"
                              : "border-white/20 hover:border-white/40 bg-white/5"
                          }`}
                        >
                          <div className="text-sm">{affirmation}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button onClick={setAlarm} disabled={!alarmTime} className="w-full bg-yellow-600 hover:bg-yellow-700">
                    Set Alarm
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
                <CardHeader>
                  <CardTitle>Active Alarms</CardTitle>
                  <CardDescription className="text-blue-100">Your scheduled wake-up times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {JSON.parse(localStorage.getItem("alarms") || "[]").length === 0 ? (
                      <p className="text-blue-200 text-center py-4">No alarms set</p>
                    ) : (
                      JSON.parse(localStorage.getItem("alarms") || "[]").map((alarm: any) => (
                        <div key={alarm.id} className="p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-mono text-lg">{alarm.time}</div>
                            <Badge variant="outline" className="border-yellow-300 text-yellow-300">
                              Active
                            </Badge>
                          </div>
                          <div className="text-sm text-blue-200">{alarm.affirmation}</div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
