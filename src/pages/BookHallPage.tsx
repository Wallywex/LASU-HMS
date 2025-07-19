"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, CheckCircle, XCircle, Building2 } from "lucide-react"
import { useHalls } from "@/contexts/useHall"

interface Booking {
  hall_id: number
  user_id: number
  start_time: string
  end_time: string
  purpose: string
}

export default function BookHallPage() {
  const { halls, loading: hallsLoading } = useHalls()
  const [selectedHallId, setSelectedHallId] = useState<string>("")
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const [loading, setLoading] = useState(false)

  const baseURL = "http://localhost:8080"

  const selectedHall = halls.find((hall) => hall.hall_id.toString() === selectedHallId)

  const showMessage = (text: string, type: "success" | "error") => {
    setMessage({ text, type })
    setTimeout(() => setMessage(null), 5000)
  }

  const bookHall = async (formData: FormData) => {
    if (!selectedHallId) {
      showMessage("Please select a hall", "error")
      return
    }

    const bookingData: Booking = {
      hall_id: Number.parseInt(selectedHallId),
      user_id: Number.parseInt(formData.get("user_id") as string),
      start_time: formData.get("start_time") as string,
      end_time: formData.get("end_time") as string,
      purpose: formData.get("purpose") as string,
    }

    setLoading(true)
    try {
      const res = await fetch(`${baseURL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      })

      if (res.ok) {
        showMessage(`Booking successful for ${selectedHall?.name}!`, "success")
        // Reset form
        const form = document.getElementById("booking-form") as HTMLFormElement
        form?.reset()
        setSelectedHallId("")
      } else {
        const msg = await res.text()
        showMessage(`Booking failed: ${msg}`, "error")
      }
    } catch (error) {
      console.log(error)
      showMessage("Booking failed", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Calendar className="h-8 w-8" />
            Book a Hall
          </h1>
          <p className="text-slate-600">Make a new hall booking</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="booking-form"
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                bookHall(formData)
              }}
            >
              <div className="space-y-6">
                <div>
                  <Label htmlFor="hall-select">Select Hall *</Label>
                  <Select value={selectedHallId} onValueChange={setSelectedHallId}>
                    <SelectTrigger>
                      <SelectValue placeholder={hallsLoading ? "Loading halls..." : "Choose a hall to book"} />
                    </SelectTrigger>
                    <SelectContent>
                      {halls.map((hall) => (
                        <SelectItem key={hall.hall_id} value={hall.hall_id.toString()}>
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" />
                            <span>
                              {hall.name} (ID: {hall.hall_id}) - Capacity: {hall.capacity}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedHall && (
                  <div className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <div className="font-semibold">Selected: {selectedHall.name}</div>
                    <div className="text-sm text-slate-600">
                      Capacity: {selectedHall.capacity} | Location: {selectedHall.location}
                    </div>
                    {selectedHall.facilities && (
                      <div className="text-sm text-slate-500">Facilities: {selectedHall.facilities}</div>
                    )}
                  </div>
                )}

                <div>
                  <Label htmlFor="booking-user-id">User ID *</Label>
                  <Input
                    id="booking-user-id"
                    name="user_id"
                    type="number"
                    placeholder="Enter User ID"
                    required
                    min="1"
                  />
                </div>

                <div>
                  <Label htmlFor="booking-start">Start Time *</Label>
                  <Input id="booking-start" name="start_time" type="datetime-local" required />
                </div>

                <div>
                  <Label htmlFor="booking-end">End Time *</Label>
                  <Input id="booking-end" name="end_time" type="datetime-local" required />
                </div>

                <div>
                  <Label htmlFor="booking-purpose">Purpose *</Label>
                  <Input id="booking-purpose" name="purpose" placeholder="Purpose of booking" required />
                </div>

                <Button type="submit" disabled={loading || !selectedHallId} className="w-full">
                  {loading ? "Booking..." : "Submit Booking"}
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
