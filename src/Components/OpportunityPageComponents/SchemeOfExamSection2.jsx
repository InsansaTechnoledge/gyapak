import React from 'react'

const SchemeOfExamSection2 = ({data,existingSections}) => {
  if(!data.details.scheme_of_exam){
    return null;
  }
  else{
    existingSections.push("scheme_of_exam");
  }
  return (
    <div className="flex-grow p-6 bg-blue-100 rounded-xl">
      <h3 className="text-xl font-bold mb-4">Subjects</h3>
      <div className="space-y-3">
      {
        data.details.scheme_of_exam.subjects
        ?
        Object.entries(data.details.scheme_of_exam.subjects).map(([subject, marks]) => (
          <div key={subject} className="flex justify-between items-center p-3 bg-white rounded-lg">
            <span className="capitalize text-blue-500">{subject.replace(/_/g, " ")}</span>
            <span className="font-bold text-blue-500"> duration: {marks.duration}</span>
            <span className="font-bold text-blue-500">{marks.marks} marks</span>
          </div>
        ))
        :
        null
      }
      {/* {
        data.details.scheme_of_exam.OTA.total_marks
        ?
        <div className="mt-4 p-3 bg-blue-200 rounded-lg">
          <div className="flex justify-between items-center font-bold">
            <span>Total Marks</span>
            <span>{data.details.scheme_of_exam.OTA.total_marks}</span>
          </div>
        </div>
        :
        null
      } */}
      </div>
    </div>
  )
}

export default SchemeOfExamSection2