import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getExamWithSubject } from '../../../service/exam.service';
import { getEventAttemptsByUser, getEventsByExamId, updateEventAttempsByUser } from '../../../service/event.service';
import { getSubjectsByEvent } from '../../../service/subject.service';
import { getQuestionsBySubject } from '../../../service/question.service';
import {
  Calendar, Clock, BookOpen, Award, BookMarked, CheckCircle,
  AlertCircle, ChevronDown, ChevronRight, HelpCircle, Info
} from 'lucide-react';
import axios from 'axios'
import { useUser } from '../../../context/UserContext';
import { getResultsByUser } from '../../../service/testResult.service';
import { downloadProctorInstaller } from '../../../utils/utilsDownloadHelper';


const ExamOverview = () => {
  const { examId } = useParams();
  const [exam, setExam] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeEvent, setActiveEvent] = useState(null);
  const [expandedQuestions, setExpandedQuestions] = useState({});
  const [activeTab, setActiveTab] = useState('subjects');
  const navigate = useNavigate();
  const { user } = useUser();
  const [eventAttempts, setEventAttempts] = useState();
  const [results, setResults] = useState();

  useEffect(() => {
    const fetchOverview = async () => {
      setLoading(true);
      try {
        // Fetch exam data
        const examData = await getExamWithSubject(examId);
        console.log(examData);
        setExam(examData.data);

        // Fetch events data
        const eventsData = await getEventsByExamId(examId);
        const eventList = eventsData?.data || [];

        // Fetch subjects and questions for each event
        const eventsWithSubjects = await Promise.all(eventList.map(async (event) => {
          const subjectsRes = await getSubjectsByEvent(event.id);

          const subjects = subjectsRes?.data || [];

          const subjectWithQuestions = await Promise.all(subjects.map(async (sub) => {
            const qRes = await getQuestionsBySubject(sub.id);
            return { ...sub, questions: qRes.data || [] };
          }));

          return { ...event, subjects: subjectWithQuestions };
        }));

        const eventAttemptsArray = await Promise.all(
          eventList.map(async (event) => {
            const res = await getEventAttemptsByUser(event.id);
            return { [event.id]: res.data.attempts };
          })
        );
 
        // Convert array of objects to a single merged object
        const eventAttemptsResponse = Object.assign({}, ...eventAttemptsArray);
        setEventAttempts(eventAttemptsResponse);
        console.log(eventAttemptsResponse);

        const resultResponse = await getResultsByUser(examId);
        setResults(resultResponse.data);
        console.log("RESULTS",resultResponse.data);

        setEvents(eventsWithSubjects);
        if (eventsWithSubjects.length > 0) {
          setActiveEvent(eventsWithSubjects[0].id);
        }
      } catch (err) {
        console.error('Error fetching overview data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchOverview();
  }, [examId]);

  const toggleQuestion = (questionId) => {
    setExpandedQuestions(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCorrectAnswer = (question) => {
    if (!question || !question.answer) return null;
    return question.answer;
  };

  // const handleStartTest = async (eventId) => {
  //   try {
  //     const body = {
  //       userId: user._id,
  //       examId,
  //       eventId
  //     };

  //     const res = await axios.post('http://localhost:8383/api/v1i2/proctor/launch', body);

  //     // Axios parses response automatically
  //     if (res.ok) console.log('🚀 Proctor launched:', res.data.message);





  //   } catch (error) {
  //     const message =
  //       error?.response?.data?.message || error.message || 'Unknown error';
  //     console.error('❌ Error launching proctor:', message);
  //   }
  // };

  const handleStartTest = async (eventId) => {
    try {
      const body = { userId: user._id, examId, eventId };
      const res = await axios.post('http://localhost:8383/api/v1i2/proctor/launch', body);
  
      if (res.data?.downloadRequired) {
        downloadProctorInstaller();
        alert("Proctor Engine will now download. Please install and reopen the test.");
      } else {
        navigate(`/test?userId=${user._id}&examId=${examId}&eventId=${eventId}`);
      }
  
    } catch (error) {
      const message = error?.response?.data?.message || error.message || 'Unknown error';
      console.error('❌ Error launching proctor:', message);
    }
  };

  const handleViewResult = (event_id) => {
    navigate(`/result/${event_id}`);
  }

  useEffect(() => {
    console.log(eventAttempts);
  }, [eventAttempts])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-purple-600 border-purple-200 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-medium text-gray-700">Loading exam overview...</h3>
          <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-xl font-bold text-gray-800">Exam Not Found</h3>
          <p className="text-gray-600 mt-2">We couldn't find the exam information you're looking for.</p>
          <button
            onClick={() => window.history.back()}
            className="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mt-16 mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="h-2 bg-purple-600"></div>
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">{exam.title}</h1>
                <p className="text-gray-600 mt-1">{exam.description}</p>
              </div>
              <div className="mt-4 md:mt-0">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                  {exam.status || 'Active'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Calendar size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Exam Date</p>
                  <p className="font-medium">{exam.date ? new Date(exam.date).toLocaleDateString() : 'Not scheduled'}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Clock size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="font-medium">{exam.duration} minutes</p>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg flex items-center">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <BookOpen size={20} className="text-purple-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Subjects</p>
                  <p className="font-medium">{Array.isArray(exam.subjects) ? exam.subjects.length : 0}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          <div className="flex border-b">
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'subjects' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              onClick={() => setActiveTab('subjects')}
            >
              <BookMarked size={18} className="mr-2" />
              Subjects Overview
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'events' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              onClick={() => setActiveTab('events')}
            >
              <Calendar size={18} className="mr-2" />
              Events & Questions
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'tests' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              onClick={() => setActiveTab('tests')}
            >
              <BookMarked size={18} className="mr-2" />
              Tests
            </button>
            <button
              className={`px-6 py-4 font-medium text-sm flex items-center ${activeTab === 'completed' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-600 hover:text-purple-600'
                }`}
              onClick={() => setActiveTab('completed')}
            >
              <BookMarked size={18} className="mr-2" />
              Results
            </button>
          </div>

          {/* Subject Tab Content */}
          {activeTab === 'subjects' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookMarked size={20} className="mr-2 text-purple-600" />
                Subjects & Weightage
              </h3>

              {Array.isArray(exam.subjects) && exam.subjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {exam.subjects.map((sub, i) => (
                    <div key={i} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                      <div className="p-5">
                        <div className="flex justify-between items-start">
                          <h4 className="text-lg font-bold text-gray-800">{sub.subjects?.name || 'Unnamed Subject'}</h4>
                          <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                            {sub.weightage}%
                          </span>
                        </div>

                        <div className="mt-4">
                          <p className="text-sm text-gray-600 mb-1">Syllabus:</p>
                          <p className="bg-gray-50 p-3 rounded text-sm">{sub.syllabus || 'No syllabus information available'}</p>
                        </div>

                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Question Types:</span>
                            <span className="text-gray-800 font-medium">Multiple Choice</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No subjects have been added to this exam yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Events Tab Content */}
          {activeTab === 'events' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar size={20} className="mr-2 text-purple-600" />
                Events Schedule
              </h3>

              {events.length > 0 ? (
                <div>
                  {/* Event Selection */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        onClick={() => setActiveEvent(event.id)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeEvent === event.id
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                      >
                        {event.name}
                      </button>
                    ))}
                  </div>

                  {/* Active Event Details */}
                  {events.map((event) => (
                    event.id === activeEvent && (
                      <div key={event.id} className="bg-white border rounded-lg shadow-sm">
                        <div className="bg-purple-50 p-4 border-b">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div>
                              <h4 className="text-lg font-bold text-gray-800">{event.name}</h4>
                              <p className="text-sm text-gray-600">Week {event.weeks}</p>
                            </div>
                            <div className="flex gap-4 mt-3 md:mt-0">
                              <div className="flex items-center text-sm">
                                <Calendar size={16} className="mr-1 text-purple-600" />
                                <span>{event.event_date}</span>
                              </div>
                              <div className="flex items-center text-sm">
                                <Clock size={16} className="mr-1 text-purple-600" />
                                <span>{event.duration} min</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Subjects and Questions */}
                        <div className="divide-y divide-gray-100">
                          {event.subjects.map((subject) => (
                            <div key={subject.id} className="p-4">
                              <h5 className="font-semibold text-gray-800 mb-3 flex items-center">
                                <BookMarked size={18} className="mr-2 text-purple-500" />
                                {subject.name}
                              </h5>

                              {subject.questions.length === 0 ? (
                                <div className="bg-gray-50 p-4 rounded-lg text-center">
                                  <HelpCircle size={24} className="mx-auto text-gray-400 mb-2" />
                                  <p className="text-gray-500 text-sm">No questions available for this subject.</p>
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  {subject.questions.map((question, qIndex) => (
                                    <div
                                      key={question.id || qIndex}
                                      className="border rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                                    >
                                      {/* Question Header */}
                                      <div
                                        className={`p-4 flex justify-between items-start cursor-pointer ${expandedQuestions[question.id] ? 'bg-gray-50' : ''
                                          }`}
                                        onClick={() => toggleQuestion(question.id)}
                                      >
                                        <div className="flex items-start">
                                          <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                            <span className="text-xs font-medium text-purple-700">{qIndex + 1}</span>
                                          </div>
                                          <div>
                                            <p className="font-medium text-gray-800">{question.question}</p>
                                            <div className="flex items-center mt-2 space-x-2">
                                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getDifficultyColor(question.difficulty)}`}>
                                                {question.difficulty || 'Unknown'}
                                              </span>
                                              {question.marks && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                                                  {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                        <ChevronDown
                                          size={20}
                                          className={`text-gray-500 transition-transform ${expandedQuestions[question.id] ? 'transform rotate-180' : ''
                                            }`}
                                        />
                                      </div>

                                      {/* Question Details */}
                                      {expandedQuestions[question.id] && (
                                        <div className="p-4 bg-gray-50 border-t">
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {question.options && Object.entries(question.options).map(([key, value], i) => {
                                              const isCorrect = getCorrectAnswer(question) === key;
                                              return (
                                                <div
                                                  key={i}
                                                  className={`p-3 rounded-lg border flex items-start ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-white'
                                                    }`}
                                                >
                                                  <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-2 flex-shrink-0 ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                                    }`}>
                                                    {key}
                                                  </div>
                                                  <div className="text-sm">{value}</div>
                                                  {isCorrect && (
                                                    <CheckCircle size={16} className="ml-2 text-green-600 flex-shrink-0" />
                                                  )}
                                                </div>
                                              );
                                            })}
                                          </div>

                                          {question.explanation && (
                                            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
                                              <div className="flex items-center text-blue-700 font-medium mb-1">
                                                <Info size={16} className="mr-1" />
                                                Explanation:
                                              </div>
                                              <p className="text-gray-700">{question.explanation}</p>
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <Calendar size={36} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No events have been scheduled for this exam yet.</p>
                </div>
              )}
            </div>
          )}


          {/* Tests */}
          {activeTab === 'tests' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookMarked size={20} className="mr-2 text-purple-600" />
                Active Tests
              </h3>

              {Array.isArray(exam.events) && exam.events.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {exam.events.map((event, i) => {
                    const attempts = eventAttempts?.[event.id] || 0;
                    return (
                      <div key={i} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold text-gray-800">{event.name || 'Unnamed Subject'}</h4>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              week {event.weeks}
                            </span>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-1">Duration:</p>
                            <p className="bg-gray-50 p-3 rounded text-sm">{event.duration || 'No duration information available'}</p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 my-auto">Event date: {event.event_date}</span>
                              <div className="flex flex-col">
                                <button
                                  disabled={attempts >= 300}
                                  onClick={() => handleStartTest(event.id)}
                                  className={`w-fit self-end font-medium rounded-md ${attempts >= 300 ? 'bg-gray-500' : 'bg-purple-600'
                                    } px-4 py-2 text-white hover:cursor-pointer`}
                                >
                                  {attempts > 0 ? "Resume test" : "Start test"}
                                </button>

                                {attempts > 0 && (
                                  <span>Attempts remaining: {3 - attempts}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No subjects have been added to this exam yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Results */}
          {activeTab === 'completed' && (
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BookMarked size={20} className="mr-2 text-purple-600" />
                  Results
              </h3>

              {Array.isArray(results) && results.length > 0 ? (
                <div className="grid grid-cols-1 gap-6">
                  {results.map((result, i) => {
                    
                    return (
                      <div key={i} className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                        <div className="h-2 bg-gradient-to-r from-purple-500 to-indigo-600"></div>
                        <div className="p-5">
                          <div className="flex justify-between items-start">
                            <h4 className="text-lg font-bold text-gray-800">{result.event_id.name || 'Unnamed Subject'}</h4>
                            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                              week {result.event_id.weeks}
                            </span>
                          </div>

                          <div className="mt-4">
                            <p className="text-sm text-gray-600 mb-1">Score:</p>
                            <p className="bg-gray-50 p-3 rounded text-sm">{result.marks}</p>
                          </div>

                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 my-auto">Test date: {result.event_id.event_date}</span>
                              <div className="flex flex-col">
                                <button
                                  onClick={()=>handleViewResult(result.event_id.id)}
                                  className={`w-fit self-end font-medium rounded-md bg-purple-600
                                     px-4 py-2 text-white hover:cursor-pointer`}
                                >
                                  View result
                                </button>

                                
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg p-6 text-center">
                  <BookOpen size={36} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-gray-600">No subjects have been added to this exam yet.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ExamOverview;