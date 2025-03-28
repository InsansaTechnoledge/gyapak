import React, { useState } from 'react'
import CentralEvent from '../Components/CentralEvent';
import StateEvent from '../Components/StateEvent';
import FloatingOrbsBackground from '../Components/FloatingOrbsBackground';

const DataInsertion = () => {
    // comment
    const [organizationType, setOrganizationType] = useState();
    return (
        <>
            <FloatingOrbsBackground />
            <div className=' w-2/3 mx-auto'>

                <div className='grid grid-cols-2 w-2/3 mx-auto gap-5 py-10'>
                    <button className='bg-purple-600 p-5 rounded-md font-bold text-white text-xl' onClick={() => setOrganizationType("Central")}>Central Organization</button>
                    <button className='bg-purple-600 p-5 rounded-md font-bold text-white text-xl' onClick={() => setOrganizationType("State")}>State Organization</button>
                </div>
                {
                    organizationType === "Central"
                        ?
                        <CentralEvent />
                        :
                        organizationType === "State"
                            ?
                            <StateEvent />
                            :
                            null
                }

            </div>
        </>

    )
}

export default DataInsertion