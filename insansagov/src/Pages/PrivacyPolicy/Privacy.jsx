import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, ArrowUp } from 'lucide-react';

const PrivacyPolicy = () => {
    const [activeSection, setActiveSection] = useState(null);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const sections = [
        {
            id: 'introduction',
            title: '1. Introduction',
            content: `Welcome to gyapak, We are a platform that aggregates information about government examinations, results, and admit cards from various official government websites. This Privacy Policy explains how we collect, use, and protect information when you use our website.`
        },
        {
            id: 'sources',
            title: '2. Information Sources',
            subsections: [
                {
                    title: '2.1 Data Collection Sources',
                    content: [
                        'We aggregate publicly available information from official government websites',
                        'Content includes examination notifications, results, admit cards, and related updates',
                        'Government logos and official marks are displayed as they appear on their respective official websites',
                        'All information is collected through automated data aggregation from public sources'
                    ]
                },
                {
                    title: '2.2 Third-Party Content',
                    content: [
                        'Government logos and marks remain property of their respective departments',
                        'Links to original government websites are provided where applicable',
                        'Updates are time-stamped with reference to their source websites'
                    ]
                }
            ]
        },
        {
            id: 'collection',
            title: '3. Information We Collect From Users',
            subsections: [
                {
                    title: '3.1 User-Provided Information (Optional)',
                    content: [
                        'Email address (if subscribed for updates)'
                    ]
                }
            ]
        }
    ];

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const TableOfContents = () => (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl mb-8 border border-blue-100">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Quick Navigation</h2>
            <nav>
                <ul className="space-y-3">
                    {sections.map(section => (
                        <li key={section.id} className="group">
                            <a
                                href={`#${section.id}`}
                                className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
                                onClick={(e) => {
                                    e.preventDefault();
                                    document.getElementById(section.id)?.scrollIntoView({ behavior: 'smooth' });
                                    setActiveSection(section.id);
                                }}
                            >
                                <ChevronRight className="w-4 h-4 mr-2 group-hover:text-blue-600" />
                                <span className="text-sm font-medium">{section.title}</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );

    const Section = ({ section }) => {
        const isActive = activeSection === section.id;

        return (
            <div id={section.id} className="mb-12">
                <div
                    className="flex items-center cursor-pointer group"
                    onClick={() => setActiveSection(isActive ? null : section.id)}
                >
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                        {section.title}
                    </h2>
                    {section.subsections && (
                        <ChevronDown className={`w-5 h-5 ml-2 text-gray-400 transition-transform ${isActive ? 'rotate-180' : ''}`} />
                    )}
                </div>

                {section.content && (
                    <p className="text-gray-600 mt-4 leading-relaxed">{section.content}</p>
                )}

                {section.subsections && (
                    <div className={`space-y-8 mt-6 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                        {section.subsections.map((subsection, index) => (
                            <div key={index} className="pl-6 border-l-2 border-blue-100">
                                <h3 className="text-lg font-semibold mb-4 text-gray-700">{subsection.title}</h3>
                                <ul className="space-y-3">
                                    {Array.isArray(subsection.content) ? (
                                        subsection.content.map((item, i) => (
                                            <li key={i} className="flex items-start text-gray-600">
                                                <div className="w-2 h-2 mt-2 mr-3 bg-blue-400 rounded-full" />
                                                <span className="leading-relaxed">{item}</span>
                                            </li>
                                        ))
                                    ) : (
                                        <p className="text-gray-600 leading-relaxed">{subsection.content}</p>
                                    )}
                                </ul>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen ">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <header className="mb-12 text-center mt-20">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
                    <p className="text-gray-500">Last updated: January 21, 2025</p>
                </header>

                <div className="grid xl:grid-cols-4 gap-8">
                    <div className="xl:col-span-1">
                        <div className="sticky top-24">
                            <TableOfContents />
                        </div>
                    </div>

                    <div className="xl:col-span-3">
                        <div className="bg-white rounded-xl shadow-sm p-8">
                            {sections.map(section => (
                                <Section key={section.id} section={section} />
                            ))}
                        </div>

                        <div className="mt-8 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                            <h3 className="font-semibold text-gray-800 mb-2">
                                Looking for logo credits?
                            </h3>
                            <p className="text-gray-600">
                                Find the complete list of credits for all logos and backgrounds used in our website{' '}
                                <a href="/credits" className="text-blue-600 hover:text-blue-800 underline">here</a>.
                            </p>
                        </div>

                        <footer className="mt-12 text-center text-gray-600">
                            <p className="mb-2">For questions about this Privacy Policy, please contact us at:</p>
                            <p className="font-medium">query.insansa@gmail.com</p>
                        </footer>
                    </div>
                </div>
            </div>

            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                    aria-label="Scroll to top"
                >
                    <ArrowUp className="w-5 h-5" />
                </button>
            )}
        </div>
    );
};

export default PrivacyPolicy;