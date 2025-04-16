import React, { useState } from 'react';
import { createInstitute } from '../../../../service/Institute.service';
import { Building, Mail, Phone, Image, Globe, MapPin, Check, Loader, BookOpen, Shield, PieChart, Users, Lock } from 'lucide-react';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    phone: '',
    password: '',
    logoUrl: '',
    website: '',
    adminUserId: '', // Optional
    address: {
      line1: '',
      line2: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
    },
    features: {
      canCreateExams: true,
      canAccessAnalytics: false,
      canHostLiveTest: false,
      canAddStudentData: false,
    },
    subscription: {
      plan: 'trialing',
    }
  });

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (e, field, nested = null) => {
    const value = e.target.value;

    if (nested) {
      setFormData((prev) => ({
        ...prev,
        [nested]: {
          ...prev[nested],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');

    if(formData.password != formData.confirm_password){
      alert("Password and Confirm password does not match");
      setLoading(false);
      return;
    }

    try {
      const payload = { ...formData };

      if (!payload.adminUserId?.trim()) {
        delete payload.adminUserId;
      }

      const validPlans = ['free', 'standard', 'premium'];
      if (!validPlans.includes(payload.subscription.plan)) {
        payload.subscription.plan = 'free';
      }

      const res = await createInstitute(payload);
      setMsg('✅ Institute created successfully!');
    } catch (err) {
      setMsg(err?.response?.data?.errors?.[0] || '❌ Error creating institute');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="registration-form" className="py-12 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start mb-10">
          <div className="md:w-1/3 mb-6 md:mb-0 md:pr-12">
            <div className="sticky top-8">
              <div className="bg-purple-600 text-white w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <Building size={32} />
              </div>
              <h2 className="text-3xl font-bold text-purple-900 mb-4">Register Your Institute</h2>
              <p className="text-gray-600 mb-6">Complete the form to join our network of educational excellence and unlock powerful assessment tools.</p>

              <div className="bg-purple-100 rounded-lg p-5 border-l-4 border-purple-600">
                <h4 className="font-bold text-purple-800 mb-2">Why Register?</h4>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-700">
                    <Check size={16} className="text-purple-600 mr-2 flex-shrink-0" />
                    <span>Streamlined assessment creation</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check size={16} className="text-purple-600 mr-2 flex-shrink-0" />
                    <span>Comprehensive analytics platform</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check size={16} className="text-purple-600 mr-2 flex-shrink-0" />
                    <span>Real-time testing capabilities</span>
                  </li>
                  <li className="flex items-center text-sm text-gray-700">
                    <Check size={16} className="text-purple-600 mr-2 flex-shrink-0" />
                    <span>Student data management tools</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="md:w-2/3 bg-white rounded-xl shadow-md p-8 border border-purple-100">
            <form onSubmit={handleSubmit} className="grid gap-6">
              <div className="mt-2">
                <h3 className="font-semibold text-purple-800 flex items-center text-lg pb-2 border-b border-purple-100">
                  <MapPin className="mr-2" size={20} />
                  Basic Information
                </h3>
              </div>
              <div className="grid md:grid-cols-1 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Institute Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                      value={formData.name}
                      onChange={(e) => handleChange(e, 'name')}
                      placeholder="Enter your institute name"
                    />
                    <Building className="absolute left-3 top-3.5 text-purple-500" size={18} />
                  </div>
                </div>

                
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Phone</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      value={formData.phone}
                      onChange={(e) => handleChange(e, 'phone')}
                      placeholder="+1 (555) 123-4567"
                    />
                    <Phone className="absolute left-3 top-3.5 text-purple-500" size={18} />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <input 
                      type={passwordVisible ? "text" : "password"}
                      className="w-full pl-10 pr-12 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                      value={formData.password}
                      onChange={(e) => handleChange(e, 'password')}
                      placeholder="Create a secure password" 
                      minLength="8"
                    />
                    <Lock className="absolute left-3 top-3.5 text-purple-500" size={18} />
                    <button 
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute right-3 top-3.5 text-gray-500 hover:text-purple-700"
                    >
                      {passwordVisible ? "Hide" : "Show"}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Website (optional)</label>
                  <div className="relative">
                    <input
                      type="url"
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      value={formData.website}
                      onChange={(e) => handleChange(e, 'website')}
                      placeholder="https://yoursite.com"
                    />
                    <Globe className="absolute left-3 top-3.5 text-purple-500" size={18} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Logo URL</label>
                  <div className="relative">
                    <input 
                      type="url" 
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      value={formData.logoUrl}
                      onChange={(e) => handleChange(e, 'logoUrl')}
                      placeholder="https://yoursite.com/logo.png" 
                    />
                    <Image className="absolute left-3 top-3.5 text-purple-500" size={18} />
                  </div>
                </div>
              </div>

              <div className="mt-2">
                <h3 className="font-semibold text-purple-800 flex items-center text-lg pb-2 border-b border-purple-100">
                  <MapPin className="mr-2" size={20} />
                  Login Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                      value={formData.email}
                      onChange={(e) => handleChange(e, 'email')}
                      placeholder="email@example.com"
                    />
                    <Mail className="absolute left-3 top-3.5 text-purple-500" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                      value={formData.password}
                      onChange={(e) => handleChange(e, 'password')}
                      placeholder='enter password'
                    />
                    <Mail className="absolute left-3 top-3.5 text-purple-500" size={18} />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Confirm password</label>
                  <div className="relative">
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                      required
                      value={formData.confirm_password}
                      onChange={(e) => handleChange(e, 'confirm_password')}
                      placeholder='re-enter password'
                    />
                    <Mail className="absolute left-3 top-3.5 text-purple-500" size={18} />
                  </div>
                </div>
              </div>


              <div className="mt-2">
                <h3 className="font-semibold text-purple-800 flex items-center text-lg pb-2 border-b border-purple-100">
                  <MapPin className="mr-2" size={20} />
                  Address Information
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Address Line 1</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    value={formData.address.line1}
                    onChange={(e) => handleChange(e, 'line1', 'address')}
                    placeholder="Street address"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Address Line 2</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    value={formData.address.line2}
                    onChange={(e) => handleChange(e, 'line2', 'address')}
                    placeholder="Apt, suite, building (optional)"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">City</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    value={formData.address.city}
                    onChange={(e) => handleChange(e, 'city', 'address')}
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">State/Province</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    value={formData.address.state}
                    onChange={(e) => handleChange(e, 'state', 'address')}
                    placeholder="State or Province"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Country</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    value={formData.address.country}
                    onChange={(e) => handleChange(e, 'country', 'address')}
                    placeholder="Country"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-1">Postal/ZIP Code</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                    value={formData.address.pincode}
                    onChange={(e) => handleChange(e, 'pincode', 'address')}
                    placeholder="Postal or ZIP code"
                  />
                </div>
              </div>

              <div className="mt-2">
                <h3 className="font-semibold text-purple-800 flex items-center text-lg pb-2 border-b border-purple-100">
                  <Check className="mr-2" size={20} />
                  Feature Selection
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center bg-white rounded-lg border border-purple-100 p-4 hover:border-purple-300 hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    id="canCreateExams"
                    className="h-5 w-5 mr-3 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    checked={formData.features.canCreateExams}
                    onChange={() => handleFeatureToggle('canCreateExams')}
                  />
                  <div>
                    <label htmlFor="canCreateExams" className="font-medium cursor-pointer text-purple-900 flex items-center">
                      <BookOpen size={16} className="mr-2" />
                      Create Exams
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Design custom assessments for your students</p>
                  </div>
                </div>

                <div className="flex items-center bg-white rounded-lg border border-purple-100 p-4 hover:border-purple-300 hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    id="canAccessAnalytics"
                    className="h-5 w-5 mr-3 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    checked={formData.features.canAccessAnalytics}
                    onChange={() => handleFeatureToggle('canAccessAnalytics')}
                  />
                  <div>
                    <label htmlFor="canAccessAnalytics" className="font-medium cursor-pointer text-purple-900 flex items-center">
                      <PieChart size={16} className="mr-2" />
                      Access Analytics
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Gain insights from detailed performance data</p>
                  </div>
                </div>

                <div className="flex items-center bg-white rounded-lg border border-purple-100 p-4 hover:border-purple-300 hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    id="canHostLiveTest"
                    className="h-5 w-5 mr-3 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    checked={formData.features.canHostLiveTest}
                    onChange={() => handleFeatureToggle('canHostLiveTest')}
                  />
                  <div>
                    <label htmlFor="canHostLiveTest" className="font-medium cursor-pointer text-purple-900 flex items-center">
                      <Shield size={16} className="mr-2" />
                      Host Live Tests
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Conduct proctored online examinations</p>
                  </div>
                </div>

                <div className="flex items-center bg-white rounded-lg border border-purple-100 p-4 hover:border-purple-300 hover:bg-purple-50 transition-all">
                  <input
                    type="checkbox"
                    id="canAddStudentData"
                    className="h-5 w-5 mr-3 text-purple-600 rounded border-purple-300 focus:ring-purple-500"
                    checked={formData.features.canAddStudentData}
                    onChange={() => handleFeatureToggle('canAddStudentData')}
                  />
                  <div>
                    <label htmlFor="canAddStudentData" className="font-medium cursor-pointer text-purple-900 flex items-center">
                      <Users size={16} className="mr-2" />
                      Add Student Data
                    </label>
                    <p className="text-xs text-gray-500 mt-1">Manage student profiles and records</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-6 bg-purple-600 hover:bg-purple-700 text-white py-4 px-8 rounded-lg font-medium transition-all disabled:opacity-70 shadow-lg flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin mr-2" size={20} />
                    Processing...
                  </>
                ) : (
                  'Register Institute'
                )}
              </button>

              {msg && (
                <div className={`mt-4 p-4 rounded-lg ${msg.startsWith('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {msg}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;