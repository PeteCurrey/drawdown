"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { User, Upload, CheckCircle, AlertCircle, Loader2, Save } from "lucide-react";
import { saveAuthorProfileAction } from "@/app/actions/admin-actions";
import { createClient } from "@/lib/supabase/client";

interface AuthorProfile {
  id?: string;
  name: string;
  role: string;
  bio: string;
  avatar_url?: string | null;
}

interface AdminSettingsClientProps {
  profile?: AuthorProfile | null;
}

export function AdminSettingsClient({ profile }: AdminSettingsClientProps) {
  const [name, setName] = useState(profile?.name || "");
  const [role, setRole] = useState(profile?.role || "");
  const [bio, setBio] = useState(profile?.bio || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const initials = name
    ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "P";

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      showToast("error", "Only JPG, PNG, and WebP images are accepted.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Image must be under 2MB.");
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const filename = `avatars/pete-${Date.now()}.${ext}`;

      setUploadProgress(40);

      const { data, error } = await supabase.storage
        .from("blog-assets")
        .upload(filename, file, { upsert: true, contentType: file.type });

      if (error) throw error;

      setUploadProgress(80);

      const { data: urlData } = supabase.storage
        .from("blog-assets")
        .getPublicUrl(data.path);

      setAvatarUrl(urlData.publicUrl);
      setUploadProgress(100);
      showToast("success", "Photo uploaded. Save Profile to apply.");
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("error", "Display Name is required.");
      return;
    }

    setSaving(true);
    try {
      const res = await saveAuthorProfileAction({
        id: profile?.id,
        name: name.trim(),
        role: role.trim(),
        bio: bio.trim(),
        avatar_url: avatarUrl || undefined,
      });

      if (res.success) {
        showToast("success", "Profile saved successfully.");
      }
    } catch (err: any) {
      console.error(err);
      showToast("error", err.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500 max-w-2xl">
      {/* Header */}
      <div className="border-b border-mkt-bd pb-6">
        <h1 className="text-3xl font-display font-black uppercase text-mkt-ink tracking-tight">
          Settings
        </h1>
        <p className="text-xs text-mkt-i3 font-mono uppercase tracking-widest mt-1">
          Author Profile &amp; Preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* Author Profile Card */}
        <div className="bg-white border border-mkt-bd p-6 rounded-xl space-y-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="border-b border-mkt-bd pb-4">
            <h3 className="text-xs font-mono uppercase tracking-widest text-mkt-i3 font-bold">
              // Author Profile
            </h3>
            <p className="text-[11px] text-mkt-i4 font-sans mt-1">
              This name and image appears on all blog posts.
            </p>
          </div>

          {/* Avatar Section */}
          <div className="flex items-start gap-6">
            {/* Avatar Preview */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-neutral-100 border-2 border-mkt-bd flex items-center justify-center relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={name || "Author"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-xl font-mono font-bold text-mkt-i3">
                    {initials}
                  </span>
                )}
              </div>
              {uploading && (
                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center">
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 space-y-3">
              <div>
                <p className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider">
                  Profile Photo
                </p>
                <p className="text-[10px] text-mkt-i4 font-sans mt-0.5">
                  JPG, PNG, or WebP. Maximum 2MB.
                </p>
              </div>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-2 px-4 py-2 border border-mkt-bd hover:bg-neutral-50 text-mkt-ink text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer rounded-lg disabled:opacity-50"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {uploading ? "Uploading..." : "Upload New Photo"}
              </button>

              {/* Progress Bar */}
              {uploadProgress > 0 && (
                <div className="h-1 bg-neutral-100 rounded-full overflow-hidden w-48">
                  <div
                    className="h-full bg-mkt-grn transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
          </div>

          {/* Display Name */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
              Display Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pete Currey"
              className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-sans outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4 focus:ring-1 focus:ring-mkt-ink"
            />
          </div>

          {/* Role / Title */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
              Role / Title
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Founder, Drawdown"
              className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-sans outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4 focus:ring-1 focus:ring-mkt-ink"
            />
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-mkt-i3 uppercase tracking-wider block">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="Building Drawdown to be the trading education platform that actually tells you the truth."
              className="w-full bg-neutral-50 border border-mkt-bd rounded px-4 py-3 text-sm text-mkt-ink font-sans outline-none focus:border-mkt-ink transition-colors placeholder:text-mkt-i4 focus:ring-1 focus:ring-mkt-ink resize-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <button
          type="submit"
          disabled={saving || uploading}
          className="flex items-center gap-2 px-6 py-3 bg-mkt-ink hover:bg-mkt-i2 disabled:opacity-60 text-white text-xs font-mono font-bold uppercase tracking-widest transition-all duration-150 cursor-pointer rounded-lg shadow-md"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Profile
        </button>
      </form>

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-[400] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl border text-sm font-sans animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === "success"
              ? "bg-white border-mkt-gbd text-mkt-grn"
              : "bg-white border-red-200 text-red-600"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          {toast.message}
        </div>
      )}
    </div>
  );
}
