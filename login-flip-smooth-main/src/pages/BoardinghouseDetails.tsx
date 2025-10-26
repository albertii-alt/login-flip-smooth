import { ArrowLeft, MapPin, User, BedDouble, Utensils, Wifi, Zap, Droplets, Fan } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "../styles/boardinghouse.css";

export default function BoardinghouseDetails() {
  const { id } = useParams();

  // Mock data - in real app, fetch based on id
  const boardinghouse = {
    name: "THE URBAN NEST",
    location: "Trinidad, Bohol",
    address: "123 Main Street, Trinidad, Bohol, Philippines",
    description: "A boardinghouse is a private house where people rent rooms for longer periods, often sharing common areas like a kitchen and living room, and typically receive meals in addition to lodging. These houses provide more of a communal living environment than a hotel or apartment, where residents typically have their own separate units. Boardinghouses are usually used for long-term stays and can cater to students, workers, or travelers seeking affordable accommodations.",
    photos: [
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
      "/placeholder.svg",
    ],
    owner: {
      name: "John Doe",
      contact: "+63 912 345 6789",
      email: "johndoe@example.com"
    },
    totalRooms: 5,
    availableRooms: 3,
    rooms: [
      {
        number: "101",
        beds: 2,
        gender: "Male",
        withCR: true,
        cooking: true,
        price: "₱1,000/month",
        status: "Available",
        inclusions: ["WiFi", "Electricity", "Water", "Fan"]
      },
      {
        number: "102",
        beds: 1,
        gender: "Female",
        withCR: true,
        cooking: false,
        price: "₱1,200/month",
        status: "Occupied",
        inclusions: ["WiFi", "Electricity", "Water", "Air Conditioning"]
      },
      {
        number: "103",
        beds: 2,
        gender: "Male",
        withCR: false,
        cooking: true,
        price: "₱800/month",
        status: "Available",
        inclusions: ["WiFi", "Electricity", "Water"]
      },
      {
        number: "201",
        beds: 3,
        gender: "Any",
        withCR: true,
        cooking: true,
        price: "₱1,500/month",
        status: "Available",
        inclusions: ["WiFi", "Electricity", "Water", "Fan", "Study Table"]
      },
      {
        number: "202",
        beds: 2,
        gender: "Female",
        withCR: true,
        cooking: false,
        price: "₱1,300/month",
        status: "Occupied",
        inclusions: ["WiFi", "Electricity", "Water", "Air Conditioning"]
      },
    ]
  };

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
                  <span>{boardinghouse.location}</span>
                </div>
                <p className="text-sm mt-1" style={{ color: "#666" }}>
                  {boardinghouse.address}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm" style={{ color: "#666" }}>Total Rooms</div>
                <div className="text-3xl font-bold" style={{ color: "#00a8cc" }}>
                  {boardinghouse.totalRooms}
                </div>
                <div className="text-sm mt-1" style={{ color: "#666" }}>
                  {boardinghouse.availableRooms} Available
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
                    {boardinghouse.owner.name}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: "#666" }}>Contact</div>
                  <div className="font-semibold" style={{ color: "#1a1a1a" }}>
                    {boardinghouse.owner.contact}
                  </div>
                </div>
                <div>
                  <div className="text-sm" style={{ color: "#666" }}>Email</div>
                  <div className="font-semibold" style={{ color: "#1a1a1a" }}>
                    {boardinghouse.owner.email}
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
              {boardinghouse.photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Photo ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Rooms Section */}
          <div className="form-container">
            <h3 className="text-xl font-bold mb-6" style={{ color: "#1a1a1a" }}>
              Available Rooms
            </h3>
            <div className="space-y-4">
              {boardinghouse.rooms.map((room, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl"
                  style={{
                    border: "2px solid #00d4ff",
                    background: room.status === "Available" ? "#f0f9fb" : "#f5f5f5"
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                          Room {room.number}
                        </h4>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: room.status === "Available" ? "#00d4ff" : "#999",
                            color: "white"
                          }}
                        >
                          {room.status}
                        </span>
                      </div>
                      <div className="text-2xl font-bold mb-3" style={{ color: "#4a148c" }}>
                        {room.price}
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="flex items-center gap-2" style={{ color: "#666" }}>
                          <BedDouble size={16} />
                          <span>{room.beds} Bed(s)</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: "#666" }}>
                          <User size={16} />
                          <span>{room.gender}</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: "#666" }}>
                          <span className="font-semibold">CR:</span>
                          <span>{room.withCR ? "Yes" : "No"}</span>
                        </div>
                        <div className="flex items-center gap-2" style={{ color: "#666" }}>
                          <Utensils size={16} />
                          <span>{room.cooking ? "Cooking Allowed" : "No Cooking"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px]">
                      <div className="text-sm font-semibold mb-2" style={{ color: "#1a1a1a" }}>
                        Inclusions:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {room.inclusions.map((inclusion, idx) => (
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
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="form-container text-center">
              <div className="text-4xl mb-2">🛏️</div>
              <div className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                {boardinghouse.rooms.filter(r => r.withCR).length}
              </div>
              <div className="text-sm" style={{ color: "#666" }}>Rooms with CR</div>
            </div>
            <div className="form-container text-center">
              <div className="text-4xl mb-2">🍳</div>
              <div className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                {boardinghouse.rooms.filter(r => r.cooking).length}
              </div>
              <div className="text-sm" style={{ color: "#666" }}>Cooking Allowed</div>
            </div>
            <div className="form-container text-center">
              <div className="text-4xl mb-2">🚪</div>
              <div className="text-2xl font-bold" style={{ color: "#00a8cc" }}>
                {boardinghouse.availableRooms}
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
