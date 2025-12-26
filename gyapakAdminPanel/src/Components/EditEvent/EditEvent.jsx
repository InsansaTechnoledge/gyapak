// src/components/events/EditEvent.jsx
import axios from "axios";
import React, { useState } from "react";
import { API_BASE_URL } from "../../config";
import EditEventShowcase from "./EditEventShowcase";
import DeleteEventShowcase from "./DeleteEventShowcase";
import WhatsAppShare from "./WhatsAppShare";
import axiosInstance from "../../api/axiosConfig";

const EditEvent = ({ title }) => {
  const [eventId, setEventId] = useState();
  const [eventData, setEventData] = useState();

  const showEvent = async () => {
    try {
      const response = await axiosInstance.get(`/api/v1i2/event/${eventId}`);
      if (response.status === 200) {
        setEventData(response.data.exam);
        console.log(response.data);
      }
    } catch (err) {
      alert(err?.response?.data?.message || err.message);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold text-center text-purple-600">
        {title}
      </h1>

      <div className="flex justify-center mt-10 w-full space-x-2">
        <h2 className="my-auto text-lg text-center font-semibold text-purple-600">
          Enter event Id to {title} :
        </h2>
        <input
          value={eventId || ""}
          onChange={(e) => setEventId(e.target.value)}
          type="text"
          className="border p-2 rounded-md w-3/12 border-purple-600"
        />
        <button
          onClick={showEvent}
          disabled={!eventId}
          className={`${
            eventId ? "bg-purple-600" : "bg-gray-400"
          } text-white px-8 py-2 rounded-md hover:cursor-pointer`}
        >
          show event
        </button>
      </div>

      <div className="mt-6">
        {eventData ? (
          <>
            {title === "Edit Event" ? (
              <EditEventShowcase
                data={eventData}
                setEventDataMain={setEventData}
                setEventId={setEventId}
              />
            ) : (
              <DeleteEventShowcase
                data={eventData}
                setEventDataMain={setEventData}
                setEventId={setEventId}
              />
            )}

            {/* WhatsApp Share block */}
            <WhatsAppShare
              eventData={eventData}
              // If you have a public-facing event page base URL, set it here:
              // e.g. "https://gyapak.in" -> will build https://gyapak.in/event/<id>
              portalLinkBase={"copy the event link from gyapak (paste here): "}
            />
          </>
        ) : null}
      </div>
    </>
  );
};

export default EditEvent;
