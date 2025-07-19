"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Plus, CheckCircle, XCircle } from "lucide-react"
import { useHalls } from "@/contexts/useHall"
import { Post } from "@/utils/https"

export default function CreateHallPage() {
  const { refreshHalls } = useHalls()
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [loading, setLoading] = useState(false)

  const baseURL = "http://localhost:8080"

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const createHall = async (formData: FormData) => {
    const hallData = {
      name: formData.get("name") as string,
      capacity: Number.parseInt(formData.get("capacity") as string),
      facilities: formData.get("facilities") as string,
      location: formData.get("location") as string,
    }

    setLoading(true)
    try {
      const res = await Post(`${baseURL}/halls`, hallData, setLoading)

      if (!res.err) {
        showMessage("Hall created successfully!", "success")
        // Reset form
        const form = document.getElementById("create-hall-form") as HTMLFormElement
        form?.reset()
        // Refresh the global halls state
        await refreshHalls()
      } else {
        showMessage("Failed to create hall", "error")
      }
    } catch (error) {
      showMessage("Failed to create hall", "error")
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Plus className="h-8 w-8" />
            Create New Hall
          </h1>
          <p className="text-slate-600">Add a new hall to the booking system</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Hall Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="create-hall-form"
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                createHall(formData)
              }}
            >
              <div className="space-y-6">
                <div>
                  <Label htmlFor="hall-name">Hall Name *</Label>
                  <Input id="hall-name" name="name" placeholder="Enter hall name" required />
                </div>

                <div>
                  <Label htmlFor="hall-capacity">Capacity *</Label>
                  <Input
                    id="hall-capacity"
                    name="capacity"
                    type="number"
                    placeholder="Enter maximum capacity"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="hall-facilities">Facilities</Label>
                  <Input id="hall-facilities" name="facilities" placeholder="e.g., Projector, AC, WiFi" />
                </div>

                <div>
                  <Label htmlFor="hall-location">Location</Label>
                  <Input id="hall-location" name="location" placeholder="Enter hall location" />
                </div>

                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Hall"}
                </Button>
              </div>
            </form>

            {message && (
              <Alert className={`mt-6 ${message.type === "error" ? "border-red-500" : "border-green-500"}`}>
                {message.type === "success" ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-600" />
                )}
                <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
                  {message.text}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
 