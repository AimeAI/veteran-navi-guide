import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  User,
  Bell,
  MessageSquare,
  Briefcase,
  BookmarkCheck,
  Search,
  AlarmClock,
  Calendar,
  Shield,
  FileText,
  ClipboardList,
  Settings,
  LogOut,
  ChevronDown,
  Building,
  Link2
} from 'lucide-react';
import { useUser } from '@/context/UserContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { DayPicker } from "react-day-picker"

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const { user, logout, supabaseUser } = useUser();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const profileMenuItems = [
    { label: t("navigation.profile"), icon: <User />, href: "/profile" },
    { label: t("navigation.resume"), icon: <FileText />, href: "/resume-assistance" },
    { label: t("navigation.applicationHistory"), icon: <ClipboardList />, href: "/application-history" },
    { label: t("navigation.integrations"), icon: <Link2 />, href: "/integrations" },
    { label: t("navigation.settings"), icon: <Settings />, href: "/settings" },
    { label: t("common.logout"), icon: <LogOut />, onClick: handleLogout, },
  ];

  return (
    <nav className="bg-background border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 font-bold text-xl">
              VeteranMatch
            </Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <NavLink to="/job-search" className={({ isActive }) => isActive ? "text-primary px-3 py-2 rounded-md text-sm font-medium" : "text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"}>
                  {t("navigation.jobSearch")}
                </NavLink>
                <NavLink to="/saved-jobs" className={({ isActive }) => isActive ? "text-primary px-3 py-2 rounded-md text-sm font-medium" : "text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"}>
                  {t("navigation.savedJobs")}
                </NavLink>
                {/* Add more navigation links here */}
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6">
              {/* Search Bar - Placeholder */}
              <div className="mr-4">
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-primary focus:border-primary block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder={t("common.search")}
                  />
                </div>
              </div>

              {/* Notification Menu - Placeholder */}
              <button
                type="button"
                className="bg-gray-100 p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary mr-4"
              >
                <span className="sr-only">View notifications</span>
                <Bell className="h-6 w-6" aria-hidden="true" />
              </button>

              {/* Profile dropdown */}
              {!user?.isAuthenticated ? (
                <>
                  <Link to="/auth?tab=login" className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">{t("common.login")}</Link>
                  <Link to="/auth?tab=signup" className="text-white bg-primary hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">{t("common.signup")}</Link>
                </>
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <span className="sr-only">Open user menu</span>
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.profilePicture || `https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                        <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-2 w-56">
                    <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {profileMenuItems.map((item, index) => (
                      <DropdownMenuItem key={index} onClick={item.onClick ? item.onClick : () => navigate(item.href || '')}>
                        {item.icon} {item.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            {/* Mobile menu button */}
            <button
              onClick={toggleMenu}
              type="button"
              className="bg-background inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              aria-controls="mobile-menu"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <Menu className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      <div className={isMenuOpen ? "md:hidden block" : "md:hidden hidden"} id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <NavLink to="/job-search" className={({ isActive }) => isActive ? "bg-gray-100 text-primary block px-3 py-2 rounded-md text-base font-medium" : "text-gray-700 hover:bg-gray-100 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"}>
            {t("navigation.jobSearch")}
          </NavLink>
          <NavLink to="/saved-jobs" className={({ isActive }) => isActive ? "bg-gray-100 text-primary block px-3 py-2 rounded-md text-base font-medium" : "text-gray-700 hover:bg-gray-100 hover:text-primary block px-3 py-2 rounded-md text-base font-medium"}>
            {t("navigation.savedJobs")}
          </NavLink>
          {/* Add more mobile navigation links here */}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex items-center px-5 sm:px-6">
            <div className="flex-shrink-0">
              {user?.isAuthenticated ? (
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.profilePicture || `https://avatar.vercel.sh/${user?.email}.png`} alt={user?.name} />
                  <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
              ) : (
                <Shield className="h-10 w-10 text-gray-400" aria-hidden="true" />
              )}
            </div>
            {user?.isAuthenticated ? (
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{user?.name}</div>
                <div className="text-sm font-medium text-gray-500">{user?.email}</div>
              </div>
            ) : (
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{t("common.guest")}</div>
                <div className="text-sm font-medium text-gray-500">{t("common.pleaseLogin")}</div>
              </div>
            )}
          </div>
          <div className="mt-3 px-2 space-y-1 sm:px-3">
            {user?.isAuthenticated ? (
              <>
                {profileMenuItems.map((item, index) => (
                  <NavLink key={index} to={item.href || ""} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                    {item.label}
                  </NavLink>
                ))}
                <button
                  onClick={handleLogout}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {t("common.logout")}
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/auth?tab=login"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {t("common.login")}
                </Link>
                <Link
                  to="/auth?tab=signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {t("common.signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
