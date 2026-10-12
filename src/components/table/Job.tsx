"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import StatsCards from "../dashboard/StatsCards";
import { CustomModal } from "../modal/CustomModal";
import ReusableTable from "./ReusableTable";

export default function Job() {
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewPlayer = (player: any) => {
    setSelectedPlayer(player);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlayer(null);
  };
  const columns = [
    { key: "title", label: "Job/Circular Title" },

    { key: "hiring", label: "Hiring By" },
    { key: "position", label: "Position" },
    { key: "date", label: "Job/Circular Date" },
    { key: "location", label: "Location" },
    { key: "type", label: "Employment Type" },
    { key: "currency", label: "Job Currency" },
    { key: "action", label: "Action" },
  ];

  const data = [
    {
      id: 1,
      title: "Senior Football Coach Required",
      hiring: "FC Barcelona Academy",
      position: "Head Coach",
      date: "2026-04-15",
      location: "Barcelona, Spain",
      type: "Full-Time",
      currency: "€5000/month",
      participate: 24, // ✅ NEW

      experience: "5+ Years",
      qualification: "UEFA Pro License",
      description: "Looking for an experienced head coach for youth academy.",
      status: "Active",
    },
    {
      id: 2,
      title: "Youth Team Assistant Coach",
      hiring: "Manchester United Academy",
      position: "Assistant Coach",
      date: "2026-04-20",
      location: "Manchester, UK",
      type: "Part-Time",
      currency: "£2500/month",
      participate: 18,

      experience: "2+ Years",
      qualification: "FA Coaching License",
      description: "Assist senior coach in training U-18 players.",
      status: "Inactive",
    },
    {
      id: 3,
      title: "Football Fitness Trainer",
      hiring: "Ajax Youth Academy",
      position: "Fitness Trainer",
      date: "2026-04-10",
      location: "Amsterdam, Netherlands",
      type: "Contract",
      currency: "€3000/month",
      participate: 32,

      experience: "3+ Years",
      qualification: "Sports Science Degree",
      description: "Handle player fitness and recovery sessions.",
      status: "Active",
    },
    {
      id: 4,
      title: "Goalkeeping Coach Needed",
      hiring: "Bayern Munich Academy",
      position: "Goalkeeping Coach",
      date: "2026-05-01",
      location: "Munich, Germany",
      type: "Full-Time",
      currency: "€4500/month",
      participate: 12,

      experience: "4+ Years",
      qualification: "UEFA B License",
      description: "Train and develop goalkeepers for youth squads.",
      status: "Active",
    },
    {
      id: 5,
      title: "Grassroots Football Trainer",
      hiring: "Local FA Organization",
      position: "Trainer",
      date: "2026-04-05",
      location: "New York, USA",
      type: "Temporary",
      currency: "$1500/month",
      participate: 9,

      experience: "1+ Year",
      qualification: "Basic Coaching Certificate",
      description: "Train beginner-level young players.",
      status: "Active",
    },
  ];

  const renderActions = (row: any) => (
    <div className="flex gap-2">
      <button
        onClick={() => handleViewPlayer(row)}
        className="text-[#FAAD14] hover:text-orange-400"
      >
        <FaEye size={20} />
      </button>
      <button className="text-red-500 hover:text-red-500">
        <RiDeleteBin6Line size={20} />
      </button>
    </div>
  );

  const formattedData = data.map((item) => ({
    ...item,
    name: (
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
          {item.title.charAt(0)}
        </div>
        <span>{item.title}</span>
      </div>
    ),
  }));

  return (
    <div>
      <div className="bg-formBg rounded-2xl">
        <StatsCards />
      </div>

      <div className="bg-formBg text-white border border-[#222] rounded-2xl overflow-hidden p-4">
        <div className=" py-4 border-b border-[#222] text-lg font-semibold">
          Job/Circular Management
        </div>

        <ReusableTable
          columns={columns}
          data={formattedData}
          renderActions={renderActions}
        />

        <CustomModal
          open={isModalOpen}
          onClose={handleCloseModal}
          title="Job/Circular Details"
          maxWidth="3xl"
          actions={[
            {
              label: "Close",
              onClick: handleCloseModal,
              variant: "secondary",
            },
          ]}
        >
          {selectedPlayer && (
            <div className=" w-full  border-t border-gray-700">
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2">
                  <p className="text-sm text-gray-400">Job/Circular Title</p>
                  <p className="text-white font-medium">
                    {selectedPlayer.title}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2 ">
                  <p className="text-sm text-gray-400">Hiring By</p>
                  <p className="text-white font-medium">
                    {selectedPlayer.hiring}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Position</span>
                  <span className="text-white font-medium">
                    {selectedPlayer.position}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">
                    Job/Circular Date
                  </span>
                  <span className="text-white font-medium">
                    {selectedPlayer.date}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Location</span>
                  <span className="text-white font-medium">
                    {selectedPlayer.location}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Employment Type</span>
                  <span className="text-white font-medium">
                    {selectedPlayer.type}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Job Currency</span>
                  <span className="text-white font-medium">
                    {selectedPlayer.currency}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Status</span>
                  <span
                    className={`px-4 py-2 text-xs rounded ${selectedPlayer.status === "Active" ? "bg-[#52C41A1A] text-primary" : "bg-[#FF00001A] text-red-500"}`}
                  >
                    {selectedPlayer.status}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 p-4 border-b">
                  <span className="text-sm text-gray-400">
                    All Participants
                  </span>
                  <span className="text-white font-medium">
                    {selectedPlayer.participate}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CustomModal>
      </div>
    </div>
  );
}
