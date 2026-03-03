"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { dictionaries, Language } from "@/lib/i18n";
import { setLanguageCookie } from "@/app/actions/language"; // Ensure you create this

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: keyof typeof dictionaries["en"]) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
    children,
    initialLanguage,
}: {
    children: React.ReactNode;
    initialLanguage: Language;
}) {
    const [language, setLanguageState] = useState<Language>(initialLanguage);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        setLanguageCookie(lang); // save to cookie for server components
    };

    const t = (key: keyof typeof dictionaries["en"]) => {
        return dictionaries[language]?.[key] || dictionaries["en"][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
