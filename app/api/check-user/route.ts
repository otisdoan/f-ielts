import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { message: "Not logged in" },
                { status: 401 }
            );
        }

        const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();

        const htmlResponse = `
      <html>
        <head>
          <style>
            body { font-family: sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; }
            .info-box { background: #f3f4f6; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
            .label { font-weight: bold; color: #374151; }
            .value { color: #059669; margin-left: 0.5rem; }
            .role { 
              display: inline-block; 
              padding: 0.25rem 0.75rem; 
              border-radius: 4px;
              font-weight: bold;
              margin-left: 0.5rem;
            }
            .admin { background: #dcfce7; color: #166534; }
            .student { background: #dbeafe; color: #1e40af; }
            h1 { color: #111827; }
            a { 
              display: inline-block; 
              padding: 10px 20px; 
              background: #ec1313; 
              color: white; 
              text-decoration: none; 
              border-radius: 8px; 
              margin-top: 20px;
              margin-right: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Current User Information</h1>
          
          <div class="info-box">
            <div><span class="label">User ID:</span><span class="value">${user.id}</span></div>
            <div><span class="label">Email:</span><span class="value">${user.email}</span></div>
            <div>
              <span class="label">Role:</span>
              <span class="role ${profile?.role === 'admin' ? 'admin' : 'student'}">
                ${profile?.role || 'No role'}
              </span>
            </div>
            <div><span class="label">Full Name:</span><span class="value">${profile?.full_name || 'Not set'}</span></div>
          </div>

          <div>
            ${profile?.role === 'admin' 
              ? '<p style="color: #059669; font-weight: bold;">✓ You have admin access</p>' 
              : '<p style="color: #dc2626; font-weight: bold;">✗ You do not have admin access. Try upgrading or logout and login again after updating role in Supabase.</p>'
            }
          </div>

          <div>
            ${profile?.role !== 'admin' 
              ? '<a href="/api/upgrade-admin">Upgrade to Admin</a>' 
              : '<a href="/admin">Go to Admin Dashboard</a>'
            }
            <a href="/dashboard" style="background: #6b7280;">Go to Dashboard</a>
            <a href="/api/logout" style="background: #dc2626;">Logout</a>
          </div>
          
          <div style="margin-top: 2rem; padding: 1rem; background: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Note:</strong> If you updated your role in Supabase but still see "student" here, 
              please <strong>logout and login again</strong> to refresh your session.
            </p>
          </div>
        </body>
      </html>
    `;

        return new NextResponse(htmlResponse, {
            status: 200,
            headers: { "Content-Type": "text/html" },
        });
    } catch (error: any) {
        return NextResponse.json({ message: "Server Error", error: error.message }, { status: 500 });
    }
}
