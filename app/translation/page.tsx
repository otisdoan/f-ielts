import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TranslationClient from "@/components/translation/TranslationClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "F-IELTS | AI Translation & Analysis",
    description:
        "Dịch chính xác theo ngữ cảnh IELTS, phân tích ngữ pháp, gợi ý từ vựng Band 7+ với công nghệ AI.",
};

export default async function TranslationPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    return <TranslationClient />;
}
