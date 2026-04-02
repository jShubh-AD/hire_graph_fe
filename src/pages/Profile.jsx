import { useState, useEffect } from 'react';
import { User, Mail, Grid, Briefcase, FileUp, Edit2, Check, ExternalLink, Zap, Network, Database, ShieldCheck } from 'lucide-react';
import { useOutletContext, Link } from 'react-router-dom';
import SkillChip from '../components/SkillChip';
import { api } from '../api';

const Profile = () => {
  const { profileData, fetchProfile, fetchRecommendations } = useOutletContext();
  const [user, setUser] = useState({});
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState('Passionate software engineer looking for exciting opportunities.');
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [graphStats, setGraphStats] = useState(null);
  
  useEffect(() => {
    if (profileData) {
      const { name, email, bio: serverBio, skills: serverSkills } = profileData;
      setUser({ name, email });
      if (serverBio) setBio(serverBio);
      
      if (serverSkills) {
        const mappedSkills = serverSkills.map(s => ({
          id: s.skill_id,
          name: s.skill_name || `Skill ${s.skill_id}`,
          proficiency: Math.round((s.proficiency || 0) * 5) || 1,
          category: s.category || 'Technical'
        }));
        setSkills(mappedSkills);
      }
    }
  }, [profileData]);

  useEffect(() => {
    const fetchGraphStats = async () => {
      try {
        const res = await api.get('/graph/stats');
        setGraphStats(res.data);
      } catch (err) {
        console.error('Failed to fetch graph stats', err);
      }
    };
    fetchGraphStats();
  }, []);

  const handleSaveBio = async () => {
    setIsEditingBio(false);
    try {
      const payloadSkills = skills.map(s => ({ 
        skill_id: s.id, 
        proficiency: s.proficiency / 5 
      }));
      await api.post('/user/profile', { bio, skills: payloadSkills });
      await fetchProfile();
      if (typeof fetchRecommendations === 'function') {
        await fetchRecommendations();
      }
    } catch(err) {
      console.error('Failed to save profile updates', err);
    }
  };

  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  const profileStrength = Math.min(100, (skills.length * 10) + (bio.length > 20 ? 20 : 0));

  return (
    <div className="max-w-6xl mx-auto pb-24 space-y-10">
      {/* Premium Hero Section */}
      <div className="relative animate-fadeInUp">
        {/* Decorative Background */}
        <div className="h-64 sm:h-80 w-full bg-gradient-to-br from-primary via-indigo-600 to-purple-800 rounded-[2.5rem] shadow-2xl shadow-primary/20 overflow-hidden relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }} />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -top-12 -left-12 w-64 h-64 bg-primary-dark/20 rounded-full blur-2xl" />
        </div>

        {/* Profile Info Overlay */}
        <div className="px-8 sm:px-12 -mt-20 relative z-10 flex flex-col md:flex-row items-end gap-8">
          <div className="relative group/avatar">
            <div className="w-40 h-40 rounded-[2.5rem] bg-white p-1.5 shadow-2xl rotate-3 group-hover/avatar:rotate-0 transition-all duration-500">
               <div className="w-full h-full rounded-[2rem] bg-gradient-to-tr from-primary to-indigo-500 flex items-center justify-center text-5xl font-black text-white shadow-inner">
                 {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
               </div>
            </div>
            <div className="absolute -bottom-2 -right-2 p-3 bg-emerald-500 text-white rounded-2xl shadow-lg border-4 border-white">
              <ShieldCheck size={20} strokeWidth={3} />
            </div>
          </div>

          <div className="flex-1 pb-4 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-2">
              <h1 className="text-4xl font-black text-dark tracking-tight drop-shadow-sm">{user.name || 'User Profile'}</h1>
              <div className="flex items-center gap-2 justify-center">
                 <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">Active Contributor</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-500 font-bold text-sm justify-center md:justify-start">
               <div className="flex items-center gap-2">
                 <Mail size={16} className="text-primary" />
                 <span>{user.email || 'user@example.com'}</span>
               </div>
               <div className="w-1 h-1 bg-gray-300 rounded-full" />
               <div className="flex items-center gap-2">
                 <Network size={16} className="text-primary" />
                 <span>Lvl {Math.floor(skills.length / 3) + 1} Architect</span>
               </div>
            </div>
          </div>

          <div className="flex gap-3 pb-4">
             <button className="p-4 bg-white border border-border rounded-2xl text-dark hover:bg-surface transition-all shadow-sm">
                <Edit2 size={20} />
             </button>
             <Link to="/resume" className="flex items-center gap-2 px-8 py-4 bg-dark text-white rounded-2xl font-bold shadow-xl shadow-gray-900/10 hover:scale-[1.02] active:scale-95 transition-all">
                Update Skills
             </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Dashboard */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Bio Section */}
          <div className="bg-white rounded-[2.5rem] border border-border p-10 shadow-[0_8px_30px_rgba(108,71,255,0.03)] animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
             <div className="flex items-center justify-between mb-8 group">
                <h2 className="text-xl font-bold text-dark flex items-center gap-3">
                  <Zap size={22} className="text-warning" />
                  Synthesis Profile
                </h2>
                {!isEditingBio && (
                   <button onClick={() => setIsEditingBio(true)} className="text-primary font-bold text-sm opacity-0 group-hover:opacity-100 transition-opacity">Edit Bio</button>
                )}
             </div>

             {isEditingBio ? (
               <div className="space-y-4">
                 <textarea 
                   className="w-full text-dark bg-surface border border-border rounded-2xl p-6 focus:border-primary focus:bg-white focus:outline-none transition-all resize-none font-medium leading-relaxed"
                   rows="4"
                   value={bio}
                   onChange={(e) => setBio(e.target.value)}
                   placeholder="Describe your professional trajectory..."
                 />
                 <div className="flex justify-end gap-3">
                    <button onClick={() => setIsEditingBio(false)} className="px-6 py-3 text-gray-500 font-bold hover:text-dark">Cancel</button>
                    <button onClick={handleSaveBio} className="px-8 py-3 bg-primary text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all">
                      <Check size={18} /> Update Story
                    </button>
                 </div>
               </div>
             ) : (
               <p className="text-gray-600 font-medium leading-relaxed text-lg italic underline decoration-primary/10 decoration-4 underline-offset-4">
                 "{bio || 'Tell the graph about yourself...'}"
               </p>
             )}
          </div>

          {/* Graph Stats Section */}
          <div className="animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
             <h2 className="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-6 px-4">Network Real-Time Metrics</h2>
             <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                {[
                  { label: 'Nodes', value: graphStats?.vertex_count || '...', icon: Database, color: 'bg-blue-50 text-blue-600 border-blue-100' },
                  { label: 'Edges', value: graphStats?.edge_count || '...', icon: Network, color: 'bg-primary/5 text-primary border-primary/10' },
                  { label: 'Latency', value: graphStats?.latency_ms ? `${graphStats.latency_ms}ms` : '...', icon: Zap, color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
                  { label: 'Status', value: 'Syncing', valueColor: 'text-emerald-600', icon: ShieldCheck, color: 'bg-emerald-50/50 text-emerald-600 border-emerald-100' }
                ].map((stat, i) => (
                  <div key={i} className={`p-6 rounded-[2rem] border bg-white shadow-sm flex flex-col items-center justify-center text-center group hover:scale-[1.03] transition-all`}>
                     <div className={`p-3 rounded-2xl mb-4 ${stat.color}`}>
                        <stat.icon size={24} />
                     </div>
                     <div className={`text-2xl font-black ${stat.valueColor || 'text-dark'} mb-1`}>{stat.value}</div>
                     <div className="text-[10px] font-black text-gray-400 tracking-widest uppercase">{stat.label}</div>
                  </div>
                ))}
             </div>
          </div>

          {/* Skills Visualization */}
          <div className="bg-white rounded-[2.5rem] border border-border p-10 shadow-[0_8px_30px_rgba(108,71,255,0.03)] animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
             <h2 className="text-xl font-bold text-dark mb-10 flex items-center gap-3">
               <Briefcase size={22} className="text-primary" />
               Knowledge Distribution
             </h2>
             {Object.keys(groupedSkills).length === 0 ? (
                <div className="py-12 border-2 border-dashed border-border rounded-[2rem] flex flex-col items-center justify-center text-center">
                   <p className="font-bold text-gray-400">Node Library Empty</p>
                   <Link to="/resume" className="text-primary font-bold text-sm mt-2 flex items-center gap-1">Add connections <ExternalLink size={14} /></Link>
                </div>
             ) : (
                <div className="space-y-10">
                   {Object.keys(groupedSkills).map((category, idx) => (
                     <div key={idx}>
                        <div className="flex items-center gap-3 mb-5">
                           <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">{category}</h3>
                           <div className="flex-1 h-[1px] bg-border" />
                        </div>
                        <div className="flex flex-wrap gap-3">
                           {groupedSkills[category].map((skill, index) => (
                             <SkillChip key={index} skill={skill} />
                           ))}
                        </div>
                     </div>
                   ))}
                </div>
             )}
          </div>
        </div>

        {/* Right Column: Profile Sidebars */}
        <div className="lg:col-span-4 space-y-10 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
           {/* Profile Strength */}
           <div className="bg-dark rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                 <Zap size={140} />
              </div>
              <h3 className="text-lg font-bold mb-6 relative z-10">Profile Authority</h3>
              <div className="flex items-center gap-6 mb-8 relative z-10">
                 <div className="text-5xl font-black text-primary">{profileStrength}%</div>
                 <div className="flex-1">
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                       <div className="h-full bg-primary rounded-full shadow-[0_0_12px_rgba(108,71,255,0.8)] transition-all duration-1000" style={{ width: `${profileStrength}%` }} />
                    </div>
                 </div>
              </div>
              <p className="text-sm font-medium text-gray-400 mb-8 relative z-10">Your graph authority determines match accuracy. Complete your nodes for maximum visibility.</p>
              <button className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-2xl font-bold text-sm transition-all border border-white/10 relative z-10">
                 Boost Authority
              </button>
           </div>

           {/* Quick Actions */}
           <div className="bg-white rounded-[2.5rem] border border-border p-10 shadow-[0_8px_30px_rgba(108,71,255,0.03)] focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-8">Node Actions</h3>
              <div className="space-y-4">
                 {[
                   { label: 'Download Identity', icon: FileUp, color: 'text-blue-500' },
                   { label: 'Privacy Settings', icon: ShieldCheck, color: 'text-emerald-500' },
                   { label: 'Sync Graph Status', icon: Database, color: 'text-warning' },
                   { label: 'Verify Credentials', icon: Check, color: 'text-primary' }
                 ].map((action, i) => (
                   <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-surface rounded-2xl transition-all group">
                      <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-xl bg-surface group-hover:bg-white shadow-sm transition-all ${action.color}`}>
                            <action.icon size={18} />
                         </div>
                         <span className="font-bold text-dark text-[15px]">{action.label}</span>
                      </div>
                      <ArrowRight size={16} className="text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                   </button>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ size, className }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
);

export default Profile;
