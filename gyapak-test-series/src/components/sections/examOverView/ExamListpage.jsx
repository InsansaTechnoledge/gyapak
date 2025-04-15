import React, { useEffect, useState } from 'react';
import { getAllexam } from '../../../service/exam.service';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, BookOpen, ArrowRight, Search, Bell, User } from 'lucide-react';

const ExamListPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const res = await getAllexam();
        setExams(res.data || []);
      } catch (err) {
        console.error("Error fetching exams:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center min-h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 border-4 border-t-purple-600 border-r-transparent border-b-purple-600 border-l-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600 font-medium">Loading exams...</p>
          </div>
        </div>
      </>
    );
  }

  if (exams.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-4xl mx-auto p-6 text-center">
          <BookOpen size={48} className="mx-auto text-purple-400 mb-4" />
          <h2 className="text-2xl font-bold mb-2">No Exams Available</h2>
          <p className="text-gray-600">There are currently no exams available in the system.</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen pt-24 bg-gray-50">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Exams</h1>
            <p className="text-gray-600 mt-2">Select an exam from the list below to begin</p>
          </div>
          <div className="bg-purple-100 text-purple-800 px-6 py-3 rounded-lg">
            <span className="font-medium">{exams.length}</span> exams available
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} navigate={navigate} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ExamCard = ({ exam, navigate }) => {
  return (
    <div 
      onClick={() => navigate(`/exam/${exam.id}`)}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col"
    >
      <div className="h-2 bg-purple-600"></div>
      
      <div className="p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-3">{exam.title}</h3>
        <p className="text-gray-600 mb-6 line-clamp-2">{exam.description}</p>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {exam.duration && (
            <div className="flex items-center text-gray-500">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Clock size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Duration</p>
                <p className="font-medium">{exam.duration} minutes</p>
              </div>
            </div>
          )}
          
          {exam.date && (
            <div className="flex items-center text-gray-500">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Calendar size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Date</p>
                <p className="font-medium">{new Date(exam.date).toLocaleDateString()}</p>
              </div>
            </div>
          )}
          
          {exam.participants !== undefined && (
            <div className="flex items-center text-gray-500">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Users size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Participants</p>
                <p className="font-medium">{exam.participants}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-4">
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors duration-200">
            Start Exam
            <ArrowRight size={18} className="ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamListPage;