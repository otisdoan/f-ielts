"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// ─── Types ────────────────────────────────────────────────────────────────────
interface GrammarError {
    type: string;
    message: string;
    suggestion: string;
    severity: "error" | "warning" | "info";
}
interface VocabSuggestion {
    original: string;
    suggestion: string;
    note: string;
}
interface AnalysisResult {
    grammarErrors: GrammarError[];
    vocabSuggestions: VocabSuggestion[];
    bandEstimate: number;
    stats: { wordCount: number; sentenceCount: number };
}
interface HistoryItem {
    id: string;
    source: string;
    translated: string;
    from: string;
    to: string;
    timestamp: Date;
}

const LANG_LABELS: Record<string, string> = {
    vi: "TIẾNG VIỆT",
    en: "ENGLISH",
    fr: "FRANÇAIS",
    de: "DEUTSCH",
    ja: "日本語",
    ko: "한국어",
    zh: "中文",
};

const SEVERITY_STYLES: Record<string, string> = {
    error: "border-red-200 bg-red-50",
    warning: "border-amber-200 bg-amber-50",
    info: "border-blue-200 bg-blue-50",
};
const SEVERITY_ICON: Record<string, string> = { error: "error", warning: "warning", info: "info" };
const SEVERITY_COLOR: Record<string, string> = {
    error: "text-red-500",
    warning: "text-amber-500",
    info: "text-blue-500",
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function TranslationClient() {
    const [sourceText, setSourceText] = useState("");
    const [translated, setTranslated] = useState("");
    const [fromLang, setFromLang] = useState("vi");
    const [toLang, setToLang] = useState("en");

    const [isTranslating, setIsTranslating] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [copied, setCopied] = useState(false);
    const [savedMsg, setSavedMsg] = useState(false);
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [showHistory, setShowHistory] = useState(false);
    const [showLangFrom, setShowLangFrom] = useState(false);
    const [showLangTo, setShowLangTo] = useState(false);
    const [translateError, setTranslateError] = useState("");
    const [analyzeTarget, setAnalyzeTarget] = useState<"source" | "translated">("translated");

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const charLimit = 5000;

    // Auto-resize textarea
    useEffect(() => {
        const ta = textareaRef.current;
        if (!ta) return;
        ta.style.height = "auto";
        ta.style.height = Math.min(ta.scrollHeight, 300) + "px";
    }, [sourceText]);

    // ── Translate ──────────────────────────────────────────────────────────────
    const handleTranslate = useCallback(async () => {
        if (!sourceText.trim()) return;
        setIsTranslating(true);
        setTranslateError("");
        setAnalysis(null);
        setShowAnalysis(false);
        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: sourceText, from: fromLang, to: toLang }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Translation failed");
            setTranslated(data.translated);
            const item: HistoryItem = {
                id: Date.now().toString(),
                source: sourceText.slice(0, 80) + (sourceText.length > 80 ? "..." : ""),
                translated: data.translated.slice(0, 80) + (data.translated.length > 80 ? "..." : ""),
                from: fromLang,
                to: toLang,
                timestamp: new Date(),
            };
            setHistory((prev) => [item, ...prev.slice(0, 9)]);
        } catch (e: unknown) {
            setTranslateError(e instanceof Error ? e.message : "Translation failed.");
        } finally {
            setIsTranslating(false);
        }
    }, [sourceText, fromLang, toLang]);

    // Ctrl+Enter to translate
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "Enter") handleTranslate();
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [handleTranslate]);

    // ── Swap ───────────────────────────────────────────────────────────────────
    const handleSwap = () => {
        setFromLang(toLang);
        setToLang(fromLang);
        setSourceText(translated);
        setTranslated(sourceText);
    };

    // ── Analyze ────────────────────────────────────────────────────────────────
    const handleAnalyze = async (target: "source" | "translated") => {
        const text = target === "source" ? sourceText : translated;
        if (!text.trim()) return;
        setIsAnalyzing(true);
        setAnalyzeTarget(target);
        setShowAnalysis(true);
        setAnalysis(null);
        try {
            const res = await fetch("/api/analyze", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error);
            setAnalysis(data);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // ── Copy ───────────────────────────────────────────────────────────────────
    const handleCopy = async () => {
        await navigator.clipboard.writeText(translated);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ── Save ───────────────────────────────────────────────────────────────────
    const handleSave = () => {
        setSavedMsg(true);
        setTimeout(() => setSavedMsg(false), 2000);
    };

    // ── Clear ──────────────────────────────────────────────────────────────────
    const handleClear = () => {
        setSourceText("");
        setTranslated("");
        setAnalysis(null);
        setShowAnalysis(false);
        setTranslateError("");
    };

    const charCount = sourceText.length;

    // ── Render ─────────────────────────────────────────────────────────────────
    return (
        <div className="dashboard-body-bg min-h-screen font-sans">
            {/* HEADER — giống hệt các trang khác */}
            <DashboardHeader />

            {/* FLOATING DECORATIONS */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <span className="material-symbols-outlined absolute opacity-10 text-7xl text-primary" style={{ top: "15%", left: "5%" }}>school</span>
                <span className="material-symbols-outlined absolute opacity-10 text-6xl text-indigo-400" style={{ top: "60%", left: "8%" }}>menu_book</span>
                <span className="material-symbols-outlined absolute opacity-10 text-8xl text-primary" style={{ top: "25%", right: "5%" }}>translate</span>
                <span className="material-symbols-outlined absolute opacity-10 text-5xl text-indigo-400" style={{ bottom: "10%", right: "10%" }}>psychology</span>
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl" />
            </div>

            {/* MAIN */}
            <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-16">

                {/* HERO */}
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                        F-IELTS AI Translation &amp; Analysis
                    </h1>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Tra cứu từ vựng, ngữ pháp và dịch câu chuẩn xác theo ngữ cảnh IELTS với công nghệ trí tuệ nhân tạo.
                    </p>
                </div>

                {/* TRANSLATION CARD */}
                <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden mb-8">

                    {/* Card header bar */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            {/* From lang */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowLangFrom(!showLangFrom); setShowLangTo(false); }}
                                    className="text-sm font-bold text-primary tracking-wide uppercase flex items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                    {LANG_LABELS[fromLang]}
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </button>
                                {showLangFrom && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 min-w-36 py-1">
                                        {Object.entries(LANG_LABELS).map(([code, label]) => (
                                            <button
                                                key={code}
                                                onClick={() => { setFromLang(code); setShowLangFrom(false); }}
                                                className={`w-full px-4 py-2 text-xs text-left font-bold uppercase hover:bg-slate-50 transition-colors ${code === fromLang ? "text-primary" : "text-slate-600"}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Swap */}
                            <button
                                onClick={handleSwap}
                                className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-primary hover:bg-slate-200 transition-all active:scale-90"
                            >
                                <span className="material-symbols-outlined text-lg">swap_horiz</span>
                            </button>

                            {/* To lang */}
                            <div className="relative">
                                <button
                                    onClick={() => { setShowLangTo(!showLangTo); setShowLangFrom(false); }}
                                    className="text-sm font-bold text-primary tracking-wide uppercase flex items-center gap-1 hover:opacity-80 transition-opacity"
                                >
                                    {LANG_LABELS[toLang]}
                                    <span className="material-symbols-outlined text-sm">expand_more</span>
                                </button>
                                {showLangTo && (
                                    <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 min-w-36 py-1">
                                        {Object.entries(LANG_LABELS).map(([code, label]) => (
                                            <button
                                                key={code}
                                                onClick={() => { setToLang(code); setShowLangTo(false); }}
                                                className={`w-full px-4 py-2 text-xs text-left font-bold uppercase hover:bg-slate-50 transition-colors ${code === toLang ? "text-primary" : "text-slate-600"}`}
                                            >
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setShowHistory(!showHistory)}
                                className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition-colors"
                            >
                                <span className="material-symbols-outlined text-lg">history</span>
                                Lịch sử
                                {history.length > 0 && (
                                    <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                                        {history.length}
                                    </span>
                                )}
                            </button>
                            <button
                                onClick={handleClear}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>
                    </div>

                    {/* History panel */}
                    {showHistory && (
                        <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-4">
                            {history.length === 0 ? (
                                <p className="text-slate-400 text-sm text-center py-2">Chưa có lịch sử dịch thuật.</p>
                            ) : (
                                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                                    {history.map((item) => (
                                        <button
                                            key={item.id}
                                            onClick={() => {
                                                setSourceText(item.source.replace("...", ""));
                                                setTranslated(item.translated.replace("...", ""));
                                                setFromLang(item.from);
                                                setToLang(item.to);
                                                setShowHistory(false);
                                            }}
                                            className="w-full text-left px-4 py-2.5 rounded-xl bg-white border border-slate-100 hover:border-primary/30 hover:shadow-sm transition-all"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium text-slate-700 truncate">{item.source}</p>
                                                    <p className="text-xs text-slate-400 truncate">{item.translated}</p>
                                                </div>
                                                <span className="text-[10px] text-slate-300 font-bold uppercase shrink-0">
                                                    {item.from}→{item.to}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                            {history.length > 0 && (
                                <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-red-500 mt-2 transition-colors">
                                    Xóa tất cả
                                </button>
                            )}
                        </div>
                    )}

                    {/* Text panels */}
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">

                        {/* SOURCE */}
                        <div className="p-8 flex flex-col min-h-[320px]">
                            <textarea
                                ref={textareaRef}
                                value={sourceText}
                                onChange={(e) => { if (e.target.value.length <= charLimit) setSourceText(e.target.value); }}
                                placeholder="Nhập nội dung cần dịch..."
                                className="flex-1 w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl text-slate-800 resize-none p-0 placeholder-slate-300 outline-none leading-relaxed min-h-[200px]"
                            />
                            <div className="mt-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                        <span className="material-symbols-outlined">mic</span>
                                    </button>
                                    <button className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors">
                                        <span className="material-symbols-outlined">volume_up</span>
                                    </button>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-xs text-slate-400">{charCount} / {charLimit}</span>
                                    <button
                                        onClick={handleTranslate}
                                        disabled={isTranslating || !sourceText.trim()}
                                        className="bg-primary hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all active:scale-95"
                                    >
                                        {isTranslating ? (
                                            <>
                                                <span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>
                                                Đang dịch...
                                            </>
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-lg">translate</span>
                                                Dịch
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* TRANSLATED */}
                        <div className="p-8 flex flex-col min-h-[320px] bg-slate-50/50">
                            {translateError ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-4xl text-red-300 mb-2 block">error</span>
                                        <p className="text-sm text-red-500 font-medium">{translateError}</p>
                                        <button onClick={handleTranslate} className="mt-2 text-xs text-primary hover:underline">Thử lại</button>
                                    </div>
                                </div>
                            ) : isTranslating ? (
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-3" />
                                        <p className="text-sm text-slate-400">Đang dịch...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex-1 text-xl md:text-2xl text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {translated || <span className="text-slate-300">Bản dịch sẽ xuất hiện ở đây...</span>}
                                </div>
                            )}

                            {translated && !isTranslating && (
                                <div className="mt-6 flex items-center justify-between border-t border-dashed border-slate-200 pt-5">
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => { if (window.speechSynthesis) { const u = new SpeechSynthesisUtterance(translated); window.speechSynthesis.speak(u); } }}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">volume_up</span>
                                        </button>
                                        <button
                                            onClick={handleCopy}
                                            className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 text-slate-500 hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-lg">{copied ? "check" : "content_copy"}</span>
                                        </button>
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm border transition-all shadow-sm ${savedMsg
                                            ? "bg-green-50 border-green-300 text-green-600"
                                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span className="material-symbols-outlined text-primary text-sm">
                                            {savedMsg ? "check_circle" : "bookmark"}
                                        </span>
                                        {savedMsg ? "Đã lưu!" : "Lưu từ vựng"}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ANALYZE BUTTON */}
                <div className="flex justify-center mb-16">
                    <button
                        onClick={() => handleAnalyze(analyzeTarget)}
                        disabled={isAnalyzing || (!sourceText.trim() && !translated.trim())}
                        className="group relative bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 shadow-2xl shadow-indigo-500/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isAnalyzing ? (
                            <>
                                <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                                Đang phân tích...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-2xl group-hover:rotate-12 transition-transform">auto_awesome</span>
                                Phân tích ngữ pháp chuyên sâu
                                <div className="absolute -top-1 -right-1 flex h-4 w-4">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-white/20" />
                                </div>
                            </>
                        )}
                    </button>
                </div>

                {/* ANALYSIS PANEL */}
                {showAnalysis && (
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-16">
                        <div className="px-8 py-5 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white">auto_awesome</span>
                                </div>
                                <div>
                                    <h2 className="font-black text-slate-900 text-lg">Phân tích IELTS Writing</h2>
                                    <p className="text-xs text-slate-500">
                                        Phân tích {analyzeTarget === "source" ? "văn bản gốc" : "bản dịch tiếng Anh"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setAnalyzeTarget(analyzeTarget === "source" ? "translated" : "source")}
                                    className="text-xs text-primary font-medium hover:underline"
                                >
                                    Đổi nguồn
                                </button>
                                <button
                                    onClick={() => setShowAnalysis(false)}
                                    className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-white hover:text-slate-600 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-lg">close</span>
                                </button>
                            </div>
                        </div>

                        {isAnalyzing ? (
                            <div className="p-12 text-center">
                                <div className="w-14 h-14 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4" />
                                <p className="text-slate-500 font-medium">Đang phân tích...</p>
                            </div>
                        ) : analysis ? (
                            <div className="p-8 space-y-8">
                                {/* Band Score */}
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                                    <div className="relative w-28 h-28 shrink-0">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                                            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10" />
                                            <circle
                                                cx="50" cy="50" r="42" fill="none" stroke="#ec1313" strokeWidth="10"
                                                strokeDasharray={`${2 * Math.PI * 42}`}
                                                strokeDashoffset={`${2 * Math.PI * 42 * (1 - analysis.bandEstimate / 9)}`}
                                                strokeLinecap="round"
                                            />
                                        </svg>
                                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                                            <span className="text-4xl font-black">{analysis.bandEstimate}</span>
                                            <span className="text-[9px] font-bold text-white/50 uppercase tracking-wider">Est. Band</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black mb-1">Ước tính Band Score</h3>
                                        <p className="text-white/60 text-sm leading-relaxed">
                                            Dựa trên ngữ pháp, từ vựng và cấu trúc câu. Ước tính sơ bộ cho Grammar Range & Accuracy.
                                        </p>
                                        <div className="flex gap-4 mt-3 text-sm text-white/70">
                                            <span>{analysis.stats.wordCount} từ</span>
                                            <span>{analysis.stats.sentenceCount} câu</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Grammar */}
                                    <div>
                                        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-primary">spellcheck</span>
                                            Kiểm tra Ngữ pháp
                                        </h3>
                                        {analysis.grammarErrors.length === 0 ? (
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200">
                                                <span className="material-symbols-outlined text-green-500 text-2xl">check_circle</span>
                                                <div>
                                                    <p className="font-bold text-green-700 text-sm">Không phát hiện lỗi!</p>
                                                    <p className="text-green-600 text-xs mt-0.5">Văn bản đạt tiêu chuẩn ngữ pháp tốt.</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
                                                {analysis.grammarErrors.map((err, i) => (
                                                    <div key={i} className={`p-4 rounded-2xl border ${SEVERITY_STYLES[err.severity]}`}>
                                                        <div className="flex items-start gap-3">
                                                            <span className={`material-symbols-outlined text-xl mt-0.5 ${SEVERITY_COLOR[err.severity]}`}>
                                                                {SEVERITY_ICON[err.severity]}
                                                            </span>
                                                            <div>
                                                                <p className="font-bold text-slate-900 text-sm">{err.type}</p>
                                                                <p className="text-slate-600 text-xs mt-0.5">{err.message}</p>
                                                                <p className="text-slate-500 text-xs mt-2">💡 {err.suggestion}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* Vocab */}
                                    <div>
                                        <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-indigo-600">auto_stories</span>
                                            Nâng cấp Từ vựng
                                            <span className="ml-auto text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">Band 7+</span>
                                        </h3>
                                        {analysis.vocabSuggestions.length === 0 ? (
                                            <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 border border-green-200">
                                                <span className="material-symbols-outlined text-green-500 text-2xl">star</span>
                                                <p className="font-bold text-green-700 text-sm">Từ vựng học thuật tốt!</p>
                                            </div>
                                        ) : (
                                            <div className="space-y-2">
                                                {analysis.vocabSuggestions.map((v, i) => (
                                                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 transition-colors group">
                                                        <div className="flex-1 min-w-0">
                                                            <span className="inline-block bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full line-through mr-2">{v.original}</span>
                                                            <span className="material-symbols-outlined text-slate-300 text-sm align-middle">arrow_forward</span>
                                                            <span className="ml-2 text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">{v.suggestion}</span>
                                                            <p className="text-[10px] text-slate-400 mt-0.5">{v.note}</p>
                                                        </div>
                                                        <button
                                                            onClick={() => navigator.clipboard.writeText(v.suggestion)}
                                                            className="w-7 h-7 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-indigo-600"
                                                        >
                                                            <span className="material-symbols-outlined text-sm">content_copy</span>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Tips */}
                                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200">
                                    <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                                        <span className="material-symbols-outlined text-amber-600">tips_and_updates</span>
                                        Mẹo Cấu trúc Câu — IELTS Band 7+
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        {[
                                            { icon: "account_tree", title: "Câu phức", tip: "Dùng which/that/who để ghép mệnh đề quan hệ." },
                                            { icon: "link", title: "Liên từ học thuật", tip: "However, Furthermore, Consequently thay vì but/also/so." },
                                            { icon: "format_quote", title: "Trật tự từ", tip: "'Although...', 'Despite...', 'Having done...' để mở đầu câu." },
                                        ].map((tip) => (
                                            <div key={tip.title} className="bg-white/70 p-4 rounded-xl">
                                                <span className="material-symbols-outlined text-amber-600 text-xl mb-2 block">{tip.icon}</span>
                                                <p className="font-bold text-slate-900 text-sm mb-1">{tip.title}</p>
                                                <p className="text-xs text-slate-500 leading-relaxed">{tip.tip}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                )}

                {/* FEATURE CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    {[
                        {
                            icon: "spellcheck",
                            iconBg: "bg-red-100",
                            iconColor: "text-primary",
                            title: "Check Ngữ Pháp",
                            desc: "Tự động phát hiện và sửa các lỗi ngữ pháp phổ biến trong bài thi IELTS Writing.",
                        },
                        {
                            icon: "auto_stories",
                            iconBg: "bg-indigo-100",
                            iconColor: "text-indigo-600",
                            title: "Nâng Cấp Từ Vựng",
                            desc: "Gợi ý các từ đồng nghĩa (synonyms) và collocation học thuật để tăng điểm Lexical Resource.",
                        },
                        {
                            icon: "speed",
                            iconBg: "bg-emerald-100",
                            iconColor: "text-emerald-600",
                            title: "Phân Tích Cấu Trúc",
                            desc: "Đánh giá độ phức tạp của câu và đề xuất các cấu trúc câu ghép, câu phức ghi điểm cao.",
                        },
                    ].map((card) => (
                        <div key={card.title} className="p-6 bg-white rounded-2xl border border-slate-100 hover:shadow-lg transition-shadow group">
                            <div className={`w-12 h-12 ${card.iconBg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                <span className={`material-symbols-outlined ${card.iconColor}`}>{card.icon}</span>
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-slate-900">{card.title}</h3>
                            <p className="text-sm text-slate-500 leading-relaxed">{card.desc}</p>
                        </div>
                    ))}
                </div>

                {/* HISTORY SECTION */}
                <div className="mt-16 bg-white rounded-2xl border border-slate-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400">history</span>
                            Lịch sử dịch thuật
                            {history.length > 0 && (
                                <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-0.5 rounded-full">{history.length}</span>
                            )}
                        </h2>
                        {history.length > 0 && (
                            <button onClick={() => setHistory([])} className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1">
                                <span className="material-symbols-outlined text-sm">delete_sweep</span>
                                Xóa tất cả
                            </button>
                        )}
                    </div>
                    <div className="p-6">
                        {history.length === 0 ? (
                            <div className="text-center py-8">
                                <span className="material-symbols-outlined text-5xl text-slate-200 mb-2 block">history</span>
                                <p className="text-slate-400 text-sm">Chưa có lịch sử. Hãy dịch thử một câu!</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {history.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSourceText(item.source.replace("...", ""));
                                            setTranslated(item.translated.replace("...", ""));
                                            setFromLang(item.from);
                                            setToLang(item.to);
                                            window.scrollTo({ top: 0, behavior: "smooth" });
                                        }}
                                        className="text-left p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/30 hover:shadow-sm transition-all group"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-[10px] font-bold text-slate-300 uppercase">{item.from} → {item.to}</span>
                                            <span className="text-[10px] text-slate-300">
                                                {item.timestamp.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-slate-700 truncate group-hover:text-primary transition-colors">{item.source}</p>
                                        <p className="text-xs text-slate-400 truncate mt-0.5">{item.translated}</p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

            </main>

            {/* FOOTER */}
            <footer className="mt-20 py-10 border-t border-slate-200 bg-white/50">
                <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
                            <span className="text-white font-bold text-sm">F</span>
                        </div>
                        <span className="font-bold text-slate-800">F-IELTS AI</span>
                        <span className="text-slate-400 text-sm ml-4">© 2024 F-IELTS. Tất cả quyền được bảo lưu.</span>
                    </div>
                    <div className="flex gap-8">
                        <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Điều khoản</a>
                        <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Bảo mật</a>
                        <a className="text-sm text-slate-500 hover:text-primary transition-colors" href="#">Liên hệ</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
