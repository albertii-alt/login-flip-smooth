import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import "../styles/boardinghouse.css";
import { useIsMobile } from "../hooks/use-mobile";

export default function AddBoardinghouse() {
  const isMobile = useIsMobile();

  return (
    <div className="app-layout">
      <Sidebar />
      <div
        className="main-content"
        style={{
          marginLeft: isMobile ? undefined : "260px",
          minHeight: "100vh",
        }}
      >
        <div className="page-header">
          <Link to="/my-boardinghouse" className="back-button">
            <ArrowLeft />
          </Link>
          <h1>Add Boardinghouse</h1>
        </div>

        <div className="form-container">
          <div className="form-row">
            <input
              type="text"
              placeholder="Owner Name"
              className="form-input half"
            />
            <input
              type="text"
              placeholder="Contact No."
              className="form-input half"
            />
            <Link to="/add-room" className="btn-add-room-side">
              Add Room
            </Link>
          </div>

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

          <div className="form-group">
            <label>Facebook Page or Profile</label>
            <input
              type="text"
              placeholder="https://facebook.com/username"
              className="form-input"
            />
          </div>

          <div className="upload-section">
            <label>Upload Photos</label>
            <div className="upload-box">
              <img src="/placeholder.svg" alt="Upload" className="upload-icon" />
              <button className="btn-choose-files">Choose Files</button>
            </div>
          </div>

          <button className="btn-save-listing">Save Listing</button>
        </div>
      </div>
    </div>
  );
}
