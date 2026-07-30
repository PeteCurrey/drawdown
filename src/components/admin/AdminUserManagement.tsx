"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  UserPlus, 
  Search, 
  Crown, 
  Handshake, 
  Check, 
  AlertCircle, 
  X, 
  Loader2,
  ShieldCheck,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  email: string;
  display_name: string | null;
  role: string | null;
  subscription_tier: string | null;
  subscription_status: string | null;
  country: string | null;
  created_at: string;
  last_sign_in_at?: string | null;
}

const TIERS = [
  { id: "free", label: "Free Tier", color: "bg-gray-100 text-gray-700 border-gray-300" },
  { id: "foundation", label: "Foundation", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  { id: "edge", label: "Edge", color: "bg-cyan-50 text-cyan-700 border-cyan-200" },
  { id: "floor", label: "Floor (Top Tier)", color: "bg-orange-50 text-[#F9771D] border-orange-200" },
];

export function AdminUserManagement() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterTier, setFilterTier] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Add User Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newTier, setNewTier] = useState("foundation");
  const [newRole, setNewRole] = useState("trader");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/users");
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) {
        setUsers(data.users);
      }
    } catch (err) {
      console.error("Failed to load admin users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTierChange = async (userId: string, newTierValue: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          subscription_tier: newTierValue,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscription_tier: newTierValue, subscription_status: newTierValue === "free" ? "inactive" : "active" } : u));
      } else {
        alert(data.error || "Failed to update tier");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update tier");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRoleChange = async (userId: string, newRoleValue: string) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          role: newRoleValue,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRoleValue } : u));
      } else {
        alert(data.error || "Failed to update role");
      }
    } catch (err: any) {
      alert(err.message || "Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    setFormSuccess(null);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: newEmail,
          password: newPassword,
          firstName: newFirstName,
          lastName: newLastName,
          subscription_tier: newTier,
          role: newRole,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to create user");
      }

      setFormSuccess(`User ${newEmail} created successfully with tier '${newTier.toUpperCase()}'!`);
      setNewEmail("");
      setNewPassword("");
      setNewFirstName("");
      setNewLastName("");
      fetchUsers();
      setTimeout(() => {
        setIsAddModalOpen(false);
        setFormSuccess(null);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to create user");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.display_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase());

    const matchesTier = filterTier === "all" || (u.subscription_tier || "free").toLowerCase() === filterTier.toLowerCase();
    return matchesSearch && matchesTier;
  });

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e7eb] pb-6">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-tight text-[#1A1A1A]">User & Membership Management</h1>
          <p className="text-xs text-[#6b7280] mt-1">
            Create new accounts with custom membership tiers, or change any existing member&apos;s tier instantly.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchUsers}
            className="p-2.5 border border-[#e5e7eb] rounded-lg text-xs font-semibold text-[#555550] hover:text-[#1A1A1A] hover:bg-gray-50 transition-colors flex items-center gap-1.5"
            title="Refresh Users"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="px-5 py-2.5 bg-[#F9771D] text-white text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#e06612] transition-colors flex items-center gap-2 shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Add User / Set Tier
          </button>
        </div>
      </header>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-gray-50 p-4 rounded-xl border border-[#e5e7eb]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or user ID..." 
            className="w-full bg-white border border-[#e5e7eb] pl-10 pr-4 py-2 text-xs outline-none focus:border-[#F9771D] rounded-lg"
          />
        </div>

        {/* Tier Filters */}
        <div className="flex items-center gap-1 flex-wrap">
          {["all", "free", "foundation", "edge", "floor"].map((t) => (
            <button
              key={t}
              onClick={() => setFilterTier(t)}
              className={cn(
                "px-3 py-1.5 text-[10px] font-bold font-mono uppercase tracking-wider rounded-md transition-all",
                filterTier === t
                  ? "bg-[#1A1A1A] text-white"
                  : "bg-white border border-[#e5e7eb] text-[#555550] hover:border-gray-400"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 border-b border-[#e5e7eb] text-[10px] font-mono uppercase tracking-widest text-[#6b7280]">
              <tr>
                <th className="px-6 py-4">User / Identity</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Membership Tier (Selectable)</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e5e7eb]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-[#F9771D]" />
                    Loading user roster...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                    No users found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const currentTier = (user.subscription_tier || "free").toLowerCase();
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                      {/* Identity */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shrink-0">
                            {user.role === "admin" ? <Crown className="w-4 h-4 text-[#F9771D]" /> : <Users className="w-4 h-4 text-gray-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-[#1A1A1A]">{user.display_name || "Trader"}</p>
                            <p className="text-[11px] text-[#6b7280]">{user.email}</p>
                          </div>
                        </div>
                      </td>

                      {/* Role dropdown */}
                      <td className="px-6 py-4">
                        <select
                          value={user.role || "trader"}
                          disabled={updatingId === user.id}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-gray-50 border border-gray-200 text-[11px] font-bold uppercase text-gray-700 rounded-md px-2 py-1 outline-none focus:border-[#F9771D]"
                        >
                          <option value="trader">Trader</option>
                          <option value="partner">Partner</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>

                      {/* Selectable Membership Tier */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <select
                            value={currentTier}
                            disabled={updatingId === user.id}
                            onChange={(e) => handleTierChange(user.id, e.target.value)}
                            className={cn(
                              "text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg px-3 py-1.5 border outline-none cursor-pointer transition-all",
                              currentTier === "floor" ? "bg-orange-50 text-[#F9771D] border-orange-300 font-extrabold" :
                              currentTier === "edge" ? "bg-cyan-50 text-cyan-700 border-cyan-300 font-bold" :
                              currentTier === "foundation" ? "bg-indigo-50 text-indigo-700 border-indigo-300 font-bold" :
                              "bg-gray-50 text-gray-600 border-gray-200 font-medium"
                            )}
                          >
                            <option value="free">Free Tier</option>
                            <option value="foundation">Foundation (£29/mo)</option>
                            <option value="edge">Edge (£49/mo)</option>
                            <option value="floor">Floor (£99/mo - Full)</option>
                          </select>
                          {updatingId === user.id && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#F9771D]" />}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className={cn(
                          "px-2 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md",
                          user.subscription_status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        )}>
                          {user.subscription_status || "inactive"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td className="px-6 py-4 text-[#6b7280] font-mono text-[11px]">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl border border-[#e5e7eb] shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-[#e5e7eb] flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="font-bold text-base uppercase text-[#1A1A1A]">Add New User & Select Tier</h3>
                <p className="text-xs text-[#6b7280]">Provision a user with instant tier assignment.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-gray-400 hover:text-black rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {formSuccess && (
                <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center gap-2">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{formSuccess}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#6b7280] mb-1">First Name</label>
                  <input 
                    type="text" 
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="e.g. Pete" 
                    className="w-full bg-gray-50 border border-[#e5e7eb] p-2.5 rounded-lg outline-none focus:border-[#F9771D]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono uppercase text-[#6b7280] mb-1">Last Name</label>
                  <input 
                    type="text" 
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="e.g. Currey" 
                    className="w-full bg-gray-50 border border-[#e5e7eb] p-2.5 rounded-lg outline-none focus:border-[#F9771D]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#6b7280] mb-1">Email Address *</label>
                <input 
                  type="email" 
                  required
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="e.g. user@example.com" 
                  className="w-full bg-gray-50 border border-[#e5e7eb] p-2.5 rounded-lg outline-none focus:border-[#F9771D]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase text-[#6b7280] mb-1">Password *</label>
                <input 
                  type="password" 
                  required
                  minLength={6}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters" 
                  className="w-full bg-gray-50 border border-[#e5e7eb] p-2.5 rounded-lg outline-none focus:border-[#F9771D]"
                />
              </div>

              {/* Membership Tier Dropdown */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#6b7280] mb-1">Membership Tier *</label>
                <select 
                  value={newTier}
                  onChange={(e) => setNewTier(e.target.value)}
                  className="w-full bg-white border border-[#F9771D] p-2.5 font-bold uppercase rounded-lg outline-none text-xs"
                >
                  <option value="free">Free Tier (Basic Access)</option>
                  <option value="foundation">Foundation Tier (£29/mo)</option>
                  <option value="edge">Edge Tier (£49/mo)</option>
                  <option value="floor">Floor Tier (£99/mo - Full VIP Access)</option>
                </select>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[10px] font-mono uppercase text-[#6b7280] mb-1">Account Role</label>
                <select 
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full bg-gray-50 border border-[#e5e7eb] p-2.5 uppercase rounded-lg outline-none text-xs"
                >
                  <option value="trader">Trader</option>
                  <option value="partner">Partner</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-gray-500 hover:text-black"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#F9771D] text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#e06612] transition-colors flex items-center gap-2"
                >
                  {isSubmitting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  Create & Grant Tier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
