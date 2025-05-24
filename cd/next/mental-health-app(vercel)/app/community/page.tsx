"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Users, MessageCircle, ThumbsUp, Flag, Plus, Reply } from "lucide-react"
import Link from "next/link"

const topics = [
  { id: "anxiety", name: "Anxiety", color: "bg-orange-100 text-orange-800", count: 24 },
  { id: "depression", name: "Depression", color: "bg-blue-100 text-blue-800", count: 18 },
  { id: "relationships", name: "Relationships", color: "bg-pink-100 text-pink-800", count: 31 },
  { id: "school", name: "School Pressure", color: "bg-purple-100 text-purple-800", count: 15 },
  { id: "work", name: "Work Stress", color: "bg-green-100 text-green-800", count: 22 },
  { id: "family", name: "Family Issues", color: "bg-yellow-100 text-yellow-800", count: 12 },
]

const generateUsername = () => {
  const adjectives = ["Brave", "Kind", "Strong", "Gentle", "Wise", "Calm", "Bright", "Hope"]
  const nouns = ["Soul", "Heart", "Mind", "Spirit", "Light", "Star", "Moon", "Sun"]
  const numbers = Math.floor(Math.random() * 999) + 1
  return `${adjectives[Math.floor(Math.random() * adjectives.length)]}${nouns[Math.floor(Math.random() * nouns.length)]}${numbers}`
}

const checkForFlaggedContent = (text: string) => {
  const flaggedWords = [
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
  ]

  const lowerText = text.toLowerCase()
  return flaggedWords.some((word) => lowerText.includes(word))
}

export default function CommunityPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [newPost, setNewPost] = useState({ title: "", content: "", topic: "anxiety" })
  const [showNewPost, setShowNewPost] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [replyingTo, setReplyingTo] = useState<number | null>(null)
  const [userVotes, setUserVotes] = useState<{ [key: number]: boolean }>({})

  useEffect(() => {
    const savedPosts = localStorage.getItem("communityPosts")
    const savedVotes = localStorage.getItem("userVotes")

    if (savedPosts) {
      setPosts(JSON.parse(savedPosts))
    } else {
      // Initialize with some sample posts
      const samplePosts = [
        {
          id: 1,
          title: "Dealing with exam anxiety",
          content: "I have my finals coming up and I'm feeling overwhelmed. Any tips for managing stress?",
          topic: "anxiety",
          author: "StudyWarrior123",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          upvotes: 5,
          replies: [
            {
              id: 1,
              content: "Try the 4-7-8 breathing technique! It really helps me calm down before tests.",
              author: "CalmMind456",
              timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
              upvotes: 3,
            },
          ],
          flagged: false,
        },
        {
          id: 2,
          title: "Feeling isolated lately",
          content: "I've been struggling to connect with friends and family. Anyone else going through this?",
          topic: "relationships",
          author: "LonelyHeart789",
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          upvotes: 8,
          replies: [],
          flagged: false,
        },
      ]
      setPosts(samplePosts)
      localStorage.setItem("communityPosts", JSON.stringify(samplePosts))
    }

    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes))
    }
  }, [])

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) return

    const isFlagged = checkForFlaggedContent(newPost.content)

    if (isFlagged) {
      // Trigger alert system
      triggerCrisisAlert(newPost.content)
    }

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      topic: newPost.topic,
      author: generateUsername(),
      timestamp: new Date().toISOString(),
      upvotes: 0,
      replies: [],
      flagged: isFlagged,
    }

    const updatedPosts = [post, ...posts]
    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))

    setNewPost({ title: "", content: "", topic: "anxiety" })
    setShowNewPost(false)
  }

  const handleUpvote = (postId: number) => {
    if (userVotes[postId]) return // Already voted

    const updatedPosts = posts.map((post) => (post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post))
    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))

    const updatedVotes = { ...userVotes, [postId]: true }
    setUserVotes(updatedVotes)
    localStorage.setItem("userVotes", JSON.stringify(updatedVotes))
  }

  const handleReply = (postId: number) => {
    if (!replyContent.trim()) return

    const isFlagged = checkForFlaggedContent(replyContent)

    if (isFlagged) {
      triggerCrisisAlert(replyContent)
    }

    const reply = {
      id: Date.now(),
      content: replyContent,
      author: generateUsername(),
      timestamp: new Date().toISOString(),
      upvotes: 0,
      flagged: isFlagged,
    }

    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, replies: [...post.replies, reply] } : post,
    )
    setPosts(updatedPosts)
    localStorage.setItem("communityPosts", JSON.stringify(updatedPosts))

    setReplyContent("")
    setReplyingTo(null)
  }

  const triggerCrisisAlert = (content: string) => {
    // Log crisis incident
    const incident = {
      id: Date.now(),
      content,
      timestamp: new Date().toISOString(),
      type: "flagged_content",
      resolved: false,
    }

    const incidents = JSON.parse(localStorage.getItem("crisisIncidents") || "[]")
    incidents.push(incident)
    localStorage.setItem("crisisIncidents", JSON.stringify(incidents))

    // Show self-care resources
    alert(
      "We noticed your message contains concerning language. Please remember that support is available. If you're in crisis, contact 988 Suicide & Crisis Lifeline.",
    )
  }

  const filteredPosts = selectedTopic === "all" ? posts : posts.filter((post) => post.topic === selectedTopic)

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
              <Users className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Peer Support Community</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Topics</CardTitle>
                <CardDescription>Browse discussions by category</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <button
                  onClick={() => setSelectedTopic("all")}
                  className={`w-full text-left p-2 rounded-lg transition-colors ${
                    selectedTopic === "all" ? "bg-indigo-100 text-indigo-800" : "hover:bg-gray-100"
                  }`}
                >
                  All Topics ({posts.length})
                </button>
                {topics.map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => setSelectedTopic(topic.id)}
                    className={`w-full text-left p-2 rounded-lg transition-colors ${
                      selectedTopic === topic.id ? topic.color : "hover:bg-gray-100"
                    }`}
                  >
                    {topic.name} ({topic.count})
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Community Guidelines</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <p>• Be respectful and supportive</p>
                <p>• No personal attacks or harassment</p>
                <p>• Share experiences, not medical advice</p>
                <p>• Use content warnings when needed</p>
                <p>• Report concerning content</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">
                {selectedTopic === "all" ? "All Discussions" : topics.find((t) => t.id === selectedTopic)?.name}
              </h2>
              <Button onClick={() => setShowNewPost(true)} className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>New Post</span>
              </Button>
            </div>

            {showNewPost && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                  <CardDescription>Share your thoughts with the community</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      placeholder="Post title"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <select
                      value={newPost.topic}
                      onChange={(e) => setNewPost({ ...newPost, topic: e.target.value })}
                      className="w-full p-2 border rounded-md"
                    >
                      {topics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Textarea
                      placeholder="Share your thoughts..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="flex space-x-2">
                    <Button onClick={handleCreatePost}>Post</Button>
                    <Button variant="outline" onClick={() => setShowNewPost(false)}>
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6">
              {filteredPosts.map((post) => (
                <Card key={post.id} className={post.flagged ? "border-red-200 bg-red-50" : ""}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{post.title}</CardTitle>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={topics.find((t) => t.id === post.topic)?.color}>
                            {topics.find((t) => t.id === post.topic)?.name}
                          </Badge>
                          <span className="text-sm text-gray-500">by {post.author}</span>
                          <span className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleString()}</span>
                          {post.flagged && (
                            <Badge variant="destructive">
                              <Flag className="h-3 w-3 mr-1" />
                              Flagged
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700 mb-4">{post.content}</p>

                    <div className="flex items-center space-x-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpvote(post.id)}
                        disabled={userVotes[post.id]}
                        className={userVotes[post.id] ? "text-blue-600" : ""}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {post.upvotes}
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setReplyingTo(replyingTo === post.id ? null : post.id)}
                      >
                        <Reply className="h-4 w-4 mr-1" />
                        Reply ({post.replies.length})
                      </Button>
                    </div>

                    {replyingTo === post.id && (
                      <div className="mt-4 space-y-2">
                        <Textarea
                          placeholder="Write a supportive reply..."
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          rows={3}
                        />
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={() => handleReply(post.id)}>
                            Post Reply
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => setReplyingTo(null)}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}

                    {post.replies.length > 0 && (
                      <div className="mt-4 space-y-3 border-l-2 border-gray-200 pl-4">
                        {post.replies.map((reply: any) => (
                          <div
                            key={reply.id}
                            className={`p-3 bg-gray-50 rounded-lg ${reply.flagged ? "border border-red-200" : ""}`}
                          >
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-medium text-sm">{reply.author}</span>
                              <span className="text-xs text-gray-500">
                                {new Date(reply.timestamp).toLocaleString()}
                              </span>
                              {reply.flagged && (
                                <Badge variant="destructive" className="text-xs">
                                  <Flag className="h-2 w-2 mr-1" />
                                  Flagged
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-700">{reply.content}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}

              {filteredPosts.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No posts in this category yet. Be the first to start a discussion!</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
