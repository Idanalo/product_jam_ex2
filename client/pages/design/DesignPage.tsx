import chatDivider from "./assets/chat-divider.svg";
import chatGroup1 from "./assets/chat-group-1.svg";
import chatGroup2 from "./assets/chat-group-2.svg";
import chatGroup3 from "./assets/chat-group-3.svg";
import footerCredits from "./assets/footer-credits.svg";
import headerJam from "./assets/header-jam.svg";
import headerTagline from "./assets/header-tagline.svg";
import painPointsBlock from "./assets/pain-points-block.svg";
import proEmergency from "./assets/pro-emergency.svg";
import proGrandchild from "./assets/pro-grandchild.svg";
import proLanguages from "./assets/pro-languages.svg";
import proWalk from "./assets/pro-walk.svg";
import rutiAvatar from "./assets/ruti-avatar.svg";
import rutiTitle from "./assets/ruti-title.svg";
import sectionBenefits from "./assets/section-benefits.svg";
import styles from "./DesignPage.module.css";

/**
 * GrannyGo Design Page: Product Jam Exercise 2 (Part 3)
 * Pixel-accurate implementation matching the designer's Figma specification
 * with authentic typography, vectors, and responsive adaptation across
 * mobile, tablet, and desktop viewports.
 */
export default function DesignPage() {
  return (
    <div className={styles.pageContainer} dir="rtl">
      {/* Top Header Section */}
      <header className={styles.header}>
        <img
          src={headerJam}
          alt="ג׳אם עיצוב מוצר | חשבונית אפיון"
          className={styles.headerJamImg}
          width="190"
          height="19"
        />
        <h1 className={styles.appLogo}>GrannyGo</h1>
        <img
          src={headerTagline}
          alt="אפליקציית ניווט ייעודית לנהגות בנות 70+"
          className={styles.headerTaglineImg}
          width="333"
          height="24"
        />
      </header>

      {/* Main White Content Sheet */}
      <main className={styles.whiteSheet}>
        {/* Character Intro: Ruti */}
        <section className={styles.characterSection}>
          <h2 className={styles.srOnly}>זו רותי, נהגת בת 75</h2>
          <img
            src={rutiTitle}
            alt="זו רותי, נהגת בת 75"
            className={styles.rutiTitleImg}
            width="160"
            height="22"
          />
          <div className={styles.avatarWrapper}>
            <img
              src={rutiAvatar}
              alt="איור של רותי, נהגת בת 75"
              className={styles.characterAvatar}
              width="260"
              height="232"
            />
          </div>
        </section>

        {/* Problem vs Solution Comparison */}
        <section
          className={styles.comparisonSection}
          aria-label="השוואה: Waze מול GrannyGo"
        >
          {/* Pain Points (Waze) */}
          <div className={styles.painPoints}>
            <img
              src={painPointsBlock}
              alt="רותי פותחת את waze, ו... הטקסט קטן והמסך עמוס, ההוראות מהירות מדי, נשלחת לכבישים מהירים"
              className={styles.painPointsImg}
              width="216"
              height="160"
            />
          </div>

          {/* Solution (GrannyGo) */}
          <div className={styles.benefits}>
            <img
              src={sectionBenefits}
              alt="עם GrannyGo רותי מנווטת בפשטות ובטחון: טקסט גדול וברור, קול רגוע ואיטי והתראה מוקדמת, הדרך המוכרת והרגועה"
              className={styles.benefitsImg}
              width="312"
              height="207"
            />
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
            {/* Conversation 1: לאן נוסעים היום? (Blue / Left) -> קפה עם רחל (Green / Right) */}
            <img
              src={chatGroup1}
              alt="שיחה ראשונה: לאן נוסעים היום? - קפה עם רחל"
              className={styles.chatGroupImg}
              width="293"
              height="53"
            />

            <img
              src={chatDivider}
              alt=""
              className={styles.chatDividerImg}
              width="293"
              height="2"
            />

            {/* Conversation 2: בעוד 500 מטר (Blue / Left) -> אפשר שוב? (Green / Right) -> בעוד 400 מטר (Blue / Left) */}
            <img
              src={chatGroup2}
              alt="שיחה שניה: בעוד 500 מטר פני ימינה - אפשר שוב? - בעוד 400 מטר פני ימינה"
              className={styles.chatGroupImg}
              width="293"
              height="93"
            />

            <img
              src={chatDivider}
              alt=""
              className={styles.chatDividerImg}
              width="293"
              height="2"
            />

            {/* Conversation 3: נתקעתי (Green / Right) -> מחייגת ל״ידידים״ (Blue / Left) */}
            <img
              src={chatGroup3}
              alt="שיחה שלישית: נתקעתי - מחייגת ל״ידידים״"
              className={styles.chatGroupImg}
              width="293"
              height="53"
            />
          </div>
        </section>

        {/* Feature Highlights Grid (The 4 Pros) */}
        <section
          className={styles.featuresGrid}
          aria-label="יתרונות בולטים של GrannyGo"
        >
          {/* Emergency Button */}
          <article className={styles.featureCard}>
            <img
              src={proEmergency}
              alt="כפתור חירום: לחיצה אחת מחייגת ישר למשפחה"
              className={styles.proCardImg}
              width="255"
              height="167"
            />
          </article>

          {/* From Parking to Door */}
          <article className={styles.featureCard}>
            <img
              src={proWalk}
              alt="מהחניה ועד הדלת: איתור חנייה נגישה, סימון החניה וניווט רגלי"
              className={styles.proCardImg}
              width="325"
              height="152"
            />
          </article>

          {/* Setup with Grandchild */}
          <article className={styles.featureCard}>
            <img
              src={proGrandchild}
              alt="התקנה עם הנכד: הזדמנות טובה לבלות יחד זמן איכות"
              className={styles.proCardImg}
              width="269"
              height="140"
            />
          </article>

          {/* 6 Languages */}
          <article className={styles.featureCard}>
            <img
              src={proLanguages}
              alt="6 שפות: עברית, אנגלית, רוסית, ערבית, אמהרית, יידיש"
              className={styles.proCardImg}
              width="345"
              height="144"
            />
          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <img
          src={footerCredits}
          alt="פותח ע״י להב לִבנה, אמיר בן אבי, רותם זוהר ואוהד גולד"
          className={styles.footerCreditsImg}
          width="318"
          height="17"
        />
      </footer>
    </div>
  );
}
