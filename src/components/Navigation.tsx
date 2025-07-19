import { Link, useLocation } from "react-router-dom"
import { Building2, Calendar, Plus, Search, Home } from "lucide-react"
import { cn } from "../lib/utils"

const navItems = [
  {
    href: "/",
    label: "Dashboard",
    icon: Home,
  },
  {
    href: "/halls",
    label: "View Halls",
    icon: Building2,
  },
  {
    href: "/availability",
    label: "Check Availability",
    icon: Search,
  },
  {
    href: "/create-hall",
    label: "Create Hall",
    icon: Plus,
  },
  {
    href: "/book-hall",
    label: "Book Hall",
    icon: Calendar,
  },
]

export function Navigation() {
  const location = useLocation()

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Building2 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-slate-800">Hall Booking System</span>
          </div>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.href

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive ? "bg-blue-100 text-blue-700" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
