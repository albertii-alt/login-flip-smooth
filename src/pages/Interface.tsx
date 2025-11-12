import { useEffect, useMemo, useState, useRef } from "react";
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
import '../styles/interface.css';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CurrentUser {
  name?: string;
  email?: string;
  role?: string;
  avatar?: string;
  loggedIn?: boolean;
}

type Room = {
  id: string;
  roomName: string;
  totalBeds: number;
  availableBeds: number;
  rentPrice: number;
  withCR?: boolean;
  gender?: string;
  cookingAllowed?: boolean;
  inclusions?: string[];
};

type Boardinghouse = {
  id: string;
  ownerEmail?: string;
  ownerName?: string;
  name: string;
  contact?: string;
  address?: string;
  description?: string;
  facebook?: string;
  photos?: string[];
  rooms?: Room[];
};

const Interface = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // read current user from localStorage (set by Auth.tsx)
  const raw = typeof window !== "undefined" ? localStorage.getItem("currentUser") : null;
  const parsed: CurrentUser | null = raw ? JSON.parse(raw) : null;

  const user: CurrentUser = {
    name: parsed?.name ?? "Guest",
    email: parsed?.email ?? "",
    role: (parsed?.role ?? "tenant").toString().toLowerCase(),
    avatar: parsed?.avatar ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(parsed?.name ?? "Guest")}`,
    loggedIn: parsed?.loggedIn ?? false,
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/auth");
  };

  const menuItems = [
    { icon: Home, label: "Home", onClick: () => navigate("/interface") },
    { icon: Info, label: "About", onClick: () => navigate("/about") },
    // Dashboard only visible for owners
    ...(user.role === "owner" ? [{ icon: LayoutDashboard, label: "Dashboard", onClick: () => navigate("/dashboard") }] : []),
    { icon: HelpCircle, label: "Help", onClick: () => {} },
    { icon: Shield, label: "Privacy & Policy", onClick: () => {} },
    { icon: Settings, label: "Settings", onClick: () => {} },
    { icon: LogOut, label: "Logout", onClick: handleLogout },
  ];

  // local state for boardinghouses loaded from localStorage
  const [boardinghouses, setBoardinghouses] = useState<Boardinghouse[]>([]);

  // filters / search
  const [searchQuery, setSearchQuery] = useState("");
  const [locationFilter, setLocationFilter] = useState<string | null>(null);
  const [availableFilter, setAvailableFilter] = useState<"all" | "hasAvailable" | "noAvailable">("all");

  // keep last serialized value to detect same-tab changes (storage event won't fire in same tab)
  const lastDataRef = useRef<string>("");

  const loadFromStorage = () => {
    try {
      const rawBH = localStorage.getItem("boardinghouses");
      if (!rawBH) {
        setBoardinghouses([]);
        lastDataRef.current = "[]";
        return;
      }
      // parse and normalize
      const parsedBH = JSON.parse(rawBH) as Boardinghouse[] | null;
      const arr = Array.isArray(parsedBH) ? parsedBH : [];
      setBoardinghouses(arr);
      lastDataRef.current = rawBH;
    } catch (err) {
      console.warn("Failed to parse boardinghouses from localStorage", err);
      setBoardinghouses([]);
      lastDataRef.current = "[]";
    }
  };

  useEffect(() => {
    loadFromStorage();

    // respond to storage events (other windows / tabs)
    const onStorage = (e: StorageEvent) => {
      if (e.key === "boardinghouses") {
        loadFromStorage();
      }
    };
    window.addEventListener("storage", onStorage);

    // simple same-tab polling to detect changes made elsewhere in app
    const interval = setInterval(() => {
      try {
        const rawBH = localStorage.getItem("boardinghouses") ?? "[]";
        if (rawBH !== lastDataRef.current) {
          loadFromStorage();
        }
      } catch {
        // ignore
      }
    }, 800);

    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(interval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // derive unique location options from loaded boardinghouses
  const locationOptions = useMemo(() => {
    const setLoc = new Set<string>();
    for (const bh of boardinghouses) {
      if (bh.address) {
        // try to extract a concise location (take part after comma if present)
        const parts = bh.address.split(",").map((p) => p.trim()).filter(Boolean);
        if (parts.length > 1) {
          setLoc.add(parts[parts.length - 1]);
        } else {
          setLoc.add(bh.address);
        }
      }
    }
    return Array.from(setLoc).sort();
  }, [boardinghouses]);

  // helper: does boardinghouse have any available beds?
  const hasAvailableRooms = (bh: Boardinghouse) => {
    if (!bh.rooms || bh.rooms.length === 0) return false;
    return bh.rooms.some((r) => Number(r.availableBeds) > 0);
  };

  // apply search + filters
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return boardinghouses.filter((bh) => {
      // search by name or address
      if (q) {
        const inName = bh.name?.toLowerCase().includes(q);
        const inAddress = bh.address?.toLowerCase().includes(q);
        if (!inName && !inAddress) return false;
      }
      // location filter
      if (locationFilter) {
        const parts = (bh.address ?? "").split(",").map((p) => p.trim());
        const lastPart = parts.length > 0 ? parts[parts.length - 1] : "";
        if (!lastPart.toLowerCase().includes(locationFilter.toLowerCase())) return false;
      }
      // available filter
      if (availableFilter === "hasAvailable" && !hasAvailableRooms(bh)) return false;
      if (availableFilter === "noAvailable" && hasAvailableRooms(bh)) return false;

      return true;
    });
  }, [boardinghouses, searchQuery, locationFilter, availableFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-cyan-500 to-blue-600 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo + small profile on left */}
            <div className="flex items-center gap-4">
              <div className="logo-icon">
                <img className="img-logo" src="/src/assets/HomebaseFinderOfficialLogo.png" alt="Homebase Finder Logo" />
              </div>
              <div className="logo-text">
                <div className="logo-title">HOMEBASE</div>
                <div className="logo-subtitle">FINDER</div>
              </div>
            </div>

            {/* Desktop Navigation + (no profile shown here) */}
            {/* Profile & logout are intentionally moved into the sidebar so owner and tenant see the same header. */}
            <div className="hidden md:flex items-center gap-8">
              <nav className="flex items-center gap-6">
                <a href="/interface" className="text-white font-semibold hover:text-cyan-100 transition-colors">
                  Home
                </a>
                <a href="/about" className="text-white font-semibold hover:text-cyan-100 transition-colors">
                  About
                </a>
              </nav>

              {/* For desktop we only show login/register when NOT logged in.
                  When logged in, user profile + logout are available in the sidebar (Sheet). */}
              {!user.loggedIn && (
                <div className="flex items-center gap-4">
                  <a href="/auth" className="text-white font-semibold hover:text-cyan-100 transition-colors">
                    Login
                  </a>
                  <a href="/auth" className="text-white font-semibold hover:text-cyan-100 transition-colors">
                    Register
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <div className="flex flex-col h-full">
                  {/* User Profile - use real currentUser data */}
                  <div className="flex flex-col items-center py-6 border-b">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full mb-3 bg-gradient-to-br from-cyan-400 to-blue-500 p-1"
                    />
                    <h3 className="text-xl font-bold text-foreground">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <p className="text-sm text-muted-foreground capitalize mt-1">{user.role}</p>
                  </div>

                  {/* Menu Items */}
                  <nav className="flex-1 py-6">
                    {menuItems.map((item, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          item.onClick();
                          setIsOpen(false);
                        }}
                        className="w-full flex items-center gap-4 px-6 py-4 text-foreground hover:bg-slate-100 transition-colors text-left"
                      >
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                        <span className="text-lg">{item.label}</span>
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
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-foreground">Filters</h2>
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

            <Button className="bg-gradient-to-r from-blue-900 to-cyan-600 hover:from-blue-800 hover:to-cyan-500 text-white font-semibold">
              Search
            </Button>
          </div>
        </div>

        {/* Properties Section */}
        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground mb-6">All Boardinghouses</h2>
          <div className="space-y-6">
            {filtered.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="grid md:grid-cols-2 gap-0">
                  <div className="aspect-video md:aspect-auto">
                    <img
                      src={property.photos?.[0] ?? "/placeholder.svg"}
                      alt={property.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-8 text-white flex flex-col justify-center">
                    <h3 className="text-3xl font-bold mb-4">
                      {property.name}
                    </h3>
                    <p className="text-white/90 mb-4 line-clamp-4">
                      {property.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-sm">{property.address}</span>
                    </div>
                    <div className="text-2xl font-bold mb-4">
                      ₱{property.rooms?.[0]?.rentPrice.toLocaleString()} / month
                    </div>
                    <Button
                      variant="outline"
                      className="bg-white/10 border-white/50 text-white hover:bg-white/20 hover:text-white"
                      onClick={() => navigate(`/boardinghouse/${property.id}`)}
                    >
                      View Details
                    </Button>
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
