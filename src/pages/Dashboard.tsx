import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Calendar, Users, Clock } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useHalls } from "@/contexts/useHall"

export default function Dashboard() {
  const { halls } = useHalls()

  const stats = {
    totalHalls: halls.length,
    totalCapacity: halls.reduce((sum, hall) => sum + hall.capacity, 0),
    averageCapacity:
      halls.length > 0 ? Math.round(halls.reduce((sum, hall) => sum + hall.capacity, 0) / halls.length) : 0,
  }

  return (
    <div className="p-6 ">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
          <p className="text-slate-600">
            Welcome to the Hall Booking System. Manage your halls and bookings efficiently.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Halls</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalHalls}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalCapacity}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Capacity</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.averageCapacity}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-blue-600" />
                View Halls
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">Browse all available halls and their details</p>
              <Link to="/halls">
                <Button className="w-full">View All Halls</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-green-600" />
                Check Availability
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">Check if a hall is available for booking</p>
              <Link to="/availability">
                <Button className="w-full">Check Availability</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Building2 className="h-5 w-5 text-purple-600" />
                Create Hall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">Add a new hall to the system</p>
              <Link to="/create-hall">
                <Button className="w-full">Create New Hall</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-orange-600" />
                Book Hall
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600 mb-4">Make a new hall booking</p>
              <Link to="/book-hall">
                <Button className="w-full">Book a Hall</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Halls */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Halls</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {halls.slice(0, 5).map((hall) => (
                <div key={hall.hall_id} className="p-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <div className="font-semibold">
                    🏢 {hall.name} (ID: {hall.hall_id})
                  </div>
                  <div className="text-sm text-slate-600">
                    Capacity: {hall.capacity} | Location: {hall.location}
                  </div>
                  {hall.facilities && <div className="text-sm text-slate-500">Facilities: {hall.facilities}</div>}
                </div>
              ))}
            </div>
            {halls.length > 5 && (
              <div className="mt-4">
                <Link to="/halls">
                  <Button variant="outline" className="w-full bg-transparent">
                    View All {halls.length} Halls
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
