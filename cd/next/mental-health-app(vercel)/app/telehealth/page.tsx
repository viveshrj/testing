"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Video, Calendar } from "lucide-react"
import Link from "next/link"

const therapists = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialty: "Cognitive Behavioral Therapy",
    rating: 4.9,
    experience: "8 years",
    image: "/placeholder.svg?height=80&width=80",
    availability: ["Mon 2-6 PM", "Wed 10 AM-2 PM", "Fri 1-5 PM"],
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialty: "Anxiety & Depression",
    rating: 4.8,
    experience: "12 years",
    image: "/placeholder.svg?height=80&width=80",
    availability: ["Tue 9 AM-1 PM", "Thu 3-7 PM", "Sat 10 AM-2 PM"],
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    specialty: "Trauma & PTSD",
    rating: 4.9,
    experience: "10 years",
    image: "/placeholder.svg?height=80&width=80",
    availability: ["Mon 10 AM-2 PM", "Wed 2-6 PM", "Fri 9 AM-1 PM"],
  },
]

export default function TelehealthPage() {
  const [selectedTherapist, setSelectedTherapist] = useState<any>(null)
  const [appointmentForm, setAppointmentForm] = useState({
    date: "",
    time: "",
    reason: "",
    notes: "",
  })

  const handleBookAppointment = () => {
    const appointment = {
      id: Date.now(),
      therapist: selectedTherapist,
      ...appointmentForm,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    }

    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]")
    appointments.push(appointment)
    localStorage.setItem("appointments", JSON.stringify(appointments))

    setSelectedTherapist(null)
    setAppointmentForm({ date: "", time: "", reason: "", notes: "" })
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
              <Video className="h-6 w-6 text-red-600" />
              <h1 className="text-2xl font-bold text-gray-900">Telehealth</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!selectedTherapist ? (
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Find a Therapist</h2>
              <p className="text-gray-600">Connect with licensed mental health professionals</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {therapists.map((therapist) => (
                <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <img
                        src={therapist.image || "/placeholder.svg"}
                        alt={therapist.name}
                        className="w-16 h-16 rounded-full bg-gray-200"
                      />
                      <div>
                        <CardTitle className="text-lg">{therapist.name}</CardTitle>
                        <CardDescription>{therapist.specialty}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-yellow-500">⭐</span>
                        <span className="font-medium">{therapist.rating}</span>
                      </div>
                      <Badge variant="secondary">{therapist.experience}</Badge>
                    </div>

                    <div>
                      <div className="text-sm font-medium mb-2">Available:</div>
                      <div className="space-y-1">
                        {therapist.availability.map((slot, index) => (
                          <div key={index} className="text-xs text-gray-600 bg-gray-50 px-2 py-1 rounded">
                            {slot}
                          </div>
                        ))}
                      </div>
                    </div>

                    <Button className="w-full" onClick={() => setSelectedTherapist(therapist)}>
                      Book Appointment
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Book Appointment with {selectedTherapist.name}</span>
                </CardTitle>
                <CardDescription>Schedule your telehealth session</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={selectedTherapist.image || "/placeholder.svg"}
                    alt={selectedTherapist.name}
                    className="w-12 h-12 rounded-full bg-gray-200"
                  />
                  <div>
                    <div className="font-medium">{selectedTherapist.name}</div>
                    <div className="text-sm text-gray-600">{selectedTherapist.specialty}</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={appointmentForm.date}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={appointmentForm.time}
                      onChange={(e) => setAppointmentForm({ ...appointmentForm, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for Visit</Label>
                  <Input
                    id="reason"
                    placeholder="e.g., Anxiety management, Depression support, Stress counseling"
                    value={appointmentForm.reason}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, reason: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any specific concerns or information you'd like to share"
                    value={appointmentForm.notes}
                    onChange={(e) => setAppointmentForm({ ...appointmentForm, notes: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Video className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-blue-900">Session Details</span>
                  </div>
                  <div className="text-sm text-blue-800 space-y-1">
                    <p>• 50-minute video session</p>
                    <p>• Secure, HIPAA-compliant platform</p>
                    <p>• Session recording available upon request</p>
                    <p>• 24-hour cancellation policy</p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setSelectedTherapist(null)} className="flex-1">
                    Back to Therapists
                  </Button>
                  <Button
                    onClick={handleBookAppointment}
                    disabled={!appointmentForm.date || !appointmentForm.time || !appointmentForm.reason}
                    className="flex-1"
                  >
                    Book Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Emergency Resources</CardTitle>
            <CardDescription>
              If you're experiencing a mental health emergency, please reach out immediately
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg">
                <div className="font-medium text-red-900 mb-2">Crisis Hotline</div>
                <div className="text-red-800">988 Suicide & Crisis Lifeline</div>
                <div className="text-sm text-red-700">24/7 support</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <div className="font-medium text-orange-900 mb-2">Text Support</div>
                <div className="text-orange-800">Text HOME to 741741</div>
                <div className="text-sm text-orange-700">Crisis Text Line</div>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="font-medium text-blue-900 mb-2">Emergency</div>
                <div className="text-blue-800">Call 911</div>
                <div className="text-sm text-blue-700">Immediate danger</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
