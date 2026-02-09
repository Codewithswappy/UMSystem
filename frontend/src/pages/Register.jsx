import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import axios from 'axios';
import { API_BASE_URL } from '../services/api';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Textarea } from "../components/ui/textarea";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    address: '',
    department: '',
    course: '',
    previousEducation: '',
    percentage: ''
  });

  const departments = [
    'Computer Science',
    'Information Technology',
    'Electronics',
    'Mechanical Engineering',
    'Civil Engineering',
    'Business Administration',
    'Commerce',
    'Arts'
  ];

  const courses = [
    'BCA (Bachelor of Computer Applications)',
    'MCA (Master of Computer Applications)',
    'B.Tech (Bachelor of Technology)',
    'M.Tech (Master of Technology)',
    'BBA (Bachelor of Business Administration)',
    'MBA (Master of Business Administration)',
    'B.Com (Bachelor of Commerce)',
    'M.Com (Master of Commerce)',
    'BA (Bachelor of Arts)',
    'MA (Master of Arts)',
    'BSc (Bachelor of Science)',
    'MSc (Master of Science)'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
    setError('');
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!formData.name || !formData.email || !formData.phone || !formData.dateOfBirth || !formData.gender || !formData.address) {
        setError("Please fill in all required fields.");
        return;
      }
    }
    setError('');
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setError('');
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
      
      if (response.data.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F3F0E6] flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[2rem] p-12 shadow-lg border border-gray-100 max-w-md text-center"
        >
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-4">Application Submitted!</h2>
          <p className="text-gray-600 mb-6">
            Your admission application has been submitted successfully! You will receive an email with your login credentials once your application is approved by the admin.
          </p>
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
          >
            Go to Login
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F0E6] py-12 px-4 flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mx-auto"
      >
        {/* Back to Home */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="text-gray-600 hover:text-black text-sm font-medium flex items-center gap-2">
            ← Back to Home
          </Link>
        </div>

        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <img src="/Logo2.png" alt="UMS Logo" className="h-16 w-auto object-contain" />
            <span className="text-2xl font-bold text-black">UMS</span>
          </Link>
          <h1 className="text-3xl font-bold text-black mt-6 mb-2">Apply for Admission</h1>
          <p className="text-gray-600">Step {currentStep} of 2</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 flex justify-center gap-2">
          <div className={`h-2 w-16 rounded-full transition-colors ${currentStep >= 1 ? 'bg-black' : 'bg-gray-200'}`} />
          <div className={`h-2 w-16 rounded-full transition-colors ${currentStep >= 2 ? 'bg-black' : 'bg-gray-200'}`} />
        </div>

        {/* Registration Form */}
        <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-lg border border-gray-100 relative overflow-hidden">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-black mb-6">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="rounded-xl h-12"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="rounded-xl h-12"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="rounded-xl h-12"
                        placeholder="+1 234 567 8900"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                      <Input
                        type="date"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                        className="rounded-xl h-12"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender *</Label>
                      <Select 
                        value={formData.gender} 
                        onValueChange={(value) => handleSelectChange('gender', value)}
                      >
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="address">Address *</Label>
                      <Textarea
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className="rounded-xl resize-none"
                        placeholder="Enter your full address"
                        rows={3}
                      />
                    </div>
                  </div>

                  <div className="pt-6 flex justify-end">
                    <Button 
                      type="button" 
                      onClick={nextStep}
                      className="bg-black text-white hover:bg-gray-800 rounded-xl h-12 px-8"
                    >
                      Next Step <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h3 className="text-xl font-bold text-black mb-6">Academic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department *</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(value) => handleSelectChange('department', value)}
                      >
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue placeholder="Select Department" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="course">Course *</Label>
                      <Select 
                        value={formData.course} 
                        onValueChange={(value) => handleSelectChange('course', value)}
                      >
                        <SelectTrigger className="rounded-xl h-12">
                          <SelectValue placeholder="Select Course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course} value={course}>{course}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="previousEducation">Previous Education</Label>
                      <Input
                        id="previousEducation"
                        name="previousEducation"
                        value={formData.previousEducation}
                        onChange={handleChange}
                        className="rounded-xl h-12"
                        placeholder="e.g., High School"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="percentage">Percentage/CGPA</Label>
                      <Input
                        type="number"
                        id="percentage"
                        name="percentage"
                        value={formData.percentage}
                        onChange={handleChange}
                        min="0"
                        max="100"
                        step="0.01"
                        className="rounded-xl h-12"
                        placeholder="85.5"
                      />
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
                    <p className="text-sm text-blue-800">
                      <strong>Note:</strong> After your application is approved, you will receive an email with your login credentials.
                    </p>
                  </div>

                  <div className="pt-6 flex justify-between items-center">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={prevStep}
                      className="rounded-xl h-12 px-6 border-gray-200"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="bg-[#FF5722] text-white hover:bg-[#F44336] rounded-xl h-12 px-8"
                    >
                      {loading ? <Loader2 className="animate-spin h-5 w-5" /> : 'Submit Application'}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-orange-600 font-semibold hover:text-orange-700">
                Sign In
              </Link>
            </p>
          </div>
        </div>

      </motion.div>
    </div>
  );
}
