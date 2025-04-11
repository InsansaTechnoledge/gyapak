import { useState } from 'react';
import ExamCard from './ExamCard';
import examData from '../../constants/data';

const examCategories = [
  { id: 'all', name: 'All Exams' },
  { id: 'upsc', name: 'UPSC' },
  { id: 'banking', name: 'Banking' },
  { id: 'ssc', name: 'SSC' },
  { id: 'railways', name: 'Railways' },
  { id: 'defence', name: 'Defence' },
  { id: 'state', name: 'State PSC' }
];

export default function ExamsSection() {
  const [activeTab, setActiveTab] = useState('all');

  const filteredExams =
    activeTab === 'all'
      ? examData.featuredExams
      : examData.featuredExams.filter((exam) => exam.category === activeTab);

  return (
    <section id="exams" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Popular Test Series
          </h2>
          <p className="text-lg text-gray-700 mt-4">
            Comprehensive and up-to-date test series for all major government exams
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-8 overflow-x-auto pb-2 space-x-2">
          {examCategories.map((category) => (
            <button
              key={category.id}
              className={`px-4 py-2 text-sm md:text-base rounded-lg transition-all whitespace-nowrap ${
                activeTab === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <button className="px-6 py-3 border-2 border-primary text-primary hover:bg-blue-50 rounded-lg font-medium transition-all">
            View All Test Series
          </button>
        </div>
      </div>
    </section>
  );
}
