import { useState, useRef, useEffect } from 'react';
import { api } from '../api';
import SkillEntry from '../components/SkillEntry';
import SkillChip from '../components/SkillChip';
import { UploadCloud, FileText, CheckCircle, X, Sparkles, User, BadgeAlert } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

const ResumeSkills = () => {
  const { profileData, skillsLibrary, fetchProfile, fetchRecommendations } = useOutletContext();
  const [skills, setSkills] = useState([]);
  const [resumeFile, setResumeFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [parsedSkills, setParsedSkills] = useState([]);
  const [bio, setBio] = useState('');
  const [analyzeStage, setAnalyzeStage] = useState('idle'); // 'idle', 'uploading', 'analyzing', 'extracting'
  const fileInputRef = useRef(null);

  // Sync profile data from context
  useEffect(() => {
    if (profileData) {
      if (profileData.skills) {
        const mapped = profileData.skills.map(s => ({
          id: s.skill_id,
          name: s.skill_name || `Skill ${s.skill_id}`,
          proficiency: Math.round(s.proficiency * 5) || 1,
          category: 'technical'
        }));
        setSkills(mapped);
      }
      if (profileData.bio) setBio(profileData.bio);
    }
  }, [profileData]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('ONLY PDF files are supported for AI graph extraction.');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('File is too large. Maximum size is 5MB.');
        return;
      }
      setResumeFile(file);
    }
  };

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    
    setIsUploading(true);
    setAnalyzeStage('uploading');
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      
      // Stage 2: Simulating "Analyzing" (backend doesn't provide partials yet)
      const timer = setTimeout(() => setAnalyzeStage('analyzing'), 800);
      
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      clearTimeout(timer);
      setAnalyzeStage('extracting');
      
      // Brief delay for "Extracting" stage readability
      await new Promise(r => setTimeout(r, 600));

      const rawSkills = res.data.skills || res.data || [];
      const mappedSkills = rawSkills.map(s => {
        const pName = s.skill || s.name || s.skillName;
        // The backend auto-saves, but we match with library for UI badges
        const match = (skillsLibrary || []).find(
          lib => lib.name.toLowerCase() === pName.toLowerCase()
        );
        
        return {
          id: match ? match.id : (s.skillId || s.id), 
          name: match ? match.name : pName, 
          proficiency: Math.round((s.proficiency || 0.5) * 5) || 1,
          category: 'technical',
          unmatched: !match 
        };
      });

      setParsedSkills(mappedSkills);
      setMessage({ type: 'success', text: 'Resume analyzed and skill graph updated!' });
      
      // Auto-sync with profile since backend already saved HAS_SKILL edges
      await fetchProfile();
      
    } catch (err) {
      console.error('Resume error:', err);
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to analyze resume. Please ensure it is a valid PDF.' });
    } finally {
      setIsUploading(false);
      setAnalyzeStage('idle');
    }
  };

  const handleAddSkill = (skill) => {
    setSkills([...skills, skill]);
  };

  const handleRemoveSkill = (name) => {
    setSkills(skills.filter(s => s.name !== name));
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    try {
      const payload = { 
        skills: skills.map(s => ({ 
          skill_id: s.id, 
          proficiency: s.proficiency / 5 
        })),
        bio // Explicitly include bio if we have it
      };
      await api.post('/user/profile', payload);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      // Refresh global state
      await fetchProfile();
      if (typeof fetchRecommendations === 'function') {
        await fetchRecommendations();
      }
    } catch {
      setMessage({ type: 'error', text: 'Failed to save skills. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-32">
      <div className="mb-12 text-center">
        <div className="inline-flex p-3 bg-primary/10 rounded-2xl text-primary mb-4">
          <User size={32} strokeWidth={2.5} />
        </div>
        <h1 className="text-3xl font-bold text-dark tracking-tight">
          Setup your <span className="text-primary">Skill Graph</span>
        </h1>
        <p className="text-gray-500 font-medium mt-3 max-w-lg mx-auto leading-relaxed">
          The more we know about your expertise, the more precise our graph-powered matching becomes.
        </p>
      </div>

      {message.text && (
         <div className={`p-4 rounded-2xl mb-10 flex items-center gap-3 font-semibold shadow-sm animate-fadeInUp ${
           message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-200'
         }`}>
           {message.type === 'success' ? <CheckCircle size={20} className="text-emerald-500 shrink-0" /> : <BadgeAlert size={20} className="text-red-500 shrink-0" />}
           <span className="text-sm">{message.text}</span>
         </div>
      )}

      {/* SECTION 1: AI Parsing */}
      <section className="bg-white p-8 sm:p-12 rounded-[2rem] border border-border shadow-[0_8px_30px_rgba(108,71,255,0.03)] mb-10 relative overflow-hidden group">
        <div className="absolute -top-12 -right-12 p-8 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity pointer-events-none">
          <FileText size={280} className="text-primary -rotate-12" />
        </div>
        
        <h2 className="text-xl font-bold text-dark mb-8 flex items-center gap-3">
          <Sparkles className="text-warning" size={24} /> 
          Graph AI Import
        </h2>
        
        <div className="flex flex-col lg:flex-row items-stretch gap-8 z-10 relative">
          <div 
            className="w-full lg:w-3/5 min-h-48 border-2 border-dashed border-border hover:border-primary/40 bg-surface hover:bg-white rounded-[1.5rem] flex flex-col items-center justify-center p-8 text-center transition-all cursor-pointer group/upload shadow-inner"
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              accept=".pdf" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange}
            />
            
            {resumeFile ? (
              <div className="flex flex-col items-center gap-3">
                 <div className="p-4 bg-primary text-white rounded-2xl shadow-lg shadow-primary/20">
                    <FileText size={32} />
                 </div>
                 <p className="font-bold text-dark mt-2">{resumeFile.name}</p>
                 <span className="text-[11px] font-black text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest border border-primary/10">
                   Click to change
                 </span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                 <div className="p-4 bg-white rounded-2xl shadow-sm mb-2 text-gray-300 group-hover/upload:text-primary transition-colors">
                    <UploadCloud size={32} strokeWidth={2.5} />
                 </div>
                 <p className="font-bold text-dark text-lg">Upload Resume PDF</p>
                 <p className="text-sm text-gray-500 font-medium">Auto-detect skills from your experience</p>
              </div>
            )}
          </div>
          
          <div className="w-full lg:w-2/5 flex flex-col justify-center items-center lg:items-start gap-6">
            <button 
              onClick={handleUploadResume}
              disabled={!resumeFile || isUploading}
              className="px-10 py-4 rounded-[10px] font-bold bg-primary text-white hover:bg-primary-dark active:scale-[0.98] transition-all shadow-xl shadow-primary/20 disabled:opacity-30 w-full flex justify-center items-center h-16 text-[15px]"
            >
              {isUploading ? (
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="animate-pulse">
                    {analyzeStage === 'uploading' ? 'Uploading PDF...' : 
                     analyzeStage === 'analyzing' ? 'Analyzing Nodes...' : 
                     'Extracting Skills...'}
                  </span>
                </div>
              ) : 'Analyze Experience'}
            </button>
            <p className="text-xs text-gray-400 text-center lg:text-left leading-relaxed font-medium">
              We'll use our graph-trained models to extract nodes and relationships from your career history.
            </p>
          </div>
        </div>

        {/* Parsed Result Preview */}
        {parsedSkills.length > 0 && (
          <div className="mt-10 p-8 bg-surface rounded-[1.5rem] border border-border animate-fadeInUp">
            <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
              Extracted Graph Nodes
            </h3>
            <div className="flex flex-wrap gap-3 mb-8">
              {parsedSkills.map((ps, idx) => (
                <SkillChip key={idx} skill={ps} />
              ))}
            </div>
            <button 
              onClick={() => setParsedSkills([])} // Simply clear since sync happened automatically
              className="flex items-center gap-3 bg-white text-primary border-primary border hover:bg-primary hover:text-white px-8 py-3 rounded-[10px] font-bold transition-all shadow-sm group"
            >
               <CheckCircle size={18} className="group-hover:scale-110 transition-transform" /> 
               <span>View Updated Profile</span>
            </button>
          </div>
        )}
      </section>

      {/* SECTION 2: Manual Skills */}
      <section className="bg-white p-8 sm:p-12 rounded-[2rem] border border-border shadow-[0_8px_30px_rgba(108,71,255,0.03)]">
        <h2 className="text-xl font-bold text-dark mb-10">Your Professional Arsenal</h2>
        
        <div className="mb-10">
          <SkillEntry 
            onAdd={handleAddSkill} 
            existingSkills={skills} 
            allSkills={skillsLibrary}
            isLoading={!skillsLibrary.length && !profileData} 
          />
        </div>

        <div className="min-h-40 p-8 bg-surface rounded-[2rem] border border-border flex flex-col justify-start items-start mb-10 transition-all relative">
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-3 w-full">
              {skills.map((skill, idx) => (
                <SkillChip 
                  key={idx} 
                  skill={skill} 
                  onRemove={handleRemoveSkill} 
                />
              ))}
            </div>
          ) : (
             <div className="w-full flex-1 flex flex-col items-center justify-center py-10 opacity-40">
                <div className="p-4 rounded-2xl mb-4 text-gray-300">
                  <X size={40} strokeWidth={2.5} />
                </div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest text-center">No connections found</p>
                <p className="text-xs text-gray-500 font-medium text-center mt-2">Start by importing your resume or searching above.</p>
             </div>
          )}
        </div>

        {/* Save Bar: Desktop version */}
        <div className="hidden sm:flex justify-end pt-10 border-t border-border">
          <button 
            onClick={handleSaveAll}
            disabled={skills.length === 0 || isSaving}
            className="flex items-center gap-3 px-12 py-4 rounded-[10px] font-bold bg-dark text-white hover:bg-black active:scale-[0.98] transition-all shadow-xl shadow-gray-900/10 disabled:opacity-30 disabled:cursor-not-allowed text-[15px]"
          >
            {isSaving ? (
              <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
            ) : 'Update Global Profile'}
          </button>
        </div>
      </section>

      {/* STICKY BOTTOM BAR FOR MOBILE */}
      <div className="sm:hidden fixed bottom-16 left-0 right-0 p-4 z-40 bg-white/80 backdrop-blur-md border-t border-border animate-in slide-in-from-bottom-full duration-300">
        <button 
          onClick={handleSaveAll}
          disabled={skills.length === 0 || isSaving}
          className="w-full h-14 bg-dark text-white font-bold rounded-[10px] flex items-center justify-center gap-3 shadow-xl"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ResumeSkills;
