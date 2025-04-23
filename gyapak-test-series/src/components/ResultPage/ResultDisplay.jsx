import React, { useEffect } from 'react'
import { fetchResultForEvent } from '../../../../Server/Utility/SQL-Queries/testResult.query'

const ResultDisplay = ({eventId}) => {
    
    useEffect(()=>{
        const fetchResult = async () => {
            const response = await fetchResultForEvent(eventId);
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