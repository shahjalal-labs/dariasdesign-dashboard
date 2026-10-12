"use client";

import profilePlaceholder from "@/assets/navbar/profile.png";
import {
  useChangePasswordMutation,
  useGetMyProfileQuery,
  useUpdateProfileMutation,
} from "@/redux/api/admin/settingApi";
import { ChevronRight, Eye, EyeOff, Info, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

type TabKey = "basic" | "account";

type ProfileForm = {
  fullName: string;
  email: string;
  phoneNumber: string;
};

type PasswordForm = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const tabConfig: Array<{ key: TabKey; label: string }> = [
  { key: "basic", label: "Basic" },
  { key: "account", label: "Account" },
];

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="mb-2 block text-[17px] font-medium text-[#1e1e24]">
      {children}
    </label>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  readOnly,
  type = "text",
  pink = false,
  rightAdornment,
}: {
  value: string;
  onChange?: (value: string) => void;
  placeholder: string;
  readOnly?: boolean;
  type?: string;
  pink?: boolean;
  rightAdornment?: React.ReactNode;
}) {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        readOnly={readOnly}
        placeholder={placeholder}
        onChange={(event) => onChange?.(event.target.value)}
        className={`h-14 w-full rounded-[10px] border px-4 text-[17px] outline-none transition-colors placeholder:text-[#a6afbf] ${
          pink
            ? "border-[#f4b2c6] bg-[#f7aac5] text-white placeholder:text-white/70"
            : "border-[#dfe3ec] bg-white text-[#2a2d36] focus:border-[#d1d7e5]"
        } ${rightAdornment ? "pr-12" : ""}`}
      />
      {rightAdornment ? (
        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#8f97a8]">
          {rightAdornment}
        </div>
      ) : null}
    </div>
  );
}

function PasswordInput({
  value,
  onChange,
  placeholder,
  visible,
  toggleVisible,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  visible: boolean;
  toggleVisible: () => void;
}) {
  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-14 w-full rounded-[10px] border border-[#d6dbe5] bg-white px-4 pr-12 text-[17px] text-[#2a2d36] outline-none transition-colors placeholder:text-[#a6afbf] focus:border-[#cfd6e2]"
      />
      <button
        type="button"
        onClick={toggleVisible}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8f97a8] transition-opacity hover:opacity-80"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

function BasicProfilePanel() {
  const { data } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [form, setForm] = useState<ProfileForm>({
    fullName: "",
    email: "",
    phoneNumber: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (data?.result) {
      setForm({
        fullName: data.result.fullName || data.result.fullname || "",
        email: data.result.email || "",
        phoneNumber: data.result.phoneNumber || data.result.phone || "",
      });
      setPreview(data.result.profileImage || data.result.profileimage || null);
    }
  }, [data]);

  const imageSrc = useMemo(
    () => preview || data?.result?.profileimage || profilePlaceholder,
    [data, preview],
  );

  const handlePickPhoto = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };

  const handleSave = async () => {
    try {
      const body = new FormData();
      body.append("fullName", form.fullName);
      body.append("phoneNumber", form.phoneNumber);
      if (file) body.append("profileImage", file);

      await updateProfile(body).unwrap();
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="rounded-[12px] bg-white px-5 py-5 md:px-6 md:py-6">
      <div className="border-b border-[#edf0f5] pb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-[34px] leading-none text-[#1f1f24] md:text-[40px]">
            Profile Information
          </h2>
          <Info size={18} className="text-[#788091]" />
        </div>
      </div>

      <div className="mt-6 max-w-[640px] space-y-5">
        <div>
          <FieldLabel>Photo Profile</FieldLabel>
          <div className="relative inline-block">
            <Image
              src={imageSrc}
              alt="Profile photo"
              width={96}
              height={96}
              className="h-[96px] w-[96px] rounded-[10px] object-cover grayscale"
            />
            <button
              type="button"
              onClick={handlePickPhoto}
              className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-[8px] bg-white shadow-md"
            >
              <Pencil size={15} className="text-[#3f4554]" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Display Name</FieldLabel>
          <TextInput
            value={form.fullName}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, fullName: value }))
            }
            placeholder="Daria"
          />
        </div>

        <div>
          <FieldLabel>Email</FieldLabel>
          <TextInput
            value={form.email}
            placeholder="bryanadams@gmail.com"
            readOnly
            pink
          />
        </div>

        <div>
          <FieldLabel>Phone Number</FieldLabel>
          <TextInput
            value={form.phoneNumber}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, phoneNumber: value }))
            }
            placeholder="+123 456 789"
          />
        </div>

        <div className="pt-1">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="h-[48px] min-w-[126px] rounded-[12px] bg-[#e7185d] px-8 text-[18px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AccountPanel() {
  const [changePassword, { isLoading }] = useChangePasswordMutation();
  const [form, setForm] = useState<PasswordForm>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSave = async () => {
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      await changePassword({
        oldPassword: form.oldPassword,
        newPassword: form.newPassword,
      }).unwrap();
      toast.success("Password updated successfully");
      setForm({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="rounded-[12px] bg-white px-5 py-5 md:px-6 md:py-6">
      <div className="border-b border-[#edf0f5] pb-4">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-[34px] leading-none text-[#1f1f24] md:text-[40px]">
            Password
          </h2>
          <Info size={18} className="text-[#788091]" />
        </div>
      </div>

      <div className="mt-6 max-w-[640px] space-y-4">
        <div>
          <FieldLabel>Old Password</FieldLabel>
          <PasswordInput
            value={form.oldPassword}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, oldPassword: value }))
            }
            placeholder="Input your old password"
            visible={showOld}
            toggleVisible={() => setShowOld((prev) => !prev)}
          />
        </div>

        <div>
          <FieldLabel>New Password</FieldLabel>
          <PasswordInput
            value={form.newPassword}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, newPassword: value }))
            }
            placeholder="Input your new password"
            visible={showNew}
            toggleVisible={() => setShowNew((prev) => !prev)}
          />
          <p className="mt-2 text-[14px] text-[#9aa2b1]">
            Min 8 Characters with a combination of letters and numbers
          </p>
        </div>

        <div>
          <FieldLabel>Confirmation New Password</FieldLabel>
          <PasswordInput
            value={form.confirmPassword}
            onChange={(value) =>
              setForm((prev) => ({ ...prev, confirmPassword: value }))
            }
            placeholder="confirmation your new password"
            visible={showConfirm}
            toggleVisible={() => setShowConfirm((prev) => !prev)}
          />
        </div>

        <div className="pt-1">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="h-[48px] min-w-[150px] rounded-[12px] bg-[#e7185d] px-8 text-[18px] font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Settings() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = (searchParams.get("tab") as TabKey | null) || "basic";
  const [activeTab, setActiveTab] = useState<TabKey>(tabFromUrl);

  useEffect(() => {
    setActiveTab(tabFromUrl);
  }, [tabFromUrl]);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    router.push(`?tab=${tab}`);
  };

  return (
    <div className="min-h-screen  p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[320px_minmax(0,1fr)]">
        <aside className="rounded-[12px] bg-white p-3 shadow-sm">
          <div className="space-y-3">
            {tabConfig.map((tab) => {
              const active = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex h-[55px] w-full items-center justify-between rounded-[8px] px-5 text-left text-[18px] transition-colors ${
                    active
                      ? "bg-[#e7185d] text-white"
                      : "bg-white text-[#1f1f24]"
                  }`}
                >
                  <span>{tab.label}</span>
                  <ChevronRight
                    size={20}
                    className={active ? "text-white" : "text-[#b3bac8]"}
                  />
                </button>
              );
            })}
          </div>
        </aside>

        <main>
          {activeTab === "basic" ? <BasicProfilePanel /> : <AccountPanel />}
        </main>
      </div>
    </div>
  );
}
