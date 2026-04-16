import { FaRegCalendarAlt } from "react-icons/fa";
import { MdOutlineDashboard } from "react-icons/md";
import { FaBed } from "react-icons/fa";
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineFeaturedPlayList } from "react-icons/md";
import { MdOutlinePerson } from "react-icons/md";
import { MdOutlinePeopleOutline } from "react-icons/md";


export const SIDE_MENU_DATA = [
  { id: "01", label: "Dashboard", icon: MdOutlineDashboard, path: "/dashboard" },
  { id: "02", label: "Bookings", icon: FaRegCalendarAlt, path: "/booking" },
  { id: "03", label: "Rooms", icon: FaBed, path: "/room" },
  { id: "04", label: "Categories", icon: MdOutlineCategory, path: "/category" },
  { id: "05", label: "Features", icon: MdOutlineFeaturedPlayList, path: "/feature" },
  { id: "06", label: "Guests", icon: MdOutlinePerson, path: "/guest" },
  { id: "07", label: "Staff", icon: MdOutlinePeopleOutline, path: "/staff" },
];

export const STATUS = {
  confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700",
  "in-progress": "bg-purple-50 text-purple-700",
  cancelled: "bg-red-50 text-red-600",
  completed: "bg-blue-50 text-blue-700",
};

export const bookings = [
  { id: "#1042", guest: "Adaeze Okonkwo", email: "adaeze@email.com", room: "Deluxe 101", checkIn: "Apr 15", checkOut: "Apr 18", total: "₦180,000", bookedBy: "Self", status: "confirmed" },
  { id: "#1041", guest: "Emeka Nwosu", email: "emeka@email.com", room: "Suite 201", checkIn: "Apr 17", checkOut: "Apr 20", total: "₦320,000", bookedBy: "Staff: Amara", status: "pending" },
  { id: "#1040", guest: "Fatima Bello", email: "fatima@email.com", room: "Standard 05", checkIn: "Apr 18", checkOut: "Apr 19", total: "₦55,000", bookedBy: "Self", status: "confirmed" },
  { id: "#1039", guest: "Chidi Okafor", email: "chidi@email.com", room: "Penthouse", checkIn: "Apr 20", checkOut: "Apr 25", total: "₦750,000", bookedBy: "Self", status: "pending" },
  { id: "#1038", guest: "Ngozi Eze", email: "ngozi@email.com", room: "Deluxe 102", checkIn: "Apr 22", checkOut: "Apr 24", total: "₦120,000", bookedBy: "Staff: Tunde", status: "confirmed" },
  { id: "#1037", guest: "Bola Akinwande", email: "bola@email.com", room: "Standard 02", checkIn: "Apr 10", checkOut: "Apr 12", total: "₦110,000", bookedBy: "Self", status: "completed" },
  { id: "#1036", guest: "Seun Badmus", email: "seun@email.com", room: "Suite 202", checkIn: "Apr 8", checkOut: "Apr 10", total: "₦200,000", bookedBy: "Self", status: "cancelled" },
];

export const rooms = [
  { name: "Standard Room 01", category: "Standard", price: "₦55,000", available: true },
  { name: "Standard Room 02", category: "Standard", price: "₦55,000", available: true },
  { name: "Deluxe Room 101", category: "Deluxe", price: "₦90,000", available: false },
  { name: "Deluxe Room 102", category: "Deluxe", price: "₦90,000", available: true },
  { name: "Suite 201", category: "Suite", price: "₦160,000", available: true },
  { name: "Suite 202", category: "Suite", price: "₦160,000", available: false },
  { name: "Penthouse", category: "Penthouse", price: "₦300,000", available: false },
];

export const categories = [
  { name: "Standard", desc: "Comfortable rooms for solo or couple stays", features: ["AC", "WiFi", "TV"], rooms: 4 },
  { name: "Deluxe", desc: "Spacious rooms with premium amenities", features: ["AC", "TV", "Balcony", "Minibar"], rooms: 4 },
  { name: "Suite", desc: "Luxury suites with separate living area", features: ["Jacuzzi", "Minibar", "Butler"], rooms: 2 },
  { name: "Penthouse", desc: "Exclusive top floor with panoramic views", features: ["Pool", "Butler", "Chef"], rooms: 1 },
];

export const features = [
  { name: "Wifi", desc: "Internet access in all rooms" },
  { name: "AC", desc: "Air conditioning in all rooms" },
  { name: "Balcony", desc: "Private balcony with select rooms" },
  { name: "Butler", desc: "Personal butler service for suites" },
  { name: "Chef", desc: "In-room dining by personal chef" },

];

export const staff = [
  { name: "Amara Obi", email: "amara@isinmi.com", role: "Admin", active: true, bookings: 24, joined: "Jan 2026" },
  { name: "Tunde Adeyemi", email: "tunde@isinmi.com", role: "Admin", active: true, bookings: 18, joined: "Feb 2026" },
  { name: "Chisom Uche", email: "chisom@isinmi.com", role: "Staff", active: false, bookings: 6, joined: "Mar 2026" },
];

export const guests = [
  { name: "Adaeze Okonkwo", email: "adaeze@email.com", bookings: 3, spent: "₦540,000", last: "Apr 15, 2026" },
  { name: "Emeka Nwosu", email: "emeka@email.com", bookings: 1, spent: "₦320,000", last: "Apr 17, 2026" },
  { name: "Fatima Bello", email: "fatima@email.com", bookings: 5, spent: "₦275,000", last: "Apr 18, 2026" },
  { name: "Chidi Okafor", email: "chidi@email.com", bookings: 2, spent: "₦1,050,000", last: "Apr 20, 2026" },
  { name: "Ngozi Eze", email: "ngozi@email.com", bookings: 4, spent: "₦480,000", last: "Apr 22, 2026" },
];

export const PAGE_TITLES = {
  dashboard: { title: "Dashboard", sub: "Welcome back — here's what's happening today" },
  bookings: { title: "Bookings", sub: "Manage all guest reservations" },
  rooms: { title: "Rooms", sub: "View and manage hotel rooms" },
  categories: { title: "Categories", sub: "Manage room categories and features" },
  features: { title: "Features", sub: "Manage room features and amenities" },
  guests: { title: "Guests", sub: "Guest records and booking history" },
  staff: { title: "Staff", sub: "Manage staff accounts and roles" },
};