import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/bussinlogo.png";

function DefaultLayout({ children }) {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useSelector((state) => state.users);

  const userMenu = [
    {
      name: "Home",
      path: "/bussin",
      icon: "ri-home-line",
    },
    {
      name: "Bookings",
      path: "/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const adminMenu = [
    {
      name: "Home",
      path: "/bussin",
      icon: "ri-home-line",
    },
    {
      name: "Buses",
      path: "/admin/buses",
      icon: "ri-bus-line",
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: "ri-user-line",
    },
    {
      name: "Bookings",
      path: "/admin/bookings",
      icon: "ri-file-list-line",
    },
    {
      name: "Logout",
      path: "/logout",
      icon: "ri-logout-box-line",
    },
  ];
  const menutoBeRendered = user?.isAdmin ? adminMenu : userMenu;
  let activeRoute = window.location.pathname;
  if (window.location.pathname.includes("book-now")) {
    activeRoute = "/bussin";
  }

  return (
    <div className="flex w-full">
    <div className="h-screen sticky top-0 flex flex-col bg-black shadow justify-start px-5 py-0">
    <img
          onClick={() => navigate("/")}
          src={logo}
          alt="logo"
          className="w-30 h-20 mt-6 rounded-full cursor-pointer"
        />
      <div className="flex flex-col gap-5 justify-start mt-8">
        {menutoBeRendered.map((item, index) => (
          <button
            key={index}
            className={`flex items-center gap-2 px-10 py-3 overflow-hidden text-white relative ${activeRoute === item.path ? "bg-gradient-to-br from-cyan-500 to-blue-500" : ""}`}
            onClick={() => {
              if (item.path === "/logout") {
                localStorage.clear();
                navigate("/");
              } else {
                navigate(item.path);
              }
            }}
          >
            <i className={`${item.icon} text-[20px]`}></i>
            {!collapsed && <span>{item.name}</span>}
          </button>
        ))}
      </div>
    </div>
    <div className="w-full">
      <div className="bg-black flex flex-col justify-start items-left py-2">
        
        <h1 className="text-white text-base mb-0 p-0 text-center">
          <div className="mt-1">{user?.name}</div>
          <div className="mt-1">{user?.email}</div>
        </h1>
      </div>
      <div className="p-[10px] px-0">{children}</div>
    </div>
  </div>
);
}
  
export default DefaultLayout;
