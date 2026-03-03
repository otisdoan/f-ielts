"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/components/LanguageProvider";
import { Language } from "@/lib/i18n";

import ChangePasswordModal from "@/components/settings/ChangePasswordModal";
import AvatarUpload from "@/components/settings/AvatarUpload";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState({
    full_name: "",
    email: "",
    avatar_url: "",
    preferred_language: "en",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { t, setLanguage } = useLanguage();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      setUser(user);

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile({
          full_name: profileData.full_name || "",
          email: user.email || "",
          avatar_url: profileData.avatar_url || "",
          preferred_language: profileData.preferred_language || "en",
        });
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: profile.full_name,
          preferred_language: profile.preferred_language,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id);

      if (error) throw error;

      setLanguage(profile.preferred_language as Language);
      alert(t("saveChanges") + " successful!");
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="bg-background-light text-slate-900 min-h-screen font-sans">
      <DashboardHeader />

      <main className="max-w-[1280px] mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{t("accountSettings")}</h1>
          <p className="text-slate-500 mt-1">{t("manageExperience")}</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="w-full lg:w-64 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${activeTab === "profile"
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-slate-600 hover:bg-white"
                }`}
            >
              <span className="material-symbols-outlined">person</span>
              <span>{t("profile")}</span>
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === "security"
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-slate-600 hover:bg-white"
                }`}
            >
              <span className="material-symbols-outlined">security</span>
              <span>{t("security")}</span>
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === "notifications"
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-slate-600 hover:bg-white"
                }`}
            >
              <span className="material-symbols-outlined">notifications</span>
              <span>{t("notifications")}</span>
            </button>
            <button
              onClick={() => setActiveTab("subscription")}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === "subscription"
                ? "bg-primary text-white shadow-sm shadow-primary/20"
                : "text-slate-600 hover:bg-white"
                }`}
            >
              <span className="material-symbols-outlined">credit_card</span>
              <span>{t("subscription")}</span>
            </button>
            <hr className="my-4 border-slate-200" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-primary hover:bg-primary/5 font-medium transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>{t("logOut")}</span>
            </button>
          </aside>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            {/* Profile Tab */}
            {activeTab === "profile" && (
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 ">
                  <h3 className="text-lg font-bold text-slate-900 ">{t("profileInformation")}</h3>
                  <p className="text-sm text-slate-500">{t("updatePhoto")}</p>
                </div>
                <form onSubmit={handleUpdateProfile}>
                  <div className="p-8 space-y-8">
                    {/* Avatar Upload */}
                    <AvatarUpload
                      currentAvatarUrl={profile.avatar_url}
                      userId={user?.id}
                      onAvatarUpdate={(url) => setProfile({ ...profile, avatar_url: url })}
                    />

                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 ">{t("fullName")}</label>
                        <input
                          type="text"
                          value={profile.full_name}
                          onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                          className="w-full rounded-lg border-slate-300  focus:border-primary focus:ring-primary transition-all"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-bold text-slate-700 ">{t("emailAddress")}</label>
                        <input
                          type="email"
                          value={profile.email}
                          disabled
                          className="w-full rounded-lg border-slate-300 bg-slate-100 cursor-not-allowed"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700 ">{t("preferredLanguage")}</label>
                        <div className="flex gap-4">
                          <label className="flex-1 cursor-pointer" onClick={() => setProfile({ ...profile, preferred_language: "en" })}>
                            <input
                              type="radio"
                              name="lang"
                              value="en"
                              checked={profile.preferred_language === "en"}
                              onChange={() => { }}
                              className="sr-only peer"
                            />
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                              <span className="font-medium">{t("english")}</span>
                              <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100">check_circle</span>
                            </div>
                          </label>
                          <label className="flex-1 cursor-pointer" onClick={() => setProfile({ ...profile, preferred_language: "vi" })}>
                            <input
                              type="radio"
                              name="lang"
                              value="vi"
                              checked={profile.preferred_language === "vi"}
                              onChange={() => { }}
                              className="sr-only peer"
                            />
                            <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/5 transition-all">
                              <span className="font-medium">{t("vietnamese")}</span>
                              <span className="material-symbols-outlined text-primary opacity-0 peer-checked:opacity-100">check_circle</span>
                            </div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-primary text-white px-8 py-2.5 rounded-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? t("saving") : t("saveChanges")}
                    </button>
                  </div>
                </form>
              </section>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-background-light flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">lock</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 ">{t("passwordAndSecurity")}</h3>
                      <p className="text-sm text-slate-500">{t("keepAccountSecure")}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-5 py-2 border-2 border-slate-200 rounded-lg font-bold text-sm text-slate-700 hover:border-primary hover:text-primary transition-all"
                  >
                    Change Password
                  </button>
                </div>
              </section>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 ">
                  <h3 className="text-lg font-bold text-slate-900 ">Notification Preferences</h3>
                  <p className="text-sm text-slate-500">Choose what you want to be notified about.</p>
                </div>
                <div className="p-6 space-y-4">
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-900 ">Email Notifications</h4>
                      <p className="text-sm text-slate-500">Receive updates via email</p>
                    </div>
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-900 ">Practice Reminders</h4>
                      <p className="text-sm text-slate-500">Daily reminders to practice</p>
                    </div>
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" defaultChecked />
                  </label>
                  <label className="flex items-center justify-between p-4 bg-slate-50 rounded-lg cursor-pointer">
                    <div>
                      <h4 className="font-bold text-slate-900 ">Progress Updates</h4>
                      <p className="text-sm text-slate-500">Weekly progress reports</p>
                    </div>
                    <input type="checkbox" className="rounded text-primary focus:ring-primary" defaultChecked />
                  </label>
                </div>
              </section>
            )}

            {/* Subscription Tab */}
            {activeTab === "subscription" && (
              <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-100 ">
                  <h3 className="text-lg font-bold text-slate-900 ">Current Subscription</h3>
                  <p className="text-sm text-slate-500">Manage your billing and plan details.</p>
                </div>
                <div className="p-6">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 p-6 rounded-xl bg-linear-to-r from-primary to-primary/80 text-white">
                    <div className="flex items-center gap-4">
                      <div className="bg-white/20 p-3 rounded-full">
                        <span className="material-symbols-outlined text-3xl">star</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium opacity-80 uppercase tracking-widest">CURRENT PLAN</p>
                        <h4 className="text-2xl font-black">Free Learner</h4>
                        <p className="text-xs mt-1 opacity-90">Unlock all tests with a Premium account.</p>
                      </div>
                    </div>
                    <button className="w-full sm:w-auto px-8 py-3 bg-white text-primary rounded-lg font-black uppercase tracking-tight shadow-xl shadow-black/10 hover:bg-slate-100 transition-all">
                      Upgrade to Premium
                    </button>
                  </div>
                  <div className="mt-6 flex items-center justify-between px-4 py-3 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600 font-medium">Billing Period</span>
                    <span className="text-sm font-bold text-slate-900 ">N/A</span>
                  </div>
                </div>
              </section>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-[1280px] mx-auto py-12 px-4 border-t border-slate-200 mt-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">database</span>
          <p className="text-xs font-bold">
            © 2024 F-IELTS EdTech. All rights reserved.
          </p>
        </div>
        <div className="flex gap-6 text-xs font-bold">
          <a className="hover:text-primary" href="#">
            Support
          </a>
          <a className="hover:text-primary" href="#">
            Terms of Service
          </a>
          <a className="hover:text-primary" href="#">
            Privacy Policy
          </a>
        </div>
      </footer>

      <ChangePasswordModal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
    </div>
  );
}
