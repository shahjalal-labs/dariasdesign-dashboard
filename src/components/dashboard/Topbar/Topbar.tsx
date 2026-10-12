/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import profileAvatar from "@/assets/navbar/profile.png";
import { useMyProfileQuery } from "@/redux/api/authApi";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AiOutlineMenu } from "react-icons/ai";

const Topbar: React.FC<{ onHamburgerClick: () => void }> = ({
  onHamburgerClick,
}) => {
  const { data: myProfileData, isLoading } = useMyProfileQuery({});
  const profile = myProfileData?.result?.profileimage;

  const token = Cookies.get("token");
  let decodedToken: any = null;

  if (token) {
    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      decodedToken = null;
    }
  }

  const pathname = usePathname();

  const isNotificationActive = pathname === "/admin/notification";

  const getPageTitle = () => {
    switch (pathname) {
      case "/admin/dashboard":
        return "Overview";
      case "/admin/user-management":
        return "User Management";
      case "/admin/event-management":
        return "Event Management";
      case "/admin/event-booking":
        return "Event Booking";
      case "/admin/discount":
        return "Discount";
      case "/admin/settings":
        return "Settings";
      default:
        return "Admin Panel";
    }
  };

  return (
    <header className="bg-secondary shadow-sm py-6 px-6 lg:px-16 w-full">
      <div className="flex justify-between items-center flex-wrap">
        <button
          className="lg:hidden text-2xl text-title"
          onClick={onHamburgerClick}
        >
          <AiOutlineMenu />
        </button>

        <div className="flex items-center gap-6">
          <h1 className="text-black text-[16px] md:text-[24px] font-bold">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-5">
          {/* <Link href="/admin/notification" className="relative">
            <div
              className={`relative p-1 rounded-full ${
                isNotificationActive
                  ? "bg-primary text-white"
                  : "text-white bg-[#52C41A1A]"
              }`}
            >
              <MdOutlineNotifications size={25} />
            </div>
          </Link> */}
          <Link href={`/admin/settings`}>
            {isLoading ? (
              <div className="h-10 w-10 animate-pulse rounded-full bg-[#e6e8ef]" />
            ) : (
              <Image
                src={profile || profileAvatar}
                className="h-10 w-10 rounded-full object-cover"
                alt="profile icon"
                width={40}
                height={40}
              />
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
