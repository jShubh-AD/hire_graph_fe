import { useState } from 'react';
import { X, AlertTriangle, Send } from 'lucide-react';

const ReportModal = ({ isOpen, onClose, onConfirm, jobTitle }) => {
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) return;
    
    setIsSubmitting(true);
    await onConfirm(reason);
    setIsSubmitting(false);
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-100 flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2 text-amber-600 font-bold">
            <AlertTriangle size={20} />
            <span>Report Job Post</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-gray-200 transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div>
            <p className="text-sm text-gray-500 font-medium mb-1 uppercase tracking-wider">Target Job</p>
            <h3 className="text-lg font-bold text-gray-900 leading-tight">{jobTitle}</h3>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="reason" className="text-sm font-bold text-gray-700">Reason for reporting</label>
            <textarea
              id="reason"
              required
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe why this job post is being reported (spam, scam, offensive, etc.)..."
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-700 focus:ring-2 focus:ring-amber-500 focus:outline-none transition-all resize-none font-medium"
            />
          </div>

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !reason.trim()}
              className="flex-1 px-4 py-2.5 rounded-xl bg-amber-600 text-white font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-200 active:scale-95 disabled:bg-gray-300 disabled:shadow-none"
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send size={18} />
                  Submit Report
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportModal;
