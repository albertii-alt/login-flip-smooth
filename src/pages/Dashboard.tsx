import { Building2, Bed, Bath, ChefHat, DoorOpen, Plus, Edit, Image, AlertCircle, TrendingUp, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import "../styles/dashboard.css";
import { useIsMobile } from "../hooks/use-mobile";
import React from "react";
import { getBoardinghousesByOwner, getAllRooms } from "../hooks/useBoardinghouseStorage";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();

  // current user
  const currentUser = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("currentUser") ?? "null") as { email?: string; role?: string } | null;
    } catch {
      return null;
    }
  }, []);

  React.useEffect(() => {
    if (!currentUser || currentUser.role !== "owner") {
      toast({ title: "Access denied", description: "Dashboard is for owners only." });
      navigate("/interface");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [boardinghouses, setBoardinghouses] = React.useState(() => {
    if (currentUser?.role === "owner" && currentUser.email) {
      return getBoardinghousesByOwner(currentUser.email);
    }
    return [];
  });

  const [rooms, setRooms] = React.useState(() => {
    // get all rooms then filter to owner's boardinghouses
    if (currentUser?.role === "owner" && currentUser.email) {
      const bhs = getBoardinghousesByOwner(currentUser.email);
      return bhs.flatMap((b) => b.rooms || []);
    }
    return [];
  });

  // activity log and reminders
  const [activityLog, setActivityLog] = React.useState<
    Array<{ ts: number; message: string; type?: string; meta?: any }>
  >([]);
  const [alerts, setAlerts] = React.useState<Array<{ id: string; message: string }>>([]);

  const fetchData = React.useCallback(() => {
    if (currentUser?.role === "owner" && currentUser.email) {
      const bhs = getBoardinghousesByOwner(currentUser.email);
      setBoardinghouses(bhs);
      setRooms(bhs.flatMap((b) => b.rooms || []));
      // build activity log: prefer stored activityLog, otherwise synthesize from data
      try {
        const stored = JSON.parse(localStorage.getItem("activityLog") ?? "null") as
          | Array<{ ts: number; message: string; type?: string; meta?: any }>
          | null;
        if (Array.isArray(stored) && stored.length > 0) {
          // show latest first
          setActivityLog(stored.slice().sort((a, b) => b.ts - a.ts));
        } else {
          const synthetic: Array<{ ts: number; message: string; type?: string; meta?: any }> = [];
          const now = Date.now();
          bhs.forEach((bh, i) => {
            // use bh.updatedAt if exists, otherwise synthetic timestamp
            const ts = (bh as any).updatedAt ? Number((bh as any).updatedAt) : now - i * 1000;
            synthetic.push({ ts, message: `Boardinghouse saved: ${bh.name || "(no name)"}`, type: "boardinghouse", meta: { id: bh.id } });
            (bh.rooms || []).forEach((r: any, j: number) => {
              const rts = r.updatedAt ? Number(r.updatedAt) : now - (i + j + 1) * 1000;
              synthetic.push({ ts: rts, message: `Room saved: ${r.roomName || "(no name)"} — ${bh.name || ""}`, type: "room", meta: { bhId: bh.id, roomId: r.id } });
            });
          });
          setActivityLog(synthetic.sort((a, b) => b.ts - a.ts));
        }
      } catch {
        setActivityLog([]);
      }

      // build reminders/alerts for missing required fields
      const newAlerts: Array<{ id: string; message: string }> = [];
      bhs.forEach((bh) => {
        if (rooms.length === 0) newAlerts.push({ id: `bh-${bh.id}-norooms`, message: `Boardinghouse "${bh.name || bh.id}" has no rooms.` });
        rooms.forEach((r: any) => {
          if (!r.roomName || !String(r.roomName).trim()) newAlerts.push({ id: `room-${r.id}-name`, message: `Room (${r.id}) in "${bh.name || bh.id}" is missing a name.` });
          if (r.totalBeds == null || r.totalBeds === "") newAlerts.push({ id: `room-${r.id}-totalBeds`, message: `Room "${r.roomName || r.id}" is missing total beds.` });
          if (r.rentPrice == null || r.rentPrice === "") newAlerts.push({ id: `room-${r.id}-rent`, message: `Room "${r.roomName || r.id}" is missing rent price.` });
        });
      });
      setAlerts(newAlerts);
    } else {
      setBoardinghouses([]);
      setRooms([]);
      setActivityLog([]);
      setAlerts([]);
    }
  }, [currentUser?.email, currentUser?.role]);

  React.useEffect(() => {
    fetchData();
    const onStorage = (e: StorageEvent) => {
      if (e.key === "boardinghouses" || e.key === "activityLog") fetchData();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [fetchData]);

  const totalBoardinghouses = boardinghouses.length;
  const totalRooms = rooms.length;
  const roomsWithCR = rooms.filter((r) => Boolean(r.withCR)).length;
  const roomsWithCooking = rooms.filter((r) => Boolean(r.cookingAllowed)).length;
  const availableRooms = rooms.filter((r) => Number(r.availableBeds) > 0).length;

  const summaryStats = [
    { icon: Building2, title: "Total Boardinghouses", value: totalBoardinghouses, color: "#06b6d4" },
    { icon: Bed, title: "Total Rooms", value: totalRooms, color: "#3b82f6" },
    { icon: Bath, title: "Rooms with CR", value: roomsWithCR, color: "#8b5cf6" },
    { icon: ChefHat, title: "Rooms with Cooking Allowed", value: roomsWithCooking, color: "#10b981" },
    { icon: DoorOpen, title: "Available Rooms", value: availableRooms, color: "#f59e0b" },
  ];

  const roomsDetailed = React.useMemo(() => {
    return rooms.map((r) => ({
      ...r,
      boardinghouseName: boardinghouses.find((b) => (b.rooms || []).some((rr) => rr.id === r.id))?.name ?? "Unknown",
    })) as Array<typeof rooms[number] & { boardinghouseName: string }>;
  }, [boardinghouses, rooms]);

  const handleRefresh = () => {
    fetchData();
    toast({ title: "Dashboard refreshed", description: "Dashboard data refreshed successfully" });
  };

  // Quick action helpers
  const goAddBoardinghouse = () => navigate("/add-boardinghouse");
  const goAddRoom = () => {
    // preselect first boardinghouse if present
    if (boardinghouses.length > 0) {
      try {
        localStorage.setItem("selectedBoardinghouseId", boardinghouses[0].id);
      } catch {}
    }
    navigate("/add-room");
  };
  const goEditRoom = () => {
    if (boardinghouses.length > 0) {
      try {
        localStorage.setItem("selectedBoardinghouseId", boardinghouses[0].id);
      } catch {}
    }
    navigate("/edit-room");
  };
  const goUploadPhotos = () => {
    if (boardinghouses.length > 0) {
      try {
        localStorage.setItem("selectedBoardinghouseId", boardinghouses[0].id);
      } catch {}
    }
    navigate("/my-boardinghouse");
  };

  // Data for charts (insert near other calculations)
  const roomsByGenderCounts = React.useMemo(() => {
    const male = rooms.filter((r) => String(r.gender ?? "").toLowerCase() === "male").length;
    const female = rooms.filter((r) => String(r.gender ?? "").toLowerCase() === "female").length;
    const anyCount = rooms.filter((r) => {
      const g = String(r.gender ?? "").toLowerCase();
      return g !== "male" && g !== "female";
    }).length;
    return { male, female, any: anyCount };
  }, [rooms]);

  const roomsWithCRPercent = totalRooms > 0 ? Math.round((roomsWithCR / totalRooms) * 100) : 0;
  const maxGenderCount = Math.max(1, roomsByGenderCounts.male, roomsByGenderCounts.female, roomsByGenderCounts.any);

  return (
    <div className="app-layout">
      <Sidebar />
      <div
        className="main-content dashboard-content"
        style={{
          marginLeft: isMobile ? undefined : "260px",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div className="dashboard-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 className="dashboard-title">Dashboard</h1>
            <button
              className="btn-refresh"
              onClick={handleRefresh}
              style={{ marginLeft: 8 }}
              aria-label="Refresh dashboard"
            >
              <RefreshCw size={18} />
            </button>
          </div>
          <p className="dashboard-subtitle">Welcome back</p>
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

          {boardinghouses.length === 0 ? (
            <div className="empty-state">
              <p>No boardinghouses added yet.</p>
              <p>Add a boardinghouse to see this summary.</p>
            </div>
          ) : (
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
                  {boardinghouses.map((bh) => {
                    const total = bh.rooms?.length ?? 0;
                    const available = (bh.rooms ?? []).filter((r) => Number(r.availableBeds) > 0).length;
                    const anyCR = (bh.rooms ?? []).some((r) => r.withCR) ? "Yes" : "No";
                    const anyCooking = (bh.rooms ?? []).some((r) => r.cookingAllowed) ? "Yes" : "No";
                    return (
                      <tr key={bh.id}>
                        <td className="font-semibold text-blue-600">{bh.name}</td>
                        <td>{bh.address}</td>
                        <td>{total}</td>
                        <td>{available}</td>
                        <td>{anyCR}</td>
                        <td>{anyCooking}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-view"
                              onClick={() => {
                                try {
                                  localStorage.setItem("selectedBoardinghouseId", bh.id);
                                } catch {}
                                navigate("/my-boardinghouse");
                              }}
                            >
                              View
                            </button>
                            <button
                              className="btn-edit"
                              onClick={() => {
                                try {
                                  localStorage.setItem("selectedBoardinghouseId", bh.id);
                                } catch {}
                                navigate(`/edit-boardinghouse/${bh.id}`);
                              }}
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Room Overview Section */}
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">Room Overview</h2>
          </div>

          {roomsDetailed.length === 0 ? (
            <div className="empty-state">
              <p>No rooms added yet.</p>
              <p>Add rooms to boardinghouses to see room overview here.</p>
            </div>
          ) : (
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
                  {roomsDetailed.map((room) => (
                    <tr key={room.id}>
                      <td className="font-semibold">{room.roomName}</td>
                      <td>{room.boardinghouseName}</td>
                      <td>{room.availableBeds}</td>
                      <td>{room.gender}</td>
                      <td>
                        <span className={`status-badge status-${room.availableBeds > 0 ? "active" : "full"}`}>
                          {room.availableBeds > 0 ? "🟢 Active" : "⚪ Full"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="dashboard-section">
          <h2 className="section-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            <button className="quick-action-btn" onClick={goAddBoardinghouse}>
              <Plus size={20} />
              Add New Boardinghouse
            </button>
            <button className="quick-action-btn" onClick={goAddRoom}>
              <Plus size={20} />
              Add Room
            </button>
            <button className="quick-action-btn" onClick={goEditRoom}>
              <Edit size={20} />
              Edit Room
            </button>
            <button className="quick-action-btn" onClick={goUploadPhotos}>
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
              {activityLog.length === 0 ? (
                <div className="activity-item">
                  <div className="activity-content">
                    <p className="activity-text">No recent activity available.</p>
                  </div>
                </div>
              ) : (
                activityLog.slice(0, 20).map((a, i) => (
                  <div key={i} className="activity-item">
                    <div className="activity-icon">
                      <TrendingUp size={16} />
                    </div>
                    <div className="activity-content">
                      <p className="activity-text">{a.message}</p>
                      <p className="activity-time">{new Date(a.ts).toLocaleString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reminders/Alerts */}
          <div className="dashboard-section">
            <h2 className="section-title">Reminders & Alerts</h2>
            <div className="alerts-container">
              {alerts.length === 0 ? (
                <div className="alert-item alert-ok">
                  <AlertCircle size={20} />
                  <span>All required fields appear filled.</span>
                </div>
              ) : (
                alerts.map((al) => (
                  <div key={al.id} className="alert-item alert-warning" title={al.message} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <AlertCircle size={18} />
                    <span>{al.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Data Overview Charts Section */}
        <div className="dashboard-section">
          <h2 className="section-title">Data Overview</h2>
          <div className="charts-grid">
            <div className="chart-card">
              <h3 className="chart-title">Rooms with CR</h3>
              <div className="chart-placeholder" style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 120, height: 120, position: "relative" }}>
                  {/* simple donut */}
                  <svg viewBox="0 0 36 36" style={{ width: 120, height: 120 }}>
                    <path
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831
                         a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#e6eef2"
                      strokeWidth="6"
                    />
                    <path
                      d="M18 2.0845
                         a 15.9155 15.9155 0 0 1 0 31.831"
                      fill="none"
                      stroke="#06b6d4"
                      strokeWidth="6"
                      strokeDasharray={`${roomsWithCRPercent} ${100 - roomsWithCRPercent}`}
                      strokeDashoffset="25"
                    />
                  </svg>
                </div>
                <div>
                  <div style={{ fontSize: 24, fontWeight: 700 }}>{roomsWithCR}</div>
                  <div style={{ color: "#666" }}>{roomsWithCRPercent}% of rooms</div>
                  <div style={{ marginTop: 8, color: "#444" }}>{totalRooms} total rooms</div>
                </div>
              </div>
            </div>

            <div className="chart-card">
              <h3 className="chart-title">Rooms by Gender</h3>

              {/* SVG bar chart to match provided image (dark bg, axis, value labels) */}
              <div className="chart-placeholder" style={{ padding: 12 }}>
                {(() => {
                  // chart layout
                  const labels = [
                    { key: "male", label: "Male", count: roomsByGenderCounts.male, color: "#3b82f6" },
                    { key: "female", label: "Female", count: roomsByGenderCounts.female, color: "#ec4899" },
                    { key: "any", label: "Any", count: roomsByGenderCounts.any, color: "#8b5cf6" },
                  ];
                  const width = 420;
                  const height = 220;
                  const padding = { top: 18, right: 18, bottom: 44, left: 36 };
                  const plotW = width - padding.left - padding.right;
                  const plotH = height - padding.top - padding.bottom;
                  const maxVal = Math.max(1, maxGenderCount);
                  const barWidth = Math.floor(plotW / (labels.length * 1.8));
                  const gap = Math.floor((plotW - labels.length * barWidth) / (labels.length + 1));

                  return (
                    <svg width="100%" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
                      {/* background similar to provided image */}
                      <rect x="0" y="0" width={width} height={height} fill="#0b0f12" rx="6" />

                      {/* y-axis ticks and gridlines */}
                      {[0, 0.25, 0.5, 0.75, 1].map((t, i) => {
                        const y = padding.top + plotH - t * plotH;
                        const val = Math.round(t * maxVal);
                        return (
                          <g key={i}>
                            <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} stroke="#172027" strokeWidth={1} />
                            <text x={padding.left - 8} y={y + 4} fontSize="11" fill="#9aa6b2" textAnchor="end">{val}</text>
                          </g>
                        );
                      })}

                      {/* x-axis line */}
                      <line
                        x1={padding.left}
                        x2={width - padding.right}
                        y1={padding.top + plotH + 6}
                        y2={padding.top + plotH + 6}
                        stroke="#2b3640"
                        strokeWidth={2}
                      />

                      {/* bars */}
                      {labels.map((g, idx) => {
                        const barHeight = (g.count / maxVal) * plotH;
                        const x = padding.left + gap + idx * (barWidth + gap);
                        const y = padding.top + plotH - barHeight;
                        return (
                          <g key={g.key}>
                            {/* bar */}
                            <rect
                              x={x}
                              y={y}
                              width={barWidth}
                              height={Math.max(4, barHeight)}
                              rx={6}
                              fill={g.color}
                            />
                            {/* value label on top */}
                            <text x={x + barWidth / 2} y={y - 6} fontSize="12" fill="#ffffff" fontWeight="700" textAnchor="middle">
                              {g.count}
                            </text>
                            {/* bottom category label */}
                            <text
                              x={x + barWidth / 2}
                              y={padding.top + plotH + 22}
                              fontSize="13"
                              fill="#e6eef2"
                              textAnchor="middle"
                            >
                              {g.label}
                            </text>
                          </g>
                        );
                      })}

                      {/* left axis label (0) at bottom */}
                      <text x={padding.left - 8} y={padding.top + plotH + 20} fontSize="11" fill="#9aa6b2" textAnchor="end">0</text>
                    </svg>
                  );
                })()}

                <div style={{ marginTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <span style={{ width: 12, height: 12, background: "#3b82f6", borderRadius: 3 }} />
                    <small style={{ color: "#334155" }}>Male</small>
                    <span style={{ width: 12, height: 12, background: "#ec4899", borderRadius: 3 }} />
                    <small style={{ color: "#334155" }}>Female</small>
                    <span style={{ width: 12, height: 12, background: "#8b5cf6", borderRadius: 3 }} />
                    <small style={{ color: "#334155" }}>Any</small>
                  </div>

                  <div style={{ color: "#94a3b8", fontSize: 13 }}>
                    <strong style={{ color: "#fff" }}>{rooms.length}</strong> total rooms
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