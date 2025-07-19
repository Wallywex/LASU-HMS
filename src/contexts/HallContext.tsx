"use client"

import { Get } from "@/utils/https"
import { createContext, useState, useEffect, type ReactNode} from "react"

interface Hall {
  hall_id: number
  name: string
  capacity: number
  facilities: string
  location: string
}

interface HallsContextType {
  halls: Hall[]
  loading: boolean
  error: string | null
  fetchHalls: () => Promise<void>
  refreshHalls: () => Promise<void>
}

const HallsContext = createContext<HallsContextType>({
  halls: [],
  loading: false,
  error: null,
  fetchHalls: async () => {},
  refreshHalls: async () => {}
})

export { HallsContext }

export function HallsProvider({ children }: { children: ReactNode }) {
  const [halls, setHalls] = useState<Hall[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseURL = "http://localhost:8080"

  const fetchHalls = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await Get(`${baseURL}/halls`, setLoading)
      if (res.err) {
        throw new Error("Failed to fetch halls")
      }
      setHalls(res.data)
    } catch (error) {
      setError("Failed to fetch halls")
      console.error("Error fetching halls:", error)
    } finally {
      setLoading(false)
    }
  }

  const refreshHalls = async () => {
    await fetchHalls()
  }

  useEffect(() => {
    fetchHalls()
  }, [])

  const value: HallsContextType = {
    halls,
    loading,
    error,
    fetchHalls,
    refreshHalls,
  }

  return <HallsContext.Provider value={value}>{children}</HallsContext.Provider>
}


