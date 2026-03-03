"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";

interface AvatarUploadProps {
  currentAvatarUrl: string;
  userId: string;
  onAvatarUpdate: (url: string) => void;
}

export default function AvatarUpload({ currentAvatarUrl, userId, onAvatarUpdate }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { t } = useLanguage();

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("File must be an image");
      return;
    }

    setError("");
    setUploading(true);

    try {
      // Create unique file name
      const fileExt = file.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      // Update profile in database
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq('id', userId);

      if (updateError) throw updateError;

      onAvatarUpdate(publicUrl);
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    setUploading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq('id', userId);

      if (error) throw error;

      onAvatarUpdate("");
    } catch (err: any) {
      setError(err.message || "Failed to remove avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-6">
      <div className="relative group">
        <div className="h-24 w-24 rounded-full bg-slate-200 border-4 border-white shadow-md overflow-hidden">
          {currentAvatarUrl ? (
            <img src={currentAvatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="material-symbols-outlined animate-spin text-white">progress_activity</span>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleFileSelect}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-1.5 bg-primary text-white rounded-full border-2 border-white shadow-sm hover:bg-red-600 transition-colors disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-sm leading-none">edit</span>
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <h4 className="font-bold text-slate-800">{t("uploadNewPhoto")}</h4>
        <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">{t("uploadConstraints")}</p>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleFileSelect}
            disabled={uploading}
            className="px-4 py-2 bg-slate-100 text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading..." : t("changeAvatar")}
          </button>
          {currentAvatarUrl && (
            <button
              type="button"
              onClick={handleRemoveAvatar}
              disabled={uploading}
              className="px-4 py-2 text-slate-500 text-sm font-medium hover:text-primary transition-colors disabled:opacity-50"
            >
              {t("remove")}
            </button>
          )}
        </div>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
