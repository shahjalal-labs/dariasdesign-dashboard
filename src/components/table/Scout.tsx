"use client";

import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomModal } from "../modal/CustomModal";
import ReusableTable from "./ReusableTable";

export default function Scout() {
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
    { key: "name", label: "Scout Operator Name (Manager)" },
    { key: "experience", label: "Years of Experience" },
    { key: "organization", label: "Current Organization (if any)" },
    { key: "level", label: "Scouting Level" },
    { key: "specialization", label: "Specialization" },
    { key: "evaluation", label: "Evaluation Method" },
    { key: "action", label: "Action" },
  ];

  const data = [
    {
      id: 1,
      name: "Kristin Watson",
      experience: "10 Years",
      organization: "FC Barcelona Academy",
      level: "Professional",
      specialization: "Youth Talent Identification",
      evaluation: "Match Analysis + Video Review",

      // ✅ NEW FIELDS
      category: "Elite Scout",
      preferred_roles: "Winger, Attacking Midfielder",
      licenses: "UEFA Scout License, FIFA Talent ID",

      // extra (modal)
      email: "kristin.watson@mail.com",
      phone: "+1 234 567 890",
      city: "Barcelona, Spain",
      bio: "Expert in identifying young football talent across European leagues.",
      status: "Active",
    },
    {
      id: 2,
      name: "Savannah Nguyen",
      experience: "7 Years",
      organization: "Manchester United Scouts",
      level: "Regional",
      specialization: "Physical Performance Analysis",
      evaluation: "Fitness Metrics + Live Scouting",

      category: "Regional Scout",
      preferred_roles: "Defender, Defensive Midfielder",
      licenses: "FIFA Certified Scout",

      email: "savannah.nguyen@mail.com",
      phone: "+1 987 654 321",
      city: "Manchester, UK",
      bio: "Focuses on player physical performance and match endurance.",
      status: "Active",
    },
    {
      id: 3,
      name: "Brooklyn Simmons",
      experience: "5 Years",
      organization: "Independent",
      level: "Grassroots",
      specialization: "Local Talent Scouting",
      evaluation: "Trial Matches + Community Events",

      category: "Grassroots Scout",
      preferred_roles: "Striker, Winger",
      licenses: "Local FA Scout Certification",

      email: "brooklyn.simmons@mail.com",
      phone: "+1 456 789 123",
      city: "New York, USA",
      bio: "Works closely with local clubs to discover emerging players.",
      status: "Inactive",
    },
    {
      id: 4,
      name: "Devon Lane",
      experience: "8 Years",
      organization: "Ajax Youth Academy",
      level: "Elite Youth",
      specialization: "Technical Skill Analysis",
      evaluation: "Skill Drills + Match Footage",

      category: "Youth Scout",
      preferred_roles: "Midfielder, Playmaker",
      licenses: "UEFA B License, Talent Scout Cert",

      email: "devon.lane@mail.com",
      phone: "+31 123 456 789",
      city: "Amsterdam, Netherlands",
      bio: "Specialist in technical scouting and youth academy recruitment.",
      status: "Active",
    },
    {
      id: 5,
      name: "Jacob Jones",
      experience: "12 Years",
      organization: "Bayern Munich Scouts",
      level: "Professional",
      specialization: "International Scouting",
      evaluation: "Data Analytics + Global Reports",

      category: "International Scout",
      preferred_roles: "All Positions",
      licenses: "FIFA Pro Scout License",

      email: "jacob.jones@mail.com",
      phone: "+49 987 654 321",
      city: "Munich, Germany",
      bio: "Handles international scouting operations and player databases.",
      status: "Inactive",
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
          {item.name.charAt(0)}
        </div>
        <span>{item.name}</span>
      </div>
    ),
  }));

  return (
    <div className="bg-formBg text-white border border-[#222] rounded-2xl overflow-hidden p-4">
      <div className=" py-4 border-b border-[#222] text-lg font-semibold">
        Scout operators and managers
      </div>

      <ReusableTable
        columns={columns}
        data={formattedData}
        renderActions={renderActions}
      />

      <CustomModal
        open={isModalOpen}
        onClose={handleCloseModal}
        title="  View Player Details"
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
                <p className="text-sm text-gray-400">
                  Scout Operator Name (Manager)
                </p>
                <p className="text-white font-medium">
                  {selectedPlayer.coach_name}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2 ">
                <p className="text-sm text-gray-400">Years of Experience</p>
                <p className="text-white font-medium">
                  {selectedPlayer.experience}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  Current Organization (if any)
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.organization}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Scouting Level</span>
                <span className="text-white font-medium">
                  {selectedPlayer.level}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Specialization</span>
                <span className="text-white font-medium">
                  {selectedPlayer.specialization}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Evaluation Method</span>
                <span className="text-white font-medium">
                  {selectedPlayer.evaluation}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Professional Bio</span>
                <span className="text-white font-medium">
                  {selectedPlayer.bio}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  Preferred Age Categories
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.category}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Preferred Roles</span>
                <span className="text-white font-medium">
                  {selectedPlayer.preferred_roles}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  License / Certification
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.licenses}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-4 border-b">
                <span className="text-sm text-gray-400">Status</span>
                <span
                  className={`px-4 py-2 text-xs rounded ${selectedPlayer.status === "Active" ? "bg-[#52C41A1A] text-primary" : "bg-[#FF00001A] text-red-500"}`}
                >
                  {selectedPlayer.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </CustomModal>
    </div>
  );
}
