import { ArrowLeft, MapPin, User, BedDouble, Utensils, Wifi, Zap, Droplets, Fan } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "../styles/boardinghouse.css";
import React from "react";

type Room = {
  id?: string;
  number?: string;
  roomName?: string;
  totalBeds?: number;
  availableBeds?: number;
  beds?: number;
  gender?: string;
  withCR?: boolean;
  cooking?: boolean;
  cookingAllowed?: boolean;
  price?: string;
  rentPrice?: string | number;
  status?: string;
  inclusions?: string[];
};

type Boardinghouse = {
  id: string;
  name?: string;
  location?: string;
  address?: string;
  description?: string;
  photos?: string[];
  owner?: {
    name?: string;
    contact?: string;
    email?: string;
  };
  ownerName?: string;
  contact?: string;
  facebook?: string;
  totalRooms?: number;
  availableRooms?: number;
  rooms?: Room[];
  structuredAddress?: {
    street?: string;
    barangay_name?: string;
    barangay?: string;
    city_name?: string;
    city?: string;
    province_name?: string;
    province?: string;
    region_name?: string;
    region?: string;
    [k: string]: any;
  };
};

export default function BoardinghouseDetails() {
  const { id } = useParams<{ id: string }>();

  const [boardinghouse, setBoardinghouse] = React.useState<Boardinghouse | null | undefined>(undefined);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem("boardinghouses");
      if (!raw) {
        setBoardinghouse(null);
        return;
      }
      const list = JSON.parse(raw) as Boardinghouse[] | null;
      if (!Array.isArray(list)) {
        setBoardinghouse(null);
        return;
      }
      const found = list.find((b) => String(b.id) === String(id));
      setBoardinghouse(found ?? null);
    } catch (err) {
      console.warn("Failed to load boardinghouses from localStorage", err);
      setBoardinghouse(null);
    }
  }, [id]);

  // When boardinghouse is undefined => loading; null => not found; object => render
  if (boardinghouse === undefined) {
    return (
      <div className="min-h-screen" style={{ background: "#e6f7fa" }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/interface" className="back-button">
              <ArrowLeft />
            </Link>
            <h1 className="text-4xl font-bold" style={{ color: "#1a1a1a" }}>
              Boardinghouse Details
            </h1>
          </div>
          <div className="form-container">
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (boardinghouse === null) {
    return (
      <div className="min-h-screen" style={{ background: "#e6f7fa" }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Link to="/interface" className="back-button">
              <ArrowLeft />
            </Link>
            <h1 className="text-4xl font-bold" style={{ color: "#1a1a1a" }}>
              Boardinghouse Details
            </h1>
          </div>
          <div className="form-container">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold mb-2">Boardinghouse not found</h2>
              <p className="text-sm text-muted-foreground">The listing you are looking for does not exist or was removed.</p>
              <div className="mt-6">
                <Link to="/interface" className="btn-save-listing">
                  Back to All Boardinghouses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // boardinghouse is guaranteed to be non-null here
  const sa = boardinghouse.structuredAddress ?? null;

  // upper address: street, barangay, city/municipality, province
  const upperAddressParts: string[] = [];
  if (sa) {
    if (sa.street) upperAddressParts.push(sa.street);
    if (sa.barangay_name ?? sa.barangay) upperAddressParts.push((sa.barangay_name ?? sa.barangay) as string);
    if (sa.city_name ?? sa.city) upperAddressParts.push((sa.city_name ?? sa.city) as string);
    if (sa.province_name ?? sa.province) upperAddressParts.push((sa.province_name ?? sa.province) as string);
  } else if (boardinghouse.address) {
    // best-effort fallback: use the full address string as upper line if structuredAddress absent
    upperAddressParts.push(boardinghouse.address);
  }
  const upperAddress = upperAddressParts.filter(Boolean).join(", ");

  // sub address: region only
  const regionOnly = sa?.region_name ?? sa?.region ?? "";

  // owner info: prefer ownerName/contact/facebook fields saved on boardinghouse (Edit/Add use ownerName/contact/facebook)
  const ownerName = boardinghouse.ownerName ?? boardinghouse.owner?.name ?? "—";
  const ownerContact = boardinghouse.contact ?? boardinghouse.owner?.contact ?? "—";
  // per request: show facebook (owner's facebook URL/account) in place of email in details
  const ownerEmailOrFacebook = boardinghouse.facebook ?? boardinghouse.owner?.email ?? "—";

  return (
    <div className="min-h-screen" style={{ background: "#e6f7fa" }}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button and Title */}
        <div className="flex items-center gap-4 mb-8">
          <Link to="/interface" className="back-button">
            <ArrowLeft />
          </Link>
          <h1 className="text-4xl font-bold" style={{ color: "#1a1a1a" }}>
            Boardinghouse Details
          </h1>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          {/* Basic Information Card */}
          <div className="form-container">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-3xl font-bold mb-2" style={{ color: "#00a8cc" }}>
                  {boardinghouse.name}
                </h2>
                <div className="flex items-center gap-2 text-lg" style={{ color: "#666" }}>
                  <MapPin size={20} />
                  <span>{upperAddress || "Location not specified"}</span>
                </div>
                <p className="text-sm mt-1" style={{ color: "#666" }}>
                  {regionOnly}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm" style={{ color: "#666" }}>Total Rooms</div>
                <div className="text-3xl font-bold" style={{ color: "#00a8cc" }}>
                  {boardinghouse.totalRooms ?? (boardinghouse.rooms?.length ?? 0)}
                </div>
                <div className="text-sm mt-1" style={{ color: "#666" }}>
                  {boardinghouse.availableRooms ?? boardinghouse.rooms?.filter(r => Number((r.availableBeds ?? r.beds ?? 0)) > 0).length ?? 0} Available
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2" style={{ color: "#1a1a1a" }}>
                Description
              </h3>
              <p className="text-base leading-relaxed" style={{ color: "#666" }}>
                {boardinghouse.description}
              </p>
            </div>

            {/* Owner Information */}
            <div className="p-6 rounded-xl mb-6" style={{ background: "#f0f9fb", border: "2px solid #00d4ff" }}>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2" style={{ color: "#1a1a1a" }}>
                <User size={20} />
                Owner Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <div className="text-sm" style={{ color: "#666" }}>Name</div>
                  <div className="font-semibold" style={{ color: "#1a1a1a" }}>
                    {ownerName}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: "#666" }}>Contact</div>
                  <div className="font-semibold" style={{ color: "#1a1a1a" }}>
                    {ownerContact}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: "#666" }}>Email / Facebook</div>
                  <div className="font-semibold">
                    {typeof ownerEmailOrFacebook === "string" && ownerEmailOrFacebook.startsWith("http") ? (
                      <a href={ownerEmailOrFacebook} target="_blank" rel="noreferrer" style={{ color: "#1a1a1a" }}>
                        {ownerEmailOrFacebook}
                      </a>
                    ) : (
                      <span style={{ color: "#1a1a1a" }}>{ownerEmailOrFacebook}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Photos Section */}
          <div className="form-container">
            <h3 className="text-xl font-bold mb-4" style={{ color: "#1a1a1a" }}>
              Photos
            </h3>
            <div className="photo-grid">
              {(boardinghouse.photos && boardinghouse.photos.length > 0) ? (
                boardinghouse.photos.map((photo, index) => (
                  <div key={index} className="photo-item">
                    <img src={photo} alt={`Photo ${index + 1}`} />
                  </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No photos available.</div>
              )}
            </div>
          </div>

          {/* Rooms Section */}
          <div className="form-container">
            <h3 className="text-xl font-bold mb-6" style={{ color: "#1a1a1a" }}>
              Available Rooms
            </h3>
            <div className="space-y-4">
              {(boardinghouse.rooms && boardinghouse.rooms.length > 0) ? (
                boardinghouse.rooms.map((room, index) => {
                  const roomName = (room.roomName ?? room.number ?? room.id ?? `Room ${index + 1}`) as string;
                  const totalBeds = (room.totalBeds ?? room.beds ?? 0) as number;
                  const availableBeds = (room.availableBeds ?? room.beds ?? 0) as number;
                  const price = (room.rentPrice ?? room.price ?? "") as string | number | undefined;
                  const withCR = room.withCR ?? false;
                  const cooking = room.cookingAllowed ?? room.cooking ?? false;
                  const gender = room.gender ?? "Any";
                  const inclusions = room.inclusions ?? [];

                  return (
                    <div
                      key={room.id ?? index}
                      className="p-6 rounded-xl"
                      style={{
                        border: "2px solid #00d4ff",
                        background: (room.status === "Available" || Number(availableBeds) > 0) ? "#f0f9fb" : "#f5f5f5"
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex-1 min-w-[200px]">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                              {roomName}
                            </h4>
                            <span
                              className="px-3 py-1 rounded-full text-xs font-semibold"
                              style={{
                                background: (room.status === "Available" || Number(availableBeds) > 0) ? "#00d4ff" : "#999",
                                color: "white"
                              }}
                            >
                              {room.status ?? ((Number(availableBeds) > 0) ? "Available" : "Occupied")}
                            </span>
                          </div>
                          <div className="text-2xl font-bold mb-3" style={{ color: "#4a148c" }}>
                            {price ? (typeof price === "number" ? `₱${price}` : price) : ""}
                          </div>
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="flex items-center gap-2" style={{ color: "#666" }}>
                              <BedDouble size={16} />
                              <span>{totalBeds} Bed(s) • {availableBeds} available</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: "#666" }}>
                              <User size={16} />
                              <span>{gender}</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: "#666" }}>
                              <span className="font-semibold">CR:</span>
                              <span>{withCR ? "Yes" : "No"}</span>
                            </div>
                            <div className="flex items-center gap-2" style={{ color: "#666" }}>
                              <Utensils size={16} />
                              <span>{cooking ? "Cooking Allowed" : "No Cooking"}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex-1 min-w-[200px]">
                          <div className="text-sm font-semibold mb-2" style={{ color: "#1a1a1a" }}>
                            Inclusions:
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {(inclusions && inclusions.length > 0) ? (
                              inclusions.map((inclusion, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 px-3 py-1 rounded-full text-xs"
                                  style={{ background: "#00d4ff", color: "white" }}
                                >
                                  {inclusion === "WiFi" && <Wifi size={12} />}
                                  {inclusion === "Electricity" && <Zap size={12} />}
                                  {inclusion === "Water" && <Droplets size={12} />}
                                  {inclusion === "Fan" && <Fan size={12} />}
                                  {inclusion === "Air Conditioning" && <Fan size={12} />}
                                  <span>{inclusion}</span>
                                </div>
                              ))
                            ) : (
                              <div className="text-sm text-muted-foreground">No inclusions listed.</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-sm text-muted-foreground">No rooms listed.</div>
              )}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-container text-center">
              <div className="text-4xl mb-2">🛏️</div>
              <div className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                {(boardinghouse.rooms ?? []).filter(r => r.withCR).length}
              </div>
              <div className="text-sm" style={{ color: "#666" }}>Rooms with CR</div>
            </div>
            <div className="form-container text-center">
              <div className="text-4xl mb-2">🍳</div>
              <div className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                {(boardinghouse.rooms ?? []).filter(r => (r.cookingAllowed ?? r.cooking)).length}
              </div>
              <div className="text-sm" style={{ color: "#666" }}>Cooking Allowed</div>
            </div>
            <div className="form-container text-center">
              <div className="text-4xl mb-2">🚪</div>
              <div className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                {boardinghouse.availableRooms ?? (boardinghouse.rooms ?? []).filter(r => Number((r.availableBeds ?? r.beds ?? 0)) > 0).length}
              </div>
              <div className="text-sm" style={{ color: "#666" }}>Available Now</div>
            </div>
          </div>

          {/* Back Button */}
          <div className="flex justify-center pb-8">
            <Link to="/interface" className="btn-save-listing">
              Back to All Boardinghouses
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
