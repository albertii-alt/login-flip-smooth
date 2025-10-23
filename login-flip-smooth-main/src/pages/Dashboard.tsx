import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
//   const location = useLocation();SS

//   useEffect(() => {
//     console.error("404 Error: User attempted to access non-existent route:", location.pathname);
//   }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <p className="title mb-4 text-xl text-gray-600">Dashboard</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          Return to Home
        </a>
      </div>
    </div>
  );
 
};

export default Dashboard;
