import { useState } from "react";
import "./fonts.css";
import comparisonScale from "./assets/comparison-scale.svg";
import grannygoMapBg from "./assets/grannygo-map-bg.svg";
import iconEmergency from "./assets/icon-emergency.svg";
import iconGrandchild from "./assets/icon-grandchild.svg";
import iconLanguages from "./assets/icon-languages.svg";
import iconV from "./assets/icon-v.svg";
import iconWalk from "./assets/icon-walk.svg";
import iconX from "./assets/icon-x.svg";
import rutiAvatar from "./assets/ruti-avatar.svg";
import styles from "./DesignPage.module.css";

type NavMode = "route" | "repeat" | "emergency";

interface NavScenario {
  label: string;
  headline: string;
  detail: string;
  badge: string;
}

const NAV_SCENARIOS: Record<NavMode, NavScenario> = {
  route: {
    label: "ניווט לקפה",
    headline: "בעוד 400 מ׳ פני ימינה",
    detail: "לכיוון קפה עם רחל",
    badge: "מסלול רגוע • ללא כביש מהיר",
  },
  repeat: {
    label: "אפשר שוב?",
    headline: "חוזר בקול רגוע ואיטי...",
    detail: "בעוד 400 מ׳ פני ימינה — התראה מוקדמת",
    badge: "דיבור ברור ואיטי • טקסט מוגדל",
  },
  emergency: {
    label: "חירום",
    headline: "מחייגת למשפחה / ידידים...",
    detail: "לחיצה אחת — העזרה בדרך",
    badge: "מצב חירום פעיל • מיקום משותף",
  },
};

const NAV_MODES: NavMode[] = ["route", "repeat", "emergency"];

const PAIN_POINTS = [
  "הטקסט קטן והמסך עמוס",
  "ההוראות מהירות מדי",
  "נשלחת לכבישים מהירים",
] as const;

const BENEFITS = [
  "טקסט גדול וברור",
  "קול רגוע ואיטי, והתראה מוקדמת",
  "הדרך המוכרת והרגועה",
] as const;

interface ChatMessage {
  sender: "app" | "user";
  text: string;
}

const CHAT_GROUPS: readonly (readonly ChatMessage[])[] = [
  [
    { sender: "app", text: "לאן נוסעים היום?" },
    { sender: "user", text: "קפה עם רחל" },
  ],
  [
    { sender: "app", text: "בעוד 500 מטר פני ימינה" },
    { sender: "user", text: "אפשר שוב?" },
    { sender: "app", text: "בעוד 400 מטר פני ימינה" },
  ],
  [
    { sender: "user", text: "נתקעתי" },
    { sender: "app", text: "מחייגת ל״ידידים״" },
  ],
];

interface FeatureItem {
  id: string;
  icon: string;
  iconWidth: number;
  iconHeight: number;
  title: string;
  description: string;
}

const FEATURES: readonly FeatureItem[] = [
  {
    id: "emergency",
    icon: iconEmergency,
    iconWidth: 78,
    iconHeight: 78,
    title: "כפתור חירום",
    description: "לחיצה אחת מחייגת ישר למשפחה",
  },
  {
    id: "walk",
    icon: iconWalk,
    iconWidth: 41,
    iconHeight: 67,
    title: "מהחניה ועד הדלת",
    description: "איתור חנייה נגישה, סימון החניה וניווט רגלי",
  },
  {
    id: "grandchild",
    icon: iconGrandchild,
    iconWidth: 51,
    iconHeight: 55,
    title: "התקנה עם הנכד",
    description: "הזדמנות טובה לבלות יחד זמן איכות",
  },
  {
    id: "languages",
    icon: iconLanguages,
    iconWidth: 74,
    iconHeight: 60,
    title: "6 שפות",
    description: "עברית, אנגלית, רוסית, ערבית, אמהרית, יידיש",
  },
];

/**
 * Interactive desktop-only GrannyGo navigation showcase displayed alongside
 * Ruti's illustration on >= 768px screens without modifying the mobile spec.
 */
function DesktopNavShowcase() {
  const [mode, setMode] = useState<NavMode>("route");
  const active = NAV_SCENARIOS[mode];
  const isEmergency = mode === "emergency";

  return (
    <div
      className={styles.navCard}
      aria-label="הדגמה אינטראקטיבית של ממשק GrannyGo"
    >
      <div
        className={`${styles.navBanner} ${isEmergency ? styles.navBannerEmergency : ""}`}
      >
        <div className={styles.navBannerText}>
          <strong className={styles.navHeadline}>{active.headline}</strong>
          <span className={styles.navDetail}>{active.detail}</span>
        </div>

        <span className={styles.navBannerIcon} aria-hidden="true">
          {isEmergency ? "!" : mode === "repeat" ? "🔊" : "↱"}
        </span>
      </div>

      <div className={styles.navMapArea}>
        <img
          src={grannygoMapBg}
          alt=""
          className={styles.navMapImg}
          width="308"
          height="108"
        />
        <span
          className={`${styles.navRouteBadge} ${isEmergency ? styles.navRouteBadgeEmergency : ""}`}
        >
          {active.badge}
        </span>
      </div>

      <div
        className={styles.navControls}
        role="tablist"
        aria-label="מצבי הדגמה"
      >
        {NAV_MODES.map((key) => {
          const isSelected = mode === key;
          const isEmergencyBtn = key === "emergency";
          return (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setMode(key)}
              className={[
                styles.navTabBtn,
                isEmergencyBtn ? styles.navTabEmergency : "",
                isSelected ? styles.navTabActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {NAV_SCENARIOS[key].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Single voice-conversation speech bubble rendered with live Hebrew text
 * and an unstretched corner tail matching the Figma vector geometry.
 */
function ChatBubble({ sender, text }: ChatMessage) {
  const isApp = sender === "app";
  return (
    <div
      className={`${styles.chatBubble} ${isApp ? styles.chatBubbleBlue : styles.chatBubbleGreen}`}
    >
      <p className={styles.chatBubbleText}>{text}</p>
      <svg
        className={isApp ? styles.bubbleTailLeft : styles.bubbleTailRight}
        width="26"
        height="14"
        viewBox="0 0 25.64 13.4"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M25.6386 13.395C22.0847 13.395 18.851 12.0034 16.4484 9.7108C13.1747 12.0334 9.18025 13.395 4.87544 13.395C3.18355 13.395 1.56174 13.1847 0 12.7943C5.41605 11.4528 9.96112 7.8988 12.6341 3.1435C12.3838 2.1324 12.2537 1.0712 12.2537 0H25.6386V13.395Z"
          fill="currentColor"
        />
      </svg>
    </div>
  );
}

/**
 * GrannyGo Design Page: Product Jam Exercise 2 (Part 3)
 * Renders live Hebrew typography with bundled Narkiss Block Condensed TRIAL
 * font files while keeping mobile (< 768px) matched to Figma and expanding
 * window mode (>= 768px) into a framed desktop showcase.
 */
export default function DesignPage() {
  return (
    <div className={styles.pageContainer} dir="rtl">
      {/* Top Header Section */}
      <header className={styles.header}>
        <p className={styles.superTitle}>ג׳אם עיצוב מוצר | חשבונית אפיון</p>
        <h1 className={styles.appLogo}>GrannyGo</h1>
        <p className={styles.subTitle}>
          אפליקציית ניווט ייעודית לנהגות בנות 70+
        </p>
      </header>

      {/* Main White Content Sheet */}
      <main className={styles.whiteSheet}>
        {/* Character Intro: Ruti */}
        <section className={styles.characterSection}>
          <h2 className={styles.characterHeading}>זו רותי, נהגת בת 75</h2>
          <div className={styles.characterRow}>
            <div className={styles.avatarWrapper}>
              <img
                src={rutiAvatar}
                alt="איור של רותי, נהגת בת 75"
                className={styles.characterAvatar}
                width="265"
                height="233"
              />
            </div>

            <div className={styles.navPreviewWrapper}>
              <DesktopNavShowcase />
            </div>
          </div>
        </section>

        {/* Problem vs Solution Comparison */}
        <section
          className={styles.comparisonSection}
          aria-label="השוואה: Waze מול GrannyGo"
        >
          {/* Pain Points (Waze) */}
          <div className={styles.painPoints}>
            <h3 className={styles.comparisonTitle}>
              רותי פותחת את <span className={styles.latinWord}>waze</span>, ו...
            </h3>
            <ul className={styles.comparisonList}>
              {PAIN_POINTS.map((item) => (
                <li key={item} className={styles.painItem}>
                  <img
                    src={iconX}
                    alt=""
                    aria-hidden="true"
                    className={styles.statusIconX}
                    width="14"
                    height="18"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className={styles.comparisonScaleWrapper} aria-hidden="true">
            <img
              src={comparisonScale}
              alt=""
              className={styles.comparisonScaleImg}
              width="112"
              height="106"
            />
          </div>

          {/* Solution (GrannyGo) */}
          <div className={styles.benefits}>
            <h3 className={`${styles.comparisonTitle} ${styles.benefitsTitle}`}>
              עם <span className={styles.inlineBrand}>GrannyGo</span>
              <br />
              רותי מנווטת בפשטות ובטחון
            </h3>
            <ul className={styles.comparisonList}>
              {BENEFITS.map((item) => (
                <li key={item} className={styles.benefitItem}>
                  <img
                    src={iconV}
                    alt=""
                    aria-hidden="true"
                    className={styles.statusIconV}
                    width="20"
                    height="20"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Voice Interface Section */}
        <section
          className={styles.voiceSection}
          aria-label="ממשק קולי - פחות לגעת, יותר לדבר"
        >
          <h2 className={styles.voiceTitle}>
            ממשק קולי - פחות לגעת, יותר לדבר
          </h2>

          <div className={styles.chatWrapper}>
            {CHAT_GROUPS.map((group, idx) => (
              <div key={idx} className={styles.chatGroupSlot}>
                {idx > 0 && (
                  <div className={styles.chatDivider} aria-hidden="true" />
                )}
                <div className={styles.chatGroup}>
                  {group.map((msg) => (
                    <ChatBubble
                      key={`${idx}-${msg.text}`}
                      sender={msg.sender}
                      text={msg.text}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Highlights Grid (The 4 Pros) */}
        <section
          className={styles.featuresGrid}
          aria-label="יתרונות בולטים של GrannyGo"
        >
          {FEATURES.map((feature) => (
            <article key={feature.id} className={styles.featureCard}>
              <div className={styles.featureIconWrapper}>
                <img
                  src={feature.icon}
                  alt=""
                  aria-hidden="true"
                  className={styles.featureIcon}
                  width={feature.iconWidth}
                  height={feature.iconHeight}
                />
              </div>
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureDesc}>{feature.description}</p>
            </article>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          פותח ע״י להב לִבנה, אמיר בן אבי, רותם זוהר ואוהד גולד
        </p>
      </footer>
    </div>
  );
}
