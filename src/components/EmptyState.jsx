import { useNavigate } from 'react-router-dom';
import { FileUp, PlusCircle, Sparkles, Bookmark, Briefcase, AlertTriangle, Search } from 'lucide-react';

const EmptyState = ({ 
  title = "Let's find your perfect match", 
  description = "Set up your profile with your skills and experience to unlock AI-powered job and internship recommendations.",
  type = "default",
  action = null
}) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch(type) {
      case 'saved': return <Bookmark size={48} className="text-purple-600" />;
      case 'applied': return <Briefcase size={48} className="text-teal-600" />;
      case 'reported': return <AlertTriangle size={48} className="text-red-600" />;
      case 'search': return <Search size={48} className="text-blue-600" />;
      default: return <Sparkles size={48} className="text-purple-500 animate-[pulse_3s_ease-in-out_infinite]" />;
    }
  };

  const getBg = () => {
    switch(type) {
      case 'saved': return 'bg-purple-50';
      case 'applied': return 'bg-teal-50';
      case 'reported': return 'bg-red-50';
      case 'search': return 'bg-blue-50';
      default: return 'bg-purple-50';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full min-h-[500px] max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
      <div className={`w-24 h-24 ${getBg()} rounded-[2rem] flex items-center justify-center mb-10 shadow-sm border border-white/50`}>
        {getIcon()}
      </div>
      
      <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight leading-tight">
        {title}
      </h2>
      <p className="text-gray-500 text-lg mb-12 max-w-md font-semibold leading-relaxed">
        {description}
      </p>

      {type === 'default' && (
        <div className="flex flex-col sm:flex-row gap-5 w-full justify-center">
          <button
            onClick={() => navigate('/resume')}
            className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-purple-600/30 active:scale-95 group w-full sm:w-auto"
          >
            <FileUp size={22} className="group-hover:-translate-y-1 transition-transform" strokeWidth={2.5} />
            <span>Upload Resume</span>
          </button>
          
          <button
            onClick={() => navigate('/resume')}
            className="flex items-center justify-center gap-3 bg-white border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50 text-gray-700 hover:text-purple-700 px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 group w-full sm:w-auto shadow-sm"
          >
            <PlusCircle size={22} className="group-hover:rotate-90 transition-transform" strokeWidth={2.5} />
            <span>Add Skills Manually</span>
          </button>
        </div>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-2xl shadow-gray-200 active:scale-95"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
