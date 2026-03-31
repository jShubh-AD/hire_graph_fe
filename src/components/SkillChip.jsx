import { X } from 'lucide-react';

const getCategoryColor = (category) => {
  const norm = (category || '').toLowerCase();
  if (norm.includes('frontend')) return 'bg-blue-100 text-blue-700 border-blue-200';
  if (norm.includes('backend')) return 'bg-teal-100 text-teal-700 border-teal-200';
  if (norm.includes('ml') || norm.includes('ai') || norm.includes('data')) return 'bg-purple-100 text-purple-700 border-purple-200';
  if (norm.includes('devops')) return 'bg-amber-100 text-amber-700 border-amber-200';
  return 'bg-gray-100 text-gray-700 border-gray-200'; // Other
};

const SkillChip = ({ skill, onRemove }) => {
  // skill = { name: 'React', proficiency: 4, category: 'frontend' }
  const colorClass = getCategoryColor(skill.category);

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-medium text-sm transition-all shadow-sm ${colorClass}`}>
      <span>{skill.name}</span>
      
      {/* Proficiency dots display */}
      {skill.proficiency && (
        <div className="flex gap-0.5 ml-1">
          {[1, 2, 3, 4, 5].map(val => (
            <div
              key={val}
              className={`w-1.5 h-1.5 rounded-full ${val <= skill.proficiency ? 'bg-current opacity-70' : 'bg-current opacity-20'}`}
            />
          ))}
        </div>
      )}

      {onRemove && (
        <button
          onClick={() => onRemove(skill.name)}
          className="ml-1 opacity-60 hover:opacity-100 hover:scale-110 transition-all rounded-full p-0.5 hover:bg-black/5"
          title="Remove skill"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};

export default SkillChip;
