"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Search, Calendar, Building2 } from "lucide-react"
import { useHalls } from "@/contexts/useHall"
import { Get } from "@/utils/https"

// Add this helper function after the imports and before the component
const formatDateTime = (dateTimeString: string) => {
  if (!dateTimeString) return "N/A"

  try {
    const date = new Date(dateTimeString)

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

export default function AvailabilityPage() {
  const { halls, loading: hallsLoading } = useHalls()
  const [selectedHallId, setSelectedHallId] = useState<string>("")
  const [availabilityResult, setAvailabilityResult] = useState<{ start_time: string; end_time: string; is_available: boolean } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseURL = "http://localhost:8080"

  const selectedHall = halls.find((hall) => hall.hall_id.toString() === selectedHallId)

  const checkAvailability = async () => {
    if (!selectedHallId) return

    setLoading(true)
    setError(null)
    try {
      const response = await Get(`${baseURL}/halls/${selectedHallId}/availability`, setLoading)
      if (response.err) {
        throw response.err
      }
      setAvailabilityResult(response.data)
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
                        {availabilityResult.available !== false ? "Available" : "Not Available"}
                      </span>
                    </div>
                  </div>

                  {/* Current Bookings */}
                  {availabilityResult.bookings && availabilityResult.bookings.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-slate-700 flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Current Bookings
                      </h4>
                      <div className="space-y-2">

                        {availabilityResult.bookings.map((booking: {
                          start_time: string
                          end_time: string
                          purpose?: string
                          user_id?: string
                        }, index: number) => (
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
                  {availabilityResult.bookings && availabilityResult.bookings.length === 0 && (
                    <div className="p-4 rounded-lg border-l-4 border-blue-500 bg-blue-50">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <span className="text-blue-800">No current bookings for this hall</span>
                      </div>
                    </div>
                  )}

                  {/* Additional Information */}
                  {availabilityResult.message && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{availabilityResult.message}</span>
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
