import { useEffect, useState, useRef } from 'react';
import { 
  Search, Calendar, Tag, Filter, MoreHorizontal, Clock, 
  ExternalLink, RefreshCw, X, ChevronDown, AlertTriangle,
  Image as ImageIcon, Film, Volume2, BookOpen
} from 'lucide-react';
import {
  fetchCurrentAffairs,
  fetchTodaysAffairs,
  fetchMonthlyAffairs,
  fetchYearlyAffairs
} from '../../Service/currentAffairService';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

// Helper function to format content preview with bullet points
const formatContentPreview = (content, maxLength = 200) => {
  if (!content) return content;
  
  // Truncate content if too long
  let truncatedContent = content.length > maxLength ? content.substring(0, maxLength) + '...' : content;
  
  // Split content into lines and format
  const lines = truncatedContent.split('\n').map(line => line.trim()).filter(line => line);
  
  return lines.map((line, index) => {
    // Check if line starts with bullet point indicators
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      return (
        <div key={index} className="flex items-start mb-1">
          <span className="text-blue-600 mr-2 mt-0.5 text-sm">•</span>
          <span className="text-sm">{line.substring(1).trim()}</span>
        </div>
      );
    }
    // Regular paragraph
    return (
      <div key={index} className="mb-1 text-sm">
        {line}
      </div>
    );
  });
};

export default function CurrentAffairsBlog() {
  const [affairs, setAffairs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMediaType, setSelectedMediaType] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const tabRefs = useRef({});


  const toDetail = (affair) => {
    const datePart = affair.date?.split('T')[0];
    const titleSlug = affair.title?.toLowerCase().replace(/\s+/g, '-');
    navigate(`/current-affairs/${datePart}/${titleSlug}`);
  };

  const fetchData = async (tab = activeTab) => {
    setLoading(true);
    setError(null);
  
    try {
      let res;
      switch (tab) {
        case 'today':
          res = await fetchTodaysAffairs();
          break;
        case 'monthly': {
          const currentDate = new Date();
          const month = selectedMonth || currentDate.getMonth() + 1;
          const year = selectedYear || currentDate.getFullYear();
          res = await fetchMonthlyAffairs(month, year);
          break;
        }
        case 'yearly': {
          const currentYear = new Date().getFullYear();
          res = await fetchYearlyAffairs(selectedYear || currentYear);
          break;
        }
        case 'all':
          res = await fetchCurrentAffairs();
          break;
        // default:
      }
  
    //   console.log("🧪 Raw Response:", res.data);
  
      const records = Array.isArray(res.data) ? res.data : [];
  
      let flattened = [];
      records.forEach(record => {
        if (Array.isArray(record.affairs) && record.affairs.length > 0) {
          record.affairs.forEach(affair => {
            flattened.push({
              ...affair,
              date: record.date,
              mediaType: affair.videoUrl
                ? 'video'
                : affair.imageUrl
                ? 'image'
                : 'text',
              mediaUrl: affair.videoUrl || affair.imageUrl || null
            });
          });
        }
      });

      if (tab === 'all') {
        flattened.sort((a, b) => new Date(b.date) - new Date(a.date));
      }
  
    //   console.log("📦 Flattened Affairs:", flattened);
      setAffairs(flattened);
    } catch (e) {
    //   console.error("❌ Error fetching current affairs", e);
      setError("Failed to load current affairs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchData();

    // if (tabRefs.current[activeTab]) {
    tabRefs.current[activeTab].scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest"
    });
  // }
  }, [activeTab]);

  const categories = [...new Set(affairs.map(item => item.category))];
  const years = [...new Set(affairs.map(item => item.date?.split('-')[0]))];
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
  
  const mediaTypes = ["image", "video", "audio", "text"];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const handleTabChange = (tab) => {
    
    setActiveTab(tab);
    fetchData(tab);
    
  };

  const handleRefresh = () => {
    fetchData(activeTab);
  };

  const getMediaTypeIcon = (mediaType) => {
    switch (mediaType) {
      case 'image':
        return <ImageIcon size={16} />;
      case 'video':
        return <Film size={16} />;
      case 'audio':
        return <Volume2 size={16} />;
      case 'text':
      default:
        return <BookOpen size={16} />;
    }
  };

  const filteredAffairs = affairs.filter(affair => {
    const matchesSearch = searchTerm === '' ||
      affair.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      affair.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || affair.category === selectedCategory;
    const matchesYear = selectedYear === '' || affair.date?.startsWith(selectedYear);
    const matchesMonth = selectedMonth === '' ||
      affair.date?.split('-')[1] === String(monthNames.findIndex(m => m === selectedMonth) + 1).padStart(2, '0');
    const matchesMediaType = selectedMediaType === '' || affair.mediaType === selectedMediaType;
    
    return matchesSearch && matchesCategory && matchesYear && matchesMonth && matchesMediaType;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const groupedAffairs = filteredAffairs.reduce((groups, affair) => {
    const date = affair.date?.split('T')[0];
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(affair);
    return groups;
  }, {});

  const sortedDates = Object.keys(groupedAffairs).sort((a, b) => new Date(b) - new Date(a));

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedYear('');
    setSelectedMonth('');
    setSelectedMediaType('');
    setSearchTerm('');
  };

  const tabClassName = (tab) => 
    `px-4 py-2 text-sm font-medium ${activeTab === tab 
      ? 'bg-purple-100 text-purple-800 rounded-md font-semibold' 
      : 'text-gray-600 hover:text-purple-700'} cursor-pointer transition-colors`;

  const renderMedia = (affair) => {
    if (!affair.mediaUrl) return null;
    
    switch (affair.mediaType) {
      case 'image':
        return (
          <div className="mb-4 relative rounded-lg overflow-hidden bg-gray-100">
            <img 
              src={affair.mediaUrl || "/api/placeholder/800/450"} 
              alt={affair.title} 
              className="w-full h-auto object-contain max-h-64"
              onError={(e) => {
                e.target.src = "/api/placeholder/800/450";
                e.target.alt = "Image unavailable";
              }}
            />
          </div>
        );
      case 'video':
        return (
          <div className="mb-4 relative aspect-video rounded-lg overflow-hidden">
            <video 
              src={affair.mediaUrl} 
              className="w-full h-full object-cover" 
              controls
              poster="/api/placeholder/800/450"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case 'audio':
        return (
          <div className="mb-4 bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center mb-2">
              <Volume2 className="text-purple-700 mr-2" />
              <span className="text-purple-800 font-medium">Audio Content</span>
            </div>
            <audio controls className="w-full">
              <source src={affair.mediaUrl} />
              Your browser does not support the audio element.
            </audio>
          </div>
        );
      default:
        return null;
    }
  };

  const getFeaturedAffair = () => {
    if (filteredAffairs.length === 0) return null;
  
    const sortedAffairs = [...filteredAffairs].sort((a, b) => new Date(b.date) - new Date(a.date));
    const mediaAffairs = sortedAffairs.filter(
      affair => affair.mediaType === 'image' || affair.mediaType === 'video'
    );
  
    const candidates = mediaAffairs.length > 0 ? mediaAffairs : sortedAffairs;
    
    return candidates[0];
  };
  

  const featuredAffair = getFeaturedAffair();
  const remainingAffairs = featuredAffair 
    ? filteredAffairs.filter(affair => affair !== featuredAffair)
    : filteredAffairs;

  return (
    <>
    <Helmet>
        <title>Current Affairs</title>
        <meta name="description" content="gyapak.in is a trusted source for the latest government exam updates, including exam dates, notifications, admit cards, and results for both central and state government departments. Stay updated with real-time information on competitive exams, application deadlines, and result announcements!" />
        <meta name="keywords" content="government competitive exams after 12th,government organisations, exam sarkari results, government calendar,current affairs,top exams for government jobs in india,Upcoming Government Exams" />
        <meta property="og:title" content="gyapak" />
        <meta property="og:description" content="Find the latest updates on government exams, admit cards, results, and application deadlines for central and state government jobs." />
      </Helmet>
    
    <div className="min-h-screen px-2 sm:px-4">
      {/* Header */}
      <header className="bg-white  pt-32 mx-auto ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
    <div className="flex justify-between items-center">
      {/* Logo & Title */}
      <div className="flex-1 text-center md:text-left">
  <h1 className="text-5xl font-bold text-purple-800 mb-3 relative inline-block">
    <span className="relative z-10">Current Affairs</span>
    <span className="absolute -bottom-2 left-0 w-full h-2 bg-purple-200 transform -rotate-1 rounded z-0"></span>
  </h1>
  <p className="text-lg text-gray-600 mt-1 max-w-xl mx-auto md:mx-0">
    Curated headlines & insights from <span className="text-purple-700 font-semibold">gyapak</span>.
  </p>
</div>


      {/* Search Bar */}
      <div className="relative w-full max-w-md hidden md:block">
        <input
          type="text"
          placeholder="Search current affairs..."
          className="w-full pl-10 pr-10 py-2  rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        {searchTerm && (
          <button
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
            onClick={() => setSearchTerm('')}
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>

    {/* Tabs */}
    <div className="mt-5 border-gray-100 pt-4">

  {/* Horizontal Scroll on Mobile, Wrap on Desktop */}
  <div className="flex gap-3 p-3  overflow-x-auto scrollbar-hide md:flex-wrap md:overflow-visible">
    {['all','monthly', 'yearly', 'today'].map((tab, index, tabs) => (
      
      <button
        key={tab}
        ref={(el)=>(tabRefs.current[tab] = el)} //adding current tab ref
        className={`px-4 py-2 text-sm whitespace-nowrap font-medium rounded-full transition focus:ring-2 outline-none ring-purple-300 ring-offset-2 ${
          activeTab === tab
            ? 'bg-purple-100 text-purple-800 shadow-sm'
            : 'text-gray-600 hover:text-purple-600 hover:bg-gray-100'
        }`}
        onClick={() => handleTabChange(tab)}
      >
        {tab === 'all' && 'All Affairs'}
        {tab === 'today' && "Today's Highlights"}
        {tab === 'monthly' && 'Monthly Archive'}
        {tab === 'yearly' && 'Yearly Archive'}
        
      </button>
    ))}

 

  </div>
  <div className="mt-2 flex justify-center md:hidden">
    <div className="h-[3px] w-16 bg-purple-300 rounded-full"></div>
  </div>

</div>


    {/* Filters (optional, toggle below this header) */}
    {showFilters && (
      <div className="mt-4">{/* Your filter section here */}</div>
    )}
  </div>
</header>


      {/* Main Content */}
      <main className="container mx-auto px-0 md:px-4 mt-2 pb-12">
           {
        loading ? (
          <div className="flex justify-center py-20">
            <div className="bg-white p-8 rounded-lg shadow-sm pt-28 text-center">
              <div className="animate-spin w-12 h-12 border-4 border-purple-300 border-t-purple-600 rounded-full mx-auto mb-4"></div>
              <p className="text-gray-600">Loading current affairs...</p>
            </div>
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 pt-48 rounded-lg text-center">
            <AlertTriangle size={48} className="mx-auto text-red-500 mb-4" />
            <h3 className="text-xl font-medium text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
              onClick={handleRefresh}
            >
              Try Again
            </button>
          </div>
        ) : filteredAffairs.length > 0 ? (
          <>
            {/* Featured Story */}
            {featuredAffair && (
        <div className="mb-12">
          <div       onClick={() => toDetail(featuredAffair)}
      className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            {(featuredAffair.mediaType === 'image' && featuredAffair.mediaUrl) && (
              <div className="relative bg-gray-100 rounded-t-xl overflow-hidden">
                <img 
                  src={featuredAffair.mediaUrl || "/api/placeholder/1200/400"} 
                  alt={featuredAffair.title} 
                  className="w-full h-auto object-contain max-h-[420px]"
                  onError={(e) => {
                    e.target.src = "/api/placeholder/1200/400";
                    e.target.alt = "Image unavailable";
                  }} 
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {featuredAffair.category}
                  </span>
                </div>
              </div>
            )}

            {(featuredAffair.mediaType === 'video' && featuredAffair.mediaUrl) && (
              <div className="relative aspect-video w-full">
                <video 
                  src={featuredAffair.mediaUrl} 
                  className="w-full h-full object-cover" 
                  controls
                  poster="/api/placeholder/1200/400"
                >
                  Your browser does not support the video tag.
                </video>
                <div className="absolute top-4 left-4">
                  <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                    {featuredAffair.category}
                  </span>
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span className="flex items-center">
                  <Clock size={14} className="mr-1" />
                  {formatDate(featuredAffair.date)}
                </span>
                {featuredAffair.mediaType && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      {getMediaTypeIcon(featuredAffair.mediaType)}
                      <span className="ml-1">{featuredAffair.mediaType.charAt(0).toUpperCase() + featuredAffair.mediaType.slice(1)}</span>
                    </span>
                  </>
                )}
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-3 hover:text-purple-700 transition-colors">
                {featuredAffair.title}
              </h3>

              <div className="text-gray-700 mb-5 leading-relaxed text-lg">
                {formatContentPreview(featuredAffair.content, 400)}
              </div>

              <div className="flex flex-wrap gap-2 mb-5">
                {featuredAffair.tags?.map((tag, idx) => (
                  <span key={idx} className="inline-flex items-center text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                    <Tag size={12} className="mr-1" />
                    {tag}
                  </span>
                ))}
              </div>

              {featuredAffair.source && (
                <div className="flex items-center text-sm text-purple-600 hover:text-purple-800">
                  <ExternalLink size={14} className="mr-1" />
                  <a href={featuredAffair.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    Source: {featuredAffair.source.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}


            {/* Regular Stories by Date */}
        {sortedDates.map(date => {
        const dateAffairs = groupedAffairs[date];
        const nonFeaturedAffairs = dateAffairs.filter(affair => affair !== featuredAffair);

        if (nonFeaturedAffairs.length === 0) return null;

        return (
          <div key={date} className="mb-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                <Calendar className="text-purple-700" size={20} />
              </div>
              <h2 className="text-lg font-bold text-purple-800">{formatDate(date)}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nonFeaturedAffairs.map((affair, index) => (
                <article onClick={() => toDetail(affair)}
                key={index} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
                  <div className="p-6">
                    {renderMedia(affair)}

                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
                        {affair.category}
                      </span>
                      <div className="flex gap-2 items-center">
                        {affair.mediaType && (
                          <span className="flex items-center text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {getMediaTypeIcon(affair.mediaType)}
                            <span className="ml-1">{affair.mediaType.charAt(0).toUpperCase() + affair.mediaType.slice(1)}</span>
                          </span>
                        )}
                        <span className="flex items-center text-sm text-gray-500">
                          <Clock size={14} className="mr-1" />
                          {formatDate(affair.date)}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-700 transition-colors">
                      {affair.title}
                    </h3>

                    <div className="text-gray-700 mb-5 leading-relaxed">
                      <div className="line-clamp-3">
                        {formatContentPreview(affair.content, 150)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-5">
                      {affair.tags && affair.tags.map((tag, idx) => (
                        <span key={idx} className="inline-flex items-center text-xs text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                          <Tag size={12} className="mr-1" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {affair.source && (
                      <div className="flex items-center text-sm text-purple-600 hover:text-purple-800">
                        <ExternalLink size={14} className="mr-1" />
                        <a href={affair.source} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          Source: {affair.source.replace(/(^\w+:|^)\/\//, '').split('/')[0]}
                        </a>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        );
      })}

          </>
        ) : (
          <div className="flex justify-center py-20">
            <div className="bg-white p-8 rounded-lg shadow-sm text-center max-w-md">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MoreHorizontal size={24} className="text-purple-700" />
              </div>
              <h3 className="text-xl font-medium text-gray-800 mb-2">No current affairs found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search or filters to find what you're looking for</p>
              <button 
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 font-medium"
                onClick={clearFilters}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </main> 
    </div>
    </>
  );
}