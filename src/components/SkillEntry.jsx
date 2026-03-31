import { useState } from 'react';
import { Plus } from 'lucide-react';

const SkillEntry = ({ onAdd, existingSkills = [] }) => {
  const [skillName, setSkillName] = useState('');
  const [proficiency, setProficiency] = useState(0);
  const [error, setError] = useState('');

  const handleAdd = () => {
    const trimmed = skillName.trim();
    if (trimmed.length < 2) {
      setError('Skill name must be at least 2 characters');
      return;
    }
    if (proficiency === 0) {
      setError('Please select a proficiency level');
      return;
    }
    
    // Parent handles actual saving, but let's check duplicates locally if passed
    if (existingSkills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) {
      setError('Skill is already in the list');
      return;
    }

    onAdd({ name: trimmed, proficiency });
    setSkillName('');
    setProficiency(0);
    setError('');
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-gray-50 p-4 border border-gray-200 rounded-2xl w-full transition-all focus-within:ring-2 focus-within:ring-purple-500/20 focus-within:border-purple-300">
        <div className="flex-1 w-full">
          <input
            type="text"
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all placeholder-gray-400"
            placeholder="e.g. React, Python, AWS..."
            value={skillName}
            onChange={(e) => {
              setSkillName(e.target.value);
              if (error) setError('');
            }}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
          />
        </div>
        
        <div className="flex flex-col gap-1 items-start sm:items-center sm:w-32 shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 sm:ml-0">Proficiency</span>
          <div className="flex items-center gap-1.5 h-10 px-1">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => {
                  setProficiency(val);
                  if (error) setError('');
                }}
                className={`w-4 h-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-purple-500/50 hover:scale-125 ${
                  val <= proficiency 
                    ? 'bg-purple-600 shadow-sm shadow-purple-600/40' 
                    : 'bg-gray-200 hover:bg-purple-300 cursor-pointer'
                }`}
                title={`Level ${val}`}
              />
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-purple-700 active:scale-95 transition-all shadow-md shadow-purple-600/20 whitespace-nowrap"
        >
          <Plus size={18} />
          <span>Add Skill</span>
        </button>
      </div>
      
      {error && (
        <p className="text-sm font-medium text-red-500 px-2 animate-pulse">{error}</p>
      )}
    </div>
  );
};

export default SkillEntry;
