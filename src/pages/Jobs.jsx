import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import JobCard from '../components/JobCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const MOCK_JOBS = [
  { jobId: 'm1', title: 'Frontend Developer Intern', company_name: 'TechCorp', job_type: 'Internship', pay_min: 40, pay_max: 50, duration: '12 weeks', score: 92, date_posted: '2 days ago' },
  { jobId: 'm2', title: 'Full Stack Engineer', company_name: 'StartupX', job_type: 'Full-time', pay_min: 120, pay_max: 150, duration: 'Permanent', score: 85, date_posted: 'Just now' },
  { jobId: 'm3', title: 'React UI Developer', company_name: 'DesignStudio', job_type: 'Part-time', pay_min: 60, pay_max: 80, duration: '6 months', score: 78, date_posted: '1 week ago' },
  { jobId: 'm4', title: 'Machine Learning Engineer', company_name: 'AI Labs', job_type: 'Full-time', pay_min: 150, pay_max: 200, duration: 'Permanent', score: 60, date_posted: '3 days ago' },
];

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get('q') || '';

  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filter states mapped to backend parameter names: job_type, pay_min, duration
  const [filters, setFilters] = useState({
    job_type: searchParams.get('job_type') || '',
    pay_min: searchParams.get('pay_min') || '',
    duration: searchParams.get('duration') || '',
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams();
        // Note: backend doesn't support 'q' yet, but we'll keep it for future-proofing or local filtering
        if (q) queryParams.set('q', q);
        if (filters.job_type) queryParams.set('job_type', filters.job_type);
        if (filters.pay_min) queryParams.set('pay_min', filters.pay_min);
        if (filters.duration) queryParams.set('duration', filters.duration);

        const res = await api.get(`/jobs/search?${queryParams.toString()}`);
        setJobs(res.data.jobs || res.data || []);
      } catch (err) {
        console.log('Using demo job data', err);
        const filtered = MOCK_JOBS.filter(job => {
          if (q && !job.title.toLowerCase().includes(q.toLowerCase()) && !job.company_name.toLowerCase().includes(q.toLowerCase())) return false;
          if (filters.job_type && job.job_type.toLowerCase() !== filters.job_type.toLowerCase()) return false;
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
    
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setFilters({ job_type: '', pay_min: '', duration: '' });
  };

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4">
      <div className="flex flex-col gap-6 mb-8 mt-2">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-200/50">
                <Search size={20} strokeWidth={3} />
              </div>
              <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                Explore <span className="text-purple-600 uppercase">Opportunities</span>
              </h1>
            </div>
            <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-2xl">
              Discover your next career milestone through our massive graph network. 
              {q && <span className="text-purple-600 ml-1">Showing matches for "{q}"</span>}
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-black transition-all border-2 text-xs uppercase tracking-tighter ${
                showFilters 
                  ? 'bg-purple-50 text-purple-700 border-purple-200 shadow-inner' 
                  : 'bg-white border-gray-100 text-gray-700 hover:border-purple-200 hover:bg-purple-50/30'
              }`}
            >
              <SlidersHorizontal size={16} strokeWidth={2.5} />
              Filters
            </button>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative group max-w-2xl">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-purple-500 transition-colors">
            <Search size={18} strokeWidth={3} />
          </div>
          <input
            type="text"
            placeholder="Role, company, or skills..."
            value={q}
            onChange={(e) => {
              const newParams = new URLSearchParams(searchParams);
              if (e.target.value) newParams.set('q', e.target.value);
              else newParams.delete('q');
              setSearchParams(newParams);
            }}
            className="w-full bg-white border-2 border-gray-100 py-3 pl-12 pr-6 rounded-2xl text-base font-bold text-gray-900 placeholder-gray-300 focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-500/5 transition-all shadow-lg shadow-gray-200/20"
          />
        </div>
      </div>

      {/* Filter Bar */}
      {showFilters && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xl shadow-gray-200/30 mb-6 animate-in fade-in slide-in-from-top-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Job Type</label>
              <select 
                name="job_type" 
                value={filters.job_type} 
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none font-bold text-xs"
              >
                <option value="">Any Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Min Pay ($/hr)</label>
              <select 
                name="pay_min" 
                value={filters.pay_min} 
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none font-bold text-xs"
              >
                <option value="">Any Pay</option>
                <option value="30">30+</option>
                <option value="50">50+</option>
                <option value="80">80+</option>
                <option value="120">120+</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</label>
              <select 
                name="duration" 
                value={filters.duration} 
                onChange={handleFilterChange}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:outline-none appearance-none font-bold text-xs"
              >
                <option value="">Any Duration</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Long-term (1y+)</option>
                <option value="Short-term">Short-term (&lt; 6mo)</option>
              </select>
            </div>

            <div className="flex items-end">
              <button 
                onClick={clearFilters}
                className="w-full px-4 py-2 text-gray-500 hover:text-red-500 font-bold transition-colors flex items-center justify-center gap-2 text-xs"
              >
                <X size={14} /> Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin" />
          <p className="text-gray-400 font-black animate-pulse uppercase tracking-widest text-[10px]">Scanning Graph Network...</p>
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5 animate-in fade-in duration-500">
          {jobs.map((job) => (
            <JobCard key={job.jobId || job.id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 px-4 border-2 border-dashed border-gray-200 rounded-[2.5rem] bg-gray-50/50 flex flex-col items-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Search size={40} className="text-gray-300" />
          </div>
          <h3 className="text-gray-900 font-extrabold text-2xl">No matches found</h3>
          <p className="text-gray-500 mt-2 font-medium max-w-xs mx-auto">We couldn't find any jobs matching your current filters. Try broader criteria.</p>
          <button 
            onClick={clearFilters}
            className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            Show All Jobs
          </button>
        </div>
      )}
    </div>
  );
};

export default Jobs;
