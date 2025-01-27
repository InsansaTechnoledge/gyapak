import React, { useEffect, useState } from 'react'
import RelatedStatesCard from './RelatedStatesCard';

const RelatedStates = (props) => {
    const [states, setStates] = useState([]);
    
    useEffect(() => {
        if(props.states){
            setStates(props.states);
        }
    }, [props]);

    return (
        <>
            <div className="grid grid-cols-4 mb-5 gap-4">
                {states.map((state, key) => (
                    <RelatedStatesCard key={key} name={state.name} logo={state.logo} id={state._id} />
                ))}
            </div>
            
        </>
    );
}

export default RelatedStates;