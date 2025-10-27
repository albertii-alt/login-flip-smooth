import { Building2, Bed, Bath, ChefHat, DoorOpen, Plus, Edit, Image, AlertCircle, TrendingUp } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import "../styles/dashboard.css";
import { useIsMobile } from "../hooks/use-mobile";

const Dashboard = () => {
  const isMobile = useIsMobile();

  const summaryStats = [
    { icon: Building2, title: "Total Boardinghouses", value: 3, color: "#06b6d4" },
    { icon: Bed, title: "Total Rooms", value: 15, color: "#3b82f6" },
    { icon: Bath, title: "Rooms with CR", value: 10, color: "#8b5cf6" },
    { icon: ChefHat, title: "Rooms with Cooking Allowed", value: 8, color: "#10b981" },
    { icon: DoorOpen, title: "Available Rooms", value: 12, color: "#f59e0b" },
  ];

  const boardinghouses = [
    {
      name: "Happy Stay Inn",
      location: "Cebu City",
      totalRooms: 5,
      availableRooms: 3,
      withCR: "Yes",
      cookingAllowed: "Yes"
    },
    {
      name: "Sunrise Villa",
      location: "Mandaue",
      totalRooms: 4,
      availableRooms: 2,
      withCR: "Yes",
      cookingAllowed: "No"
    },
    {
      name: "Sunshine Dorm",
      location: "Lapu-Lapu",
      totalRooms: 6,
      availableRooms: 4,
      withCR: "No",
      cookingAllowed: "Yes"
    }
  ];

  const rooms = [
    {
      name: "Room 101",
      boardinghouse: "Happy Stay Inn",
      bedsAvailable: 2,
      gender: "Male",
      status: "active"
    },
    {
      name: "Room 102",
      boardinghouse: "Happy Stay Inn",
      bedsAvailable: 0,
      gender: "Female",
      status: "full"
    },
    {
      name: "Room 201",
      boardinghouse: "Sunrise Villa",
      bedsAvailable: 1,
      gender: "Male",
      status: "active"
    }
  ];

  const recentActivities = [
    { text: "Edited Room 201 details.", time: "2 hours ago" },
    { text: "Added new Boardinghouse: Sunshine Dorm.", time: "1 day ago" },
    { text: "Updated Happy Stay Inn description.", time: "2 days ago" },
  ];

  const alerts = [
    { text: "2 rooms missing photos.", type: "warning" },
    { text: "1 boardinghouse missing address.", type: "warning" },
    { text: "Some room inclusions not selected.", type: "info" },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div
        className="main-content dashboard-content"
        style={{
          marginLeft: isMobile ? undefined : "260px", // keep content out from under fixed sidebar on desktop
          minHeight: "100vh",
        }}
      >
      {/* Header */}
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <p className="dashboard-subtitle">Welcome back, John Doe</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards-grid">
        {summaryStats.map((stat, index) => (
          <div key={index} className="summary-card">
            <div className="summary-card-icon" style={{ backgroundColor: `${stat.color}20`, color: stat.color }}>
              <stat.icon size={28} />
            </div>
            <div className="summary-card-content">
              <p className="summary-card-title">{stat.title}</p>
              <p className="summary-card-value">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Boardinghouse Summary Table */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Boardinghouse Summary</h2>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Boardinghouse Name</th>
                <th>Location</th>
                <th>Total Rooms</th>
                <th>Available Rooms</th>
                <th>With CR</th>
                <th>Cooking Allowed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {boardinghouses.map((bh, index) => (
                <tr key={index}>
                  <td className="font-semibold text-blue-600">{bh.name}</td>
                  <td>{bh.location}</td>
                  <td>{bh.totalRooms}</td>
                  <td>{bh.availableRooms}</td>
                  <td>{bh.withCR}</td>
                  <td>{bh.cookingAllowed}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-view">View</button>
                      <button className="btn-edit">Edit</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Room Overview Section */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2 className="section-title">Room Overview</h2>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Room Name</th>
                <th>Boardinghouse</th>
                <th>Beds Available</th>
                <th>Gender Allowed</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room, index) => (
                <tr key={index}>
                  <td className="font-semibold">{room.name}</td>
                  <td>{room.boardinghouse}</td>
                  <td>{room.bedsAvailable}</td>
                  <td>{room.gender}</td>
                  <td>
                    <span className={`status-badge status-${room.status}`}>
                      {room.status === "active" ? "🟢 Active" : "⚪ Full"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-section">
        <h2 className="section-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button className="quick-action-btn">
            <Plus size={20} />
            Add New Boardinghouse
          </button>
          <button className="quick-action-btn">
            <Plus size={20} />
            Add Room
          </button>
          <button className="quick-action-btn">
            <Edit size={20} />
            Edit Room Info
          </button>
          <button className="quick-action-btn">
            <Image size={20} />
            Upload Boardinghouse Photos
          </button>
        </div>
      </div>

      {/* Bottom Grid: Recent Activities & Alerts */}
      <div className="bottom-grid">
        {/* Recent Updates */}
        <div className="dashboard-section">
          <h2 className="section-title">Recent Updates</h2>
          <div className="activity-feed">
            {recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-icon">
                  <TrendingUp size={16} />
                </div>
                <div className="activity-content">
                  <p className="activity-text">{activity.text}</p>
                  <p className="activity-time">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders/Alerts */}
        <div className="dashboard-section">
          <h2 className="section-title">Reminders & Alerts</h2>
          <div className="alerts-container">
            {alerts.map((alert, index) => (
              <div key={index} className={`alert-item alert-${alert.type}`}>
                <AlertCircle size={20} />
                <span>{alert.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Data Overview Charts Section */}
      <div className="dashboard-section">
        <h2 className="section-title">Data Overview</h2>
        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Rooms with CR</h3>
            <div className="chart-placeholder">
              <div className="pie-chart">
                <div className="pie-segment" style={{ background: "conic-gradient(#06b6d4 0% 67%, #e2e8f0 67% 100%)" }}></div>
              </div>
              <div className="chart-legend">
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "#06b6d4" }}></span>
                  <span>With CR (67%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color" style={{ backgroundColor: "#e2e8f0" }}></span>
                  <span>Without CR (33%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Rooms by Gender</h3>
            <div className="chart-placeholder">
              <div className="bar-chart">
                <div className="bar-item">
                  <div className="bar" style={{ height: "70%", backgroundColor: "#3b82f6" }}></div>
                  <span className="bar-label">Male</span>
                </div>
                <div className="bar-item">
                  <div className="bar" style={{ height: "50%", backgroundColor: "#ec4899" }}></div>
                  <span className="bar-label">Female</span>
                </div>
                <div className="bar-item">
                  <div className="bar" style={{ height: "30%", backgroundColor: "#8b5cf6" }}></div>
                  <span className="bar-label">Any</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;
