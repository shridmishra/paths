"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Separator } from "@workspace/ui/components/separator"
import {
    Code, Palette, Database, Cloud, Smartphone, Brain,
    ChevronRight, ChevronLeft, Check, Sparkles
} from "lucide-react"
import { useRouter } from "next/navigation"

const interests = [
    { id: "web", name: "Web Development", icon: Code, color: "bg-blue-500" },
    { id: "design", name: "UI/UX Design", icon: Palette, color: "bg-pink-500" },
    { id: "data", name: "Data Science", icon: Database, color: "bg-purple-500" },
    { id: "cloud", name: "Cloud & DevOps", icon: Cloud, color: "bg-cyan-500" },
    { id: "mobile", name: "Mobile Development", icon: Smartphone, color: "bg-green-500" },
    { id: "ai", name: "AI & Machine Learning", icon: Brain, color: "bg-orange-500" }
]

const skillLevels = [
    { id: "beginner", name: "Beginner", description: "Just starting my learning journey" },
    { id: "intermediate", name: "Intermediate", description: "I have some experience" },
    { id: "advanced", name: "Advanced", description: "I'm looking to master my skills" }
]

const goals = [
    { id: "career", name: "Career Change", description: "Switch to a new career path" },
    { id: "skills", name: "Skill Development", description: "Learn new technologies" },
    { id: "project", name: "Build Projects", description: "Create real-world applications" },
    { id: "certification", name: "Get Certified", description: "Earn professional certifications" }
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [selectedInterests, setSelectedInterests] = useState<string[]>([])
    const [selectedLevel, setSelectedLevel] = useState<string>("")
    const [selectedGoals, setSelectedGoals] = useState<string[]>([])
    const [name, setName] = useState("")

    const totalSteps = 4

    const toggleInterest = (id: string) => {
        setSelectedInterests(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        )
    }

    const toggleGoal = (id: string) => {
        setSelectedGoals(prev =>
            prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
        )
    }

    const handleComplete = () => {
        // In a real app, save preferences to backend
        router.push("/")
    }

    const canProceed = () => {
        switch (step) {
            case 1:
                return name.trim().length > 0
            case 2:
                return selectedInterests.length > 0
            case 3:
                return selectedLevel !== ""
            case 4:
                return selectedGoals.length > 0
            default:
                return false
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
            <div className="w-full max-w-2xl">
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Step {step} of {totalSteps}</span>
                        <span className="text-sm text-muted-foreground">{Math.round((step / totalSteps) * 100)}%</span>
                    </div>
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                            className="h-full bg-primary transition-all duration-300"
                            style={{ width: `${(step / totalSteps) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Step 1: Welcome & Name */}
                {step === 1 && (
                    <Card className="border-2">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="p-3 rounded-full bg-primary/10">
                                    <Sparkles className="h-8 w-8 text-primary" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl">Welcome to Paths!</CardTitle>
                            <CardDescription className="text-base">
                                Let's personalize your learning experience
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    What should we call you?
                                </label>
                                <Input
                                    id="name"
                                    placeholder="Enter your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-lg"
                                />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full"
                                size="lg"
                                onClick={() => setStep(2)}
                                disabled={!canProceed()}
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 2: Interests */}
                {step === 2 && (
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">What interests you?</CardTitle>
                            <CardDescription>
                                Select all the topics you'd like to explore (choose at least one)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-3">
                                {interests.map((interest) => {
                                    const Icon = interest.icon
                                    const isSelected = selectedInterests.includes(interest.id)

                                    return (
                                        <button
                                            key={interest.id}
                                            onClick={() => toggleInterest(interest.id)}
                                            className={`relative p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                                    ? 'border-primary bg-primary/5 shadow-md'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-2 right-2">
                                                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                        <Check className="h-3 w-3" />
                                                    </div>
                                                </div>
                                            )}
                                            <div className={`${interest.color} w-10 h-10 rounded-lg flex items-center justify-center mb-3`}>
                                                <Icon className="h-5 w-5 text-white" />
                                            </div>
                                            <p className="font-semibold">{interest.name}</p>
                                        </button>
                                    )
                                })}
                            </div>
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(1)}>
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => setStep(3)}
                                disabled={!canProceed()}
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 3: Skill Level */}
                {step === 3 && (
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">What's your skill level?</CardTitle>
                            <CardDescription>
                                This helps us recommend the right paths for you
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {skillLevels.map((level) => (
                                <button
                                    key={level.id}
                                    onClick={() => setSelectedLevel(level.id)}
                                    className={`w-full p-4 rounded-lg border-2 transition-all text-left ${selectedLevel === level.id
                                            ? 'border-primary bg-primary/5 shadow-md'
                                            : 'border-border hover:border-primary/50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <p className="font-semibold text-lg mb-1">{level.name}</p>
                                            <p className="text-sm text-muted-foreground">{level.description}</p>
                                        </div>
                                        {selectedLevel === level.id && (
                                            <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                <Check className="h-4 w-4" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            ))}
                        </CardContent>
                        <CardFooter className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(2)}>
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={() => setStep(4)}
                                disabled={!canProceed()}
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </CardFooter>
                    </Card>
                )}

                {/* Step 4: Goals */}
                {step === 4 && (
                    <Card className="border-2">
                        <CardHeader>
                            <CardTitle className="text-2xl">What are your goals?</CardTitle>
                            <CardDescription>
                                Select what you want to achieve (choose at least one)
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {goals.map((goal) => {
                                const isSelected = selectedGoals.includes(goal.id)

                                return (
                                    <button
                                        key={goal.id}
                                        onClick={() => toggleGoal(goal.id)}
                                        className={`w-full p-4 rounded-lg border-2 transition-all text-left ${isSelected
                                                ? 'border-primary bg-primary/5 shadow-md'
                                                : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-lg mb-1">{goal.name}</p>
                                                <p className="text-sm text-muted-foreground">{goal.description}</p>
                                            </div>
                                            {isSelected && (
                                                <div className="bg-primary text-primary-foreground rounded-full p-1">
                                                    <Check className="h-4 w-4" />
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                )
                            })}
                        </CardContent>
                        <Separator className="my-6" />
                        <CardFooter className="flex gap-2">
                            <Button variant="outline" onClick={() => setStep(3)}>
                                <ChevronLeft className="h-4 w-4 mr-2" />
                                Back
                            </Button>
                            <Button
                                className="flex-1"
                                size="lg"
                                onClick={handleComplete}
                                disabled={!canProceed()}
                            >
                                <Check className="h-4 w-4 mr-2" />
                                Complete Setup
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </div>
    )
}
