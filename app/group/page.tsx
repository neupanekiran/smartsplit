'use client';
import { useState } from "react";
import { FaBeer, FaCoffee, FaArrowLeft } from 'react-icons/fa'; // Example icons
import { MdAlarm } from 'react-icons/md';
import Navbar from "../Navbar";
const groupData = [
    { name: "Trip Expenses", status: "You Owe", amount: "₹500" },
    { name: "Dinner Split", status: "Your Pay", amount: "₹300" },
  ];
export default function GroupPage() {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const groups = groupData;
  return (
    <>
    <div className="min-h-screen py-6  flex justify-center">
      <div className="container max-w-screen-md shadow-xl rounded-lg overflow-hidden">
        {selectedGroup !== null ? (
          <div className="flex flex-col h-full">
            <div className="bg-blue-600 text-white p-4 flex items-center">
              <button
                className="focus:outline-none"
                onClick={() => setSelectedGroup(null)}
              >
                <FaArrowLeft size={24} />
              </button>
              <h1 className="text-xl font-semibold ml-4">
                {groups[selectedGroup].name}
              </h1>
            </div>
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {groups[selectedGroup].name}
              </h2>
              <p
                className={`text-lg ${
                  groups[selectedGroup].status === "You Owe"
                    ? "text-red-600"
                    : "text-green-600"
                }`}
              >
                {groups[selectedGroup].status}: {groups[selectedGroup].amount}
              </p>
              <div className="mt-4">
                <p className="text-gray-700">Breakdown of expenses...</p>
                {/* Add detailed breakdown here */}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
               Groups
            </h1>
            {groups.map((group, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 mb-2 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200 cursor-pointer"
                onClick={() => setSelectedGroup(index)}
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-700">
                    {group.name}
                  </h2>
                  <p
                    className={`text-md ${
                      group.status === "You Owe"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {group.status}: {group.amount}
                  </p>
                </div>
                <div>
                  {group.status === "You Owe" ? <FaBeer size={24} className="text-red-500" /> : <MdAlarm size={24} className="text-green-500"/>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    <Navbar/></>
  );
}
