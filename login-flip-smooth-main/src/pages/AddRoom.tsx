import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import "../styles/boardinghouse.css";

export default function AddRoom() {
  const inclusions = [
    "Mattress",
    "Electric Fan",
    "Table",
    "Cabinet",
    "Pillow",
    "Aircon",
    "Chair",
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <Link to="/my-boardinghouse" className="back-button">
            <ArrowLeft />
          </Link>
          <h1>Add Room</h1>
        </div>

        <div className="form-container">
          <div className="form-group">
            <label>Room Name:</label>
            <input
              type="text"
              placeholder="Room 101"
              className="form-input-room"
            />
          </div>

          <div className="info-section">
            <label className="section-label">Information:</label>
            <div className="info-grid">
              <div className="form-group">
                <label>Total Beds:</label>
                <input type="number" placeholder="10" className="form-input-room" />
              </div>
              <div className="form-group">
                <label>Beds Available:</label>
                <input type="number" placeholder="10" className="form-input-room" />
              </div>
              <div className="form-group">
                <label>Rent Price:</label>
                <input type="number" placeholder="500" className="form-input-room" />
              </div>
              <div className="form-group">
                <label>With CR:</label>
                <select className="form-select">
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
              <div className="form-group">
                <label>Beds Occupied:</label>
                <input type="number" placeholder="5" className="form-input-room" />
              </div>
              <div className="form-group">
                <label>Gender Allowed:</label>
                <select className="form-select">
                  <option>Male</option>
                  <option>Female</option>
                  <option>Any</option>
                </select>
              </div>
              <div className="form-group full-width">
                <label>Cooking Allowed Inside:</label>
                <select className="form-select">
                  <option>Yes/No</option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>
          </div>

          <div className="inclusions-section">
            <label>Inclusions:</label>
            <div className="inclusions-grid">
              {inclusions.map((item) => (
                <label key={item} className="checkbox-label">
                  <input type="checkbox" />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-add">Add</button>
            <button className="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
