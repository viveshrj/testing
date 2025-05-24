"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Brain, FileText, Target } from "lucide-react"
import Link from "next/link"

export default function CBTToolsPage() {
  const [thoughtRecord, setThoughtRecord] = useState({
    situation: "",
    emotion: "",
    intensity: "",
    automaticThought: "",
    evidence: "",
    balancedThought: "",
  })

  const [behaviorLog, setBehaviorLog] = useState({
    trigger: "",
    behavior: "",
    consequence: "",
    alternative: "",
  })

  const cognitiveDistortions = [
    "All-or-Nothing Thinking",
    "Overgeneralization",
    "Mental Filter",
    "Disqualifying the Positive",
    "Jumping to Conclusions",
    "Magnification/Minimization",
    "Emotional Reasoning",
    "Should Statements",
    "Labeling",
    "Personalization",
  ]

  const handleSaveThoughtRecord = () => {
    const records = JSON.parse(localStorage.getItem("thoughtRecords") || "[]")
    const newRecord = {
      ...thoughtRecord,
      id: Date.now(),
      date: new Date().toISOString(),
    }
    records.push(newRecord)
    localStorage.setItem("thoughtRecords", JSON.stringify(records))

    setThoughtRecord({
      situation: "",
      emotion: "",
      intensity: "",
      automaticThought: "",
      evidence: "",
      balancedThought: "",
    })
  }

  const handleSaveBehaviorLog = () => {
    const logs = JSON.parse(localStorage.getItem("behaviorLogs") || "[]")
    const newLog = {
      ...behaviorLog,
      id: Date.now(),
      date: new Date().toISOString(),
    }
    logs.push(newLog)
    localStorage.setItem("behaviorLogs", JSON.stringify(logs))

    setBehaviorLog({
      trigger: "",
      behavior: "",
      consequence: "",
      alternative: "",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center space-x-2">
              <Brain className="h-6 w-6 text-purple-600" />
              <h1 className="text-2xl font-bold text-gray-900">CBT Tools</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="thought-record" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="thought-record">Thought Record</TabsTrigger>
            <TabsTrigger value="behavior-log">Behavior Log</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
          </TabsList>

          <TabsContent value="thought-record" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Thought Record</span>
                </CardTitle>
                <CardDescription>Identify and challenge negative thought patterns</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="situation">Situation</Label>
                    <Textarea
                      id="situation"
                      placeholder="Describe the situation that triggered your emotion"
                      value={thoughtRecord.situation}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, situation: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emotion">Emotion</Label>
                    <Input
                      id="emotion"
                      placeholder="What emotion did you feel?"
                      value={thoughtRecord.emotion}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, emotion: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="intensity">Intensity (1-10)</Label>
                    <Input
                      id="intensity"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Rate the intensity"
                      value={thoughtRecord.intensity}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, intensity: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="automaticThought">Automatic Thought</Label>
                    <Textarea
                      id="automaticThought"
                      placeholder="What went through your mind?"
                      value={thoughtRecord.automaticThought}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, automaticThought: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidence">Evidence Against</Label>
                    <Textarea
                      id="evidence"
                      placeholder="What evidence contradicts this thought?"
                      value={thoughtRecord.evidence}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, evidence: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="balancedThought">Balanced Thought</Label>
                    <Textarea
                      id="balancedThought"
                      placeholder="What's a more balanced way to think about this?"
                      value={thoughtRecord.balancedThought}
                      onChange={(e) => setThoughtRecord({ ...thoughtRecord, balancedThought: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveThoughtRecord} className="w-full">
                  Save Thought Record
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="behavior-log" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Behavior Log</span>
                </CardTitle>
                <CardDescription>Track behavioral patterns and identify alternatives</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="trigger">Trigger</Label>
                    <Textarea
                      id="trigger"
                      placeholder="What triggered this behavior?"
                      value={behaviorLog.trigger}
                      onChange={(e) => setBehaviorLog({ ...behaviorLog, trigger: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="behavior">Behavior</Label>
                    <Textarea
                      id="behavior"
                      placeholder="Describe the behavior"
                      value={behaviorLog.behavior}
                      onChange={(e) => setBehaviorLog({ ...behaviorLog, behavior: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="consequence">Consequence</Label>
                    <Textarea
                      id="consequence"
                      placeholder="What was the result?"
                      value={behaviorLog.consequence}
                      onChange={(e) => setBehaviorLog({ ...behaviorLog, consequence: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alternative">Alternative Behavior</Label>
                    <Textarea
                      id="alternative"
                      placeholder="What could you do differently next time?"
                      value={behaviorLog.alternative}
                      onChange={(e) => setBehaviorLog({ ...behaviorLog, alternative: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={handleSaveBehaviorLog} className="w-full">
                  Save Behavior Log
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="exercises" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cognitive Distortions</CardTitle>
                  <CardDescription>Common thinking patterns to watch out for</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {cognitiveDistortions.map((distortion, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="font-medium text-sm">{distortion}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Breathing Exercise</CardTitle>
                  <CardDescription>4-7-8 breathing technique for relaxation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-6xl font-bold text-indigo-600 mb-4">4-7-8</div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Inhale</strong> for 4 counts
                      </p>
                      <p>
                        <strong>Hold</strong> for 7 counts
                      </p>
                      <p>
                        <strong>Exhale</strong> for 8 counts
                      </p>
                    </div>
                  </div>
                  <Button className="w-full">Start Guided Breathing</Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
