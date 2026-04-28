import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Bell, User, Moon, Sun, MapPin, Home, Plus, LogOut, Settings, Shield, BarChart3 } from "lucide-react";
import API from "../api/axios";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useTheme } from "../context/ThemeContext";

function Navbar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await API.get("/issues/me");
          setUser(res.data);
        } catch (error) {
          console.error("Failed to fetch user:", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    fetchUser();
  }, [token]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (token) {
        try {
          const res = await API.get("/notifications");
          setNotifications(res.data);
          setUnreadCount(res.data.filter(n => !n.read).length);
        } catch (error) {
          console.error("Failed to fetch notifications:", error);
        }
      }
    };

    if (token) fetchNotifications();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/map", label: "Map", icon: MapPin },
    { to: "/notifications", label: "Notifications", icon: Bell },
  ];

  if (user?.role === "ADMIN") {
    navItems.push(
      { to: "/admin", label: "Admin", icon: Shield },
      { to: "/dashboard", label: "Dashboard", icon: BarChart3 }
    );
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <motion.h1
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer"
            onClick={() => navigate("/")}
          >
            Civic Solver
          </motion.h1>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <motion.div
                key={item.to}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to={item.to}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="w-9 h-9 p-0"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </Button>

            {token && (
              <>
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative w-9 h-9 p-0">
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <div className="p-2">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.slice(0, 5).map((notif) => (
                        <DropdownMenuItem key={notif.id} className="p-3">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm">{notif.message}</p>
                            <p className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleDateString()}</p>
                          </div>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">No notifications</div>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/notifications")}>
                      View all notifications
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Profile Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full">
                      <User size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <div className="p-2">
                      <p className="font-semibold">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <User size={16} className="mr-2" />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/settings")}>
                      <Settings size={16} className="mr-2" />
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut size={16} className="mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* Report Issue Button */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button size="sm" onClick={() => navigate("/create")}>
                    <Plus size={16} className="mr-2" />
                    Report Issue
                  </Button>
                </motion.div>
              </>
            )}

            {!token && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden w-9 h-9 p-0">
                  <Menu size={18} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col gap-4 mt-8">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      <item.icon size={20} />
                      {item.label}
                    </Link>
                  ))}

                  {token && (
                    <>
                      <div className="border-t pt-4">
                        <div className="px-3 py-2">
                          <p className="font-semibold">{user?.name || 'User'}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        >
                          <User size={20} />
                          Profile
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full text-left"
                        >
                          <LogOut size={20} />
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;