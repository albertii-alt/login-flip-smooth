import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import "../styles/boardinghouse.css";

export default function EditBoardinghouse() {
  const photos = [
    "/placeholder.svg",
    "/placeholder.svg",
    "/placeholder.svg",
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <div className="page-header">
          <Link to="/my-boardinghouse" className="back-button">
            <ArrowLeft />
          </Link>
          <h1>Edit Boardinghouse Details</h1>
        </div>

        <div className="form-container">
          <div className="form-row-with-buttons">
            <div className="form-column">
              <input
                type="text"
                placeholder="Boardinghouse Name"
                className="form-input"
              />
              <input
                type="text"
                placeholder="Full Address/Location"
                className="form-input"
              />
              <textarea
                placeholder="Description"
                className="form-textarea"
                defaultValue="A boardinghouse is a residential building where individuals can rent a room and typically receive meals and other basic services, such as laundry or cleaning. It often provides a more communal living environment than a hotel or apartment, with shared common areas like kitchens or bathrooms. Boardinghouses are usually used for long-term stays and can cater to students, workers, or travelers seeking affordable accommodations."
              />
            </div>
            <div className="side-buttons">
              <Link to="/edit-room" className="btn-purple">
                Edit Rooms <span>›</span>
              </Link>
              <Link to="/add-room" className="btn-purple">
                Add Room
              </Link>
            </div>
          </div>

          <div className="upload-section">
            <label>Upload Photos</label>
            <div className="photo-grid">
              {photos.map((photo, index) => (
                <div key={index} className="photo-item">
                  <img src={photo} alt={`Photo ${index + 1}`} />
                </div>
              ))}
              <div className="photo-item add-photo">
                <span>+ Add new photo</span>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn-save-changes">
              <span className="save-icon">💾</span> Save Changes
            </button>
            <button className="btn-cancel">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
