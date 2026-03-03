import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // 1. Get current logged-in user
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { message: "You must be logged in first. Use /login to sign in." },
                { status: 401 }
            );
        }

        // 2. Update their role to "admin" in profiles
        const { error: updateError } = await supabase
            .from("profiles")
            .update({ role: "admin" })
            .eq("id", user.id);

        if (updateError) {
            console.error(updateError);
            return NextResponse.json(
                { message: "Failed to update role", error: updateError.message },
                { status: 500 }
            );
        }

        // 3. Optional: Add a simple HTML response for clarity
        const htmlResponse = `
      <html>
        <body style="font-family: sans-serif; padding: 2rem; text-align: center;">
          <h1 style="color: #16a34a;">Success! You are now an Admin.</h1>
          <p>Your account (User ID: ${user.id}) has been upgraded to admin role.</p>
          <a href="/admin" style="display: inline-block; padding: 10px 20px; background: #ec1313; color: white; text-decoration: none; border-radius: 8px; margin-top: 20px;">
            Go to Admin Dashboard
          </a>
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
