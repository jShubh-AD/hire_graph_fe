import { useState } from 'react';
import { Plus, ChevronDown, Search, Award } from 'lucide-react';

const SkillEntry = ({ onAdd, existingSkills = [], allSkills = [], isLoading = false }) => {
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState(0);
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = skillName.trim();
    const matchedSkill = allSkills.find(
      s => s.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (!matchedSkill) {
      setError('Skill not found in library. Please select from the dropdown.');
      return;
    }

    if (proficiency === 0) {
      setError('Please select a proficiency level (1-5)');
      return;
    }
    
    if (existingSkills.some(s => s.id === matchedSkill.id)) {
      setError('Skill is already in the list');
      return;
    }

    onAdd({ 
      id: matchedSkill.id, 
      name: matchedSkill.name, 
      proficiency,
      category: matchedSkill.category || 'other'
    });
    setSkillName('');
    setProficiency(0);
    setError('');
  };

  return (
    <div className="flex flex-col gap-4 animate-fadeInUp">
      <div className="flex flex-col gap-6 md:gap-8 bg-white p-6 sm:p-8 rounded-[2rem] border border-border shadow-[0_2px_12px_rgba(108,71,255,0.03)] focus-within:border-primary/30 transition-all">
        
        {/* Full-width Search Input */}
        <div className="w-full relative group">
          <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1">Discover Skill</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors pointer-events-none">
              <Search size={18} />
            </div>
            <input
              type="text"
              list="skills-list"
              className="w-full bg-surface border-border border-[1.5px] rounded-2xl pl-12 pr-12 py-4 h-14 text-dark font-semibold text-[15px] focus:outline-none focus:border-primary focus:bg-white transition-all placeholder-gray-400"
              placeholder={isLoading ? "Loading library..." : "Type to find skills (AI, Python, React...)"}
              value={skillName}
              onChange={(e) => {
                setSkillName(e.target.value);
                if (error) setError('');
              }}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <datalist id="skills-list">
              {allSkills.map((s) => (
                <option key={s.id} value={s.name} />
              ))}
            </datalist>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none">
              <ChevronDown size={18} />
            </div>
          </div>
        </div>
        
        {/* Segmented Proficiency Bar */}
        <div className="w-full">
           <label className="text-[12px] font-black text-gray-400 uppercase tracking-widest mb-3 block px-1 flex items-center gap-2">
             <Award size={14} className="text-primary" />
             Self-Assessed Proficiency
           </label>
           <div className="flex items-center gap-2 h-12 bg-surface rounded-2xl p-1.5 border border-border">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setProficiency(val);
                  if (error) setError('');
                }}
                className={`flex-1 h-full rounded-[10px] font-black text-xs transition-all relative overflow-hidden flex items-center justify-center ${
                  val <= proficiency 
                    ? 'bg-primary text-white shadow-sm' 
                    : 'bg-white text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
                title={`Level ${val}`}
              >
                {val}
                {val <= proficiency && (
                  <div className="absolute inset-0 bg-white opacity-10 animate-pulse pointer-events-none" />
                )}
              </button>
            ))}
          </div>
          <div className="flex justify-between px-2 mt-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Beginner</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight text-center">Intermediate</span>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">Expert</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full flex items-center justify-center gap-3 bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary-dark shadow-[0_4px_16px_rgba(108,71,255,0.2)] hover:scale-[1.01] transition-all"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Add Skill Connection</span>
        </button>
      </div>
      
      {error && (
        <div className="flex items-center gap-2 text-danger font-bold text-sm px-4 py-3 bg-red-50 border border-red-100 rounded-xl animate-fadeInUp">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
};

// Internal AlertCircle if needed (since it's not imported)
const AlertCircle = ({ size }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
);

export default SkillEntry;
