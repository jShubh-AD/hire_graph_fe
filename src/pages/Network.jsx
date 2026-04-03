import { Users, UserPlus, UserCheck, Zap, Award, Briefcase, Mail, Loader2, ArrowRight } from 'lucide-react';
import { useNetwork } from '../hooks/useNetwork';
import { useOutletContext } from 'react-router-dom';

// Move UserCard outside to prevent unnecessary re-mounts and improve stability
const UserCard = ({ user, isFollowing = false, onAction, profileData }) => {
  if (!user) return null;

  console.log('[DEBUG] Rendering UserCard for:', user.name || user.userId);

  const initials = user?.name 
    ? String(user.name).split(' ').filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0, 2) 
    : 'U';
    
  const isSuggestedMe = user?.userId === profileData?.userId;
  const role = user?.current_company?.role || 'Professional';
  const company = user?.current_company?.company_name;

  return (
    <div className="bg-white rounded-3xl p-6 border border-border hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1 transition-all duration-300 group relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px] -mr-8 -mt-8 transition-transform group-hover:scale-110" />
      
      <div className="flex items-start justify-between mb-6 relative">
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-transform group-hover:scale-105 shadow-sm ${
              isFollowing ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white' : 'bg-gradient-to-br from-primary to-purple-600 text-white'
            }`}>
              {initials}
            </div>
            {isFollowing && (
              <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-lg shadow-md border border-border">
                <UserCheck size={14} className="text-emerald-500" />
              </div>
            )}
          </div>

          <div className="flex flex-col">
            <h3 className="font-bold text-dark text-lg group-hover:text-primary transition-colors line-clamp-1">{user.name || 'Anonymous User'}</h3>
            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {role}{company ? ` @ ${company}` : ''}
            </div>
          </div>
        </div>

        {Number(user.shared_skill_count) > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-yellow-50 text-yellow-700 rounded-full text-[10px] font-bold border border-yellow-100 shrink-0 shadow-sm animate-pulse">
            <Zap size={10} className="fill-yellow-500" />
            <span>{user.shared_skill_count} SHARED</span>
          </div>
        )}
      </div>

      <div className="space-y-4 relative">
        <div className="flex gap-2 flex-wrap">
          {(Array.isArray(user.skills) ? user.skills : []).slice(0, 2).map((skill, i) => (
            <span key={i} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-xl text-[10px] font-bold border border-gray-100 group-hover:bg-white transition-colors">
              {skill}
            </span>
          ))}
          {(!user.skills || user.skills.length === 0) && (
            <span className="px-3 py-1.5 bg-gray-50 text-gray-400 rounded-xl text-[10px] font-medium border border-gray-100 italic">No shared skills</span>
          )}
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            onAction(user);
          }}
          disabled={isSuggestedMe}
          className={`w-full py-3.5 px-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-sm active:scale-95 ${
            isSuggestedMe 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
              : isFollowing
                ? 'bg-white text-red-500 border-2 border-red-50 hover:bg-red-50 hover:border-red-100'
                : 'bg-primary text-white hover:bg-primary-dark shadow-primary/20 hover:shadow-lg hover:shadow-primary/30'
          }`}
        >
          {isFollowing ? (
            <>Unfollow</>
          ) : (
            <>
              <UserPlus size={18} />
              <span>{isSuggestedMe ? 'You' : 'Follow'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

const Network = () => {
  const context = useOutletContext();
  const profileData = context?.profileData;
  const { following, suggestions, isLoading, error, follow, unfollow, stats } = useNetwork();

  console.log('[DEBUG] Network Component Render', { 
    followingCount: following?.length, 
    suggestionsCount: suggestions?.length,
    isLoading,
    hasError: !!error
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-160px)] flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-primary/20 rounded-full animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Users size={32} className="text-primary animate-pulse" />
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-dark">Loading...</h2>
          <p className="text-gray-400 font-medium">Scanning for industry connections</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-24">
      {/* Network Stats Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-dark to-gray-800 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] -ml-24 -mb-24" />
        
        <div className="relative z-10 text-center md:text-left flex flex-col items-center md:items-start gap-4">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2">
            <Users size={32} className="text-primary" />
          </div>
          <div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">Your Network</h1>
            <p className="text-gray-400 text-lg font-medium max-w-md leading-relaxed">
              You are connected to <span className="text-white font-bold">{stats.followingCount}</span> top professionals matching your interests.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap justify-center gap-6 md:gap-10">
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 min-w-[160px] text-center hover:bg-white/10 transition-colors">
            <div className="text-4xl font-black text-primary mb-1">{stats.followingCount}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Connections</div>
          </div>
          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 min-w-[160px] text-center hover:bg-white/10 transition-colors">
            <div className="text-4xl font-black text-yellow-400 mb-1">{stats.sharedSkillsCount}</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Shared Skills</div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 p-6 rounded-[32px] flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
            <AlertTriangle className="text-red-500" size={24} />
          </div>
          <div>
            <p className="font-bold text-lg">Failed to Load Content</p>
            <p className="text-sm opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Following Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
              <UserCheck className="text-emerald-500" size={20} />
            </div>
            <h2 className="text-2xl font-black text-dark tracking-tight">Active Connections</h2>
          </div>
          <span className="text-xs font-bold text-gray-400 bg-gray-100 px-4 py-2 rounded-full border border-gray-200">
            {stats.followingCount} TOTAL
          </span>
        </div>

        {Array.isArray(following) && following.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {following.map(user => (
              <UserCard 
                key={`following-${user?.userId || Math.random()}`} 
                user={user} 
                isFollowing={true} 
                onAction={(u) => unfollow(u?.userId)}
                profileData={profileData}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-100 p-16 flex flex-col items-center text-center shadow-sm group">
            <div className="w-24 h-24 bg-gray-50 rounded-[40px] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
              <Users size={40} className="text-gray-200" />
            </div>
            <h3 className="text-xl font-bold text-dark mb-2">Build your connection network</h3>
            <p className="text-gray-400 max-w-sm mb-8 font-medium italic">Your professional graph is currently empty. Follow other industry leaders to see their job updates and referrals.</p>
            <button 
              onClick={() => document.getElementById('suggestions-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
            >
              See Suggestions <ArrowRight size={18} />
            </button>
          </div>
        )}
      </section>

      {/* Suggestions Section */}
      <section id="suggestions-section" className="space-y-6">
        <div className="flex items-center gap-3 px-4">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
            <UserPlus className="text-primary" size={20} />
          </div>
          <h2 className="text-2xl font-black text-dark tracking-tight">Expand Your Network</h2>
        </div>

        {Array.isArray(suggestions) && suggestions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {suggestions.map(user => (
              <UserCard 
                key={`suggested-${user?.userId || Math.random()}`} 
                user={user} 
                isFollowing={false} 
                onAction={follow}
                profileData={profileData}
              />
            ))}
          </div>
        ) : (
          !isLoading && (
            <div className="bg-white rounded-[40px] border border-border p-12 text-center">
              <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center mx-auto mb-4">
                <Users size={32} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium italic">No new industry suggestions found at the moment.</p>
            </div>
          )
        )}
      </section>
    </div>
  );
};

export default Network;
