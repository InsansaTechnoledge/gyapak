import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useApi } from '../../Context/ApiContext';

const ExamCalendar = ({ organizationId }) => {
  const { apiBaseUrl } = useApi();
  const [examLink, setExamLink] = useState();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const [error, setError] = useState(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (organizationId) {
      const fetchCalendar = async () => {
        try {
          setLoading(true);
          setError(null);
          const response = await axios.get(`${apiBaseUrl}/api/organization/calendar/${organizationId}`);
          if (response.status === 200) {
            setExamLink(response.data.calendar);
          }
        } catch (err) {
          console.error('Failed to fetch calendar:', err);
          setError('Unable to load exam calendar. Please try again later.');
          setLoading(false);
        }
      };

      fetchCalendar();
    }
  }, [organizationId, apiBaseUrl]);

  useEffect(() => {
    if (!examLink) return;

    const loadPdf = async () => {
      try {
        if (!window.pdfjsLib) {
          setError('PDF.js library not loaded. Please check your connection and refresh the page.');
          setLoading(false);
          return;
        }

        const pdfjsLib = window.pdfjsLib;

        const loadingTask = pdfjsLib.getDocument({
          url: examLink,
          withCredentials: false,
          cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/cmaps/',
          cMapPacked: true
        });

        const pdf = await loadingTask.promise;

        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setLoading(false);
        renderPage(pdf, 1);
      } catch (error) {
        console.error('Error initializing PDF viewer:', error);
        setError('Failed to load the PDF. Please check your connection and try again.');
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(loadPdf, 100);
    return () => clearTimeout(timeoutId);
  }, [examLink]);

  useEffect(() => {
    if (pdfDocument) {
      renderPage(pdfDocument, currentPage);
    }
  }, [scale, currentPage]);

  const renderPage = async (pdf, pageNumber) => {
    if (!pdf) return;

    try {
      const page = await pdf.getPage(pageNumber);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: viewport
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
      setError(`Failed to render page ${pageNumber}. Please try again.`);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleZoomIn = () => {
    setScale(prevScale => Math.min(3.0, prevScale + 0.2));
  };

  const handleZoomOut = () => {
    setScale(prevScale => Math.max(0.5, prevScale - 0.2));
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if (containerRef.current.mozRequestFullScreen) {
        containerRef.current.mozRequestFullScreen();
      } else if (containerRef.current.webkitRequestFullscreen) {
        containerRef.current.webkitRequestFullscreen();
      } else if (containerRef.current.msRequestFullscreen) {
        containerRef.current.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleRetry = () => {
    setError(null);
    setLoading(true);
    if (organizationId) {
      const fetchCalendar = async () => {
        try {
          const response = await axios.get(`${apiBaseUrl}/api/organization/calendar/${organizationId}`);
          if (response.status === 200) {
            setExamLink(response.data.calendar);
          }
        } catch (err) {
          console.error(err);
          setError('Failed to load the calendar. Please try again later.');
          setLoading(false);
        }
      };

      fetchCalendar();
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
        <p className="mt-4 text-indigo-600 font-medium">Loading exam calendar...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-red-50 p-6 rounded-lg shadow-sm">
        <div className="flex flex-col items-center text-center">
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 className="mt-4 text-lg font-medium text-red-800">{error}</h3>
          <button
            onClick={handleRetry}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Custom scrollbar-hiding CSS
  const scrollbarHidingStyle = `
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;

  return (
    <div ref={containerRef} className={`transition-all duration-300 ${isFullscreen ? 'bg-gray-900 p-4' : 'mb-6'}`}>
      {/* Inject CSS for hiding scrollbar */}
      <style>{scrollbarHidingStyle}</style>

      <div className="flex flex-col">
        {/* PDF Viewer Container */}
        <div
          className={`relative overflow-auto hide-scrollbar bg-white ${isFullscreen ? 'rounded-none' : 'rounded-lg shadow-md'}`}
          style={{ maxHeight: isFullscreen ? '100vh' : '70vh' }}
        >
          <div className="flex justify-center min-h-64 hide-scrollbar p-1">
            <canvas ref={canvasRef} className="max-w-full"></canvas>
          </div>
        </div>

        {/* Controls Bar */}
        <div className={`flex items-center justify-between ${isFullscreen ? 'bg-gray-800 text-white mt-2 p-3 rounded-lg' : 'bg-white mt-4 p-2 rounded-lg shadow-sm'}`}>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleZoomOut}
              className={`p-2 rounded-full ${isFullscreen ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              disabled={scale <= 0.5}
              aria-label="Zoom Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
              </svg>
            </button>
            <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
            <button
              onClick={handleZoomIn}
              className={`p-2 rounded-full ${isFullscreen ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              aria-label="Zoom In"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={handlePrevPage}
              className={`p-2 rounded-full ${isFullscreen ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
              disabled={currentPage <= 1}
              aria-label="Previous Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>
            <span className="mx-3 text-sm font-medium">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              className={`p-2 rounded-full ${isFullscreen ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50`}
              disabled={currentPage >= totalPages}
              aria-label="Next Page"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-full ${isFullscreen ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
            aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"></path>
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCalendar;