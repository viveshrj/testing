import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()

    // Simple sentiment analysis logic
    // In a real app, you would use a proper AI service
    const lowerText = text.toLowerCase()

    let sentiment = "neutral"
    let emotion = "calm"
    let confidence = 0.7

    // Positive indicators
    if (
      lowerText.includes("happy") ||
      lowerText.includes("great") ||
      lowerText.includes("wonderful") ||
      lowerText.includes("amazing") ||
      lowerText.includes("excited") ||
      lowerText.includes("grateful")
    ) {
      sentiment = "positive"
      emotion = "happy"
      confidence = 0.9
    }
    // Negative indicators
    else if (
      lowerText.includes("sad") ||
      lowerText.includes("terrible") ||
      lowerText.includes("awful") ||
      lowerText.includes("depressed") ||
      lowerText.includes("hopeless") ||
      lowerText.includes("down")
    ) {
      sentiment = "negative"
      emotion = "sad"
      confidence = 0.85
    }
    // Anxiety indicators
    else if (
      lowerText.includes("anxious") ||
      lowerText.includes("worried") ||
      lowerText.includes("stress") ||
      lowerText.includes("nervous") ||
      lowerText.includes("panic") ||
      lowerText.includes("overwhelmed")
    ) {
      sentiment = "anxious"
      emotion = "anxious"
      confidence = 0.8
    }
    // Hopeful indicators
    else if (
      lowerText.includes("hope") ||
      lowerText.includes("optimistic") ||
      lowerText.includes("better") ||
      lowerText.includes("improving")
    ) {
      sentiment = "hopeful"
      emotion = "hopeful"
      confidence = 0.75
    }

    return NextResponse.json({
      sentiment,
      emotion,
      confidence,
      analysis: {
        wordCount: text.split(" ").length,
        characterCount: text.length,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
