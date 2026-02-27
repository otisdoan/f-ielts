import React from 'react';
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();
    const user = session?.user;

    let profile = null;
    if (user) {
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        profile = data;
    }

    const initials = profile?.full_name
        ? profile.full_name.substring(0, 2).toUpperCase()
        : user?.email?.substring(0, 2).toUpperCase() || 'AD';

    return (
        <div className="flex-1 overflow-y-auto pb-12 p-8">
            <h1 className="text-[#181111] text-3xl font-black leading-tight tracking-tight mb-2">Account Settings</h1>
            <p className="text-[#896161] text-base font-normal mb-8">Manage your profile, security, and global system configurations.</p>

            <div className="flex flex-col gap-8 max-w-5xl">
                {/* Section 1: Profile Information */}
                <section>
                    <h2 className="text-[#181111] text-xl font-bold px-1 pb-4">Profile Information</h2>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="flex flex-col items-center gap-3">
                                    {profile?.avatar_url ? (
                                        <div className="size-32 rounded-full border-4 border-white shadow-md bg-center bg-no-repeat bg-cover flex items-center justify-center font-bold text-4xl text-slate-400"
                                            style={{ backgroundImage: `url(${profile.avatar_url})` }}>
                                        </div>
                                    ) : (
                                        <div className="size-32 rounded-full border-4 border-white shadow-md bg-center bg-slate-200 flex items-center justify-center font-bold text-4xl text-slate-400">
                                            {initials}
                                        </div>
                                    )}
                                    <button className="text-primary text-sm font-semibold hover:underline cursor-pointer">Change Avatar</button>
                                </div>
                                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Full Name</label>
                                        <input className="rounded-lg border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary w-full p-2 border" type="text" defaultValue={profile?.full_name || ''} placeholder="Your Full Name" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                                        <input className="rounded-lg border-gray-200 bg-gray-50 text-sm text-gray-500 w-full p-2 border" disabled type="email" defaultValue={user?.email || ''} />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number</label>
                                        <input className="rounded-lg border-gray-200 bg-white text-sm focus:border-primary focus:ring-primary w-full p-2 border" placeholder="+1 (555) 000-0000" type="text" />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</label>
                                        <input className="rounded-lg border-gray-200 bg-gray-50 text-sm text-gray-500 w-full p-2 border" disabled type="text" defaultValue={profile?.role || 'user'} />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end">
                                <button className="px-6 py-2 bg-primary text-white rounded-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-colors">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}
