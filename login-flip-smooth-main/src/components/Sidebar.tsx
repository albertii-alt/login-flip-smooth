import { Home, Building2, Plus, Settings, LogOut } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: Building2, label: "My Boardinghouse", path: "/my-boardinghouse" },
    { icon: Plus, label: "Add New", path: "/add-boardinghouse" },
    { icon: Settings, label: "Account Settings", path: "/account-settings" },
    { icon: LogOut, label: "Logout", path: "/" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <img src="/placeholder.svg" alt="John Doe" />
        </div>
        <div className="profile-info">
          <h3>John Doe</h3>
          <p>Owner</p>
        </div>
      </div>

      <hr className="sidebar-divider" />

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${
              location.pathname === item.path ? "active" : ""
            }`}
          >
            <item.icon className="sidebar-nav-icon" />
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};
