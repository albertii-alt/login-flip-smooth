import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Sidebar } from "@/components/Sidebar";
import "../styles/boardinghouse.css";
import { useIsMobile } from "../hooks/use-mobile";

export default function MyBoardinghouse() {
  const isMobile = useIsMobile();
  const boardinghouses = [
    {
      id: 1,
      name: "The Urban Nest",
      availableRooms: 2,
      image: "/placeholder.svg",
    },
    {
      id: 2,
      name: "The Urban Nest",
      availableRooms: 2,
      image: "/placeholder.svg",
    },
  ];

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
          <Link to="/dashboard" className="back-button">
            <ArrowLeft />
          </Link>
          <h1>My Boardinghouse</h1>
          <Link to="/add-boardinghouse" className="add-button">
            <Plus /> Add
          </Link>
        </div>

        <div className="boardinghouse-list">
          {boardinghouses.map((bh) => (
            <div key={bh.id} className="boardinghouse-card">
              <img src={bh.image} alt={bh.name} className="bh-image" />
              <div className="bh-info">
                <h2>{bh.name}</h2>
                <p>Available Rooms : {bh.availableRooms}</p>
              </div>
              <div className="bh-actions">
                <Link to={`/edit-boardinghouse/${bh.id}`} className="btn-edit">
                  Edit
                </Link>
                <button className="btn-delete">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
