"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, MapPin, Users, Wrench, RefreshCw } from "lucide-react"
import { useHalls } from "@/contexts/useHall"

export default function HallsPage() {
  const { halls, loading, error, refreshHalls } = useHalls()

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-2">
            <Building2 className="h-8 w-8" />
            All Halls
          </h1>
          <p className="text-slate-600">Browse all available halls in the system</p>
        </div>

        <div className="mb-6">
          <Button onClick={refreshHalls} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Loading..." : "Refresh Halls"}
          </Button>
        </div>

        {error && (
          <Alert className="mb-6 border-red-500">
            <AlertDescription className="text-red-700">{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {halls.map((hall) => (
            <Card key={hall.hall_id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  {hall.name}
                </CardTitle>
                <div className="text-sm text-slate-500">ID: {hall.hall_id}</div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">Capacity: {hall.capacity}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-slate-500" />
                    <span className="text-sm">{hall.location}</span>
                  </div>

                  {hall.facilities && (
                    <div className="flex items-start gap-2">
                      <Wrench className="h-4 w-4 text-slate-500 mt-0.5" />
                      <span className="text-sm">{hall.facilities}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {halls.length === 0 && !loading && (
          <div className="text-center py-12">
            <Building2 className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 mb-2">No halls found</h3>
            <p className="text-slate-500">There are no halls in the system yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}
