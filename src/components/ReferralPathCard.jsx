import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Users, Copy, Check, ArrowRight } from 'lucide-react';

const ReferralPathCard = ({ referrals = [], companyName, jobTitle }) => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const hasReferrals = referrals && referrals.length > 0;

  const handleCopy = (referral) => {
    const friendName = referral.userName || referral.name || 'Friend';
    const message = `Hi ${friendName}, I saw you work at ${companyName}. I'm interested in the ${jobTitle} role there. Would you be open to referring me? I'd really appreciate it!`;
    
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!hasReferrals) {
    return (
      <div className="bg-surface rounded-2xl p-6 border border-border mt-8">
        <div className="flex items-center gap-3 mb-3 text-dark">
          <Users className="text-gray-400" size={20} />
          <h4 className="font-semibold text-sm">No connections at this company</h4>
        </div>
        <p className="text-gray-500 text-xs mb-4 leading-relaxed">
          Grow your network to unlock referral opportunities and increase your chances of landing a role.
        </p>
        <button
          onClick={() => navigate('/network')}
          className="flex items-center gap-2 text-xs font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
        >
          <span>Browse Network</span>
          <ArrowRight size={14} />
        </button>
      </div>
    );
  }

  // Assuming we show the first referral path found
  const referral = referrals[0];
  const friendName = referral.userName || referral.name || 'Connection';
  const friendRole = referral.role || referral.currentRole || 'Senior Entity';

  return (
    <div className="bg-indigo-50/50 rounded-2xl p-6 border border-primary/20 mt-8 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Target size={40} className="text-primary" />
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-2 rounded-lg">
          <Target className="text-primary" size={20} />
        </div>
        <h4 className="font-bold text-dark text-sm">You have a connection here!</h4>
      </div>

      {/* Referral Path Visualization */}
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-white border-2 border-primary/20 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
            YOU
          </div>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">You</span>
        </div>

        <div className="flex-1 h-[2px] bg-primary/20 relative mx-2">
          <ArrowRight size={14} className="absolute -right-1 -top-[6px] text-primary/40" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-[10px] font-bold text-white shadow-md">
            {friendName.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)}
          </div>
          <div className="text-center">
            <span className="block text-[10px] font-bold text-dark truncate w-20">{friendName}</span>
            <span className="block text-[8px] text-gray-400 truncate w-20">{friendRole}</span>
          </div>
        </div>

        <div className="flex-1 h-[2px] bg-primary/20 relative mx-2">
          <ArrowRight size={14} className="absolute -right-1 -top-[6px] text-primary/40" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-white border-2 border-primary flex items-center justify-center text-[10px] font-bold text-primary shadow-sm">
            {companyName.slice(0, 2).toUpperCase()}
          </div>
          <span className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">Works here</span>
        </div>
      </div>

      <button
        onClick={() => handleCopy(referral)}
        className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all shadow-sm ${
          copied 
            ? 'bg-emerald-500 text-white shadow-emerald-200' 
            : 'bg-white text-dark border border-border hover:border-primary/30 group-hover:shadow-md'
        }`}
      >
        {copied ? (
          <>
            <Check size={14} />
            <span>Copied to Clipboard!</span>
          </>
        ) : (
          <>
            <Copy size={14} className="text-primary" />
            <span>Copy Intro Message</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ReferralPathCard;
