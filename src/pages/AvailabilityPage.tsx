import { useState } from "react"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Search, Calendar, Building2 } from "lucide-react"
import { useHalls } from "@/contexts/useHall"

// Add this helper function after the imports and before the component
const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return "N/A"

  try {
    let date: Date

    // Handle different date formats from your API
    if (dateTimeString.includes("-") && dateTimeString.includes(":")) {
      // Format: "2025-07-15 09:00:00" or "7-11-2025 14:00"
      let normalizedDate = dateTimeString

      // Convert "7-11-2025 14:00" to "2025-11-07 14:00:00"
      if (dateTimeString.match(/^\d{1,2}-\d{1,2}-\d{4}/)) {
        const parts = dateTimeString.split(" ")
        const datePart = parts[0]
        const timePart = parts[1] || "00:00"

        const [month, day, year] = datePart.split("-")
        normalizedDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart}`

        // Add seconds if not present
        if (!normalizedDate.includes(":00:00") && normalizedDate.split(":").length === 2) {
          normalizedDate += ":00"
        }
      }

      // Add seconds if not present for standard format
      if (!normalizedDate.includes(":00:00") && normalizedDate.split(":").length === 2) {
        normalizedDate += ":00"
      }

      date = new Date(normalizedDate)
    } else {
      date = new Date(dateTimeString)
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return dateTimeString // Return original if parsing fails
    }

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }

    return date.toLocaleDateString("en-US", options)
  } catch (error) {
    console.log(error)
    return dateTimeString // Return original if any error occurs
  }
}

const calculateDuration = (startTime: string, endTime: string) => {
  try {
    const start = new Date(
      startTime.includes("-") && startTime.includes(":")
        ? startTime.match(/^\d{1,2}-\d{1,2}-\d{4}/)
          ? (() => {
              const parts = startTime.split(" ")
              const datePart = parts[0]
              const timePart = parts[1] || "00:00"
              const [month, day, year] = datePart.split("-")
              return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart}:00`
            })()
          : startTime + (startTime.split(":").length === 2 ? ":00" : "")
        : startTime,
    )

    const end = new Date(
      endTime.includes("-") && endTime.includes(":")
        ? endTime.match(/^\d{1,2}-\d{1,2}-\d{4}/)
          ? (() => {
              const parts = endTime.split(" ")
              const datePart = parts[0]
              const timePart = parts[1] || "00:00"
              const [month, day, year] = datePart.split("-")
              return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")} ${timePart}:00`
            })()
          : endTime + (endTime.split(":").length === 2 ? ":00" : "")
        : endTime,
    )

    const diffMs = end.getTime() - start.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0 && diffMinutes > 0) {
      return `${diffHours}h ${diffMinutes}m`
    } else if (diffHours > 0) {
      return `${diffHours}h`
    } else if (diffMinutes > 0) {
      return `${diffMinutes}m`
    } else {
      return "0m"
    }
  } catch (error) {
    console.log(error)
    return "N/A"
  }
}

export default function AvailabilityPage() {
  const { halls, loading: hallsLoading } = useHalls()
  const [selectedHallId, setSelectedHallId] = useState<string>("")
  const [availabilityResult, setAvailabilityResult] = useState<{ start_time: string; end_time: string; }[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseURL = "http://localhost:8080"

  const selectedHall = halls.find((hall) => hall.hall_id.toString() === selectedHallId)

  const checkAvailability = async () => {
    if (!selectedHallId) return

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${baseURL}/halls/${selectedHallId}/availability`)
      const data = await res.json()
      setAvailabilityResult(data)
    } catch (error) {
      console.log(error)
      setError("Failed to check availability")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Search className="h-8 w-8" />
            Check Hall Availability
          </h1>
          <p className="text-slate-600">Check if a hall is available for booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Select Hall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="hall-select">Choose a Hall</Label>
                  <Select value={selectedHallId} onValueChange={setSelectedHallId}>
                    <SelectTrigger>
                      <SelectValue placeholder={hallsLoading ? "Loading halls..." : "Select a hall"} />
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
                    <div className="font-semibold">{selectedHall.name}</div>
                    <div className="text-sm text-slate-600">
                      Capacity: {selectedHall.capacity} | Location: {selectedHall.location}
                    </div>
                    {selectedHall.facilities && (
                      <div className="text-sm text-slate-500">Facilities: {selectedHall.facilities}</div>
                    )}
                  </div>
                )}

                <Button onClick={checkAvailability} disabled={loading || !selectedHallId} className="w-full">
                  {loading ? "Checking..." : "Check Availability"}
                </Button>
              </div>

              {error && (
                <Alert className="mt-4 border-red-500">
                  <AlertDescription className="text-red-700">{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Availability Result</CardTitle>
            </CardHeader>
            <CardContent>
              {availabilityResult ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold">Results for {selectedHall?.name}</h3>
                  </div>

                  {/* Availability Status */}
                  <div className="p-4 rounded-lg border-l-4 border-green-500 bg-green-50">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-green-800">
                        {Array.isArray(availabilityResult) && availabilityResult.length > 0
                          ? `${availabilityResult.length} Booking${availabilityResult.length > 1 ? "s" : ""} Found`
                          : "No Current Bookings"}
                      </span>
                    </div>
                  </div>

                  {/* Handle Array Response */}
                  {Array.isArray(availabilityResult) && availabilityResult.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Scheduled Bookings ({availabilityResult.length})
                      </h4>
                      <div className="space-y-3">
                        {availabilityResult.map((booking: { start_time: string; end_time: string; purpose?: string; user_id?: string }, index: number) => (
                          <div
                            key={index}
                            className="p-4 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                <span className="font-medium text-slate-800">Booking #{index + 1}</span>
                              </div>
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {calculateDuration(booking.start_time, booking.end_time)}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded bg-green-100 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      Start Time
                                    </span>
                                    <div className="text-sm font-medium text-slate-800">
                                      {formatDateTime(booking.start_time)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-4 h-4 rounded bg-red-100 flex items-center justify-center">
                                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                  </div>
                                  <div>
                                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                      End Time
                                    </span>
                                    <div className="text-sm font-medium text-slate-800">
                                      {formatDateTime(booking.end_time)}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {booking.purpose && (
                              <div className="mt-3 pt-3 border-t border-slate-100">
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                  Purpose
                                </span>
                                <div className="text-sm text-slate-700 mt-1">{booking.purpose}</div>
                              </div>
                            )}

                            {booking.user_id && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
                                  User ID
                                </span>
                                <div className="text-sm text-slate-700 mt-1">{booking.user_id}</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Handle Object Response with bookings array */}
                  {!Array.isArray(availabilityResult) &&
                    typeof availabilityResult === 'object' &&
                    availabilityResult !== null &&
                    'bookings' in availabilityResult &&
                    Array.isArray((availabilityResult as { bookings: Array<{ start_time: string; end_time: string; purpose?: string; user_id?: string }> }).bookings) &&
                    (availabilityResult as { bookings: Array<{ start_time: string; end_time: string; purpose?: string; user_id?: string }> }).bookings.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Current Bookings
                        </h4>
                        <div className="space-y-2">
                          {(availabilityResult as { bookings: Array<{ start_time: string; end_time: string; purpose?: string; user_id?: string }> }).bookings.map((booking, index) => (
                            <div key={index} className="p-3 bg-slate-50 rounded-lg border">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                <div>
                                  <span className="font-medium text-slate-600">Start:</span>
                                  <span className="ml-2 text-slate-800">{formatDateTime(booking.start_time)}</span>
                                </div>
                                <div>
                                  <span className="font-medium text-slate-600">End:</span>
                                  <span className="ml-2 text-slate-800">{formatDateTime(booking.end_time)}</span>
                                </div>
                                {booking.purpose && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium text-slate-600">Purpose:</span>
                                    <span className="ml-2 text-slate-800">{booking.purpose}</span>
                                  </div>
                                )}
                                {booking.user_id && (
                                  <div>
                                    <span className="font-medium text-slate-600">User ID:</span>
                                    <span className="ml-2 text-slate-800">{booking.user_id}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* No Bookings Message */}
                  {((Array.isArray(availabilityResult) && availabilityResult.length === 0) ||
                    (!Array.isArray(availabilityResult) &&
                      typeof availabilityResult === 'object' &&
                      availabilityResult !== null &&
                      'bookings' in availabilityResult &&
                      Array.isArray((availabilityResult as { bookings: Array<{ start_time: string; end_time: string; purpose?: string; user_id?: string }> }).bookings) &&
                      (availabilityResult as { bookings: Array<{ start_time: string; end_time: string; purpose?: string; user_id?: string }> }).bookings.length === 0)) && (
                    <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-800">
                          No current bookings for this hall - Available for booking!
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  {!Array.isArray(availabilityResult) &&
                    typeof availabilityResult === 'object' &&
                    availabilityResult !== null &&
                    'message' in availabilityResult && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{(availabilityResult as { message: string }).message}</span>
                    </div>
                  )}

                  {/* Summary Card */}
                  {Array.isArray(availabilityResult) && availabilityResult.length > 0 && (
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                      <h5 className="font-medium text-blue-900 mb-2">Booking Summary</h5>
                      <div className="text-sm text-blue-800">
                        <p>• Total bookings: {availabilityResult.length}</p>
                        <p>• Hall: {selectedHall?.name}</p>
                        <p>• Capacity: {selectedHall?.capacity} people</p>
                      </div>
                    </div>
                  )}

                  {/* Raw Data Toggle (for debugging) */}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-700">
                      View Raw Data
                    </summary>
                    <pre className="mt-2 p-3 bg-slate-100 rounded text-xs overflow-auto max-h-32 text-slate-600">
                      {JSON.stringify(availabilityResult, null, 2)}
                    </pre>
                  </details>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                  <p>Select a hall and click "Check Availability" to see results</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
