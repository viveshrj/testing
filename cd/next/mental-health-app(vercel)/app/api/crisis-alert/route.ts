import { type NextRequest, NextResponse } from "next/server"

const flaggedKeywords = [
  "suicide",
  "kill myself",
  "end it all",
  "want to die",
  "hurt myself",
  "self harm",
  "cutting",
  "overdose",
  "jump off",
  "hang myself",
  "not worth living",
  "better off dead",
  "can't go on",
]

const selfCareChecklist = [
  "Take 5 deep breaths",
  "Call a trusted friend or family member",
  "Go for a short walk outside",
  "Listen to calming music",
  "Practice grounding techniques (5-4-3-2-1 method)",
  "Drink a glass of water",
  "Write down three things you're grateful for",
]

export async function POST(request: NextRequest) {
  try {
    const { content, userId } = await request.json()

    // Check for flagged content
    const lowerContent = content.toLowerCase()
    const isFlagged = flaggedKeywords.some((keyword) => lowerContent.includes(keyword))

    if (isFlagged) {
      // Log the incident
      const incident = {
        id: Date.now(),
        userId: userId || "anonymous",
        content: content.substring(0, 200), // Limit stored content for privacy
        timestamp: new Date().toISOString(),
        type: "crisis_alert",
        resolved: false,
        severity: "high",
      }

      // In a real app, this would be stored in a secure database
      // and trigger notifications to mental health professionals

      return NextResponse.json({
        flagged: true,
        alert: {
          message: "We're concerned about your wellbeing. Please reach out for support.",
          resources: {
            crisis_hotline: "988 Suicide & Crisis Lifeline",
            text_support: "Text HOME to 741741",
            emergency: "Call 911 if in immediate danger",
          },
          selfCareChecklist,
          incident,
        },
      })
    }

    return NextResponse.json({
      flagged: false,
      message: "Content processed successfully",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process crisis alert" }, { status: 500 })
  }
}
