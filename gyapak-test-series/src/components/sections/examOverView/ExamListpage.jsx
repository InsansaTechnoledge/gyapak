import React, { useEffect, useState } from 'react';
import { getAllexam } from '../../../service/exam.service';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Users, BookOpen, ArrowRight, Search, Bell, User } from 'lucide-react';
import Loader from '../../common/Loader/Loader';
import ErrorComponent from '../../common/ErrorComponent/ErrorComponent';
import ExamCard from './ExamCard';

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
        <Loader message={"Loading exams..."} />
      </>
    );
  }

  if (exams.length === 0) {
    return (
      <>
        <ErrorComponent heading={"No exams available"} info={"There are currently no exams available in the system."} />

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

        <div className="grid md:grid-cols-3 gap-x-20 gap-y-10">
          {exams.map((exam) => (
            <>
              <ExamCard key={exam.id} exam={exam} />
              {/* <ExamCard key={exam.id} exam={exam} />
              <ExamCard key={exam.id} exam={exam} />
              <ExamCard key={exam.id} exam={exam} />
              <ExamCard key={exam.id} exam={exam} /> */}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};



export default ExamListPage;