import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { message: "Not logged in" },
                { status: 401 }
            );
        }

        // Refresh the session
        const { data: { session }, error: sessionError } = await supabase.auth.refreshSession();
        
        if (sessionError) {
            console.error("Session refresh error:", sessionError);
        }

        // Get fresh profile data
        const { data: profile } = await supabase
            .from("profiles")
            .select("role, full_name")
            .eq("id", user.id)
            .single();

        const htmlResponse = `
      <html>
        <head>
          <style>
            body { 
              font-family: sans-serif; 
              padding: 2rem; 
              text-align: center;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .card {
              background: white;
              padding: 3rem;
              border-radius: 16px;
              box-shadow: 0 20px 60px rgba(0,0,0,0.3);
              max-width: 500px;
            }
            h1 { color: #10b981; margin-bottom: 1rem; }
            .info { 
              background: #f3f4f6; 
              padding: 1rem; 
              border-radius: 8px; 
              margin: 1.5rem 0;
              text-align: left;
            }
            .label { font-weight: bold; color: #374151; }
            .value { color: #059669; }
            .role {
              display: inline-block;
              padding: 0.5rem 1rem;
              background: ${profile?.role === 'admin' ? '#dcfce7' : '#dbeafe'};
              color: ${profile?.role === 'admin' ? '#166534' : '#1e40af'};
              border-radius: 8px;
              font-weight: bold;
              margin: 1rem 0;
            }
            a { 
              display: inline-block; 
              padding: 12px 24px; 
              background: #ec1313; 
              color: white; 
              text-decoration: none; 
              border-radius: 8px; 
              margin: 10px;
              font-weight: bold;
              transition: all 0.3s;
            }
            a:hover { 
              background: #dc2626; 
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(236, 19, 19, 0.4);
            }
            .success { color: #10b981; font-weight: bold; margin: 1rem 0; }
            .instruction {
              background: #fef3c7;
              padding: 1rem;
              border-radius: 8px;
              margin: 1rem 0;
              border-left: 4px solid #f59e0b;
              text-align: left;
            }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>✅ Session Refreshed!</h1>
            
            <div class="info">
              <div><span class="label">Email:</span> <span class="value">${user.email}</span></div>
              <div><span class="label">User ID:</span> <span class="value">${user.id}</span></div>
            </div>

            <div class="role">${profile?.role || 'No role'}</div>

            ${profile?.role === 'admin' ? `
              <p class="success">🎉 You have admin access!</p>
              <div class="instruction">
                <strong>Next Step:</strong><br>
                Click the button below to access the Admin Dashboard.
                If it still redirects to dashboard, clear your browser cache (Ctrl+Shift+Delete) and try again.
              </div>
            ` : `
              <p style="color: #dc2626; font-weight: bold;">❌ Still not admin</p>
              <div class="instruction">
                Something went wrong. Please check the profile in Supabase database.
              </div>
            `}

            <div>
              ${profile?.role === 'admin' ? `
                <a href="/admin">Go to Admin Dashboard</a>
              ` : `
                <a href="/api/upgrade-admin" style="background: #10b981;">Try Upgrade Again</a>
              `}
              <a href="/dashboard" style="background: #6b7280;">Dashboard</a>
              <a href="/api/debug-admin" style="background: #3b82f6;">Debug Info</a>
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
            message: "Server Error", 
            error: error.message 
        }, { status: 500 });
    }
}
