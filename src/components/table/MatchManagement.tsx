"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import StatsCards from "../dashboard/StatsCards";
import { CustomModal } from "../modal/CustomModal";
import ReusableTable from "./ReusableTable";

export default function MatchManagement() {
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
    { key: "title", label: "Match Title" },

    { key: "organization", label: "Organized By" },
    { key: "date", label: "Match Date" },
    { key: "location", label: "Location" },
    { key: "category_age", label: "Age Category" },
    { key: "price", label: "Ticket Price" },
    { key: "team", label: "Participant Team" },
    { key: "action", label: "Action" },
  ];

  const data = [
    {
      id: 1,
      title: "U-16 Championship Final",
      type: "Tournament Final", // ✅ NEW
      organization: "Barcelona Youth Academy",
      date: "2026-05-12",
      location: "Barcelona, Spain",
      category_age: "U-16",
      price: "$20",
      team: "FC Barcelona U16 vs Real Madrid U16",

      referee: "John Smith",
      duration: "90 mins",
      stadium: "Camp Nou Mini",
      description: "Final match of the U-16 youth championship.",
      status: "Upcoming",
    },
    {
      id: 2,
      title: "Regional League Match",
      type: "League Match", // ✅ NEW
      organization: "Manchester FA",
      date: "2026-04-25",
      location: "Manchester, UK",
      category_age: "U-18",
      price: "$15",
      team: "Manchester United U18 vs Liverpool U18",

      referee: "David Miller",
      duration: "90 mins",
      stadium: "Old Trafford Youth মাঠ",
      description: "Top regional rivalry match.",
      status: "Upcoming",
    },
    {
      id: 3,
      title: "Friendly Match",
      type: "Friendly", // ✅ NEW
      organization: "Ajax Academy",
      date: "2026-04-10",
      location: "Amsterdam, Netherlands",
      category_age: "U-14",
      price: "Free",
      team: "Ajax U14 vs PSV U14",

      referee: "Mark de Jong",
      duration: "80 mins",
      stadium: "Ajax Training Ground",
      description: "Friendly development match.",
      status: "Completed",
    },
    {
      id: 4,
      title: "International Youth Cup",
      type: "Tournament", // ✅ NEW
      organization: "FIFA Youth",
      date: "2026-06-01",
      location: "Munich, Germany",
      category_age: "U-20",
      price: "$30",
      team: "Germany U20 vs France U20",

      referee: "Thomas Muller",
      duration: "90 mins",
      stadium: "Allianz Arena",
      description: "International youth tournament.",
      status: "Upcoming",
    },
    {
      id: 5,
      title: "Grassroots Tournament",
      type: "Grassroots Event", // ✅ NEW
      organization: "Local FA",
      date: "2026-04-05",
      location: "New York, USA",
      category_age: "U-12",
      price: "$5",
      team: "NYC Kids vs LA Juniors",

      referee: "James Carter",
      duration: "60 mins",
      stadium: "Community Field",
      description: "Local grassroots competition.",
      status: "Completed",
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
          Match Management
        </div>

        <ReusableTable
          columns={columns}
          data={formattedData}
          renderActions={renderActions}
        />

        <CustomModal
          open={isModalOpen}
          onClose={handleCloseModal}
          title="Match Details"
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
                  <p className="text-sm text-gray-400">Match Title</p>
                  <p className="text-white font-medium">
                    {selectedPlayer.title}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2 ">
                  <p className="text-sm text-gray-400">Match Type</p>
                  <p className="text-white font-medium">
                    {selectedPlayer.type}
                  </p>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">
                    Match Description
                  </span>
                  <span className="text-white font-medium">
                    {selectedPlayer.description}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Organized By</span>
                  <span className="text-white font-medium">
                    {selectedPlayer.organization}
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Match Date</span>
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
                  <span className="text-sm text-gray-400">Age Category</span>
                  <span className="text-white font-medium">
                    {selectedPlayer.bio}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">Ticket Price</span>
                  <span className="text-white font-medium">
                    {selectedPlayer.category}
                  </span>
                </div>

                <div className="flex justify-between items-center border-t border-gray-700 p-2">
                  <span className="text-sm text-gray-400">
                    Participant Team
                  </span>
                  <span className="text-white font-medium">
                    {selectedPlayer.team}
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
