import React from 'react'

const SchemeOfExamSection1 = ({data,existingSections}) => {
  if(!data.details.scheme_of_exam || !data.details.scheme_of_exam.IMA_INA_AirForce){
    return null;
  }
  else{
    existingSections.push("scheme_of_exam");
  }

    return (
        <div className="flex-grow p-6 bg-purple-100 rounded-xl">
          <h3 className="text-xl font-bold mb-4">IMA, INA, Air Force Academy</h3>
          <div className="space-y-3">
            {Object.entries(data.details.scheme_of_exam.IMA_INA_AirForce.subjects).map(([subject, marks]) => (
              <div key={subject} className="flex justify-between items-center p-3 bg-white rounded-lg">
                <span className="capitalize text-purple-500">{subject.replace(/_/g, " ")}</span>
                <span className="font-bold text-purple-500">{marks} marks</span>
              </div>
            ))}
            <div className="mt-4 p-3 bg-purple-200 rounded-lg">
              <div className="flex justify-between items-center font-bold">
                <span>Total Marks</span>
                <span>{data.details.scheme_of_exam.IMA_INA_AirForce.total_marks}</span>
              </div>
            </div>
          </div>
        </div>
      )
}

export default SchemeOfExamSection1