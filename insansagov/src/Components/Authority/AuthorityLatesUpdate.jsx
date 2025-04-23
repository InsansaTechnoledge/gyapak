import React, { useState } from 'react'
import LatestUpdateCard from '../Updates/LatestUpdateCard'
import ViewMoreButton from '../Buttons/ViewMoreButton'

const AuthorityLatestUpdates = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [latestUpdates,setLatestUpdates] = useState(props.latestUpdates);
  const [filteredLatestUpdates, setFilteredLatestUpdates] = useState(props.latestUpdates.slice(0,2));

  const handleToggle = () => {
    setIsExpanded(!isExpanded);

    if(!isExpanded){
      setFilteredLatestUpdates(latestUpdates);
    }
    else{
      setFilteredLatestUpdates(latestUpdates.slice(0,2));
    }
  };

  return (
    <>
        <div className='flex justify-between mb-5'>
            <div className='font-bold text-2xl flex items-center'>Latest Updates</div>
            {latestUpdates.length >2 &&(
        <ViewMoreButton
          content={isExpanded ? "view less ▲" : "View More ▼"}
          onClick={handleToggle}
        />
      )}
        </div>

      {
        props.titleHidden
          ? null
        :
          <div className='space-y-5 mb-10'>
            {
              filteredLatestUpdates && filteredLatestUpdates.map((update, key) => {
                return <LatestUpdateCard key={key} id={update._id} name={update.name} date={update.updatedAt} organization={props.name} apply_link={update.apply_link}/>
              })
            }

          </div>
      }
    </>
  )
}

export default AuthorityLatestUpdates