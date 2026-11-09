import iconEmergency from "./assets/icon-emergency.svg";
import iconGrandchild from "./assets/icon-grandchild.svg";
import iconLanguages from "./assets/icon-languages.svg";
import iconWalk from "./assets/icon-walk.svg";
import rutiAvatar from "./assets/ruti-avatar.svg";
import styles from "./DesignPage.module.css";

/**
 * GrannyGo Design Page: Product Jam Exercise 2 (Part 3)
 * Implemented from the designer's Figma mobile screen specification
 * with full responsiveness across phone, tablet, and desktop viewports.
 *
 * Publicly accessible without requiring authentication so designers and collaborators
 * can view and test it directly.
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
            <h3 className={styles.sectionTitle}>...רותי פותחת את waze, ו</h3>
            <ul className={styles.painList}>
              <li className={styles.painItem}>הטקסט קטן והמסך עמוס</li>
              <li className={styles.painItem}>ההוראות מהירות מדי</li>
              <li className={styles.painItem}>נשלחת לכבישים מהירים</li>
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
              <li className={styles.benefitItem}>טקסט גדול וברור</li>
              <li className={styles.benefitItem}>קול רגוע ואיטי, והתראה מוקדמת</li>
              <li className={styles.benefitItem}>הדרך המוכרת והרגועה</li>
            </ul>
          </div>
        </section>

        {/* Voice Interface Section */}
        <section className={styles.voiceSection}>
          <h2 className={styles.voiceTitle}>
            ממשק קולי - פחות לגעת, יותר לדבר
          </h2>

          <div className={styles.chatContainer}>
            {/* Conversation 1 */}
            <div className={styles.chatGroup}>
              <span className={styles.bubbleBlue}>לאן נוסעים היום?</span>
              <span className={styles.bubbleGreen}>קפה עם רחל</span>
            </div>

            <hr className={styles.chatDivider} />

            {/* Conversation 2 */}
            <div className={styles.chatGroup}>
              <span className={styles.bubbleBlue}>בעוד 500 מטר פני ימינה</span>
              <span className={styles.bubbleGreen}>אפשר שוב?</span>
              <span className={styles.bubbleBlue}>בעוד 400 מטר פני ימינה</span>
            </div>

            <hr className={styles.chatDivider} />

            {/* Conversation 3 */}
            <div className={styles.chatGroup}>
              <span className={styles.bubbleGreen}>נתקעתי</span>
              <span className={styles.bubbleBlue}>מחייגת ל״ידידים״</span>
            </div>
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
