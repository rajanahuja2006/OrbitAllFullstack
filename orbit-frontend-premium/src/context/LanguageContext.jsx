import { createContext, useContext, useState, useEffect } from "react";

const LanguageContext = createContext();

const translations = {
  English: {
    account: "Account",
    notifications: "Notifications",
    learningSettings: "Learning Settings",
    aiSettings: "AI Settings",
    privacyAppearance: "Privacy & Appearance",
    dataSupport: "Data & Support",
  },
  Spanish: {
    account: "Cuenta",
    notifications: "Notificaciones",
    learningSettings: "Ajustes de aprendizaje",
    aiSettings: "Ajustes de IA",
    privacyAppearance: "Privacidad y apariencia",
    dataSupport: "Datos y soporte",
  },
  French: {
    account: "Compte",
    notifications: "Notifications",
    learningSettings: "Paramètres d'apprentissage",
    aiSettings: "Paramètres d'IA",
    privacyAppearance: "Confidentialité et apparence",
    dataSupport: "Données et assistance",
  },
  Hindi: {
    account: "खाता",
    notifications: "सूचनाएँ",
    learningSettings: "सीखने की सेटिंग्स",
    aiSettings: "एआई सेटिंग्स",
    privacyAppearance: "गोपनीयता और दिखावट",
    dataSupport: "डेटा और सहायता",
  }
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("app-language") || "English";
  });

  useEffect(() => {
    localStorage.setItem("app-language", language);
  }, [language]);

  const t = (key) => translations[language]?.[key] || translations["English"]?.[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
