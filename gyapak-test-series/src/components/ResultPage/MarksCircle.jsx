import React from 'react';

const MarksCircle = ({ score, total, size = 180, stroke = 16 }) => {
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const percentage = Math.min(score / total, 1); // cap at 100%
    const offset = circumference - percentage * circumference;

    return (
        <div className="flex items-center justify-center">
            <svg width={size} height={size}>
                {/* Background Circle */}
                <circle
                    stroke="#e5e7eb"
                    fill="transparent"
                    strokeWidth={stroke}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                {/* Progress Circle */}
                <circle
                    stroke="#9810fa"
                    fill="transparent"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                />
                {/* Text in Center */}
                <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="fill-slate-700"
                >
                    <tspan x="50%" dy="0em" className="text-5xl font-bold">
                        {score}
                    </tspan>
                    <tspan x="50%" dy="2em" className="text-sm">
                        out of {total}
                    </tspan>
                </text>
            </svg>
        </div>
    );
};

export default MarksCircle;
