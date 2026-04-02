import { X } from 'lucide-react';

const getCategoryColor = (category) => {
  const norm = (category || '').toLowerCase();
  // Frontend=Blue, Backend=Teal, ML=Purple, DevOps=Amber, Other=Gray
  if (norm.includes('frontend')) return 'bg-blue-50 text-blue-600 border-blue-100';
  if (norm.includes('backend')) return 'bg-teal-50 text-teal-600 border-teal-100';
  if (norm.includes('ml') || norm.includes('ai') || norm.includes('data')) return 'bg-purple-50 text-purple-600 border-purple-100';
  if (norm.includes('devops')) return 'bg-amber-50 text-amber-600 border-amber-100';
  return 'bg-gray-50 text-gray-500 border-gray-100'; // Other
};

const SkillChip = ({ skill, onRemove }) => {
  const colorClass = getCategoryColor(skill.category);

  return (
    <div className={`inline-flex items-center gap-2.5 px-3 py-1.5 rounded-xl border font-semibold text-[13px] transition-all shadow-sm animate-in zoom-in-95 duration-150 ${colorClass}`}>
      <div className="flex items-center gap-1.5">
        <span className={`w-1.5 h-1.5 rounded-full bg-current opacity-70`} />
        <span>{skill.name}</span>
      </div>
      
      {skill.proficiency && (
        <div className="flex items-center gap-1.5 bg-white/40 px-1.5 py-0.5 rounded-lg text-[10px] font-black border border-white/20">
          {skill.proficiency}/5
        </div>
      )}

      {onRemove && (
        <button
          onClick={() => onRemove(skill.name)}
          className="ml-0.5 opacity-40 hover:opacity-100 hover:scale-110 transition-all rounded-full p-0.5 bg-black/0 hover:bg-black/5"
          title="Remove skill"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SkillChip;
