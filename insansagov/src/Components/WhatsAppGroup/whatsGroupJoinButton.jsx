import React, { useState } from 'react';

const SocialGroupsJoin = () => {
  const [links] = useState({
    whatsapp: 'https://chat.whatsapp.com/YOUR_INVITE_CODE',
    telegram: 'https://t.me/YOUR_TELEGRAM_GROUP',
    linkedin: 'https://www.linkedin.com/groups/YOUR_LINKEDIN_GROUP_ID/'
  });
  
  const [copied, setCopied] = useState({});
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const copyToClipboard = (platform) => {
    navigator.clipboard.writeText(links[platform]);
    setCopied({ [platform]: true });
    setTimeout(() => setCopied({}), 2000);
  };

  const joinGroup = (platform) => {
    window.open(links[platform], '_blank');
  };

  const platforms = [
    {   
      id: 'whatsapp',
      name: 'WhatsApp',
      gradient: 'from-green-300 to-green-200',
      lightGradient: 'from-green-300 to-green-200',
      buttonColor: 'bg-green-500 hover:bg-green-600',
      textColor: 'text-green-500',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.67-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
        </svg>
      ),
      members: '450+',
      activity: 'Very Active',
      benefits: ['Instant Updates', 'Community Support', 'Rich Media Sharing']
    },
    {
      id: 'telegram',
      name: 'Telegram',
      gradient: 'bg-blue-300',
      lightGradient: 'bg-blue-300',
      buttonColor: 'bg-blue-500 hover:bg-blue-600',
      textColor: 'text-blue-500',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.768-.546 3.462-.768 4.59-.101.504-.497 1.245-.825 1.275-.751.061-1.348-.486-2.001-.953-.985-.67-1.547-1.08-2.507-1.731-.995-.673-.322-1.064.218-1.683.143-.164 2.646-2.483 2.692-2.691.007-.027.015-.126-.046-.18-.06-.054-.148-.033-.211-.021-.09.022-1.514.968-4.271 2.839-.405.278-.771.41-1.099.4-.36-.012-1.051-.207-1.566-.378-.631-.204-1.125-.312-1.084-.661.024-.181.361-.367 1.002-.558 3.908-1.749 6.504-2.902 7.78-3.459.74-.323 1.685-.755 2.671-.62.308.042.637.304.703.618.066.322.015 1.029-.089 1.512z"/>
        </svg>
      ),
      members: '320+',
      activity: 'Active Daily',
      benefits: ['Secure Messaging', 'File Sharing', 'Community Channels']
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      gradient: 'from-indigo-400 to-indigo-600',
      lightGradient: 'from-indigo-50 to-indigo-100',
      buttonColor: 'bg-indigo-500 hover:bg-indigo-600',
      textColor: 'text-indigo-500',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      ),
      members: '280+',
      activity: 'Regular Updates',
      benefits: ['Professional Network', 'Industry Insights', 'Career Opportunities']
    }
  ];

  return (
    <div className="py-16 px-4  text-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-block mb-3">
            <div className="flex items-center justify-center space-x-1">
              {platforms.map((platform) => (
                <div key={platform.id} className={`w-8 h-8 rounded-full bg-gradient-to-r ${platform.gradient} flex items-center justify-center`}>
                  <span className="text-white text-opacity-90 transform scale-75">{platform.icon}</span>
                </div>
              ))}
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-600 to-gray-900">Join Our Exclusive Communities</h1>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">Connect with industry professionals, get exclusive content, and stay updated with the latest trends.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {platforms.map((platform) => (
            <div 
              key={platform.id} 
              className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800 to-gray-900 shadow-xl border border-gray-700 transform transition-all duration-300 hover:-translate-y-2"
              onMouseEnter={() => setHoveredCard(platform.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              {/* Glowing background effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${platform.gradient} opacity-30 blur-sm rounded-2xl ${hoveredCard === platform.id ? 'opacity-70' : 'opacity-20'} transition-opacity duration-300`}></div>
              
              {/* Content container */}
              <div className="relative p-6 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${platform.gradient} flex items-center justify-center shadow-lg mr-4`}>
                      <span className="text-white">{platform.icon}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{platform.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                        <span className="text-xs text-gray-400">{platform.activity}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-xs text-white">{platform.members}</span>
                  </div>
                </div>
                
                <div className="mb-6">
                  <ul className="space-y-2">
                    {platform.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-center text-gray-300">
                        <svg className={`w-4 h-4 ${platform.textColor} mr-2`} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="mt-auto">
                  <button 
                    onClick={() => joinGroup(platform.id)}
                    className={`w-full ${platform.buttonColor} text-white font-medium py-3 px-4 rounded-lg transition duration-300 shadow-lg transform hover:shadow-xl flex items-center justify-center group mb-4`}
                  >
                    Join Community
                    <svg className="w-5 h-5 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                  
                  <div className="flex items-center bg-black bg-opacity-20 rounded-lg p-2">
                    <div className="flex-1 truncate mr-2 text-xs text-gray-400">
                      {links[platform.id]}
                    </div>
                    <button
                      onClick={() => copyToClipboard(platform.id)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-md transition duration-300 ${
                        copied[platform.id]
                          ? `bg-gradient-to-r ${platform.gradient} text-white`
                          : 'bg-white bg-opacity-10 text-white hover:bg-opacity-20'
                      }`}
                    >
                      {copied[platform.id] ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 max-w-lg mx-auto">
            Join our communities to receive exclusive content, updates, and connect with like-minded professionals.
            <span className="block mt-2 text-xs text-gray-500">Your privacy matters to us. You can unsubscribe at any time.</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SocialGroupsJoin;