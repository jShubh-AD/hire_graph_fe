import { useState, useEffect } from 'react';
import { User, Mail, Grid, Briefcase, FileUp, Edit2, Check } from 'lucide-react';
import SkillChip from '../components/SkillChip';
import { api } from '../api';

const Profile = () => {
  const [user, setUser] = useState({});
  const [skills, setSkills] = useState([]);
  const [bio, setBio] = useState('Passionate software engineer looking for exciting opportunities.');
  const [isEditingBio, setIsEditingBio] = useState(false);
  
  // Stats
  const [stats, setStats] = useState({
    jobsSaved: 12,
    jobsApplied: 4,
  });

  useEffect(() => {
    // Load user basic info from local storage
    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(storedUser);

    // Mock an endpoint to fetch profile data (skills, bio, etc)
    const fetchProfile = async () => {
      try {
        const response = await api.get('/user/profile');
        if (response.data.skills) {
          const mappedSkills = response.data.skills.map(s => ({
            name: s.skill,
            proficiency: s.proficiency <= 1 ? Math.round(s.proficiency * 5) || 1 : s.proficiency,
            category: 'other' // Backend doesn't support category yet
          }));
          setSkills(mappedSkills);
        }
        if (response.data.bio) setBio(response.data.bio);
        if (response.data.stats) setStats(response.data.stats);
      } catch (error) {
        // Fallback or demo case
        setSkills([
          { name: 'JavaScript', proficiency: 5, category: 'frontend' },
          { name: 'React', proficiency: 4, category: 'frontend' },
          { name: 'Node.js', proficiency: 3, category: 'backend' },
          { name: 'MongoDB', proficiency: 3, category: 'backend' },
          { name: 'AWS', proficiency: 2, category: 'devops' },
          { name: 'Python', proficiency: 4, category: 'ml' },
        ]);
        console.log('Using demo profile data', error);
      }
    };
    
    fetchProfile();
  }, []);

  const handleSaveBio = async () => {
    setIsEditingBio(false);
    // Attempt saving to backend
    try {
      const payloadSkills = skills.map(s => ({ skill: s.name, proficiency: s.proficiency / 5 }));
      await api.post('/user/profile', { bio, skills: payloadSkills });
    } catch(err) {
      console.error('Failed to save bio');
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, skill) => {
    const cat = skill.category || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto pb-12">
      {/* Header Profile Section */}
      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50 flex flex-col sm:flex-row gap-8 items-start sm:items-center relative overflow-hidden mb-8">
        <div className="w-full h-32 absolute top-0 left-0 bg-gradient-to-r from-purple-100 to-teal-50 pointer-events-none" />
        
        <div className="relative z-10 flex shrink-0 justify-center w-full sm:w-auto mt-8 sm:mt-0">
          <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gradient-to-tr from-purple-500 to-indigo-500 flex items-center justify-center text-4xl font-extrabold text-white">
            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </div>
        </div>

        <div className="relative z-10 flex-1 w-full text-center sm:text-left pt-0 sm:pt-14">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{user.name || 'User Profile'}</h1>
          <div className="flex items-center gap-2 text-gray-500 font-medium justify-center sm:justify-start mt-2">
            <Mail size={16} />
            <span>{user.email || 'user@example.com'}</span>
          </div>

          <div className="mt-6 flex flex-col group">
            <div className="flex items-center gap-2 justify-between">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">About Me</h3>
              {!isEditingBio && (
                <button 
                  onClick={() => setIsEditingBio(true)}
                  className="text-gray-400 hover:text-purple-600 transition-colors p-1 rounded-md opacity-0 group-hover:opacity-100"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            
            {isEditingBio ? (
              <div className="flex flex-col gap-2 mt-2">
                <textarea 
                  className="w-full text-gray-700 bg-gray-50 border border-gray-200 rounded-xl p-3 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all resize-none font-medium"
                  rows="3"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
                <button 
                  onClick={handleSaveBio}
                  className="self-end bg-gray-900 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 text-sm hover:bg-gray-800 transition-colors"
                >
                  <Check size={16} /> Save
                </button>
              </div>
            ) : (
              <p className="text-gray-700 mt-2 font-medium leading-relaxed max-w-2xl">{bio}</p>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
            <h2 className="text-lg font-extrabold text-gray-900 mb-6 flex items-center gap-2">
              <Grid size={20} className="text-purple-600" />
              Overview
            </h2>
            
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                <div className="flex items-center gap-3 text-purple-700 font-semibold">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><Briefcase size={20} /></div>
                  Total Skills
                </div>
                <span className="text-2xl font-extrabold text-purple-900">{skills.length}</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-teal-50 rounded-2xl border border-teal-100">
                <div className="flex items-center gap-3 text-teal-700 font-semibold">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><FileUp size={20} /></div>
                  Jobs Applied
                </div>
                <span className="text-2xl font-extrabold text-teal-900">{stats.jobsApplied}</span>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                <div className="flex items-center gap-3 text-amber-700 font-semibold">
                  <div className="p-2 bg-white rounded-xl shadow-sm"><Grid size={20} /></div>
                  Saved Jobs
                </div>
                <span className="text-2xl font-extrabold text-amber-900">{stats.jobsSaved}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
           <h2 className="text-lg font-extrabold text-gray-900 mb-8 flex items-center gap-2">
             <Briefcase size={20} className="text-purple-600" />
             Technical Arsenal
           </h2>

           {Object.keys(groupedSkills).length === 0 ? (
             <div className="text-center py-12 text-gray-400 font-medium bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
               No skills found. Head over to the Resume page to add some!
             </div>
           ) : (
             <div className="flex flex-col gap-8">
               {Object.keys(groupedSkills).map((category, idx) => (
                 <div key={idx}>
                   <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">{category}</h3>
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
    </div>
  );
};

export default Profile;
