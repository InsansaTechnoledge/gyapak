import React, { useEffect, useState } from 'react'
import Search from '../../Components/Search/Search'
import TopAuthorities from '../../Components/Authority/TopAuthorities'
import { useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import API_BASE_URL from '../config'
import RelatedAuthorities from '../../Components/Authority/RelatedAuthorities'
import RelatedCategories from '../../Components/Categories/RelatedCategories'
import RelatedStates from '../../Components/States/RelatedStates'
import MoreAuthorities from '../../Components/Authority/MoreAuthorities'
import MoreOrganizations from '../../Components/Authority/MoreOrganizations'
import MoreCategories from '../../Components/Authority/MoreCategories'
import { RingLoader } from 'react-spinners'
import no_search_image from '../../assets/Landing/no_search.jpg'
import {Helmet} from 'react-helmet-async'

const SearchPage = () => {
  const location = useLocation();
  const [query, setQuery] = useState();
  const queryParams = new URLSearchParams(location.search);
  const [searchData, setSearchData] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSearch = async () => {
      const queryData = queryParams.get("query");
      setQuery(queryData);
      const response = await axios.get(`${API_BASE_URL}/api/search/result/${queryData}`);

      if (response.status === 200) {
        console.log(response.data);
        setSearchData(response.data);
      }
    }

    fetchSearch();
  }, [location])

  const searchHandler = (input) => {
    navigate(`/search?query=${encodeURIComponent(input)}`);
  }

  if (!searchData) {
    return <div className='w-full h-screen flex justify-center'>
      <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
    </div>
  }

  return (
    <>
      <Helmet>
        <title>gyapak</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government exams, exam dates, admit cards, results, central government jobs, state government jobs, competitive exams, government jobs" />
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>
    <div className='pt-28'>
      <div className='flex justify-center mb-10'>
        <Search input={query} searchHandler={searchHandler} />
      </div>
      {
        searchData && searchData.authorities.length == 0 && searchData.categories.length == 0 && searchData.organizations.length == 0
          ?
          <>
            <h3 className='font-bold text-center text-2xl'>No match found for "{query}"</h3>
            <img src={no_search_image} className='w-5/12 mx-auto'/>
          </>
          :
          <div className='text-2xl xl:text-3xl font-bold text-gray-900 mb-5'>Your search result for "{query}"</div>

      }
      {
        searchData && searchData.authorities && searchData.authorities.length > 0
          ?
          <>
            <h1 className='text-lg mb-3'>States</h1>
            <RelatedStates states={searchData.authorities} />
          </>
          :
          null
      }
      {
        searchData && searchData.organizations && searchData.organizations.length > 0
          ?
          (
            <>
              <h1 className='text-lg mb-3'>Organizations</h1>
              <RelatedAuthorities organizations={searchData.organizations} />
            </>
          )
          :
          null
      }
      {
        searchData && searchData.categories && searchData.categories.length > 0
          ?
          <>
            <h1 className='text-lg mb-3'>Categories</h1>
            <RelatedCategories categories={searchData.categories} />
          </>
          :

          null
      }
      {
        searchData && searchData.authorities && searchData.authorities.length > 0
          ?
          <>
            <MoreAuthorities currentAuthority={searchData.authorities[0]} />

          </>
          :
          searchData && searchData.organizations && searchData.organizations.length > 0
            ?
            <>
              {/* {getMoreOrganizations(searchData.organizations[0].category)} */}
              <MoreOrganizations currentOrganization={searchData.organizations[0]} />

            </>
            :
            searchData && searchData.categories && searchData.categories.length > 0
              ?
              <>

                <MoreCategories currentCategory={searchData.categories[0]} />

              </>
              :
              null
      }
      {/* <TopAuthorities titleHidden={true}/> */}
    </div>
    </>
  )
}

export default SearchPage
