import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { text, from, to } = await req.json();

        if (!text || !text.trim()) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const trimmed = text.trim().slice(0, 5000);

        // Google Translate unofficial API (no key needed)
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(trimmed)}`;

        const res = await fetch(url, {
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        if (!res.ok) {
            throw new Error(`Google Translate returned ${res.status}`);
        }

        const data = await res.json();

        // data[0] is an array of [translated, original, ...]
        let translated = "";
        if (Array.isArray(data[0])) {
            translated = data[0]
                .map((item: [string]) => (item && item[0] ? item[0] : ""))
                .join("");
        }

        return NextResponse.json({ translated });
    } catch (err) {
        console.error("[translate API]", err);
        return NextResponse.json(
            { error: "Translation failed. Please try again." },
            { status: 500 }
        );
    }
}
