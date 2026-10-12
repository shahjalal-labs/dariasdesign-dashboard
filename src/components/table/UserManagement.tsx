"use client";

import { Input } from "@/components/ui/input";
import {
  useDeleteUserMutation,
  useGetAllUserListQuery,
} from "@/redux/api/admin/dashboarApi";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import DashboardPagination from "./DashboardPagination";
import TableSkeleton from "./TableSkeleton";

type User = {
  id: string;
  profileImage: string | null;
  fullName: string;
  email: string;
  phoneNumber: string;
  status: string;
};

const rowsPerPage = 10;

type UserListResponse = {
  meta?: {
    page: number;
    limit: number;
    totalCount: number;
    totalPage: number;
  };
  userList?: User[];
};

export default function UserManagement() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const { data: getUserListData, isFetching } = useGetAllUserListQuery({
    page,
    limit: rowsPerPage,
    search,
  });

  const response = getUserListData?.result as UserListResponse | undefined;
  const users = response?.userList || [];
  const totalPages = Math.max(1, response?.meta?.totalPage || 1);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user?",
    );
    if (!confirmed) return;

    await deleteUser(id).unwrap();
  };

  return (
    <div className="rounded-3xl border border-[#ececf2] bg-white px-4 py-5 shadow-sm md:px-7 md:py-6">
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[34px] font-semibold leading-none text-[#25252a]">
          User List
        </h2>
        <div className="relative w-full sm:w-[290px]">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#b0b4be]" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search"
            className="h-[50px] rounded-xl border-[#d8dde6] bg-white pl-11 text-[#30303a] placeholder:text-[#adb3bf]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        {isFetching && users.length === 0 ? (
          <TableSkeleton columns={5} rows={5} className="min-w-[900px]" />
        ) : (
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#e8eaf0] text-left text-base font-medium text-[#545861]">
                <th className="py-4 pr-4">User Name</th>
                <th className="px-4 py-4">Email Address</th>
                <th className="px-4 py-4">Phone Number</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="text-base text-[#2f3138]">
                  <td className="py-5 pr-4">{user.fullName}</td>
                  <td className="px-4 py-5 text-[#5f6572]">{user.email}</td>
                  <td className="px-4 py-5 text-[#5f6572]">
                    {user.phoneNumber}
                  </td>
                  <td className="px-4 py-5">
                    <span
                      className={`inline-flex min-w-[66px] items-center justify-center rounded-md px-3 py-1 text-xs font-medium ${
                        user.status === "Active"
                          ? "bg-[#ebf5e9] text-[#62be49]"
                          : "bg-[#ffecec] text-[#ff6d6f]"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={isDeleting}
                      className="inline-flex text-[#ff5f63] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <RiDeleteBin6Line size={20} />
                    </button>
                  </td>
                </tr>
              ))}

              {!isFetching && users.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-base text-[#8f95a2]"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      <DashboardPagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}
