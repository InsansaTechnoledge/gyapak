import { ChevronRight, Star } from 'lucide-react';

export default function ExamCard({ exam }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all cursor-pointer">
      <div className="p-6">
        <div className="flex items-center">
          <img
            src={exam.image}
            alt={exam.title}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="ml-4">
            <h3 className="font-bold text-lg text-gray-900">{exam.title}</h3>
            <div className="flex items-center text-sm">
              <Star size={14} className="text-yellow-500 fill-current" />
              <span className="ml-1">{exam.rating}</span>
              <span className="mx-1 text-gray-400">•</span>
              <span>{exam.students} students</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <div className="bg-blue-50 text-primary px-3 py-1 rounded-full text-xs font-medium">
            {exam.tests} Tests
          </div>
          <div className="text-right">
            <div className="text-gray-500 line-through text-sm">{exam.discount}</div>
            <div className="font-bold text-gray-900">{exam.price}</div>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 p-4 flex justify-between items-center">
        <div className="text-sm text-gray-700">Updated for 2025</div>
        <div className="flex items-center text-primary font-medium text-sm">
          View Details <ChevronRight size={16} className="ml-1" />
        </div>
      </div>
    </div>
  );
}
