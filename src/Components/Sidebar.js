import React, { useState, useEffect } from "react";
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Chip,
  Avatar
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { Outlet, Link } from "react-router-dom";
import { FaBars } from "react-icons/fa6";
import { AiOutlineLogout } from "react-icons/ai";
import "./sidebar.css";
import { menuItems } from "./menuItems";
import logo from '../imgs/companylogo.png';
import logonew from '../imgs/logonew.png';
import user from '../imgs/user.jpg';

function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [orgData, setOrgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrgData = async () => {
      try {
        const response = await fetch("http://localhost:8001/Organisation");
        if (!response.ok) {
          throw new Error("Failed to fetch organization data");
        }
        const data = await response.json();
        setOrgData(data[0]); // Assuming the API returns an array with one object
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrgData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsSidebarVisible(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleToggleSidebar = () => {
    if (isSmallScreen) {
      setIsSidebarVisible(!isSidebarVisible);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleToggleSubmenu = (path) => {
    setOpenMenu(openMenu === path ? null : path);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="grid-container">
      <header className="header">
        <Box component="header" sx={{ display: "flex", gap: 3 }}>
          <Box className="bar-icon">
            <FaBars onClick={handleToggleSidebar} style={{ fontSize: "1.8rem" }} />
          </Box>
          <Box display={'flex'} justifyContent={'space-between'} flex={1} m={2} color={'#000'}>
            <Box display={'flex'} flexDirection={'column'}>
              {loading ? (
                <Typography variant="body1">Loading organization data...</Typography>
              ) : error ? (
                <Typography variant="body1" color="error">{error}</Typography>
              ) : orgData ? (
                <>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Typography variant="h6" className="title">
                      <b>{orgData.SocietyName}</b>
                    </Typography>
                    <Chip
                      label={orgData.Registration}
                      sx={{ backgroundColor: "#25D366", color: "#fff", height: '20px' }}
                    />
                  </Box>
                  <Typography className="title">
                    {`${orgData.AddressLine1}, ${orgData.AddressLine2}, ${orgData.AddressLine3}`}
                  </Typography>
                  <Typography className="title">
                    {`${orgData.State} - ${orgData.Pin}`}
                  </Typography>
                </>
              ) : null}
            </Box>
            <Box display={'flex'} flexDirection={"column"} alignItems="flex-start">
              {orgData && (
                <>
                  <Typography variant="h6" className="title">
                    Registration Details
                  </Typography>
                  <Box display={'flex'} gap={2} flexDirection="row">
                    <Typography className="title">
                      <b>Date:</b> {formatDate(orgData.RegisteredDate)}
                    </Typography>
                    <Typography className="title">
                      <b>No:</b> {orgData.Registration}
                    </Typography>
                    <Typography className="title">
                      <b>Authority:</b> {orgData.RegisteringAuthority}
                    </Typography>
                  </Box>
                </>
              )}
            </Box>
          </Box>
        </Box>
      </header>
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""} ${isSidebarVisible ? "show" : ""}`}>
        <IconButton onClick={handleToggleSidebar} className="toggle-button">
          {isCollapsed ? <ChevronRight className="toggle-icon" /> : <ChevronLeft className="toggle-icon" />}
        </IconButton>
        <Box
          component="aside"
          style={{
            width: isCollapsed ? "50px" : "225px",
            padding: 5,
            transition: "width 0.3s",
          }}
        >
          <Box sx={{ pt: 3, display: "flex", alignItems: "center", justifyContent: "start", gap: 1 }}>
            <div style={{ textAlign: "center" }}>
              <img
                src={isCollapsed ? logonew : logo}
                alt="logo"
                style={{ height: "50px", margin: "0 auto", width: isCollapsed ? "50px" : "auto" }}
              />
            </div>
            {!isCollapsed && <Typography variant="h5" className="company-name-text"></Typography>}
          </Box>
          <Box className="sidebar-contents" sx={{ mt: 2 }}>
            <List sx={{ cursor: "pointer" }}>
              {menuItems.map((item, index) => (
                <Box key={index}>
                  <ListItem
                    onClick={() => handleToggleSubmenu(item.path)}
                    className="menu-item"
                    sx={{
                      mt: 1,
                      color: 'black',
                      borderRadius: "10px",
                      transition: "background-color 0.3s, color 0.3s",
                      "&:hover": {
                        color: "#fff",
                        backgroundColor: "#2c85de",
                        ".menu-icon": {
                          color: "#fff",
                        },
                        ".menu-text": {
                          color: "#fff",
                        },
                      },
                    }}
                    component={item.submenus?.length ? "div" : Link}
                    to={item.submenus?.length ? undefined : item.path}
                  >
                    <ListItemIcon sx={{ fontSize: "1.5rem" }} className="menu-icon">
                      {item.icon}
                    </ListItemIcon>
                    {!isCollapsed && <ListItemText primary={item.title} sx={{ ml: -2 }} />}
                    {!isCollapsed && item.submenus?.length > 0 && (
                      <ListItemIcon sx={{ justifyContent: "end" }}>
                        {openMenu === item.path ? <ExpandLess className="menu-icon" /> : <ExpandMore className="menu-icon" />}
                      </ListItemIcon>
                    )}
                  </ListItem>
                  {item.submenus?.length > 0 && (
                    <Collapse in={openMenu === item.path} timeout="auto" unmountOnExit>
                      <List component="div" disablePadding>
                        {item.submenus.map((subItem, subIndex) => (
                          <ListItem
                            key={subIndex}
                            component={Link}
                            to={subItem.path}
                            className="menu-item"
                            sx={{
                              mt: 1,
                              borderRadius: "10px",
                              color: "black",
                              pl: 4,
                              transition: "background-color 0.3s, color 0.3s",
                              "&:hover": {
                                color: "#fff",
                                backgroundColor: "#0000ff",
                                ".menu-icon": {
                                  color: "#fff",
                                },
                                ".menu-text": {
                                  color: "#fff",
                                },
                              },
                            }}
                          >
                            <ListItemIcon sx={{ fontSize: "1.2rem" }} className="menu-icon">
                              {subItem.icon}
                            </ListItemIcon>
                            {!isCollapsed && <ListItemText primary={subItem.title} sx={{ ml: -2 }} className="menu-text" />}
                          </ListItem>
                        ))}
                      </List>
                    </Collapse>
                  )}
                </Box>
              ))}
            </List>

            <Box className="user-profile-section" sx={{ mt: 'auto', p: 2 }}>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar 
                  src={user} 
                  alt="User" 
                  sx={{ 
                    width: 40, 
                    height: 40,
                    border: '2px solid #2c85de'
                  }} 
                />
                {!isCollapsed && (
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Chavan Diksha
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      Admin
                    </Typography>
                  </Box>
                )}
                {!isCollapsed && (
                  <IconButton 
                    size="small" 
                    sx={{ 
                      ml: 'auto',
                      color: 'error.main',
                      '&:hover': {
                        backgroundColor: 'rgba(244, 67, 54, 0.08)'
                      }
                    }}
                    // onClick={logoutuser}
                  >
                    <AiOutlineLogout />
                  </IconButton>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </aside>
      <main className="main">
        <Box component="main">
          <Outlet />
        </Box>
      </main>
    </div>
  );
}

export default Sidebar;