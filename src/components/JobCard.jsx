import { useState, useRef, useEffect } from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Flag,
  Send,
  MoreVertical
} from 'lucide-react';
import { api } from '../api';
import ReportModal from './ReportModal';

const getCompanyColor = (name) => {
  const colors = [
    '#6C47FF', '#00C48C', '#FFB800', '#FF4D4D', '#3B82F6', '#EC4899', '#8B5CF6'
  ];
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = (name || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-success text-white border-success';
  if (score >= 50) return 'bg-warning text-white border-warning';
  return 'bg-gray-400 text-white border-gray-400';
};

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const posted = new Date(dateStr);
  const now = new Date();
  const diffMs = now - posted;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays <= 7) return `${diffDays}d ago`;
  
  return posted.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

const JobCard = ({ job, index = 0, status }) => {
  const [isSaved, setIsSaved] = useState(status === 'saved' || job.is_saved || false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApplied, setIsApplied] = useState(status === 'applied' || job.is_applied || false);
  const [isApplying, setIsApplying] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isReported, setIsReported] = useState(status === 'reported' || job.is_flagged || false);
  const [reportReason, setReportReason] = useState(job.report_reason || '');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const statusStyles = {
    saved: 'border-orange-400/30 shadow-[0_8px_20px_rgba(251,146,60,0.08)] bg-orange-50/10',
    applied: 'border-emerald-400/30 shadow-[0_8px_20px_rgba(52,211,153,0.08)] bg-emerald-50/10',
    reported: 'border-red-400/30 shadow-[0_8px_20px_rgba(248,113,113,0.08)] bg-red-50/10 opacity-80 grayscale-[0.2]'
  };

  const activeStatusStyle = statusStyles[status] || '';

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const jobId = job.jobId || job.id;
  const rawScore = job.score || job.matchScore || job.match_score || 0;
  let score = rawScore <= 1 ? Math.round(rawScore * 100) : Math.round(rawScore);
  
  const companyName = job.company_name || job.company || '';
  const skills = job.skills || [];
  
  const displayPay = job.pay_min 
    ? `${job.pay_min}${job.pay_max ? `-${job.pay_max}` : ''}`
    : job.payRange || 'Competitive';

  const handleSave = async (e) => {
    e.stopPropagation();
    setIsSaving(true);
    try {
      await api.post(`/jobs/save/${jobId}`);
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async (e) => {
    e.stopPropagation();
    setIsApplying(true);
    try {
      await api.post(`/jobs/apply/${jobId}`);
      setIsApplied(true);
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleReport = async (reason) => {
    try {
      await api.post(`/jobs/report/${jobId}?reason=${encodeURIComponent(reason)}`);
      setIsReported(true);
      setReportReason(reason);
    } catch (error) {
      console.error('Error reporting job:', error);
    }
  };

  return (
    <div 
      className={`card-premium group relative flex flex-col p-5 hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(108,71,255,0.1)] active:scale-[0.99] animate-fadeInUp stagger-${(index % 5) + 1} ${activeStatusStyle} ${isReported ? 'opacity-70 grayscale-[0.3]' : ''}`}
    >
      {/* Top Section: Avatar & Header */}
      <div className="flex items-start gap-4 mb-4">
        <div 
          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm"
          style={{ backgroundColor: getCompanyColor(companyName) }}
        >
          {companyName.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-[18px] font-semibold text-dark leading-tight line-clamp-1 group-hover:text-primary transition-colors">
              {job.title}
            </h3>
            
            <div className="relative shrink-0" ref={menuRef}>
              <button 
                onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-dark transition-all"
              >
                <MoreVertical size={20} />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-border py-2 z-50 animate-popIn">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleSave(e); setIsMenuOpen(false); }}
                    disabled={isSaved || isSaving || isReported}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                      isSaved ? 'text-primary bg-primary/5' : 'text-gray-600 hover:bg-surface'
                    } ${(isSaving || isReported) ? 'opacity-40 cursor-not-allowed' : ''}`}
                  >
                    {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                    {isSaved ? 'Job Saved' : 'Save Job'}
                  </button>
                  
                  <button 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (!isReported) {
                        setIsReportModalOpen(true);
                      }
                      setIsMenuOpen(false);
                    }}
                    disabled={isReported}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Flag size={18} />
                    {isReported ? 'Already Reported' : 'Report Job'}
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500">{companyName}</span>
            {(job.job_type || job.type) && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface border border-border text-gray-600 font-medium">
                  {job.job_type || job.type}
                </span>
              </>
            )}
            {job.duration && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-300" />
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-surface border border-border text-gray-600 font-medium">
                  {job.duration}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Pay and Location */}
      <div className="flex items-center gap-1.5 mb-5 text-dark font-medium">
        <div className="p-1 rounded bg-surface border border-border">
          <DollarSign size={12} className="text-primary" />
        </div>
        <span className="text-sm">{displayPay}</span>
        {job.location && (
          <>
            <span className="text-gray-300 text-xs mx-1">/</span>
            <span className="text-xs text-gray-500 font-normal">{job.location}</span>
          </>
        )}
      </div>

      {/* Footer Meta */}
      <div className="flex items-center justify-between mb-4 mt-auto">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Clock size={14} />
          <span className="text-[12px] font-medium">{formatDate(job.date_posted || job.datePosted)}</span>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end max-w-full">
          {skills.map((skill, idx) => {
            const skillName = typeof skill === 'object' ? (skill.name || skill.skill_name || skill.skill || '') : skill;
            if (!skillName) return null;
            return (
              <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-surface border border-border text-gray-500 uppercase tracking-tight">
                {skillName}
              </span>
            );
          })}
        </div>
      </div>

      {/* Action Button */}
      <button 
        onClick={handleApply}
        disabled={isApplied || isReported || isApplying}
        className={`w-full py-2.5 rounded-[10px] font-semibold text-[14px] transition-all flex items-center justify-center gap-2 ${
          isApplied
            ? 'bg-emerald-50 text-success border border-success/20'
            : isReported
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'btn-primary'
        }`}
      >
        {isApplying ? (
          <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
        ) : isApplied ? (
          <CheckCircle size={16} />
        ) : (
          <Send size={16} />
        )}
        {isApplied ? 'Application Sent' : isReported ? 'Listing Processed' : 'Quick Apply'}
      </button>


      {isReported && (
        <div className="absolute top-4 right-4 text-red-500">
          <AlertCircle size={18} />
        </div>
      )}
      

      <ReportModal 
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        onConfirm={handleReport}
        jobTitle={job.title}
      />
    </div>
  );
};

export default JobCard;
