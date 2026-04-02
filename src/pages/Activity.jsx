import { useState, useEffect } from 'react';
import { api } from '../api';
import JobCard from '../components/JobCard';
import EmptyState from '../components/EmptyState';
import { Bookmark, Briefcase, AlertTriangle, History, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Activity = () => {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'applied', 'reported'
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const tabs = [
    { id: 'saved', name: 'Saved', icon: Bookmark, count: null },
    { id: 'applied', name: 'Applied', icon: Briefcase, count: null },
    { id: 'reported', name: 'Reported', icon: AlertTriangle, count: null },
  ];

  useEffect(() => {
    const fetchActivity = async () => {
      setIsLoading(true);
      try {
        const res = await api.get(`/jobs/${activeTab}`);
        setJobs(res.data.jobs || res.data || []);
      } catch (err) {
        console.error(`Failed to fetch ${activeTab} jobs:`, err);
        setJobs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivity();
  }, [activeTab]);

  return (
    <div className="max-w-7xl mx-auto pb-24 px-4">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-fadeInUp">
        <div>
          <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-4">
            <History size={28} strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-dark tracking-tight">
            Professional <span className="text-primary">Timeline</span>
          </h1>
          <p className="text-gray-500 font-medium mt-2 max-w-md leading-relaxed">
            A centralized view of your graph-powered career decisions and interactions.
          </p>
        </div>
        
        {/* <Link 
          to="/" 
          className="group flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 hover:bg-primary/10 px-5 py-3 rounded-xl transition-all"
        >
          Explore More Nodes 
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link> */}
      </div>

      {/* Modern Underline Tabs */}
      <div className="relative mb-12 border-b border-border animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="flex gap-10">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2.5 pb-4 px-1 relative transition-all duration-300 ${
                  isActive 
                    ? 'text-primary font-bold' 
                    : 'text-gray-400 font-semibold hover:text-gray-600'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[15px]">{tab.name}</span>
                
                {/* Underline Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-4px_8px_rgba(108,71,255,0.3)] animate-in fade-in zoom-in-95 duration-300" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div 
                key={n} 
                className="h-[320px] bg-white rounded-[2rem] border border-border overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-shimmer animate-shimmer" />
                <div className="p-8 flex flex-col gap-4">
                   <div className="w-16 h-16 bg-surface rounded-2xl" />
                   <div className="w-3/4 h-6 bg-surface rounded-lg" />
                   <div className="w-1/2 h-4 bg-surface rounded-lg" />
                   <div className="mt-auto flex gap-2">
                      <div className="flex-1 h-10 bg-surface rounded-xl" />
                      <div className="flex-1 h-10 bg-surface rounded-xl" />
                   </div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto">
            {jobs.map((job, idx) => (
              <JobCard key={job.jobId || job.id} job={job} index={idx} status={activeTab} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[2.5rem] border border-border p-16 shadow-[0_8px_30px_rgba(108,71,255,0.02)]">
            <EmptyState 
              title={
                activeTab === 'saved' ? "Your node library is empty" :
                activeTab === 'applied' ? "No active applications" :
                "Safe & Secure"
              }
              description={
                activeTab === 'saved' 
                  ? "The graph is waiting for your signal. Save jobs you like to build recommendations faster." 
                  : activeTab === 'applied'
                  ? "You haven't initiated any connections yet. Start by applying to high-match roles."
                  : "Excellent, you haven't needed to report any nodes. Your graph remains clean."
              }
              type={activeTab}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Activity;
