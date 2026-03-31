import { useState, useEffect } from 'react';
import { api } from '../api';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import { Briefcase, AlertTriangle } from 'lucide-react';

const MOCK_JOBS = [
  { id: 1, title: 'Frontend Developer Intern', company: 'TechCorp', type: 'Internship', payRange: '$40-50/hr', duration: '12 weeks', matchScore: 92, datePosted: '2 days ago' },
  { id: 2, title: 'Full Stack Engineer', company: 'StartupX', type: 'Full-time', payRange: '$120k-150k', duration: 'Permanent', matchScore: 85, datePosted: 'Just now' },
  { id: 3, title: 'React UI Developer', company: 'DesignStudio', type: 'Part-time', payRange: '$60/hr', duration: '6 months', matchScore: 78, datePosted: '1 week ago' },
];

const Home = () => {
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSkills, setHasSkills] = useState(true); // Default to true, will test if API fails
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const res = await api.get('/jobs/recommendations');
        // If the backend returns an empty array, it might mean no skills or just no jobs.
        // Assuming if there's a specific "no skills" error or field
        if (res.data.needsProfile || res.data.noSkills) {
          setHasSkills(false);
        } else {
          setHasSkills(true);
          setJobs(res.data.jobs || res.data || []);
        }
      } catch (err) {
        // If backend is unreachable or returns 404/500
        if (!err.response) {
          setIsOffline(true);
          setJobs(MOCK_JOBS); // Demo mode
        } else if (err.response?.status === 400 || err.response?.status === 404) {
          // Assuming 400/404 might mean no profile/skills set up
          setHasSkills(false);
        } else {
          setIsOffline(true);
          setJobs(MOCK_JOBS);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommended();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gray-500">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          <p className="font-medium animate-pulse">Finding your best matches...</p>
        </div>
      </div>
    );
  }

  if (!hasSkills && !isOffline) {
    return <EmptyState />;
  }

  return (
    <div className="max-w-6xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Briefcase size={28} className="text-purple-600" />
            Recommended for you
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            Based on your skills and profile preferences
          </p>
        </div>
      </div>

      {isOffline && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl mb-8 flex items-center gap-3 shadow-sm font-medium">
          <AlertTriangle size={20} className="text-amber-500 shrink-0" />
          <div>
            Backend is currently offline. Viewing demo data.
          </div>
        </div>
      )}

      {jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
          <p className="text-gray-500 font-medium text-lg">No matches found right now.</p>
          <p className="text-gray-400 mt-2">Try updating your skills to expand your recommendations.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
