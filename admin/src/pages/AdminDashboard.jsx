import { useState } from "react";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "▦" },
  { id: "bookings", label: "Bookings", icon: "📅" },
  { id: "rooms", label: "Rooms", icon: "🛏" },
  { id: "categories", label: "Categories", icon: "⊞" },
  { id: "guests", label: "Guests", icon: "👤" },
  { id: "staff", label: "Staff", icon: "👥" },
];

const STATUS = {
  confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-600",
  completed: "bg-blue-50 text-blue-700",
};

const bookings = [
  { id: "#1042", guest: "Adaeze Okonkwo", email: "adaeze@email.com", room: "Deluxe 101", checkIn: "Apr 15", checkOut: "Apr 18", total: "₦180,000", bookedBy: "Self", status: "confirmed" },
  { id: "#1041", guest: "Emeka Nwosu", email: "emeka@email.com", room: "Suite 201", checkIn: "Apr 17", checkOut: "Apr 20", total: "₦320,000", bookedBy: "Staff: Amara", status: "pending" },
  { id: "#1040", guest: "Fatima Bello", email: "fatima@email.com", room: "Standard 05", checkIn: "Apr 18", checkOut: "Apr 19", total: "₦55,000", bookedBy: "Self", status: "confirmed" },
  { id: "#1039", guest: "Chidi Okafor", email: "chidi@email.com", room: "Penthouse", checkIn: "Apr 20", checkOut: "Apr 25", total: "₦750,000", bookedBy: "Self", status: "pending" },
  { id: "#1038", guest: "Ngozi Eze", email: "ngozi@email.com", room: "Deluxe 102", checkIn: "Apr 22", checkOut: "Apr 24", total: "₦120,000", bookedBy: "Staff: Tunde", status: "confirmed" },
  { id: "#1037", guest: "Bola Akinwande", email: "bola@email.com", room: "Standard 02", checkIn: "Apr 10", checkOut: "Apr 12", total: "₦110,000", bookedBy: "Self", status: "completed" },
  { id: "#1036", guest: "Seun Badmus", email: "seun@email.com", room: "Suite 202", checkIn: "Apr 8", checkOut: "Apr 10", total: "₦200,000", bookedBy: "Self", status: "cancelled" },
];

const rooms = [
  { name: "Standard Room 01", category: "Standard", price: "₦55,000", available: true },
  { name: "Standard Room 02", category: "Standard", price: "₦55,000", available: true },
  { name: "Deluxe Room 101", category: "Deluxe", price: "₦90,000", available: false },
  { name: "Deluxe Room 102", category: "Deluxe", price: "₦90,000", available: true },
  { name: "Suite 201", category: "Suite", price: "₦160,000", available: true },
  { name: "Suite 202", category: "Suite", price: "₦160,000", available: false },
  { name: "Penthouse", category: "Penthouse", price: "₦300,000", available: false },
];

const categories = [
  { name: "Standard", desc: "Comfortable rooms for solo or couple stays", features: ["AC", "WiFi", "TV"], rooms: 4 },
  { name: "Deluxe", desc: "Spacious rooms with premium amenities", features: ["AC", "TV", "Balcony", "Minibar"], rooms: 4 },
  { name: "Suite", desc: "Luxury suites with separate living area", features: ["Jacuzzi", "Minibar", "Butler"], rooms: 2 },
  { name: "Penthouse", desc: "Exclusive top floor with panoramic views", features: ["Pool", "Butler", "Chef"], rooms: 1 },
];

const staff = [
  { name: "Amara Obi", email: "amara@isinmi.com", role: "Admin", active: true, bookings: 24, joined: "Jan 2026" },
  { name: "Tunde Adeyemi", email: "tunde@isinmi.com", role: "Admin", active: true, bookings: 18, joined: "Feb 2026" },
  { name: "Chisom Uche", email: "chisom@isinmi.com", role: "Staff", active: false, bookings: 6, joined: "Mar 2026" },
];

const guests = [
  { name: "Adaeze Okonkwo", email: "adaeze@email.com", bookings: 3, spent: "₦540,000", last: "Apr 15, 2026" },
  { name: "Emeka Nwosu", email: "emeka@email.com", bookings: 1, spent: "₦320,000", last: "Apr 17, 2026" },
  { name: "Fatima Bello", email: "fatima@email.com", bookings: 5, spent: "₦275,000", last: "Apr 18, 2026" },
  { name: "Chidi Okafor", email: "chidi@email.com", bookings: 2, spent: "₦1,050,000", last: "Apr 20, 2026" },
  { name: "Ngozi Eze", email: "ngozi@email.com", bookings: 4, spent: "₦480,000", last: "Apr 22, 2026" },
];

function Badge({ status }) {
  return (
    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS[status]}`}>
      {status}
    </span>
  );
}

function StatCard({ icon, label, value, change, changeType }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5">
      <div className="text-2xl mb-3">{icon}</div>
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-medium text-gray-900">{value}</p>
      {change && (
        <p className={`text-xs mt-1.5 ${changeType === "up" ? "text-emerald-600" : "text-red-500"}`}>
          {change}
        </p>
      )}
    </div>
  );
}

function DashboardPage({ setPage }) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon="📅" label="Total bookings (2026)" value="284" change="+18% vs last year" changeType="up" />
        <StatCard icon="💰" label="Revenue (2026)" value="₦14.2M" change="+22% vs last year" changeType="up" />
        <StatCard icon="🏨" label="Rooms available" value="8 / 12" change="4 occupied today" />
        <StatCard icon="⏳" label="Pending confirmations" value="6" change="Awaiting guest action" changeType="down" />
      </div>

      <div className="grid grid-cols-5 gap-4 mb-6">
        <div className="col-span-3 bg-white border border-gray-100 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-gray-800">Recent bookings</h3>
            <button onClick={() => setPage("bookings")} className="text-xs text-emerald-700 hover:underline">View all →</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-left">
                <th className="text-xs text-gray-400 uppercase tracking-wide pb-3 font-medium">Guest</th>
                <th className="text-xs text-gray-400 uppercase tracking-wide pb-3 font-medium">Room</th>
                <th className="text-xs text-gray-400 uppercase tracking-wide pb-3 font-medium">Check-in</th>
                <th className="text-xs text-gray-400 uppercase tracking-wide pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.slice(0, 5).map((b) => (
                <tr key={b.id} className="border-t border-gray-50">
                  <td className="py-2.5 text-sm text-gray-700">{b.guest}</td>
                  <td className="py-2.5 text-sm text-gray-500">{b.room}</td>
                  <td className="py-2.5 text-sm text-gray-500">{b.checkIn}</td>
                  <td className="py-2.5"><Badge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="col-span-2 bg-white border border-gray-100 rounded-xl p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4">Occupancy</h3>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-28 h-28">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12" />
                <circle cx="50" cy="50" r="40" fill="none" stroke="#059669" strokeWidth="12"
                  strokeDasharray="168 251" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-medium text-gray-900">67%</span>
                <span className="text-xs text-gray-400">occupied</span>
              </div>
            </div>
          </div>
          <div className="flex justify-around mt-2">
            <div className="text-center">
              <p className="text-xl font-medium text-gray-900">8</p>
              <p className="text-xs text-gray-400 mt-0.5">Available</p>
            </div>
            <div className="w-px bg-gray-100" />
            <div className="text-center">
              <p className="text-xl font-medium text-gray-900">4</p>
              <p className="text-xs text-gray-400 mt-0.5">Occupied</p>
            </div>
          </div>

          <div className="mt-5 border-t border-gray-50 pt-4">
            <h3 className="text-sm font-medium text-gray-800 mb-3">Bookings by category</h3>
            {[["Penthouse", 45], ["Suite", 70], ["Deluxe", 88], ["Standard", 60]].map(([cat, pct]) => (
              <div key={cat} className="flex items-center gap-2 mb-2">
                <span className="text-xs text-gray-400 w-16">{cat}</span>
                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-7 text-right">{pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-5">
        <h3 className="text-sm font-medium text-gray-800 mb-4">Today's check-ins & check-outs</h3>
        <div className="flex flex-col gap-2.5">
          {[
            { name: "Adaeze Okonkwo", room: "Deluxe 101 · 2 guests", type: "Check-in", status: "confirmed" },
            { name: "Tunde Adeyemi", room: "Suite 201 · 1 guest", type: "Check-out", status: "completed" },
            { name: "Kemi Lawal", room: "Standard 03 · 3 guests", type: "Check-in", status: "confirmed" },
          ].map((item) => (
            <div key={item.name} className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.room}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500">{item.type}</span>
                <Badge status={item.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BookingsPage() {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "confirmed", "pending", "cancelled", "completed"];
  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs capitalize border transition-all ${filter === f ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["#", "Guest", "Email", "Room", "Check-in", "Check-out", "Total", "Booked by", "Status"].map((h) => (
                <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-4 py-3 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => (
              <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-xs text-gray-400">{b.id}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.guest}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{b.email}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{b.room}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{b.checkIn}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{b.checkOut}</td>
                <td className="px-4 py-3 text-sm font-medium text-gray-800">{b.total}</td>
                <td className="px-4 py-3 text-xs text-gray-500">{b.bookedBy}</td>
                <td className="px-4 py-3"><Badge status={b.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RoomsPage() {
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? rooms : filter === "available" ? rooms.filter(r => r.available) : rooms.filter(r => !r.available);

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {["all", "available", "occupied"].map((f) => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs capitalize border transition-all ${filter === f ? "bg-emerald-700 text-white border-emerald-700" : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"}`}>
            {f}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.name} className="bg-white border border-gray-100 rounded-xl overflow-hidden hover:border-emerald-200 transition-colors">
            <div className="h-24 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-4xl">🛏</div>
            <div className="p-4">
              <p className="text-sm font-medium text-gray-800">{r.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{r.category}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-sm font-medium text-emerald-700">{r.price}<span className="text-xs text-gray-400 font-normal">/night</span></span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${r.available ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                  {r.available ? "Available" : "Occupied"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoriesPage() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-800">Room categories</h3>
        <button className="text-xs bg-emerald-700 text-white px-4 py-1.5 rounded-full">+ Add category</button>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {["Name", "Description", "Features", "Rooms", "Actions"].map(h => (
              <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-5 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {categories.map((c) => (
            <tr key={c.name} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{c.name}</td>
              <td className="px-5 py-3.5 text-xs text-gray-400 max-w-xs">{c.desc}</td>
              <td className="px-5 py-3.5">
                <div className="flex flex-wrap gap-1">
                  {c.features.map(f => (
                    <span key={f} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{f}</span>
                  ))}
                </div>
              </td>
              <td className="px-5 py-3.5 text-sm text-gray-600">{c.rooms}</td>
              <td className="px-5 py-3.5 text-xs text-emerald-700 cursor-pointer hover:underline">Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GuestsPage() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {["Guest name", "Email", "Total bookings", "Total spent", "Last stay"].map(h => (
              <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-5 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {guests.map((g) => (
            <tr key={g.name} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5 text-sm font-medium text-gray-800">{g.name}</td>
              <td className="px-5 py-3.5 text-xs text-gray-400">{g.email}</td>
              <td className="px-5 py-3.5 text-sm text-gray-600">{g.bookings}</td>
              <td className="px-5 py-3.5 text-sm font-medium text-emerald-700">{g.spent}</td>
              <td className="px-5 py-3.5 text-xs text-gray-400">{g.last}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StaffPage() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <h3 className="text-sm font-medium text-gray-800">Staff accounts</h3>
        <button className="text-xs bg-emerald-700 text-white px-4 py-1.5 rounded-full">+ Add staff</button>
      </div>
      <table className="w-full">
        <thead className="bg-gray-50 border-b border-gray-100">
          <tr>
            {["Name", "Email", "Role", "Status", "Bookings made", "Joined"].map(h => (
              <th key={h} className="text-left text-xs text-gray-400 uppercase tracking-wide px-5 py-3 font-medium">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {staff.map((s) => (
            <tr key={s.name} className="border-t border-gray-50 hover:bg-gray-50 transition-colors">
              <td className="px-5 py-3.5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">
                    {s.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <span className="text-sm font-medium text-gray-800">{s.name}</span>
                </div>
              </td>
              <td className="px-5 py-3.5 text-xs text-gray-400">{s.email}</td>
              <td className="px-5 py-3.5"><span className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full">{s.role}</span></td>
              <td className="px-5 py-3.5"><span className={`text-xs px-2.5 py-1 rounded-full ${s.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-500"}`}>{s.active ? "Active" : "Inactive"}</span></td>
              <td className="px-5 py-3.5 text-sm text-gray-600">{s.bookings}</td>
              <td className="px-5 py-3.5 text-xs text-gray-400">{s.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const PAGE_TITLES = {
  dashboard: { title: "Dashboard", sub: "Welcome back — here's what's happening today" },
  bookings: { title: "Bookings", sub: "Manage all guest reservations" },
  rooms: { title: "Rooms", sub: "View and manage hotel rooms" },
  categories: { title: "Categories", sub: "Manage room categories and features" },
  guests: { title: "Guests", sub: "Guest records and booking history" },
  staff: { title: "Staff", sub: "Manage staff accounts and roles" },
};

export default function AdminDashboard() {
  const [page, setPage] = useState("dashboard");

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col flex-shrink-0">
        <div className="px-5 py-5 border-b border-gray-100">
          <p className="text-base font-medium tracking-tight text-gray-900">Isinmi Hotel</p>
          <p className="text-xs text-gray-400 mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-5 mb-2">Overview</p>
          {NAV.slice(0, 1).map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-2 ${page === item.id ? "text-emerald-700 bg-emerald-50 border-emerald-600 font-medium" : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </button>
          ))}
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-5 mt-4 mb-2">Manage</p>
          {NAV.slice(1, 5).map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-2 ${page === item.id ? "text-emerald-700 bg-emerald-50 border-emerald-600 font-medium" : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </button>
          ))}
          <p className="text-[10px] text-gray-400 uppercase tracking-widest px-5 mt-4 mb-2">System</p>
          {NAV.slice(5).map((item) => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-2.5 px-5 py-2.5 text-sm transition-all border-l-2 ${page === item.id ? "text-emerald-700 bg-emerald-50 border-emerald-600 font-medium" : "text-gray-500 border-transparent hover:bg-gray-50 hover:text-gray-800"}`}>
              <span className="text-base">{item.icon}</span>{item.label}
            </button>
          ))}
        </nav>

        <div className="px-5 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-medium text-emerald-700">SA</div>
            <div>
              <p className="text-xs font-medium text-gray-800">Super Admin</p>
              <p className="text-[10px] text-gray-400">isinmihotel.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-100 px-7 h-14 flex items-center justify-between flex-shrink-0">
          <div>
            <p className="text-sm font-medium text-gray-900">{PAGE_TITLES[page].title}</p>
            <p className="text-xs text-gray-400">{PAGE_TITLES[page].sub}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium">2026</span>
            <span className="text-xs text-gray-400">April 13, 2026</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-7">
          {page === "dashboard" && <DashboardPage setPage={setPage} />}
          {page === "bookings" && <BookingsPage />}
          {page === "rooms" && <RoomsPage />}
          {page === "categories" && <CategoriesPage />}
          {page === "guests" && <GuestsPage />}
          {page === "staff" && <StaffPage />}
        </main>
      </div>
    </div>
  );
}
