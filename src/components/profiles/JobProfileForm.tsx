import React, { useState, useEffect } from 'react';
import type { JobProfile, CreateJobProfilePayload } from '@/types';
import styles from './JobProfileForm.module.css';

interface JobProfileFormProps {
  existingProfile?: JobProfile;
  onSubmit: (data: CreateJobProfilePayload) => Promise<void>;
  isSubmitting: boolean;
}

const JobProfileForm: React.FC<JobProfileFormProps> = ({ existingProfile, onSubmit, isSubmitting }) => {
  const [profileName, setProfileName] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyBackground, setCompanyBackground] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');

  useEffect(() => {
    if (existingProfile) {
      setProfileName(existingProfile.profile_name);
      setTargetRole(existingProfile.target_role);
      setJobDescription(existingProfile.job_description);
      setCompanyName(existingProfile.company_name);
      setCompanyBackground(existingProfile.company_background);
      setResponsibilities(existingProfile.responsibilities.join('\n'));
      setRequiredSkills(existingProfile.required_skills.join('\n'));
    }
  }, [existingProfile]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const responsibilitiesArray = responsibilities.split('\n').filter(item => item.trim() !== '');
    const requiredSkillsArray = requiredSkills.split('\n').filter(item => item.trim() !== '');

    onSubmit({
      profile_name: profileName,
      target_role: targetRole,
      job_description: jobDescription,
      company_name: companyName,
      company_background: companyBackground,
      responsibilities: responsibilitiesArray,
      required_skills: requiredSkillsArray,
    });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="profileName">Profile Name</label>
        <input
          id="profileName"
          type="text"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          placeholder="e.g., Senior Python Developer"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="targetRole">Target Role</label>
        <input
          id="targetRole"
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          placeholder="e.g., Lead Backend Engineer at Google"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          placeholder="e.g., Google"
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="jobDescription">Job Description</label>
        <textarea
          id="jobDescription"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste the full job description here..."
          rows={8}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="companyBackground">Company Background</label>
        <textarea
          id="companyBackground"
          value={companyBackground}
          onChange={(e) => setCompanyBackground(e.target.value)}
          placeholder="Paste the company's 'About Us' section or a brief description..."
          rows={5}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="responsibilities">Responsibilities (one per line)</label>
        <textarea
          id="responsibilities"
          value={responsibilities}
          onChange={(e) => setResponsibilities(e.target.value)}
          placeholder="Design, implement, and maintain complex applications..."
          rows={5}
          required
        />
      </div>
      <div className={styles.formGroup}>
        <label htmlFor="requiredSkills">Required Skills (one per line)</label>
        <textarea
          id="requiredSkills"
          value={requiredSkills}
          onChange={(e) => setRequiredSkills(e.target.value)}
          placeholder="5+ years of experience in Python..."
          rows={5}
          required
        />
      </div>
      <button type="submit" disabled={isSubmitting} className={styles.submitButton}>
        {isSubmitting ? 'Saving...' : (existingProfile ? 'Save Changes' : 'Create Profile')}
      </button>
    </form>
  );
};

export default JobProfileForm;