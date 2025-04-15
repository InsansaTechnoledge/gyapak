import { ArrowRight, Calendar, Clock, Users } from 'lucide-react';
import React from 'react'
import { useNavigate } from 'react-router-dom';

const ExamCard = ({ exam }) => {
    const navigate = useNavigate();

    return (
        // <div 
        //   onClick={() => navigate(`/exam/${exam.id}`)}
        //   className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 flex flex-col"
        // >
        //   <div className="h-2 bg-purple-600"></div>

        //   <div className="p-8">
        //     <h3 className="text-2xl font-bold text-gray-800 mb-3">{exam.title}</h3>
        //     <p className="text-gray-600 mb-6 line-clamp-2">{exam.description}</p>

        //     <div className="grid grid-cols-2 gap-4 mb-6">
        //       {exam.duration && (
        //         <div className="flex items-center text-gray-500">
        //           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
        //             <Clock size={20} className="text-purple-600" />
        //           </div>
        //           <div>
        //             <p className="text-xs text-gray-400">Duration</p>
        //             <p className="font-medium">{exam.duration} minutes</p>
        //           </div>
        //         </div>
        //       )}

        //       {exam.date && (
        //         <div className="flex items-center text-gray-500">
        //           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
        //             <Calendar size={20} className="text-purple-600" />
        //           </div>
        //           <div>
        //             <p className="text-xs text-gray-400">Date</p>
        //             <p className="font-medium">{new Date(exam.date).toLocaleDateString()}</p>
        //           </div>
        //         </div>
        //       )}

        //       {exam.participants !== undefined && (
        //         <div className="flex items-center text-gray-500">
        //           <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
        //             <Users size={20} className="text-purple-600" />
        //           </div>
        //           <div>
        //             <p className="text-xs text-gray-400">Participants</p>
        //             <p className="font-medium">{exam.participants}</p>
        //           </div>
        //         </div>
        //       )}
        //     </div>

        //     <div className="flex justify-end mt-4">
        //       <button className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg flex items-center font-medium transition-colors duration-200">
        //         Start Exam
        //         <ArrowRight size={18} className="ml-2" />
        //       </button>
        //     </div>
        //   </div>
        // </div>
        // <div className='border rounded-md p-5 relative'>
        //     <div className='flex gap-5'>
        //         <div className='border rounded-md p-5 flex flex-grow'>
        //             <div className='my-auto  mx-auto'>  
        //                 JEE Mains
        //             </div>
        //         </div>
        //         {/* <div className='border rounded-md p-5 flex-grow'>
        //             <div className='text-sm'>
        //                 Hosted by
        //             </div>
        //             <div className='text-xl'>
        //                 Insansa Techknowledge
        //             </div>
        //         </div> */}
        //     </div>
        //     {/* <div className='border rounded-md p-5 mt-5'>
        //         Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quis molestiae aliquid delectus corrupti, rem qui voluptas earum sapiente sed maxime!
        //     </div> */}
        //     <div className='flex gap-5 mt-5'>
        //         <div className='border rounded-md p-5 flex flex-grow'>
        //             <span className='mx-auto'>
        //                 20+ Events
        //             </span>
        //         </div>
        //         {/* <button className='border rounded-md p-5 flex-grow'>
        //             View Exam
        //         </button> */}
        //     </div>

        //     <div className='absolute transform rotate-[20deg] top-0 right-0 translate-x-4/12 translate-y-1/12 border rounded-md p-3 flex flex-col shadow-xl bg-white'>
        //         <div className='p-1 bg-amber-900 rounded-full w-min mx-auto'></div>
        //         <div className='mt-4'>Insansa Techknowledge</div>
        //     </div>
        // </div>
        <div className='group border-purple-700 border-2 rounded-md p-5 relative transition-all duration-500 hover:shadow-lg h-min bg-gradient-to-br from bg-purple-50 to-purple-200 shadow-lg'>
            <div className='flex gap-5'>
                <div className='rounded-md p-5 flex flex-grow bg-purple-500/20 font-bold text-2xl'>
                    <div className='my-auto mx-auto'>
                        {exam.title}
                    </div>
                </div>
                
            </div>

            <div className='
            bg-purple-500/20 font-semibold text-sm
            origin-top opacity-0 max-h-0 scale-x-0 transition-all duration-500 group-hover:scale-x-100 group-hover:scale-y-100 group-hover:opacity-100 rounded-md group-hover:p-5 group-hover:mt-5 group-hover:max-h-none'>
                {exam.description}
            </div>

            <div className='flex group-hover:gap-5 mt-5'>
                <div className=' rounded-md p-2 group-hover:p-5 flex flex-grow bg-purple-500/20 font-semibold'>
                    <span className='mx-auto'>
                        {exam.events.length}+ Tests
                    </span>
                </div>
                <button 
                onClick={()=>navigate(exam.id)}
                className='
                bg-purple-700/70 text-white font-bold
                hover:cursor-pointer
                origin-top opacity-0 max-h-0 max-w-0 scale-x-0 transition-all duration-500 group-hover:max-w-none group-hover:scale-x-100 group-hover:scale-y-100 group-hover:opacity-100 rounded-md group-hover:p-5 group-hover:max-h-none'>
                    View Exam
                </button>
            </div>

            <div className='
            border-purple-900
            min-w-fit
            absolute transform rotate-[20deg] top-0 right-0 translate-x-4/12 translate-y-1/12 border-2 rounded-md p-3 flex flex-col shadow-xl bg-white'>
                <div className='p-1 bg-purple-900 rounded-full w-min mx-auto'></div>
                <div className='mt-4 max-w-42 text-wrap text-purple-900 font-semibold text-center text-sm'>Insansa Techknowledge</div>
            </div>
        </div>




    )
}

export default ExamCard