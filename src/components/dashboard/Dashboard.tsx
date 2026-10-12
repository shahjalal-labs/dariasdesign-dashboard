"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useAdminDashboardOverviewQuery } from "@/redux/api/admin/dashboarApi";
import { RiDeleteBin6Line } from "react-icons/ri";
import StatsCards from "./StatsCards";

type RevenueItem = {
  label: string;
  totalRevenue: number;
};

type PaymentStatus = {
  name: string;
  value: number;
  color: string;
};

type User = {
  id: string;
  profileImage: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: string;
};

type DashboardResponse = {
  totalTicketSold: number;
  totalRevenue: number;
  totalSlots: number;
  availableSpots: number;
  paymentStatus: Array<{ name: string; count: number }>;
  userList: User[];
  earningReport: Array<{ time: string; total: number }>;
};

export default function Dashboard() {
  const [selected, setSelected] = useState("monthly");
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Fetch dashboard overview with filter
  const {
    data: overviewResponse,
    isLoading,
    isError,
  } = useAdminDashboardOverviewQuery(selected);

  const overviewData = overviewResponse?.result as
    | DashboardResponse
    | undefined;
  const isInitialLoading = isLoading && !overviewData;

  // Transform earning report to chart format
  const chartData: RevenueItem[] = overviewData?.earningReport
    ? overviewData.earningReport.map((item) => ({
        label: item.time,
        totalRevenue: item.total,
      }))
    : [];

  // Transform payment status to include colors
  const paymentData: PaymentStatus[] = overviewData?.paymentStatus
    ? overviewData.paymentStatus.map((item, index) => {
        const colors = ["#5f3de3", "#4fbe1d", "#eb2d72"];
        return {
          name: item.name,
          value: item.count,
          color: colors[index % colors.length],
        };
      })
    : [];

  // Get user list from API or empty array
  const userList: User[] = overviewData?.userList || [];

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return userList.slice(0, 4); // Show first 4 users

    return userList.filter(
      (user) =>
        user.fullName.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        user.phoneNumber.includes(query),
    );
  }, [search, userList]);

  // Prepare stats for StatsCards
  const stats = [
    {
      title: "Total Users",
      value: overviewData?.totalRevenue
        ? `${overviewData.userList?.length || 0}`
        : "0",
      description: "Active users in system",
    },
    {
      title: "Total Revenue",
      value: `$${overviewData?.totalRevenue?.toFixed(2) || "0.00"}`,
      description: "Total earnings",
    },
    {
      title: "Total Slots",
      value: overviewData?.totalSlots?.toString() || "0",
      description: "Available time slots",
    },
    {
      title: "Available Spots",
      value: overviewData?.availableSpots?.toString() || "0",
      description: "Open booking spots",
    },
  ];

  const maxRevenue = Math.max(
    ...chartData.map((d: RevenueItem) => d.totalRevenue || 0),
    1,
  );

  const options = [
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
  ];

  const revenueTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload?.length) return null;

    return (
      <div className="rounded-xl border border-[#f1f1f4] bg-white px-3 py-2 shadow-lg">
        <p className="text-xs text-[#8a8a94]">{label}</p>
        <p className="text-sm font-semibold text-[#252525]">
          {payload[0].value.toLocaleString()}k
        </p>
      </div>
    );
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8">
      <div className="rounded-3xl border border-[#ececf2] bg-[#f9fafc] p-4">
        <StatsCards stats={stats} />
      </div>

      <div className="mb-6 mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border border-[#ececf2] bg-white shadow-sm">
          <div className="relative flex items-start justify-between p-4 md:p-6">
            <CardHeader className="p-0">
              <CardTitle className="text-[34px] font-medium leading-none text-[#1f1f24]">
                Earning Report
              </CardTitle>
            </CardHeader>

            <div className="relative">
              <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-1 rounded-xl border border-[#ebebf0] bg-[#fbfbfd] px-4 py-2 text-sm font-medium text-[#676779]"
              >
                {options.find((o) => o.value === selected)?.label || "Monthly"}
                <ChevronDown className="h-4 w-4" />
              </button>

              {open && (
                <div className="absolute right-0 z-10 mt-2 w-40 overflow-hidden rounded-xl border border-[#ececf2] bg-white shadow-xl">
                  {options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSelected(option.value);
                        setOpen(false);
                      }}
                      className="w-full px-3 py-2 text-left text-sm text-[#676779] transition-colors hover:bg-[#f7f7fb]"
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <CardContent>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#efeff5"
                    strokeDasharray="4 5"
                  />
                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9b9bac", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    allowDecimals={false}
                    domain={[0, maxRevenue + 20]}
                    tick={{ fill: "#9b9bac", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f3f3f8" }}
                    content={revenueTooltip}
                  />
                  <Bar
                    barSize={30}
                    dataKey="totalRevenue"
                    radius={[10, 10, 10, 10]}
                    minPointSize={5}
                  >
                    {chartData.map((entry: RevenueItem, index: number) => (
                      <Cell
                        key={index}
                        fill={
                          entry.totalRevenue === maxRevenue
                            ? "#ea2d72"
                            : "#eba2be"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#ececf2] bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-[34px] font-medium leading-none text-[#1f1f24]">
              Payment Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto h-64 max-w-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={paymentData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={58}
                    outerRadius={82}
                    startAngle={90}
                    endAngle={-270}
                    strokeWidth={0}
                  >
                    {paymentData.map((entry: PaymentStatus) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#8a8a94]">
              {paymentData.map((item: PaymentStatus) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-2xl border border-[#ececf2] bg-white p-4 md:p-6">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h1 className="text-[34px] font-medium leading-none text-[#1f1f24]">
            User List
          </h1>
          <div className="flex items-center gap-3">
            <div className="relative w-full min-w-[220px] md:w-[280px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#a0a0b0]" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search"
                className="h-10 rounded-xl border-[#e9e9ef] bg-[#fbfbfd] pl-9 text-[#30303a]"
              />
            </div>
            <button className="h-10 rounded-xl bg-primary px-7 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90">
              See All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="border-y border-[#ececf2] text-left text-base text-[#5f5f6e]">
                <th className="py-4 pr-4 font-medium">User Name</th>
                <th className="px-4 py-4 font-medium">Email Address</th>
                <th className="px-4 py-4 font-medium">Phone Number</th>
                <th className="px-4 py-4 font-medium">Status</th>
                <th className="px-4 py-4 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user: User) => (
                <tr
                  key={user.id}
                  className="border-b border-[#f1f1f5] text-[#2f2f37]"
                >
                  <td className="py-4 pr-4 text-base">{user.fullName}</td>
                  <td className="px-4 py-4 text-base text-[#5f5f6e]">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 text-base text-[#5f5f6e]">
                    {user.phoneNumber}
                  </td>
                  <td className="px-4 py-4">
                    <span
                      className={`rounded-md px-4 py-1 text-sm font-medium ${
                        user.status === "Active"
                          ? "bg-[#eef8e7] text-[#4baf2f]"
                          : "bg-[#fff1f1] text-[#d44d4f]"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end text-[#ff5a5f]">
                      <button className="transition-transform hover:scale-110">
                        <RiDeleteBin6Line size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-[#ececf2] bg-[#f9fafc] p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-2xl border border-[#f1d9e3] bg-white/80 p-5"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-[#ececf2]" />
                <div className="h-4 w-24 rounded bg-[#ececf2]" />
              </div>
              <div className="h-10 w-28 rounded bg-[#ececf2]" />
              <div className="mt-3 h-3 w-32 rounded bg-[#f2f3f7]" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2 rounded-2xl border border-[#ececf2] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between p-4 md:p-6">
            <div className="space-y-3">
              <div className="h-8 w-48 rounded bg-[#ececf2]" />
              <div className="h-4 w-32 rounded bg-[#f2f3f7]" />
            </div>
            <div className="h-10 w-28 rounded-xl bg-[#ececf2]" />
          </CardHeader>
          <CardContent>
            <div className="h-72 w-full animate-pulse rounded-2xl border border-dashed border-[#ececf2] bg-[linear-gradient(180deg,#fafafe_0%,#f4f6fb_100%)] p-4">
              <div className="flex h-full items-end gap-3">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="flex-1">
                    <div
                      className="mx-auto w-full rounded-t-2xl bg-[#e5e8ef]"
                      style={{ height: `${25 + (index % 5) * 14}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-[#ececf2] bg-white shadow-sm">
          <CardHeader className="pb-2">
            <div className="space-y-3">
              <div className="h-8 w-44 rounded bg-[#ececf2]" />
              <div className="h-4 w-28 rounded bg-[#f2f3f7]" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex h-72 items-center justify-center">
              <div className="h-52 w-52 rounded-full border-[20px] border-[#f1f3f8] animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-2xl border border-[#ececf2] bg-white shadow-sm">
        <CardHeader className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:justify-between md:p-6">
          <div className="space-y-3">
            <div className="h-8 w-40 rounded bg-[#ececf2]" />
            <div className="h-4 w-56 rounded bg-[#f2f3f7]" />
          </div>
          <div className="h-11 w-full rounded-xl bg-[#ececf2] md:w-72" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 rounded-2xl bg-[#fafbfe] p-4 animate-pulse"
              >
                <div className="h-4 rounded bg-[#ececf2]" />
                <div className="h-4 rounded bg-[#ececf2]" />
                <div className="h-4 rounded bg-[#ececf2]" />
                <div className="h-4 rounded bg-[#ececf2]" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
