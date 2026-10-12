"use client";

import Image from "next/image";
import { useState } from "react";
import { FaEye } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";

import { CustomModal } from "../modal/CustomModal";
import ReusableTable from "./ReusableTable";

export const playerData = [
  {
    id: 1,
    playerName: "Roberts Albert",
    gender: "Male",
    profession: "Defensive Midfielder",
    dominantFoot: "Left",
    status: "Active",
    playing_style: "Ball-Winning Midfielder",
    primary_position: "Central Midfield",
    secondary_position: "Defensive Midfield",
    city: "London",
    bio: "Strong defensive midfielder with excellent tackling and passing skills.",
    institute: "London Football Academy",
    skills: "Tackling, Passing, Positioning",
    dob: "1995-06-15",
    height: 180,
    weight: 75,
    certificate: "/certificates/roberts-albert-cert.png",
    resume: "roberts_albert_resume.pdf",
    avatar: "/players/roberts-albert.png",
    current_category: "Senior",
  },
  {
    id: 2,
    playerName: "Alex Carter",
    gender: "Female",
    profession: "Left Back",
    dominantFoot: "Right",
    status: "Active",
    playing_style: "Overlapping Fullback",
    primary_position: "Left Back",
    secondary_position: "Wing Back",
    city: "Manchester",
    bio: "Fast and aggressive fullback with strong attacking instincts.",
    institute: "Manchester Youth Club",
    skills: "Speed, Crossing, Tackling",
    dob: "2000-02-10",
    height: 170,
    weight: 60,
    certificate: "/certificates/alex-carter-cert.png",
    resume: "alex_carter_resume.pdf",
    avatar: "/players/alex-carter.png",
    current_category: "Senior",
  },
  {
    id: 3,
    playerName: "Mia Johnson",
    gender: "Female",
    profession: "Winger",
    dominantFoot: "Both",
    status: "Active",
    playing_style: "Target Man",
    primary_position: "Left Wing",
    secondary_position: "Right Wing",
    city: "New York",
    bio: "Dynamic winger with great dribbling and finishing skills.",
    institute: "NYC Football Academy",
    skills: "Dribbling, Speed, Shooting",
    dob: "1998-11-21",
    height: 165,
    weight: 55,
    certificate: "/certificates/mia-johnson-cert.png",
    resume: "mia_johnson_resume.pdf",
    avatar: "/players/mia-johnson.png",
    current_category: "Senior",
  },
  {
    id: 4,
    playerName: "Jordan Lee",
    gender: "Male",
    profession: "Defensive Midfielder",
    dominantFoot: "Left",
    status: "Inactive",
    playing_style: "Pressing Forward",
    primary_position: "Defensive Midfield",
    secondary_position: "Central Midfield",
    city: "Los Angeles",
    bio: "Energetic midfielder known for aggressive pressing and stamina.",
    institute: "LA Football Academy",
    skills: "Stamina, Tackling, Pressing",
    dob: "1997-08-30",
    height: 178,
    weight: 70,
    certificate: "/certificates/jordan-lee-cert.png",
    resume: "jordan_lee_resume.pdf",
    avatar: "/players/jordan-lee.png",
    current_category: "Senior",
  },
  {
    id: 5,
    playerName: "Samantha Kim",
    gender: "Female",
    profession: "Left Back",
    dominantFoot: "Left",
    status: "Active",
    playing_style: "Deep-Lying Playmaker",
    primary_position: "Left Back",
    secondary_position: "Central Midfield",
    city: "Seoul",
    bio: "Tactically intelligent player with excellent distribution and vision.",
    institute: "Seoul Football Academy",
    skills: "Passing, Vision, Positioning",
    dob: "1999-05-12",
    height: 172,
    weight: 62,
    certificate: "/certificates/samantha-kim-cert.png",
    resume: "samantha_kim_resume.pdf",
    avatar: "/players/samantha-kim.png",
    current_category: "Senior",
  },
];

const columns = [
  { key: "playerName", label: "Player Name" },
  { key: "gender", label: "Gender" },
  { key: "profession", label: "Profession Subcategory" },
  { key: "dominantFoot", label: "Dominant Foot" },
  { key: "status", label: "Status" },
  { key: "playingStyle", label: "Playing Style" },
  { key: "action", label: "Action" },
];

export default function PlayerManagement() {
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

  const renderActions = (row: any) => (
    <div className="flex gap-2">
      <button
        className="text-[#FAAD14] hover:text-orange-400"
        onClick={() => handleViewPlayer(row)}
      >
        <FaEye size={20} />
      </button>
      <button className="text-red-500 hover:text-red-500">
        <RiDeleteBin6Line size={20} />
      </button>
    </div>
  );

  const renderPlayerName = (row: any) => (
    <div className="flex items-center gap-2">
      {row.avatar && (
        <Image
          src={row.avatar}
          alt={"profile"}
          width={30}
          height={30}
          className="rounded-full object-contain bg-slate-600"
        />
      )}
      <span>{row.playerName}</span>
    </div>
  );

  const modifiedData = playerData.map((row) => ({
    ...row,
    playerName: renderPlayerName(row),
  }));

  return (
    <>
      <div className="p-6 bg-formBg rounded-2xl min-h-screen text-white">
        <h2 className="text-xl font-normal mb-4 text-white">
          View Player Details
        </h2>
        <ReusableTable
          columns={columns}
          data={modifiedData}
          renderActions={renderActions}
        />
      </div>

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
                <p className="text-sm text-gray-400">Player Name</p>
                <p className="text-white font-medium">
                  {selectedPlayer.playerName}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2 ">
                <p className="text-sm text-gray-400">Gender</p>
                <p className="text-white font-medium">
                  {selectedPlayer.gender}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">
                  Profession Subcategory
                </span>
                <span className="text-white font-medium">
                  {selectedPlayer.profession}
                </span>
              </div>

              <div className="flex justify-between items-center border-t border-gray-700 p-2">
                <span className="text-sm text-gray-400">City</span>
                <span className="text-white font-medium">
                  {selectedPlayer.city}
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
              <div className="flex justify-between items-center border-t border-gray-700 p-4 border-b ">
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
    </>
  );
}
