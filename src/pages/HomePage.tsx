import { Link } from 'react-router-dom';
import { FaUserTie, FaCog, FaMicrophone } from 'react-icons/fa';
import styles from './HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.pageContainer}>
      {/* --- Hero Section --- */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Your Personal AI Interview Coach</h1>
        <p className={styles.heroSubtitle}>
          Welcome! This is your space to practice, build confidence, and master your interview skills against a customized AI interviewer.
        </p>
      </section>

      {/* --- Getting Started Steps --- */}
      <section className={styles.stepsContainer}>
        {/* Step 1: Create Profile */}
        <div className={styles.stepCard}>
          <FaUserTie className={styles.stepIcon} />
          <h2 className={styles.stepTitle}>1. Create a Job Profile</h2>
          <p className={styles.stepDescription}>
            Define the job you're targeting. Paste the job description, skills, and company info to give your AI interviewer context.
          </p>
          <Link to="/profiles" className={styles.stepLink}>Go to Profiles</Link>
        </div>

        {/* Step 2: Configure Interview */}
        <div className={styles.stepCard}>
          <FaCog className={styles.stepIcon} />
          <h2 className={styles.stepTitle}>2. Set Up Your Session</h2>
          <p className={styles.stepDescription}>
            Choose your interviewer's personality. Do you want them to be friendly, skeptical, or formal? You decide.
          </p>
          <Link to="/interview" className={styles.stepLink}>Set Up Interview</Link>
        </div>

        {/* Step 3: Start Practicing */}
        <div className={styles.stepCard}>
          <FaMicrophone className={styles.stepIcon} />
          <h2 className={styles.stepTitle}>3. Start the Live Interview</h2>
          <p className={styles.stepDescription}>
            Engage in a real-time, voice-based conversation. Handle objections, answer questions, and get ready for the real thing.
          </p>
          <Link to="/interview" className={styles.stepLink}>Start Practicing</Link>
        </div>
      </section>

      {/* --- Final Call to Action --- */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaTitle}>Ready to Begin?</h2>
        <p>The best way to get started is by creating your first job profile.</p>
        <Link to="/profiles" className={styles.stepLink}>Create Your First Profile</Link>
      </section>
    </div>
  );
};

export default HomePage;