import { useContext } from "react"
import { HallsContext } from "./HallContext"

export function useHalls() {
      const context = useContext(HallsContext)
      if (context === undefined) {
        throw new Error("useHalls must be used within a HallsProvider")
      }
      return context
    }