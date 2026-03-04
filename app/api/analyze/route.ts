import { NextRequest, NextResponse } from "next/server";

// IELTS academic vocabulary suggestions - common replacements for Band 7+
const VOCABULARY_UPGRADES: Record<string, { suggestion: string; note: string }> = {
    "very good": { suggestion: "exceptional / outstanding", note: "More academic" },
    "a lot of": { suggestion: "a significant number of / numerous", note: "Academic register" },
    "many": { suggestion: "numerous / a multitude of", note: "Higher register" },
    "show": { suggestion: "demonstrate / illustrate", note: "Academic verb" },
    "think": { suggestion: "consider / argue / contend", note: "Academic verb" },
    "get": { suggestion: "obtain / acquire / achieve", note: "Formal verb" },
    "big": { suggestion: "substantial / significant / considerable", note: "Academic adj." },
    "small": { suggestion: "minimal / negligible / marginal", note: "Academic adj." },
    "important": { suggestion: "crucial / pivotal / paramount", note: "Stronger academic word" },
    "problem": { suggestion: "issue / challenge / concern", note: "More neutral" },
    "use": { suggestion: "utilize / employ / implement", note: "Formal verb" },
    "help": { suggestion: "facilitate / assist / support", note: "Academic verb" },
    "make": { suggestion: "create / generate / produce / establish", note: "Academic verb" },
    "look at": { suggestion: "examine / investigate / analyse", note: "Academic verb" },
    "find out": { suggestion: "ascertain / determine / identify", note: "Academic verb" },
    "because": { suggestion: "due to / as a result of / owing to", note: "Linking phrase" },
    "but": { suggestion: "however / nevertheless / nonetheless", note: "Academic connector" },
    "also": { suggestion: "furthermore / in addition / moreover", note: "Academic connector" },
    "for example": { suggestion: "for instance / to illustrate / as evidenced by", note: "Academic phrase" },
    "in conclusion": { suggestion: "to conclude / in summary / overall", note: "Academic closing" },
    "improve": { suggestion: "enhance / ameliorate / advance", note: "Academic verb" },
    "increase": { suggestion: "surge / escalate / rise significantly", note: "Stronger verb" },
    "decrease": { suggestion: "decline / diminish / reduce", note: "Formal verb" },
    "affect": { suggestion: "impact / influence / have implications for", note: "Academic verb" },
    "try": { suggestion: "attempt / endeavour / strive", note: "Formal verb" },
    "need": { suggestion: "require / necessitate / demand", note: "Formal verb" },
};

// Common grammar patterns
interface GrammarError {
    type: string;
    message: string;
    position?: { start: number; end: number };
    suggestion: string;
    severity: 'error' | 'warning' | 'info';
}

function analyzeGrammar(text: string): GrammarError[] {
    const errors: GrammarError[] = [];
    const lower = text.toLowerCase();

    // Passive voice overuse
    const passiveMatches = [...text.matchAll(/\b(is|are|was|were|been|be)\s+(being\s+)?\w+ed\b/gi)];
    if (passiveMatches.length > 2) {
        errors.push({
            type: "Passive Voice",
            message: `${passiveMatches.length} passive constructions detected.`,
            suggestion: "IELTS Band 7+ prefers active voice. Try converting some to active.",
            severity: "warning",
        });
    }

    // Repeated sentence starters
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
    const starters = sentences.map(s => s.trim().split(/\s+/)[0]?.toLowerCase() || "");
    const starterFreq: Record<string, number> = {};
    for (const st of starters) {
        if (st) starterFreq[st] = (starterFreq[st] || 0) + 1;
    }
    const repeatedStarters = Object.entries(starterFreq).filter(([, count]) => count >= 2);
    if (repeatedStarters.length > 0) {
        errors.push({
            type: "Sentence Variety",
            message: `Repeated sentence starters: "${repeatedStarters.map(([w]) => w).join('", "')}"`,
            suggestion: "Vary your sentence openings with subordinate clauses or participial phrases.",
            severity: "warning",
        });
    }

    // Article issues (a/an)
    const anBeforeConsonant = [...text.matchAll(/\ban\s+[bcdfghjklmnpqrstvwxyz]/gi)];
    if (anBeforeConsonant.length > 0) {
        errors.push({
            type: "Article Error",
            message: `Possible incorrect use of "an" before consonant sound.`,
            suggestion: 'Use "an" before vowel sounds (a, e, i, o, u), "a" before consonant sounds.',
            severity: "error",
        });
    }
    const aBeforeVowel = [...text.matchAll(/\ba\s+[aeiou]/gi)];
    if (aBeforeVowel.length > 0) {
        errors.push({
            type: "Article Error",
            message: `Possible incorrect use of "a" before vowel sound.`,
            suggestion: 'Use "an" before vowel sounds.',
            severity: "error",
        });
    }

    // Informal contractions
    const contractions = lower.match(/\b(don't|can't|won't|isn't|aren't|it's|they're|we're|i'm|he's|she's)\b/g);
    if (contractions && contractions.length > 0) {
        errors.push({
            type: "Informal Language",
            message: `${contractions.length} contractions found: ${[...new Set(contractions)].join(", ")}`,
            suggestion: "IELTS Academic Writing requires formal language. Avoid contractions.",
            severity: "error",
        });
    }

    // Vague words
    const vagueWords = lower.match(/\b(things|stuff|a lot|very|really|quite|basically|obviously)\b/g);
    if (vagueWords && vagueWords.length > 0) {
        errors.push({
            type: "Vague Language",
            message: `Vague words detected: ${[...new Set(vagueWords)].join(", ")}`,
            suggestion: "Replace with precise academic vocabulary for higher Lexical Resource score.",
            severity: "warning",
        });
    }

    // Long sentences (potential run-ons)
    const longSentences = sentences.filter(s => s.split(/\s+/).length > 35);
    if (longSentences.length > 0) {
        errors.push({
            type: "Sentence Length",
            message: `${longSentences.length} very long sentence(s) detected (35+ words).`,
            suggestion: "Break into shorter sentences or use proper punctuation and connectors.",
            severity: "warning",
        });
    }

    // Short / underdeveloped sentences
    const shortSentences = sentences.filter(s => s.split(/\s+/).filter(w => w.length > 0).length < 6);
    if (shortSentences.length >= 2) {
        errors.push({
            type: "Sentence Complexity",
            message: `${shortSentences.length} very short sentences detected.`,
            suggestion: "Combine using relative clauses (which/that), subordinators (although/while) for Band 7+ Grammar Range.",
            severity: "info",
        });
    }

    return errors;
}

interface VocabSuggestion {
    original: string;
    suggestion: string;
    note: string;
}

function suggestVocabulary(text: string): VocabSuggestion[] {
    const suggestions: VocabSuggestion[] = [];
    const lower = text.toLowerCase();

    for (const [word, upgrade] of Object.entries(VOCABULARY_UPGRADES)) {
        if (lower.includes(word)) {
            suggestions.push({
                original: word,
                suggestion: upgrade.suggestion,
                note: upgrade.note,
            });
        }
    }

    return suggestions.slice(0, 6); // Max 6 vocab suggestions
}

function estimateBandScore(text: string, errors: GrammarError[]): number {
    const words = text.split(/\s+/).filter(w => w.length > 0).length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5).length;
    const avgWordsPerSentence = sentences > 0 ? words / sentences : 0;
    const errorCount = errors.filter(e => e.severity === "error").length;
    const warningCount = errors.filter(e => e.severity === "warning").length;

    let score = 6.0;
    if (errorCount === 0) score += 0.5;
    if (warningCount <= 1) score += 0.5;
    if (avgWordsPerSentence > 15 && avgWordsPerSentence < 30) score += 0.5;
    if (words > 150) score += 0.5;
    score = Math.min(9.0, Math.max(4.0, score));

    return Math.round(score * 2) / 2;
}

export async function POST(req: NextRequest) {
    try {
        const { text } = await req.json();
        if (!text || !text.trim()) {
            return NextResponse.json({ error: "No text provided" }, { status: 400 });
        }

        const trimmed = text.trim();
        const grammarErrors = analyzeGrammar(trimmed);
        const vocabSuggestions = suggestVocabulary(trimmed);
        const bandEstimate = estimateBandScore(trimmed, grammarErrors);

        const wordCount = trimmed.split(/\s+/).filter((w: string) => w.length > 0).length;
        const sentenceCount = trimmed.split(/[.!?]+/).filter((s: string) => s.trim().length > 5).length;

        return NextResponse.json({
            grammarErrors,
            vocabSuggestions,
            bandEstimate,
            stats: { wordCount, sentenceCount },
        });
    } catch (err) {
        console.error("[analyze API]", err);
        return NextResponse.json({ error: "Analysis failed." }, { status: 500 });
    }
}
