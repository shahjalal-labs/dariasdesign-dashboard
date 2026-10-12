"use client";

import Image from "next/image";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { CustomModal } from "../modal/CustomModal";
import ReusableTable from "./ReusableTable";

const CoachManagement = () => {
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
    { key: "name", label: "Coach Name" },
    { key: "city", label: "City" },
    { key: "senior", label: "Last Season's Category (Senior/Adult)" },
    { key: "youth", label: "Last Season's Category (Youth)" },
    { key: "status", label: "Status" },
    { key: "action", label: "Action" },
  ];

  const data = [
    {
      id: 1,
      coach_name: "Kristin Watson",
      name: "Kristin Watson",
      role: "Professional Coach",
      city: "2972 Westheimer Rd, USA",
      licenses: "UEFA Pro License",
      category: "Professionals",
      category_youth: "U-13 Giovannissimi Professionals",
      bio: "Experienced football coach with 10+ years in youth and senior training.",
      institute: "Harvard Sports Academy",
      skills: "Leadership, Strategy, Fitness Training",
      dob: "1990-05-12",
      height: "178",
      weight: "72",
      dominantFoot: "Right",
      primary_position: "Midfielder",
      secondary_position: "Defender",
      playing_style: "Possession-based",
      certificate: "/certificate.png", // put your image in public folder
      resume: "resume_kristin.pdf",
      status: "Active",
    },
    {
      id: 2,
      coach_name: "Savannah Nguyen",
      name: "Savannah Nguyen",
      role: "Athletic Trainer",
      city: "3891 Ranchview Dr, USA",
      licenses: "FIFA Certified Trainer",
      category: "Athletic Trainer",
      category_youth: "U-14 Giovannissimi Regional",
      bio: "Specialist in athletic performance and injury recovery.",
      institute: "Stanford Sports Institute",
      skills: "Rehabilitation, Strength Training",
      dob: "1988-09-20",
      height: "165",
      weight: "60",
      dominantFoot: "Left",
      primary_position: "Forward",
      secondary_position: "Winger",
      playing_style: "Counter Attack",
      certificate: "/certificate.png",
      resume: "resume_savannah.pdf",
      status: "Active",
    },
    {
      id: 3,
      coach_name: "Brooklyn Simmons",
      name: "Brooklyn Simmons",
      role: "Masseur",
      city: "2715 Ash Dr, USA",
      licenses: "Sports Therapy License",
      category: "Masseur",
      category_youth: "U-13 Giovannissimi Professionals",
      bio: "Expert in muscle recovery and sports massage therapy.",
      institute: "Oxford Health Institute",
      skills: "Massage Therapy, Recovery",
      dob: "1992-02-14",
      height: "170",
      weight: "65",
      dominantFoot: "Right",
      primary_position: "Defender",
      secondary_position: "Midfielder",
      playing_style: "Defensive",
      certificate: "/certificate.png",
      resume: "resume_brooklyn.pdf",
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
        Coach Management
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
                <p className="text-sm text-gray-400">Coach Name</p>
                <p className="text-white font-medium">
                  {selectedPlayer.coach_name}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2 ">
                <p className="text-sm text-gray-400">Coach/Professional role</p>
                <p className="text-white font-medium">{selectedPlayer.role}</p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">City</span>
                <span className="text-white font-medium">
                  {selectedPlayer.city}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Licenses</span>
                <span className="text-white font-medium">
                  {selectedPlayer.licenses}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  Last Season’s Category (Senior/Adult)
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.category}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  Last Season’s Category (Youth)
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.category_youth}
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
                  Education (optional)
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.institute}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Skills</span>
                <span className="text-white font-medium">
                  {selectedPlayer.skills}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Date of Birth</span>
                <span className="text-white font-medium">
                  {selectedPlayer.dob}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Height (cm)</span>
                <span className="text-white font-medium">
                  {selectedPlayer.height}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Weight (kg)</span>
                <span className="text-white font-medium">
                  {selectedPlayer.weight}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Dominant Foot</span>
                <span className="text-white font-medium">
                  {selectedPlayer.dominantFoot}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Primary Position</span>
                <span className="text-white font-medium">
                  {selectedPlayer.primary_position}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  Secondary Position
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.secondary_position}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Current Category</span>
                <span className="text-white font-medium">
                  {selectedPlayer.secondary_position}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Playing Style</span>
                <span className="text-white font-medium">
                  {selectedPlayer.playing_style}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  Medical Certificate
                </span>
                <Image
                  src={selectedPlayer.certificate}
                  alt="certificate"
                  width={200}
                  height={200}
                  className="bg-[#52C41A1A]"
                />
              </div>
              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">Resume</span>
                <span className="text-white font-medium">
                  {selectedPlayer.resume}
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
};

export default CoachManagement;
