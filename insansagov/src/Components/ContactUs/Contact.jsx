import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, X, Book, GraduationCap, Award, Users, BookOpen } from 'lucide-react';
import PaperPlane from '../SubmitAnimation/PaperPlane';
import axios from 'axios';
import { useApi, CheckServer } from '../../Context/ApiContext';
import { RingLoader } from 'react-spinners';

const Contact = () => {
    const { apiBaseUrl, setApiBaseUrl } = useApi();
    const [isSuccessPopupVisible, setIsSuccessPopupVisible] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        subject: '',
        message: ''
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const id = document.getElementById("paper");
        const notid = document.getElementById("notpaper");

        id.classList.add("flex");
        id.classList.remove("hidden");
        notid.classList.add("blur-sm");

        setTimeout(() => {
            id.classList.remove("flex");
            id.classList.add("hidden");
            notid.classList.remove("blur-sm");
            setLoading(true);
        }, 1500);
        //created object to add the website name  and passed it there 
        const details = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            recievedOn: 'gyapak.in'
        }

        try {
            const response = await axios.post(`${apiBaseUrl}/api/contact/sendMail `, details);
            if (response.status === 201) {
                await axios.post(`${apiBaseUrl}/api/contact/sendMailtoUser`, {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                });
                setLoading(false);
                setIsSuccessPopupVisible(true);
                setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    subject: '',
                    message: ''
                });
            }
        } catch (error) {
            console.error('Error sending email:', error);
            if (error.response || error.request) {
                if ((error.response && error.response.status >= 500 && error.response.status < 600) || (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT' || error.code === 'ENOTFOUND' || error.code === "ERR_NETWORK")) {
                    const url = await CheckServer();
                    setApiBaseUrl(url);
                    setTimeout(() => handleSubmit(), 1000);
                }
                else {
                    console.error('Error fetching state count:', error);
                }
            }
            else {
                console.error('Error fetching state count:', error);
            }
        }
    };

    const contactCategories = [
        {
            id: 'general',
            icon: <BookOpen className="w-5 h-5" />,
            label: 'General Inquiry',
            description: 'Questions about our programs or services'
        },
        {
            id: 'academic',
            icon: <GraduationCap className="w-5 h-5" />,
            label: 'Academic Support',
            description: 'Get help with your studies'
        },
        {
            id: 'career',
            icon: <Award className="w-5 h-5" />,
            label: 'Career Guidance',
            description: 'Plan your future career path'
        }
    ];

    return (
        <>
            <div id="paper" className="hidden fixed inset-0 items-center justify-center z-40 bg-black/20 backdrop-blur-sm">
                <PaperPlane />
            </div>


            {isSuccessPopupVisible && (
                <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl w-96 p-8 transform transition-all duration-300 scale-100 animate-fade-in">
                        <div className="relative">
                            <button
                                onClick={() => setIsSuccessPopupVisible(false)}
                                className="absolute -right-4 -top-4 p-2 bg-purple-100 rounded-full hover:bg-purple-200 transition-colors"
                            >
                                <X className="w-4 h-4 text-purple-800" />
                            </button>
                            <div className="text-center space-y-4">
                                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                                    <Send className="w-8 h-8 text-purple-800" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900">Message Sent!</h3>
                                <p className="text-gray-600">
                                    Thanks for reaching out! Our student support team will get back to you within 24 hours.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div id="notpaper" className="min-h-screen py-16 px-4 sm:px-6 lg:px-8">
                
                <div className="max-w-4xl mx-auto text-center mb-16 space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="w-20 h-20 bg-purple-800 rounded-full flex items-center justify-center">
                            <Users className="w-10 h-10 text-white" />
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                        Student Support Center
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're here to support your educational journey. Choose a category below and let us know how we can help you succeed.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                        {contactCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveTab(category.id)}
                                className={`flex flex-col items-center p-6 rounded-xl transition-all duration-300 ${activeTab === category.id
                                    ? 'bg-purple-800 text-white shadow-lg shadow-purple-200'
                                    : 'bg-white text-gray-600 hover:bg-purple-100 hover:shadow-md'
                                    }`}
                            >
                                <div className={`p-3 rounded-full mb-3 ${activeTab === category.id ? 'bg-white/20' : 'bg-purple-100'
                                    }`}>
                                    {category.icon}
                                </div>
                                <span className="font-semibold">{category.label}</span>
                                <span className={`text-sm mt-2 ${activeTab === category.id ? 'text-purple-100' : 'text-gray-500'
                                    }`}>
                                    {category.description}
                                </span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="max-w-7xl mx-auto">
                {
                    loading
                        ?
                        <div className='absolute w-8/12 z-50 h-screen flex justify-center'>
                            <RingLoader size={60} color={'#5B4BEA'} speedMultiplier={2} className='my-auto' />
                        </div>
                        :
                        null
                }
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-800 to-indigo-700 p-8 lg:p-12 shadow-xl order-2 lg:order-1">
                            <div className="absolute inset-0 bg-[url('/api/placeholder/400/400')] opacity-10 mix-blend-overlay"></div>

                            <h2 className="text-3xl font-bold text-white mb-8">Campus Resources</h2>

                            <div className="space-y-8 relative z-10">
                                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <MapPin className="w-6 h-6 text-purple-200 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-white mb-2">Student Center</h3>
                                            <p className="text-purple-100">
                                                B/321 Monalisa Business Center<br />
                                                Manjalpur, Vadodara<br />
                                                Gujarat, INDIA 390011
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <Phone className="w-6 h-6 text-purple-200 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-white mb-2">Student Helpline</h3>
                                            <p className="text-purple-100">
                                                +91 9724379123<br />
                                                0265-4611836
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <Mail className="w-6 h-6 text-purple-200 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-white mb-2">Email Support</h3>
                                            <p className="text-purple-100">
                                                talent@insansa.com<br />
                                                sales@insansa.com
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm hover:bg-white/20 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <Clock className="w-6 h-6 text-purple-200 flex-shrink-0" />
                                        <div>
                                            <h3 className="font-semibold text-white mb-2">Support Hours</h3>
                                            <p className="text-purple-100">
                                                Monday - Friday: 10am - 6pm<br />
                                                Saturday & Sunday: Closed
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-xl order-1 lg:order-2">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="p-3 bg-purple-100 rounded-lg">
                                    {activeTab === 'general' && <BookOpen className="w-6 h-6 text-purple-800" />}
                                    {activeTab === 'academic' && <GraduationCap className="w-6 h-6 text-purple-800" />}
                                    {activeTab === 'career' && <Award className="w-6 h-6 text-purple-800" />}
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {activeTab === 'general' && "How can we help you?"}
                                    {activeTab === 'academic' && "Get Academic Assistance"}
                                    {activeTab === 'career' && "Plan Your Career Path"}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                                            placeholder="John"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Student Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                                        placeholder="john@example.com"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors"
                                        placeholder={
                                            activeTab === 'general' ? "What would you like to know?" :
                                                activeTab === 'academic' ? "What subject do you need help with?" :
                                                    "What career path interests you?"
                                        }
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-gray-700">Your Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-colors resize-none"
                                        placeholder={
                                            activeTab === 'general' ? "Tell us how we can assist you..." :
                                                activeTab === 'academic' ? "Describe what you're struggling with..." :
                                                    "Tell us about your career goals..."
                                        }
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-purple-800 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 group shadow-lg shadow-purple-200"
                                >
                                    <span className="text-lg">Submit Request</span>
                                    <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>

                                <p className="text-sm text-gray-500 text-center mt-4">
                                    Our support team typically responds within 24 hours during business days
                                </p>
                            </form>
                        </div>
                    </div>


                </div>
            </div>
        </>
    );
};

export default Contact;