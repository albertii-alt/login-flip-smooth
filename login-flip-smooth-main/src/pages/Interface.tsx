import { useState } from "react";
import { Menu, Home, Info, LayoutDashboard, HelpCircle, Shield, Settings, LogOut } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import "../styles/interface.css";

interface PropertyCard {
  id: number;
  title: string;
  description: string;
  location: string;
  price: string;
  image: string;
}

const Interface = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  
  // Mock user data - in real app, get from auth context
  const user = {
    name: "John Doe",
    role: "owner", // or "tenant"
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John"
  };

  const properties: PropertyCard[] = [
    {
      id: 1,
      title: "THE URBAN NEST",
      description: "A boardinghouse is a private house where people rent rooms for longer periods, often sharing common areas like a kitchen and living room, and typically receive meals in addition to lodging. These houses provide more of a communal...",
      location: "Trinidad, Bohol",
      price: "₱1,000/month",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "THE URBAN NEST",
      description: "A boardinghouse is a private house where people rent rooms for longer periods, often sharing common areas like a kitchen and living room, and typically receive meals in addition to lodging. These houses provide more of a communal...",
      location: "Trinidad, Bohol",
      price: "₱1,000/month",
      image: "/placeholder.svg"
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const menuItems = [
    { icon: Home, label: "Home", onClick: () => navigate("/interface") },
    { icon: Info, label: "About", onClick: () => navigate("/about") },
    ...(user.role === "owner" ? [{ icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate("/dashboard") }] : []),
    { icon: HelpCircle, label: "Help", onClick: () => {} },
    { icon: Shield, label: "Privacy & Policy", onClick: () => {} },
    { icon: Settings, label: "Settings", onClick: () => {} },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 interface-container">
      {/* Header */}
      <header className="interface-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="logo-container">
              <div className="logo-icon">
                <span>H</span>
                <span>H</span>
                <span>H</span>
              </div>
              <div className="logo-text">
                <div>HOMEBASE</div>
                <div>FINDER</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="/interface" className="nav-link">
                Home
              </a>
              <a href="/about" className="nav-link">
                About
              </a>
              <a href="/auth" className="nav-link">
                Login
              </a>
              <a href="/auth" className="nav-link">
                Register
              </a>
            </nav>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  {/* User Profile */}
                  <div className="sidebar-profile">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="sidebar-avatar"
                    />
                    <h3 className="sidebar-name">{user.name}</h3>
                    <p className="sidebar-role">{user.role}</p>
                  </div>

                  {/* Menu Items */}
                  <nav className="sidebar-menu">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setIsOpen(false);
                        }}
                        className="sidebar-menu-item"
                      >
                        <item.icon />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Filters Section */}
        <div className="filters-section">
          <h2 className="filters-title">Filters</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="trinidad">Trinidad, Bohol</SelectItem>
                <SelectItem value="tagbilaran">Tagbilaran City</SelectItem>
                <SelectItem value="ubay">Ubay</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">₱500 - ₱1,000</SelectItem>
                <SelectItem value="mid">₱1,000 - ₱2,000</SelectItem>
                <SelectItem value="high">₱2,000+</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger className="bg-slate-50">
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="any">Any</SelectItem>
              </SelectContent>
            </Select>

            <Button className="search-btn">
              Search
            </Button>
          </div>
        </div>

        {/* Properties Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">All Boardinghouses</h2>
          <div className="space-y-6">
            {properties.map((property) => (
              <div key={property.id} className="property-card">
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto">
                    <img
                      src={property.image}
                      alt={property.title}
                      className="property-image"
                    />
                  </div>
                  <div className="property-info">
                    <h3 className="property-title">
                      THE URBAN <span className="property-title-highlight">NEST</span>
                    </h3>
                    <p className="property-description">
                      {property.description}
                    </p>
                    <div className="property-location">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{property.location}</span>
                    </div>
                    <div className="property-price">{property.price}</div>
                    <button className="view-more-btn">
                      View More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Interface;
