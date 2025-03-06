import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface MobileMenuProps {
  className?: string;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, isEmployer, isAdmin } = useAuth();

  // Define menu items based on user role
  const menuItems = [
    {
      section: "Jobs",
      items: [
        { name: "Job Search", path: "/job-search" },
        { name: "Saved Jobs", path: "/saved" },
        { name: "Application History", path: "/history" },
        { name: "Recommended Jobs", path: "/recommendations" },
      ],
    },
    {
      section: "Resources",
      items: [
        { name: "Career Counseling", path: "/resources/career-counseling" },
        { name: "Resume Assistance", path: "/resources/resume-assistance" },
        { name: "Interview Preparation", path: "/resources/interview-prep" },
        { name: "Military Transition", path: "/resources/military-transition" },
        { name: "Community Forums", path: "/resources/forums" },
      ],
    },
    {
      section: "Events",
      items: [{ name: "Job Fairs & Events", path: "/events" }],
    },
    {
      section: "Employer",
      items: [
        { name: "Post a Job", path: "/employer/post-job" },
        { name: "Manage Applications", path: "/employer/manage-applications" },
        { name: "Search Veterans", path: "/employer/search-veterans" },
        { name: "Employer Profile", path: "/employer-profile" },
        { name: "Lead Management", path: "/leads" },
      ],
    },
    {
      section: "Admin",
      items: [
        { name: "Dashboard", path: "/admin" },
        { name: "Content Management", path: "/admin/content" },
        { name: "A/B Testing", path: "/ab-testing" },
      ],
    },
  ];

  // Filter menu items based on user role
  const filteredMenuItems = menuItems.filter((section) => {
    if (section.section === "Admin" && !isAdmin) return false;
    if (section.section === "Employer" && !isEmployer) return false;
    return true;
  });

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("md:hidden", className)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[350px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Link to="/" onClick={handleLinkClick}>
                <h2 className="text-xl font-bold">VeteranJobBoard</h2>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="flex-1 overflow-auto py-2">
            {isAuthenticated ? (
              <div className="space-y-4">
                {filteredMenuItems.map((section) => (
                  <div key={section.section} className="px-2">
                    <h3 className="mb-1 px-4 text-sm font-medium text-gray-500">
                      {section.section}
                    </h3>
                    <div className="space-y-1">
                      {section.items.map((item) => (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={handleLinkClick}
                        >
                          <div
                            className={cn(
                              "block px-4 py-2 text-sm rounded-md",
                              location.pathname === item.path
                                ? "bg-gray-100 font-medium text-primary"
                                : "text-gray-700 hover:bg-gray-50"
                            )}
                          >
                            {item.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-2 p-4">
                <Link to="/auth?mode=login" onClick={handleLinkClick}>
                  <Button variant="outline" className="w-full justify-start">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth?mode=signup" onClick={handleLinkClick}>
                  <Button className="w-full justify-start">Sign Up</Button>
                </Link>
                <div className="pt-4">
                  <h3 className="mb-1 px-2 text-sm font-medium text-gray-500">
                    Explore
                  </h3>
                  <div className="space-y-1">
                    <Link to="/job-search" onClick={handleLinkClick}>
                      <div
                        className={cn(
                          "block px-4 py-2 text-sm rounded-md",
                          location.pathname === "/job-search"
                            ? "bg-gray-100 font-medium text-primary"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        Job Search
                      </div>
                    </Link>
                    <Link to="/resources/military-transition" onClick={handleLinkClick}>
                      <div
                        className={cn(
                          "block px-4 py-2 text-sm rounded-md",
                          location.pathname === "/resources/military-transition"
                            ? "bg-gray-100 font-medium text-primary"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        Military Transition Resources
                      </div>
                    </Link>
                    <Link to="/events" onClick={handleLinkClick}>
                      <div
                        className={cn(
                          "block px-4 py-2 text-sm rounded-md",
                          location.pathname === "/events"
                            ? "bg-gray-100 font-medium text-primary"
                            : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        Job Fairs & Events
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {isAuthenticated && (
            <div className="border-t p-4">
              <Link to="/profile" onClick={handleLinkClick}>
                <Button variant="outline" className="w-full justify-start">
                  My Profile
                </Button>
              </Link>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;
