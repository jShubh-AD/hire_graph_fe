import { useEffect, useRef } from 'react';
import { X, Briefcase, MapPin, DollarSign, Clock, Send, Bookmark, BookmarkCheck, CheckCircle, ShieldCheck, Zap, Users } from 'lucide-react';
import { useReferral } from '../hooks/useReferral';
import { useJobActions } from '../hooks/useJobActions';
import ReferralPathCard from './ReferralPathCard';

const JobDetailDrawer = ({ 
  isOpen, 
  onClose, 
  job, 
  profileData
}) => {
  const { referralData, isLoading: isReferralLoading, fetchReferralPath, reset: resetReferral } = useReferral();
  const { isSaved, isSaving, isApplied, isApplying, handleSave, handleApply, resetActions } = useJobActions(job);
  const drawerRef = useRef(null);

  const lastFetchedIdRef = useRef(null);

  useEffect(() => {
    const currentJobId = job?.id || job?.jobId;
    if (isOpen && job && lastFetchedIdRef.current !== currentJobId) {
      lastFetchedIdRef.current = currentJobId;
      document.body.style.overflow = 'hidden';
      fetchReferralPath(currentJobId);
      resetActions(job);
    } else if (!isOpen) {
      lastFetchedIdRef.current = null;
      document.body.style.overflow = 'auto';
      resetReferral();
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen, job, fetchReferralPath, resetReferral, resetActions]);

  // Handle escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!job) return null;

  const companyName = job.company_name || job.company || '';
  const displayPay = job.pay_min 
    ? `$${job.pay_min}${job.pay_max ? ` - $${job.pay_max}` : ''}`
    : job.payRange || 'Competitive';

  // Calculate skill match percentage
  const userSkills = profileData?.skills?.map(s => s.skill_name.toLowerCase()) || [];
  const jobSkillsList = job.skills || [];
  const matches = jobSkillsList.filter(js => {
    const name = (typeof js === 'object' ? (js.skill_name || js.name || '') : js).toLowerCase();
    return userSkills.includes(name);
  });
  const matchPercentage = jobSkillsList.length > 0 ? Math.round((matches.length / jobSkillsList.length) * 100) : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-500 bg-emerald-50 border-emerald-100';
    if (score >= 50) return 'text-amber-500 bg-amber-50 border-amber-100';
    return 'text-gray-400 bg-gray-50 border-gray-100';
  };

  const getIntensityColor = (intensity) => {
    switch (intensity?.toLowerCase()) {
      case 'high': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'low': return 'bg-slate-100 text-slate-500 border-slate-200';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-dark/20 backdrop-blur-[2px] z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside 
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-white z-[70] shadow-2xl transition-transform duration-500 ease-out transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
              style={{ backgroundColor: '#6C47FF' }} // Mock/Fallback
            >
              {companyName.slice(0, 1).toUpperCase()}
            </div>
            <div>
              <h2 className="text-lg font-bold text-dark leading-tight">{job.title}</h2>
              <p className="text-sm font-medium text-gray-500 uppercase tracking-tight">{companyName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2.5 rounded-full hover:bg-surface text-gray-400 hover:text-dark transition-all">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-surface/50 rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <DollarSign size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Salary Range</span>
              </div>
              <span className="text-sm font-bold text-dark">{displayPay}</span>
            </div>
            <div className="bg-surface/50 rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Briefcase size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Job Type</span>
              </div>
              <span className="text-sm font-bold text-dark capitalize">{job.job_type || job.type || 'Full Time'}</span>
            </div>
            <div className="bg-surface/50 rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <MapPin size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Location</span>
              </div>
              <span className="text-sm font-bold text-dark truncate">{job.location || 'Remote'}</span>
            </div>
            <div className="bg-surface/50 rounded-2xl p-4 border border-border">
              <div className="flex items-center gap-2 text-gray-400 mb-1">
                <Clock size={14} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Posted Date</span>
              </div>
              <span className="text-sm font-bold text-dark">{job.date_posted || 'Today'}</span>
            </div>
          </div>

          {/* Matches & Score */}
          <div className={`p-5 rounded-2xl border mb-8 flex items-center justify-between ${getScoreColor(matchPercentage)}`}>
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Zap size={24} className="animate-pulse" />
              </div>
              <div>
                <h4 className="font-bold text-dark text-base tracking-tight">Your Skills Match</h4>
                <p className="text-xs font-semibold opacity-70">Based on your current profile</p>
              </div>
            </div>
            <div className="text-2xl font-black">{matchPercentage}%</div>
          </div>

          {/* Required Skills */}
          <section className="mb-10">
            <h4 className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 mb-4 flex items-center gap-2">
              <ShieldCheck size={14} className="text-primary" />
              Required Skills
            </h4>
            <div className="flex flex-wrap gap-2">
              {jobSkillsList.map((skill, idx) => {
                const name = typeof skill === 'object' ? (skill.skill_name || skill.name || '') : skill;
                const intensity = typeof skill === 'object' ? skill.importance : 'Medium';
                const isMatched = userSkills.includes(name.toLowerCase());

                return (
                  <div 
                    key={idx} 
                    className={`px-3 py-1.5 rounded-xl border text-[11px] font-bold flex items-center gap-2 transition-all ${
                      isMatched ? 'border-primary/20 bg-primary/5 text-primary ring-1 ring-primary/10' : 'border-border bg-white text-gray-500'
                    }`}
                  >
                    {isMatched && <CheckCircle size={12} className="text-primary" />}
                    <span>{name}</span>
                    <span className={`px-1.5 py-0.5 rounded-full text-[8px] border uppercase ${getIntensityColor(intensity)}`}>
                      {intensity}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Job Description */}
          <section className="mb-10">
            <h4 className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 mb-4">
              Detailed Description
            </h4>
            <div className="prose prose-sm text-gray-600 leading-relaxed font-medium">
              <p className="whitespace-pre-wrap">{job.description || 'No description provided.'}</p>
            </div>
          </section>

          {/* Referral Path */}
          <section className="mb-10">
            <h4 className="text-[11px] font-black uppercase tracking-[2px] text-gray-400 mb-4 flex items-center gap-2">
              <Users size={14} className="text-primary" />
              REFERRAL PATH
            </h4>
            {isReferralLoading ? (
              <div className="h-32 flex items-center justify-center bg-surface animate-pulse rounded-2xl">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <ReferralPathCard 
                referrals={referralData?.referrals} 
                companyName={companyName}
                jobTitle={job.title}
              />
            )}
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-white flex gap-3 shadow-[0_-1px_20px_rgba(0,0,0,0.03)]">
          <button 
            onClick={() => handleSave(job.jobId || job.id)}
            disabled={isSaving || isSaved}
            className={`flex-1 py-3 rounded-xl font-bold text-xs flex-shrink-0 flex items-center justify-center gap-3 transition-all border ${
              isSaved ? 'bg-primary/5 border-primary text-primary shadow-sm' : 'border-border text-gray-600 hover:bg-surface'
            } ${isSaving ? 'opacity-70' : ''}`}
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            ) : isSaved ? (
              <BookmarkCheck size={18} />
            ) : (
              <Bookmark size={18} />
            )}
            {isSaved ? 'Job Saved' : 'Save Job'}
          </button>
          
          <button 
            onClick={() => handleApply(job.jobId || job.id)}
            disabled={isApplied || isApplying}
            className={`flex-[2] py-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-3 transition-all shadow-lg ${
              isApplied ? 'bg-emerald-50 text-success border border-success/20 shadow-none' : 'btn-primary'
            }`}
          >
            {isApplying ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : isApplied ? (
              <>
                <CheckCircle size={18} />
                <span>Application Sent</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Quick Apply</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default JobDetailDrawer;
