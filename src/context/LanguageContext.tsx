"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { bm, type LangDict } from "@/i18n/bm";
import { en } from "@/i18n/en";

type Language = "bm" | "en";

interface LanguageContextValue {
  lang: Language;
  t: LangDict;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "bm",
  t: bm,
  setLang: () => {},
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>("bm");

  useEffect(() => {
    const stored = localStorage.getItem("msn-lang") as Language | null;
    if (stored === "bm" || stored === "en") {
      setLangState(stored);
    }
  }, []);

  function setLang(l: Language) {
    setLangState(l);
    localStorage.setItem("msn-lang", l);
  }

  const t = lang === "bm" ? bm : en;

  return (
    <LanguageContext.Provider value={{ lang, t, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
