import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import JobCard from '../components/JobCard';
import { Search, Filter, Briefcase, SlidersHorizontal } from 'lucide-react';

const MOCK_JOBS = [
  { id: 1, title: 'Frontend Developer Intern', company: 'TechCorp', type: 'Internship', payRange: '$40-50/hr', duration: '12 weeks', matchScore: 92, datePosted: '2 days ago' },
  { id: 2, title: 'Full Stack Engineer', company: 'StartupX', type: 'Full-time', payRange: '$120k-150k', duration: 'Permanent', matchScore: 85, datePosted: 'Just now' },
  { id: 3, title: 'React UI Developer', company: 'DesignStudio', type: 'Part-time', payRange: '$60/hr', duration: '6 months', matchScore: 78, datePosted: '1 week ago' },
  { id: 4, title: 'Machine Learning Engineer', company: 'AI Labs', type: 'Full-time', payRange: '$150k-200k', duration: 'Permanent', matchScore: 60, datePosted: '3 days ago' },
  { id: 5, title: 'DevOps Intern', company: 'CloudBase', type: 'Internship', payRange: '$35/hr', duration: '6 months', matchScore: 45, datePosted: '1 month ago' },
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    payMin: searchParams.get('pay_min') || '',
    duration: searchParams.get('duration') || '',
    datePosted: searchParams.get('date_posted') || '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          q,
          ...filters
        });
        
        // Remove empty filters
        for (const [key, value] of queryParams.entries()) {
          if (!value) queryParams.delete(key);
        }

        const res = await api.get(`/jobs/search?${queryParams.toString()}`);
        setJobs(res.data.jobs || res.data || []);
      } catch (err) {
        // Fallback or demo
        console.log('Using demo job data', err);
        // Simple mock filtering logic for demo
        const filtered = MOCK_JOBS.filter(job => {
          if (q && !job.title.toLowerCase().includes(q.toLowerCase()) && !job.company.toLowerCase().includes(q.toLowerCase())) return false;
          if (filters.type && !job.type.toLowerCase().includes(filters.type.toLowerCase())) return false;
          return true;
        });
        setJobs(filtered);
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [q, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Update URL but maintain 'q'
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const handleSearchCommit = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const query = fd.get('q');
    
    const newParams = new URLSearchParams(searchParams);
    if (query) {
      newParams.set('q', query);
    } else {
      newParams.delete('q');
    }
    setSearchParams(newParams);
  };

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight flex items-center gap-3">
            <Search size={28} className="text-purple-600" />
            Explore Jobs
          </h1>
          <p className="text-gray-500 font-medium mt-2">
            {q ? `Showing results for "${q}"` : 'Browse all available opportunities'}
          </p>
        </div>
        
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold transition-all ${
            showFilters 
              ? 'bg-purple-100 text-purple-700 shadow-inner' 
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 shadow-sm'
          }`}
        >
          <SlidersHorizontal size={18} />
          Filters
        </button>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/50 mb-8 animate-in fade-in slide-in-from-top-4">
          <form onSubmit={handleSearchCommit} className="mb-6 flex gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                name="q"
                defaultValue={q}
                placeholder="Search keywords..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>
            <button type="submit" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 shadow-md">
              Search
            </button>
          </form>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Job Type</label>
              <select 
                name="type" 
                value={filters.type} 
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none font-medium"
              >
                <option value="">Any Type</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Min Pay Range</label>
              <select 
                name="payMin" 
                value={filters.payMin} 
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none font-medium"
              >
                <option value="">Any Pay</option>
                <option value="50k">$50k+</option>
                <option value="100k">$100k+</option>
                <option value="150k">$150k+</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Duration</label>
              <select 
                name="duration" 
                value={filters.duration} 
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none font-medium"
              >
                <option value="">Any Duration</option>
                <option value="permanent">Permanent</option>
                <option value="contract">Contract (6+ mo)</option>
                <option value="summer">Summer (10-12 wk)</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Date Posted</label>
              <select 
                name="datePosted" 
                value={filters.datePosted} 
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-700 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none font-medium"
              >
                <option value="">Any Time</option>
                <option value="24h">Past 24 hours</option>
                <option value="7d">Past week</option>
                <option value="30d">Past month</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 px-4 border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50 flex flex-col items-center">
          <Search size={48} className="text-gray-300 mb-4" />
          <p className="text-gray-500 font-bold text-xl">No jobs match your criteria.</p>
          <p className="text-gray-400 mt-2 font-medium">Try adjusting your filters or search terms.</p>
          <button 
            onClick={() => {
              setSearchParams(new URLSearchParams());
              setFilters({ type: '', payMin: '', duration: '', datePosted: '' });
            }}
            className="mt-6 px-6 py-2.5 bg-white border-2 border-gray-200 rounded-xl font-bold text-gray-700 hover:text-purple-600 hover:border-purple-200 transition-all shadow-sm"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
