import { Building2, Calendar } from 'lucide-react'
import React from 'react'


const AdmitCardCard = ({ card }) => {
    return (
        <div
            key={card._id}
            className="p-4 border border-purple-800 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between"
        >
            <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {card.abbreviation}
                </h3>
                <p className="font-medium mb-2">{card.name}</p>
                <div className="text-sm text-gray-600">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        Released: {new Date(card.date_of_notification).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="h-4 w-4" />
                        Last Date: {new Date(card.end_date).toLocaleDateString()}
                    </div>
                    <span
                        className={`inline-block mt-2 px-2 py-1 rounded-full text-xsbg-green-100 text-green-800`}
                    >
                        ACTIVE
                    </span>
                </div>
            </div>
            <div>
                <a
                    href={card.apply_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block mt-4 px-4 py-2 bg-purple-800 text-white text-center rounded-md hover:bg-purple-900 transition-colors"
                >
                    View Admit Card
                </a>
            </div>
        </div>
    )
}

export default AdmitCardCard