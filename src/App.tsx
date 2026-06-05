import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import ProjectDetail from "@/pages/ProjectDetail";
import Orders from "@/pages/Orders";
import Checkin from "@/pages/Checkin";
import Announcements from "@/pages/admin/Announcements";
import Reviews from "@/pages/admin/Reviews";
import Reports from "@/pages/admin/Reports";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/project/:id" element={<ProjectDetail />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/checkin" element={<Checkin />} />
        <Route path="/admin/announcements" element={<Announcements />} />
        <Route path="/admin/reviews" element={<Reviews />} />
        <Route path="/admin/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}
