import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import JobDetailDrawer from '../components/JobDetailDrawer';
import { Briefcase, AlertTriangle } from 'lucide-react';

const MOCK_JOBS = [
  { jobId: 'm1', title: 'Frontend Developer Intern', company_name: 'TechCorp', job_type: 'Internship', pay_min: 40, pay_max: 50, duration: '12 weeks', score: 92, date_posted: '2 days ago' },
  { jobId: 'm2', title: 'Full Stack Engineer', company_name: 'StartupX', job_type: 'Full-time', pay_min: 120, pay_max: 150, duration: 'Permanent', score: 85, date_posted: 'Just now' },
  { jobId: 'm3', title: 'React UI Developer', company_name: 'DesignStudio', job_type: 'Part-time', pay_min: 60, pay_max: 80, duration: '6 months', score: 78, date_posted: '1 week ago' },
];

const Home = () => {
  const { recommendations, profileData } = useOutletContext();
  // Derive data directly from context to avoid cascading renders
  const jobs = recommendations 
    ? (Array.isArray(recommendations) ? recommendations : (recommendations.jobs || []))
    : [];
  
  const isLoading = !recommendations && !profileData;
  
  const hasSkills = profileData?.skills && profileData.skills.length > 0;
  
  // Drawer state
  const [selectedJob, setSelectedJob] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCardClick = (job) => {
    setSelectedJob(job);
    setIsDrawerOpen(true);
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="font-bold text-lg animate-pulse text-purple-900/60">Analyzing your potential...</p>
        </div>
      </div>
    );
  }

  if (!hasSkills) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-7xl mx-auto pb-20 px-4">
      <div className="flex flex-col gap-6 mb-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-dark tracking-tight mb-2">
              Recommended for <span className="text-primary">you</span>
            </h1>
            <p className="text-gray-500 font-medium text-[15px] max-w-2xl leading-relaxed">
              Discover opportunities precisely matched to your unique skill graph.
            </p>
          </div>
        </div>
      </div>


      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {jobs.map((job, idx) => (
            <JobCard key={job.jobId || job.id} job={job} index={idx} onClick={() => handleCardClick(job)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 px-6 border border-border border-dashed rounded-[2rem] bg-surface mx-auto max-w-2xl">
          <div className="bg-white p-5 rounded-2xl w-24 h-24 flex items-center justify-center mx-auto mb-8 shadow-xl shadow-gray-200/20 border border-border">
            <Briefcase size={36} className="text-gray-200" />
          </div>
          <h3 className="text-2xl font-bold text-dark mb-3">No matches found</h3>
          <p className="text-gray-500 font-medium text-lg max-w-md mx-auto mb-10">
            Try expanding your skill set or refining your profile to see more recommendations.
          </p>
          <button className="btn-primary px-10 py-3 shadow-lg shadow-primary/20">
            Refresh My Profile
          </button>
        </div>
      )}

      {/* Global Job Detail Drawer */}
      <JobDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        job={selectedJob}
        profileData={profileData}
      />
    </div>
  );
};

export default Home;
