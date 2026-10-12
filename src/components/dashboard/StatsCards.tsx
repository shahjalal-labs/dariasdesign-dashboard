"use client";

import { DollarSign, Ticket, Timer, UserRoundCheck } from "lucide-react";
import { Card, CardContent } from "../ui/card";

type StatItem = {
  title: string;
  value: string;
  description?: string;
};

const defaultIcons: Record<string, typeof Ticket> = {
  "Total Users": UserRoundCheck,
  "Total Revenue": DollarSign,
  "Total Slots": Timer,
  "Available Spots": Ticket,
};

const defaultColors: Record<string, { bg: string; iconBg: string }> = {
  "Total Users": {
    bg: "bg-[#f7e7ef]",
    iconBg: "bg-[#ea2d72]",
  },
  "Total Revenue": {
    bg: "bg-[#f5eedf]",
    iconBg: "bg-[#f2a90b]",
  },
  "Total Slots": {
    bg: "bg-[#f8e7eb]",
    iconBg: "bg-[#ef6f84]",
  },
  "Available Spots": {
    bg: "bg-[#f8e7eb]",
    iconBg: "bg-[#f06f86]",
  },
};

interface StatsCardsProps {
  stats?: StatItem[];
}

export default function StatsCards({ stats: customStats }: StatsCardsProps) {
  const defaultStats = [
    {
      title: "Total Users",
      value: "0",
      description: "Active users",
    },
    {
      title: "Total Revenue",
      value: "$0.00",
      description: "Total earnings",
    },
    {
      title: "Total Slots",
      value: "0",
      description: "Available slots",
    },
    {
      title: "Available Spots",
      value: "0",
      description: "Open spots",
    },
  ];

  const displayStats = customStats || defaultStats;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {displayStats.map((stat) => {
        const Icon = defaultIcons[stat.title] || Ticket;
        const colors = defaultColors[stat.title] || {
          bg: "bg-[#f7e7ef]",
          iconBg: "bg-[#ea2d72]",
        };

        return (
          <Card
            key={stat.title}
            className={`${colors.bg} border border-[#f1d9e3] shadow-none rounded-2xl`}
          >
            <CardContent className="p-5">
              <div className="mb-5 flex items-center gap-3 text-[#3f3f46]">
                <span
                  className={`${colors.iconBg} inline-flex h-8 w-8 items-center justify-center rounded-full text-white`}
                >
                  <Icon size={14} />
                </span>
                <p className="text-base font-medium">{stat.title}</p>
              </div>
              <p className="text-[40px] leading-none tracking-[-0.02em] text-[#252525]">
                {stat.value}
              </p>
              {stat.description && (
                <p className="mt-2 text-sm text-[#8a8a94]">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
