import { Trophy } from 'lucide-react'
import React from 'react'

const Step = ({step}) => {
  return (
    <>
        <div className='flex-col flex justify-between'>
            <div className='relative flex mx-auto my-10 w-3/5'>
                <div className='p-5 rounded-full bg-purple-300 relative left-2.5'>
                    <Trophy className='w-full h-full ' />
                </div>
                <div className='bg-purple-700 text-white rounded-full px-2 py-1 w-min h-min my-auto border-2 border-white relative -left-2.5'>
                    0{step}
                </div>
            </div>
            <div>
                <h3 className='text-xl font-bold text-center'>Lorem, ipsum.</h3>
                <div className='text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit. </div>
            </div>
        </div>
    </>
  )
}

export default Step