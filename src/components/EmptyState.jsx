import { useNavigate } from 'react-router-dom';
import { FileUp, PlusCircle, Sparkles } from 'lucide-react';

const EmptyState = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center h-full min-h-[500px] max-w-2xl mx-auto">
      <div className="w-24 h-24 bg-purple-50 rounded-3xl flex items-center justify-center mb-8 shadow-sm">
        <Sparkles size={48} className="text-purple-500 animate-[pulse_3s_ease-in-out_infinite]" />
      </div>
      
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-500">
        Let's find your perfect match
      </h2>
      <p className="text-gray-500 text-lg mb-10 max-w-md font-medium">
        Set up your profile with your skills and experience to unlock AI-powered job and internship recommendations.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <button
          onClick={() => navigate('/resume')}
          className="flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3.5 rounded-2xl font-bold transition-all shadow-xl shadow-purple-600/20 active:scale-95 group w-full sm:w-auto"
        >
          <FileUp size={20} className="group-hover:-translate-y-1 transition-transform" />
          <span>Upload Resume</span>
        </button>
        
        <button
          onClick={() => navigate('/resume')}
          className="flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-purple-200 hover:bg-purple-50 text-gray-700 hover:text-purple-700 px-6 py-3.5 rounded-2xl font-bold transition-all active:scale-95 group w-full sm:w-auto"
        >
          <PlusCircle size={20} className="group-hover:rotate-90 transition-transform" />
          <span>Add Skills Manually</span>
        </button>
      </div>
    </div>
  );
};

export default EmptyState;
