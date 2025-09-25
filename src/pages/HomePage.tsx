import { Link } from 'react-router-dom';
import { FaUserTie, FaCog, FaMicrophone, FaFileAlt } from 'react-icons/fa'; 
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
        {/* 👇 STEP 1 IS NOW UPDATED */}
        <div className={styles.stepCard}>
          <div className={styles.multiIcon}>
            <FaUserTie className={styles.stepIcon} />
            <FaFileAlt className={styles.stepIcon} />
          </div>
          <h2 className={styles.stepTitle}>1. Build Your Profile</h2>
          <p className={styles.stepDescription}>
            First, complete your personal info and upload your resume. Then, create job profiles for the specific roles you're targeting.
          </p>
          <Link to="/profile" className={styles.stepLink}>Go to Profile & Resume</Link>
        </div>

        {/* Step 2: Create Job Profile */}
        <div className={styles.stepCard}>
          <FaCog className={styles.stepIcon} />
          <h2 className={styles.stepTitle}>2. Create a Job Profile</h2>
          <p className={styles.stepDescription}>
            Define the job you're targeting. Paste the job description, skills, and company info to give your AI interviewer context.
          </p>
          <Link to="/profiles" className={styles.stepLink}>Go to Job Profiles</Link>
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
        <p>The best way to get started is by completing your profile and resume.</p>
        <Link to="/profile" className={styles.stepLink}>Complete Your Profile</Link>
      </section>
    </div>
  );
};

export default HomePage;