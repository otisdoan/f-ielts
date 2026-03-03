import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        
        // Get user from session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        // Try to get profile with different methods
        const { data: profile1, error: error1 } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user?.id)
            .single();

        // Try without RLS
        const { data: profile2, error: error2 } = await supabase
            .from("profiles")
            .select("role, full_name, id")
            .eq("id", user?.id)
            .maybeSingle();

        // Get all profiles to check if data exists
        const { data: allProfiles, error: error3 } = await supabase
            .from("profiles")
            .select("id, role, full_name")
            .limit(10);

        const debugInfo = {
            timestamp: new Date().toISOString(),
            session: {
                exists: !!session,
                user_id: session?.user?.id,
                user_email: session?.user?.email,
                error: sessionError?.message
            },
            user: {
                exists: !!user,
                id: user?.id,
                email: user?.email,
                error: userError?.message
            },
            profile_query_1: {
                data: profile1,
                error: error1?.message,
                details: error1?.details,
                hint: error1?.hint
            },
            profile_query_2: {
                data: profile2,
                error: error2?.message
            },
            all_profiles_sample: {
                count: allProfiles?.length || 0,
                data: allProfiles?.slice(0, 3),
                error: error3?.message
            },
            check_if_user_in_profiles: {
                found: allProfiles?.some(p => p.id === user?.id),
                user_profile: allProfiles?.find(p => p.id === user?.id)
            }
        };

        const htmlResponse = `
<!DOCTYPE html>
<html>
<head>
    <title>Admin Debug Info</title>
    <style>
        body { 
            font-family: 'Courier New', monospace; 
            padding: 2rem; 
            background: #1a1a1a;
            color: #e0e0e0;
        }
        .container { max-width: 1200px; margin: 0 auto; }
        h1 { color: #4ade80; }
        h2 { color: #60a5fa; margin-top: 2rem; }
        pre { 
            background: #2a2a2a; 
            padding: 1rem; 
            border-radius: 8px; 
            overflow-x: auto;
            border-left: 4px solid #4ade80;
        }
        .error { 
            color: #ef4444; 
            background: #3a1a1a;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #ef4444;
        }
        .success { 
            color: #10b981;
            background: #1a3a2a;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #10b981;
        }
        .warning {
            color: #f59e0b;
            background: #3a2a1a;
            padding: 1rem;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
        }
        .section {
            margin-bottom: 2rem;
            padding: 1rem;
            background: #252525;
            border-radius: 8px;
        }
        a {
            display: inline-block;
            padding: 10px 20px;
            background: #3b82f6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 5px;
        }
        a:hover { background: #2563eb; }
        .btn-danger { background: #ef4444; }
        .btn-danger:hover { background: #dc2626; }
        .btn-success { background: #10b981; }
        .btn-success:hover { background: #059669; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔍 Admin Access Debug Information</h1>
        
        <div class="section">
            <h2>Current Session</h2>
            ${session ? `
                <div class="success">
                    ✅ Session Active<br>
                    User ID: ${session.user.id}<br>
                    Email: ${session.user.email}
                </div>
            ` : `
                <div class="error">
                    ❌ No Active Session
                </div>
            `}
        </div>

        <div class="section">
            <h2>Profile Lookup Results</h2>
            ${profile1 ? `
                <div class="success">
                    ✅ Profile Found (Query 1)<br>
                    Role: <strong>${profile1.role}</strong><br>
                    Full Name: ${profile1.full_name || 'Not set'}
                </div>
            ` : `
                <div class="error">
                    ❌ Profile Not Found (Query 1)<br>
                    Error: ${error1?.message || 'Unknown'}<br>
                    ${error1?.hint ? `Hint: ${error1.hint}<br>` : ''}
                    ${error1?.details ? `Details: ${error1.details}` : ''}
                </div>
            `}
            
            ${profile2 ? `
                <div class="success">
                    ✅ Profile Found (Query 2 - maybeSingle)<br>
                    Role: <strong>${profile2.role}</strong>
                </div>
            ` : error2 ? `
                <div class="error">
                    ❌ Profile Query 2 Failed: ${error2.message}
                </div>
            ` : ''}
        </div>

        <div class="section">
            <h2>Diagnosis</h2>
            ${!user ? `
                <div class="error">
                    ❌ <strong>Problem: No authenticated user</strong><br>
                    Solution: You need to login first
                </div>
            ` : !profile1 && !profile2 ? `
                <div class="error">
                    ❌ <strong>Problem: Profile not found or RLS blocking access</strong><br>
                    Possible causes:<br>
                    • No profile record exists for user ${user.id}<br>
                    • RLS policies are blocking the query<br>
                    • Database connection issue
                </div>
                <div class="warning">
                    Solutions:<br>
                    1. Run this SQL in Supabase to create missing profile:<br>
                    <pre>INSERT INTO public.profiles (id, role, full_name)
VALUES ('${user.id}', 'admin', '${user.email}')
ON CONFLICT (id) DO UPDATE SET role = 'admin';</pre>
                    2. Or use the upgrade endpoint:
                    <a href="/api/upgrade-admin" class="btn-success">Upgrade to Admin</a>
                </div>
            ` : profile1?.role !== 'admin' && profile2?.role !== 'admin' ? `
                <div class="warning">
                    ⚠️ <strong>Problem: User is not admin</strong><br>
                    Current role: ${profile1?.role || profile2?.role}<br>
                    You need admin role to access /admin pages
                </div>
                <div>
                    <a href="/api/upgrade-admin" class="btn-success">Upgrade to Admin</a>
                </div>
            ` : `
                <div class="success">
                    ✅ <strong>Everything looks good!</strong><br>
                    You have admin access. If /admin still redirects, try:<br>
                    • Clearing browser cache<br>
                    • Using incognito mode<br>
                    • Force refresh (Ctrl+Shift+R)
                </div>
                <div>
                    <a href="/admin">Go to Admin Dashboard</a>
                </div>
            `}
        </div>

        <div class="section">
            <h2>📊 Full Debug Data (JSON)</h2>
            <pre>${JSON.stringify(debugInfo, null, 2)}</pre>
        </div>

        <div>
            <a href="/dashboard">Dashboard</a>
            <a href="/api/check-user">Check User</a>
            <a href="/api/upgrade-admin" class="btn-success">Upgrade to Admin</a>
            <a href="/api/logout" class="btn-danger">Logout</a>
        </div>
    </div>
</body>
</html>
        `;

        return new NextResponse(htmlResponse, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    } catch (error: any) {
        return NextResponse.json({ 
            error: "Server Error", 
            message: error.message,
            stack: error.stack 
        }, { status: 500 });
    }
}
