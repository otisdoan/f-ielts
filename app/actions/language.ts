"use server";

import { cookies } from "next/headers";
import { Language } from "@/lib/i18n";

export async function setLanguageCookie(lang: Language) {
    const cookieStore = await cookies();
    cookieStore.set("preferred_language", lang, { path: "/", maxAge: 60 * 60 * 24 * 365 });
}
