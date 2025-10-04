import React from 'react';
import { CheckCircle, Calendar, HelpCircle, Users, Tag, X } from 'lucide-react';

const DeleteSuccessDialog = ({ 
  isOpen, 
  onClose, 
  deletionSummary 
}) => {
  if (!isOpen || !deletionSummary) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="bg-green-50 border-b border-green-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-green-900">Deletion Successful</h2>
                <p className="text-green-700 mt-1">
                  Organization and all dependencies have been deleted successfully.
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Organization Info */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deleted Organization</h3>
            <p className="text-2xl font-bold text-gray-900">{deletionSummary.organization.name}</p>
            <p className="text-gray-600">{deletionSummary.organization.abbreviation}</p>
          </div>

          {/* Deletion Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {/* Events */}
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {deletionSummary.deletedItems.events}
              </div>
              <p className="text-sm font-medium text-blue-700">Events Deleted</p>
            </div>

            {/* FAQs */}
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <HelpCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {deletionSummary.deletedItems.faqs}
              </div>
              <p className="text-sm font-medium text-green-700">FAQs Deleted</p>
            </div>

            {/* Authorities */}
            <div className="bg-purple-50 rounded-lg p-4 text-center">
              <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {deletionSummary.deletedItems.authorityReferences}
              </div>
              <p className="text-sm font-medium text-purple-700">Authority Updates</p>
            </div>

            {/* Categories */}
            <div className="bg-orange-50 rounded-lg p-4 text-center">
              <Tag className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-orange-600">
                {deletionSummary.deletedItems.categoryReferences}
              </div>
              <p className="text-sm font-medium text-orange-700">Category Updates</p>
            </div>
          </div>

          {/* Total Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-900 mb-2">✅ Operation Complete</h4>
            <p className="text-green-800">
              Successfully deleted {deletionSummary.organization.name} and cleaned up all {
                deletionSummary.deletedItems.events + 
                deletionSummary.deletedItems.faqs + 
                deletionSummary.deletedItems.authorityReferences + 
                deletionSummary.deletedItems.categoryReferences
              } related dependencies.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 border-t border-gray-200 p-6">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteSuccessDialog;