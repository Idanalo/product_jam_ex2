import chatDivider from "./assets/chat-divider.svg";
import chatGroup1 from "./assets/chat-group-1.svg";
import chatGroup2 from "./assets/chat-group-2.svg";
import chatGroup3 from "./assets/chat-group-3.svg";
import iconEmergency from "./assets/icon-emergency.svg";
import iconGrandchild from "./assets/icon-grandchild.svg";
import iconLanguages from "./assets/icon-languages.svg";
import iconV from "./assets/icon-v.svg";
import iconWalk from "./assets/icon-walk.svg";
import iconX from "./assets/icon-x.svg";
import rutiAvatar from "./assets/ruti-avatar.svg";
import styles from "./DesignPage.module.css";

/**
 * GrannyGo Design Page: Product Jam Exercise 2 (Part 3)
 * Pixel-accurate implementation from the designer's Figma specification
 * with full responsiveness across phone, tablet, and desktop viewports.
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
          <div className={styles.avatarWrapper}>
            <img
              src={rutiAvatar}
              alt="רותי, נהגת בת 75"
              className={styles.characterAvatar}
              width="260"
              height="232"
            />
          </div>
        </section>

        {/* Problem vs Solution Comparison */}
        <section className={styles.comparisonSection}>
          {/* Pain Points (Waze) */}
          <div className={styles.painPoints}>
            <h3 className={styles.sectionTitle}>
              רותי פותחת את waze, ו...
            </h3>
            <ul className={styles.painList}>
              <li className={styles.painItem}>
                <img src={iconX} alt="X" className={styles.statusIcon} />
                <span>הטקסט קטן והמסך עמוס</span>
              </li>
              <li className={styles.painItem}>
                <img src={iconX} alt="X" className={styles.statusIcon} />
                <span>ההוראות מהירות מדי</span>
              </li>
              <li className={styles.painItem}>
                <img src={iconX} alt="X" className={styles.statusIcon} />
                <span>נשלחת לכבישים מהירים</span>
              </li>
            </ul>
          </div>

          {/* Solution (GrannyGo) */}
          <div className={styles.benefits}>
            <h3 className={styles.sectionTitle}>
              עם <em>GrannyGo</em>
              <br />
              רותי מנווטת בפשטות ובטחון
            </h3>
            <ul className={styles.benefitList}>
              <li className={styles.benefitItem}>
                <img src={iconV} alt="V" className={styles.statusIcon} />
                <span>טקסט גדול וברור</span>
              </li>
              <li className={styles.benefitItem}>
                <img src={iconV} alt="V" className={styles.statusIcon} />
                <span>קול רגוע ואיטי, והתראה מוקדמת</span>
              </li>
              <li className={styles.benefitItem}>
                <img src={iconV} alt="V" className={styles.statusIcon} />
                <span>הדרך המוכרת והרגועה</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Voice Interface Section */}
        <section className={styles.voiceSection}>
          <h2 className={styles.voiceTitle}>
            ממשק קולי - פחות לגעת, יותר לדבר
          </h2>

          <div className={styles.chatWrapper}>
            {/* Conversation 1: לאן נוסעים היום? (Blue / Left) -> קפה עם רחל (Green / Right) */}
            <img
              src={chatGroup1}
              alt="לאן נוסעים היום? - קפה עם רחל"
              className={styles.chatGroupImg}
            />

            <img src={chatDivider} alt="" className={styles.chatDividerImg} />

            {/* Conversation 2: בעוד 500 מטר (Blue / Left) -> אפשר שוב? (Green / Right) -> בעוד 400 מטר (Blue / Left) */}
            <img
              src={chatGroup2}
              alt="בעוד 500 מטר פני ימינה - אפשר שוב? - בעוד 400 מטר פני ימינה"
              className={styles.chatGroupImg}
            />

            <img src={chatDivider} alt="" className={styles.chatDividerImg} />

            {/* Conversation 3: נתקעתי (Green / Right) -> מחייגת ל״ידידים״ (Blue / Left) */}
            <img
              src={chatGroup3}
              alt="נתקעתי - מחייגת ל״ידידים״"
              className={styles.chatGroupImg}
            />
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className={styles.featuresGrid}>
          {/* Emergency Button */}
          <article className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <img
                src={iconEmergency}
                alt="כפתור חירום"
                className={styles.featureIcon}
              />
            </div>
            <h3 className={styles.featureTitle}>כפתור חירום</h3>
            <p className={styles.featureDesc}>לחיצה אחת מחייגת ישר למשפחה</p>
          </article>

          {/* From Parking to Door */}
          <article className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <img
                src={iconWalk}
                alt="מהחניה ועד הדלת"
                className={styles.featureIcon}
              />
            </div>
            <h3 className={styles.featureTitle}>מהחניה ועד הדלת</h3>
            <p className={styles.featureDesc}>
              איתור חנייה נגישה, סימון החניה וניווט רגלי
            </p>
          </article>

          {/* Setup with Grandchild */}
          <article className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <img
                src={iconGrandchild}
                alt="התקנה עם הנכד"
                className={styles.featureIcon}
              />
            </div>
            <h3 className={styles.featureTitle}>התקנה עם הנכד</h3>
            <p className={styles.featureDesc}>
              הזדמנות טובה לבלות יחד זמן איכות
            </p>
          </article>

          {/* 6 Languages */}
          <article className={styles.featureCard}>
            <div className={styles.featureIconWrapper}>
              <img
                src={iconLanguages}
                alt="6 שפות"
                className={styles.featureIcon}
              />
            </div>
            <h3 className={styles.featureTitle}>6 שפות</h3>
            <p className={styles.featureDesc}>
              עברית, אנגלית, רוסית, ערבית, אמהרית, יידיש
            </p>
          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p>פותח ע״י להב לִבנה, אמיר בן אבי, רותם זוהר ואוהד גולד</p>
      </footer>
    </div>
  );
}
