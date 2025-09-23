import React, { useEffect, useState } from 'react'
import QuickApplyButton from '../OpportunityComponents/QuickApplyButton';
import DetailsSection from '../OpportunityComponents/DetailsSection';
import DocumentLinksSection from '../OpportunityComponents/DocumentLinksSection';
import AdditionalDetailsSection from '../OpportunityComponents/AdditionalDetailsSection';
import axios from 'axios';
import { API_BASE_URL } from '../../config';
import HeroSectionEdit from '../OpportunityComponents/HeroSectionEdit';
import ModernExamDetailsPage from '../../Pages/Opportunities/Opportunities';
import { Trash2, AlertTriangle, CheckCircle, X, Eye, EyeOff } from 'lucide-react';

const DeleteEventShowcase = ({data, setEventDataMain, setEventId}) => {

    const [eventData, setEventData] = useState(data);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [showSecretKey, setShowSecretKey] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState('');
    const [showPreview, setShowPreview] = useState(true);

    const SUBMIT_SECRET = "Gyapak_Insansa@123"

    const handleDeleteEvent = async () => {
        if (secretKey !== SUBMIT_SECRET) {
            setError("Invalid secret key. Access denied.");
            return;
        }

        setIsDeleting(true);
        setError('');

        try {
            const response = await axios.delete(`${API_BASE_URL}/api/v1i2/event/`, {
                data: {
                    organizationId: eventData.organization_id,
                    eventId: eventData._id
                }
            });
    
            if (response.status === 200) {
                setEventDataMain(null);
                setEventId(null);
                setShowDeleteModal(false);
                // Show success message instead of alert
                alert(response.data.message || "Event deleted successfully!");
            }
        } catch (err) {
            setError(err.response?.data?.message || 'An error occurred while deleting the event.');
        } finally {
            setIsDeleting(false);
        }
    };

    const openDeleteModal = () => {
        setShowDeleteModal(true);
        setSecretKey('');
        setError('');
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSecretKey('');
        setError('');
    };
    


    return (
        <>
            {/* Action Header */}
            <div className='bg-red-50 border border-red-200 rounded-lg p-6 mt-8 mx-4'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                        <div className='bg-red-100 p-3 rounded-full'>
                            <AlertTriangle className='h-6 w-6 text-red-600' />
                        </div>
                        <div>
                            <h2 className='text-xl font-bold text-red-800'>Delete Event</h2>
                            <p className='text-red-600'>This action cannot be undone. Please review the event details before deletion.</p>
                        </div>
                    </div>
                    <div className='flex space-x-3'>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className='flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition'
                        >
                            {showPreview ? <EyeOff className='h-4 w-4 mr-2' /> : <Eye className='h-4 w-4 mr-2' />}
                            {showPreview ? 'Hide Preview' : 'Show Preview'}
                        </button>
                        <button 
                            onClick={openDeleteModal}
                            className='flex items-center bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition'
                        >
                            <Trash2 className='h-4 w-4 mr-2' />
                            Delete Event
                        </button>
                    </div>
                </div>

                {/* Event Quick Info */}
                <div className='mt-4 p-4 bg-white rounded-lg border'>
                    <h3 className='font-semibold text-gray-800 mb-2'>Event to be deleted:</h3>
                    <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                        <div>
                            <span className='text-gray-600'>Event ID:</span>
                            <span className='ml-2 font-mono text-gray-800'>{eventData._id}</span>
                        </div>
                        <div>
                            <span className='text-gray-600'>Organization ID:</span>
                            <span className='ml-2 font-mono text-gray-800'>{eventData.organization_id}</span>
                        </div>
                        <div>
                            <span className='text-gray-600'>Event Type:</span>
                            <span className='ml-2 font-semibold text-gray-800'>{eventData.examName || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center space-x-3'>
                                <div className='bg-red-100 p-2 rounded-full'>
                                    <AlertTriangle className='h-5 w-5 text-red-600' />
                                </div>
                                <h3 className='text-lg font-bold text-gray-800'>Confirm Deletion</h3>
                            </div>
                            <button
                                onClick={closeDeleteModal}
                                className='text-gray-400 hover:text-gray-600 transition'
                            >
                                <X className='h-5 w-5' />
                            </button>
                        </div>

                        <div className='mb-6'>
                            <p className='text-gray-600 mb-4'>
                                You are about to permanently delete this event. This action cannot be undone.
                            </p>
                            
                            <div className='bg-gray-50 p-3 rounded-lg mb-4'>
                                <p className='text-sm font-semibold text-gray-800'>Event ID: {eventData._id}</p>
                            </div>

                            <div className='mb-4'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Enter Secret Key to Confirm:
                                </label>
                                <div className='relative'>
                                    <input
                                        type={showSecretKey ? 'text' : 'password'}
                                        value={secretKey}
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        className='w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500 pr-10'
                                        placeholder='Enter secret key'
                                    />
                                    <button
                                        type='button'
                                        onClick={() => setShowSecretKey(!showSecretKey)}
                                        className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600'
                                    >
                                        {showSecretKey ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded-lg'>
                                    <p className='text-red-600 text-sm'>{error}</p>
                                </div>
                            )}
                        </div>

                        <div className='flex space-x-3'>
                            <button
                                onClick={closeDeleteModal}
                                className='flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition'
                                disabled={isDeleting}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteEvent}
                                disabled={isDeleting || !secretKey}
                                className='flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white py-2 px-4 rounded-lg font-medium transition flex items-center justify-center'
                            >
                                {isDeleting ? (
                                    <>
                                        <div className='animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2'></div>
                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className='h-4 w-4 mr-2' />
                                        Delete Event
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Event Preview */}
            {showPreview && (
                <div className='mt-6'>
                    <ModernExamDetailsPage eventData={eventData} />
                </div>
            )}
        </>
    )
}

export default DeleteEventShowcase