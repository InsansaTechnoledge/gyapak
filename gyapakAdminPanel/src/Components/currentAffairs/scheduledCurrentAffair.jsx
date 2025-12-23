import axios from "axios";
import { API_BASE_URL } from "../../config";
import { useState, useEffect } from "react";
import ScheduleAffairEditModal from "./scheduleAffairEditModal";

const ScheduleCurrentffair = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const fetchScheduledAffairs = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/api/v1i2/affair/scheduled-affair`
      );
      setLoading(false);
      console.log(response.data.data);
      setData(response.data.data);
    } catch (err) {
      console.error("Something Went wrong while fetching the data ", err);
    }
  };

  const deleteScheduledAffair = async (id) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/api/v1i2/affair/scheduled-affair/${id}`
      );
      if (response.status === 200) {
        fetchScheduledAffairs();
        return alert("Deleted succefully");}
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async (updatedRecord) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/api/v1i2/affair/scheduled-affair/${updatedRecord._id}`,
        updatedRecord
      );

      console.log("Updated successfully:", response.data);
      alert("Scheduled affair updated successfully!");

      setOpenModal(false);
      setSelectedRecord(null);
      fetchScheduledAffairs();
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update scheduled affair. Please try again.");
    }
  };

  useEffect(() => {
    fetchScheduledAffairs();
  }, []);
  if (loading) {
    return <h1>.....Loading</h1>;
  }
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Scheduled Current Affairs
              </h1>
              <p className="text-gray-500 mt-1">
                View and manage scheduled current affairs
              </p>
            </div>

            <button
              onClick={fetchScheduledAffairs}
              className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-2 rounded-lg font-medium"
            >
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Table */}
        {data.length > 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table Header */}
            <div className="bg-gray-50 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-700">
                <div className="col-span-1 text-center">ID</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-3">Scheduled At</div>
                <div className="col-span-3 text-center">Actions</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {data.map((item, index) => (
                <div
                  key={item._id || index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <div className="grid grid-cols-12 gap-4 p-4 items-center">
                    {/* ID */}
                    <div className="col-span-1 text-center text-sm font-medium text-gray-500">
                      {index + 1}
                    </div>

                    {/* Title */}
                    <div className="col-span-5">
                      <div className="font-medium text-gray-800">
                        {item.title}
                      </div>
                    </div>

                    {/* Scheduled At */}
                    <div className="col-span-3">
                      <div className="text-sm text-gray-600">
                        {new Date(item.scheduledPublishDate).toLocaleString(
                          "en-IN",
                          {
                            dateStyle: "medium",
                            timeStyle: "short",
                          }
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-3">
                      <div className="flex justify-center gap-2">
                        <button
                          className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition font-medium"
                          onClick={() => {
                            setSelectedRecord(item);
                            setOpenModal(true);
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1.5 text-sm bg-red-600 text-white hover:bg-red-700 rounded-lg transition font-medium"
                          onClick={() => deleteScheduledAffair(item._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <h3 className="text-xl font-medium text-gray-700 mb-2">
              No Scheduled Current Affairs
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              There are no scheduled current affairs at the moment. Schedule
              some to see them displayed here.
            </p>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <ScheduleAffairEditModal
        isOpen={openModal}
        onClose={() => {
          setOpenModal(false);
          setSelectedRecord(null);
        }}
        record={selectedRecord}
        onSubmit={handleUpdate}
      />
    </div>
  );
};

export default ScheduleCurrentffair;
