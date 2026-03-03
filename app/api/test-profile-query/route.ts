import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Get user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Not logged in" }, { status: 401 });
        }

        // Query profile directly - same as admin layout does
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, full_name, id, created_at, updated_at")
            .eq("id", user.id)
            .single();

        // Also try with maybeSingle to see difference
        const { data: profile2, error: error2 } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();

        // Get ALL profiles to verify data exists
        const { data: allProfiles } = await supabase
            .from("profiles")
            .select("id, role, full_name")
            .order("created_at", { ascending: false })
            .limit(10);

        const result = {
            current_user: {
                id: user.id,
                email: user.email,
            },
            profile_query_single: {
                data: profile,
                error: profileError?.message,
                error_details: profileError?.details,
                error_hint: profileError?.hint,
            },
            profile_query_maybeSingle: {
                data: profile2,
                error: error2?.message,
            },
            comparison: {
                profile_exists: !!profile || !!profile2,
                role_from_single: profile?.role,
                role_from_maybe: profile2?.role,
                is_admin: profile?.role === "admin" || profile2?.role === "admin",
            },
            all_profiles_sample: allProfiles?.map(p => ({
                id: p.id,
                role: p.role,
                full_name: p.full_name,
                is_current_user: p.id === user.id,
            })),
            admin_layout_logic: {
                will_pass_check: !!(profile && profile.role === "admin"),
                reason: !profile 
                    ? "Profile not found" 
                    : profile.role !== "admin" 
                    ? `Role is '${profile.role}', not 'admin'`
                    : "Should have access",
            },
        };

        return NextResponse.json(result, { 
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } catch (error: any) {
        return NextResponse.json({ 
            error: "Server Error", 
            message: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
}
