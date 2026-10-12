"use client";

import settingIcon from "@/assets/dashboard/account-setting-01.png";
import football_pitch from "@/assets/dashboard/football-pitch.png";
import new_job from "@/assets/dashboard/new-job.png";
import userGroup from "@/assets/dashboard/user-group.png";
import user from "@/assets/dashboard/user-multiple.png";
import logo from "@/assets/logo.png";

import { logOut } from "@/redux/ReduxFunction";
import Cookies from "js-cookie";
import { LayoutDashboard, LogOut, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SidebarProps {
  onCloseClick?: () => void;
}

interface MenuItem {
  href?: string;
  label: string;
  icon?: any;
  isImage?: boolean;
  subItems?: { label: string; href: string; icon?: any }[];
}

const Sidebar = ({ onCloseClick }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const role = "Admin";

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    if (
      pathname.startsWith("/admin/player-management") ||
      pathname.startsWith("/admin/coach-management") ||
      pathname.startsWith("/admin/scout")
    ) {
      setUserDropdownOpen(true);
    }
  }, [pathname]);

  const allMenuItems: MenuItem[] = [
    { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    {
      href: "/admin/user-management",
      label: "User Management",
      icon: user,
      isImage: true,
    },
    {
      href: "/admin/event-management",
      icon: football_pitch,
      label: "Event Management",
      isImage: true,
    },
    {
      href: "/admin/event-booking",
      icon: new_job,
      label: "Event Booking",
      isImage: true,
    },
    {
      href: "/admin/discount",
      icon: userGroup,
      label: "Discount",
      isImage: true,
    },
    {
      href: "/admin/settings",
      icon: settingIcon,
      label: "Settings",
      isImage: true,
    },
  ];

  const handleLogout = () => {
    Cookies.remove("token");
    router.push("/login");
    logOut();
  };

  return (
    <div className="relative">
      <aside className="w-full lg:w-72 h-screen bg-secondary flex flex-col text-white">
        <button
          onClick={onCloseClick}
          className="absolute top-4 right-4 lg:hidden p-2 rounded-md text-red-500"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="p-6 flex justify-center">
          <Image src={logo} alt="logo" width={131} height={101} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {allMenuItems.map((item, idx) => {
              const isActive = item.href === pathname;

              if (item.subItems) {
                return (
                  <div key={idx} className={`rounded-lg  `}>
                    <li>
                      <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className={`flex justify-between items-center w-full px-4 py-3 rounded-lg text-base bg- hover:bg-[#ffffff1e] hover:text-title transition-colors ${
                          userDropdownOpen ||
                          pathname.includes("/admin/player-management") ||
                          pathname.includes("/admin/coach-management") ||
                          pathname.includes("/admin/scout")
                            ? "bg-primary text-white font-medium"
                            : "text-title"
                        }`}
                      >
                        <div className="flex items-center gap-3 ">
                          {item.icon && (
                            <Image
                              src={item.icon}
                              alt={item.label}
                              width={20}
                              height={20}
                              className={`object-contain ${
                                pathname === item.href
                                  ? "brightness-0 invert-0"
                                  : "brightness-0 invert"
                              }`}
                            />
                          )}
                          <span>{item.label}</span>
                        </div>
                        <span>{userDropdownOpen ? "▲" : "▼"}</span>
                      </button>
                    </li>
                  </div>
                );
              }

              return (
                <li key={idx}>
                  <Link
                    href={item.href!}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base transition-colors ${
                      isActive
                        ? "bg-primary text-white font-medium"
                        : "text-black hover:bg-pink-50 "
                    }`}
                    onClick={onCloseClick}
                  >
                    {item.isImage ? (
                      <Image
                        src={item.icon!}
                        alt={item.label}
                        width={20}
                        height={20}
                        className={`transition-all ${
                          pathname === item.href
                            ? "brightness-0 invert"
                            : "brightness-0 invert-0 "
                        }`}
                      />
                    ) : (
                      item.icon && <item.icon className="w-5 h-5" />
                    )}
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Logout */}
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg text-sm font-medium bg-[#FFFFFF1A] text-[#FF8989] hover:bg-[#ffffff1e] transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default Sidebar;
