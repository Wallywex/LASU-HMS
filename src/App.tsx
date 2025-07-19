import { Routes, Route } from "react-router-dom"
import { Navigation } from "./components/Navigation"
import { HallsProvider } from "@/contexts/HallContext"
import Dashboard from "./pages/Dashboard"
import HallsPage from "./pages/HallsPage"
import AvailabilityPage from "./pages/AvailabilityPage"
import CreateHallPage from "./pages/CreateHallPage"
import BookHallPage from "./pages/BookHallPage"

function App() {
  return (
    <HallsProvider>
      <div className="min-h-screen w-full bg-slate-50">
        <Navigation />
        <main >
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/halls" element={<HallsPage />} />
            <Route path="/availability" element={<AvailabilityPage />} />
            <Route path="/create-hall" element={<CreateHallPage />} />
            <Route path="/book-hall" element={<BookHallPage />} />
          </Routes>
        </main>
      </div>
    </HallsProvider>
  )
}

export default App
