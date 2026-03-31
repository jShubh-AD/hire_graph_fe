import { useState } from 'react';
import { Bookmark, BookmarkCheck, Clock, DollarSign, Building } from 'lucide-react';
import { api } from '../api';

const getTypeColor = (type) => {
  const normalized = (type || '').toLowerCase();
  if (normalized.includes('intern')) return 'bg-purple-100 text-purple-700 border-purple-200';
  if (normalized.includes('part')) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-teal-100 text-teal-700 border-teal-200'; // Default to full-time styling
};

const getScoreColor = (score) => {
  if (score >= 80) return 'bg-green-100 text-green-700 border-green-200';
  if (score >= 50) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-gray-100 text-gray-700 border-gray-200';
};

const JobCard = ({ job }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const score = job.matchScore || job.match_score || 0;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.post('/jobs/save', { jobId: job.id });
      setIsSaved(true);
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-xl hover:border-purple-200 transition-all group flex flex-col h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-1">
            {job.title}
          </h3>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <Building size={16} />
            <span className="text-sm font-medium">{job.company}</span>
          </div>
        </div>
        
        {/* Match Score Badge */}
        {score > 0 && (
          <div className={`px-2.5 py-1 rounded-lg border text-sm font-bold shadow-sm ${getScoreColor(score)} flex-shrink-0 ml-2`}>
            {score}% Match
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getTypeColor(job.type)}`}>
          {job.type || 'Full-time'}
        </span>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">
          <DollarSign size={14} />
          {job.payRange || job.pay_range || job.pay || 'Competitive'}
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-50 text-gray-600 border border-gray-200 text-xs font-medium">
          <Clock size={14} />
          {job.duration || 'Permanent'}
        </div>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-xs text-gray-400 font-medium">
          {job.datePosted || job.date_posted || 'Recently added'}
        </span>
        
        <button
          onClick={handleSave}
          disabled={isSaved || isSaving}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all text-sm ${
            isSaved
              ? 'bg-purple-50 text-purple-700 cursor-default'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm active:scale-95'
          }`}
        >
          {isSaving ? (
            <div className="w-4 h-4 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mr-1" />
          ) : isSaved ? (
            <BookmarkCheck size={18} className="text-purple-600" />
          ) : (
            <Bookmark size={18} />
          )}
          {isSaved ? 'Saved' : 'Save Job'}
        </button>
      </div>
    </div>
  );
};

export default JobCard;
