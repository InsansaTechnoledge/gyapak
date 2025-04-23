import React, { useEffect } from 'react'
import { getResultForEvent } from '../../service/testResult.service';

const ResultDisplay = ({eventId}) => {
    
    useEffect(()=>{
        const fetchResult = async () => {
            const response = await getResultForEvent(eventId);
            if(response.status==200){
                console.log(response);
            }
        }

        fetchResult();
    },[])
    
    return (
        <div className='flex flex-col'>
            wegq3
        </div>
    )
}

export default ResultDisplay