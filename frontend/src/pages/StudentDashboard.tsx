import { useEffect, useState } from 'react';
import { User, BookOpen, Calendar, Bell, Settings, LogOut, Clock, Award, TrendingUp, BarChart3 } from 'lucide-react';

import Footer from "../components/Footer";
import StatCard from "../components/StatCard";
import HoursChart from "../components/HoursChart";
import PerformanceGauge from "../components/PerformanceGauge";
import Leaderboard from "../components/Leaderboard";
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page) => void;
}

export default function StudentDashboard({ onNavigate }: Props) {
  const [user, setUser] = useState<any>(null);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [lectureCount, setLectureCount] = useState(0);

  const courses = [
    {
      id: 1,
      name: 'Introduction to Computer Technology',
      teacher: 'Dr. Sarah Johnson',
      progress: 45,
      attendance: 92,
      description: 'Learn the fundamentals of computer technology',
      category: 'Computer Science',
      duration: '12 weeks',
      lectures: lectureCount,
      assignments: 5,
      quizzes: 3,
    }
  ];

  const upcomingClasses = [
    { id: 1, subject: 'Introduction to Computer Technology', time: '10:00 AM', room: 'Room 301' },
    { id: 2, subject: 'Lab Session', time: '2:00 PM', room: 'Lab 102' },
  ];

  const assignments = [
    { id: 1, title: 'Programming Assignment 1', course: 'Intro to CT', dueDate: 'Jan 25, 2024', status: 'pending' },
    { id: 2, title: 'Research Paper', course: 'Intro to CT', dueDate: 'Jan 28, 2024', status: 'submitted' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));

    // Load lecture count from localStorage
    const savedLectures = localStorage.getItem('courseLectures');
    if (savedLectures) {
      const lectures = JSON.parse(savedLectures);
      setLectureCount(lectures.length);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setShowProfileDropdown(false);
    onNavigate('landing');
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-teal-600 to-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Student Dashboard</h1>
                <p className="text-sm text-teal-200">Welcome back, {user?.name || 'Student'}!</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <button className="relative p-2 hover:bg-white/10 rounded-lg transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                  className="flex items-center space-x-2 p-2 hover:bg-white/10 rounded-lg transition"
                >
                  <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                    <User className="w-6 h-6" />
                  </div>
                  <span className="hidden md:inline font-medium">{user?.name?.split(' ')[0] || 'Student'}</span>
                </button>
                
                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-4 border-b">
                      <p className="font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-sm text-gray-600">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded">
                        Student
                      </span>
                    </div>
                    <div className="py-2">
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center">
                        <User className="w-4 h-4 mr-2" />
                        My Profile
                      </button>
                      <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                      </button>
                      <div className="border-t my-2"></div>
                      <button 
                        onClick={logout}
                        className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard title="Enrolled Courses" value="1" bgColor="bg-purple-100" icon={<BookOpen className="w-8 h-8 text-purple-600" />} />
            <StatCard title="Completed Courses" value="0" bgColor="bg-green-100" icon={<Award className="w-8 h-8 text-green-600" />} />
            <StatCard title="Avg. Attendance" value="92%" bgColor="bg-blue-100" icon={<TrendingUp className="w-8 h-8 text-blue-600" />} />
            <StatCard title="Avg. Performance" value="68%" bgColor="bg-teal-100" icon={<BarChart3 className="w-8 h-8 text-teal-600" />} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <HoursChart />
            </div>
            <div>
              <PerformanceGauge />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-xl font-semibold mb-4">My Courses</h2>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg font-bold">{course.name}</h3>
                        <p className="text-gray-600 text-sm">Instructor: {course.teacher}</p>
                        <p className="text-gray-500 text-sm mt-1">{course.category} • {course.duration}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">Progress</span>
                          <span className="text-sm font-bold text-teal-600">{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-teal-600 h-2 rounded-full" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2 text-center pt-2">
                        <div>
                          <p className="text-sm text-gray-600">Lectures</p>
                          <p className="font-bold text-teal-600">{course.lectures}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Assignments</p>
                          <p className="font-bold text-blue-600">{course.assignments}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Quizzes</p>
                          <p className="font-bold text-purple-600">{course.quizzes}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => onNavigate('courseManagement')}
                      className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
                    >
                      View Course Details →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="w-6 h-6 mr-2 text-teal-600" />
                  Today's Classes
                </h2>
                <div className="space-y-3">
                  {upcomingClasses.map((cls) => (
                    <div key={cls.id} className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                      <h3 className="font-semibold text-gray-800">{cls.subject}</h3>
                      <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {cls.time}
                        </span>
                        <span>{cls.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Pending Assignments</h2>
                <div className="space-y-3">
                  {assignments.map((assignment) => (
                    <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-800">{assignment.title}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${
                          assignment.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{assignment.course}</p>
                      <p className="text-xs text-gray-500 mt-1">Due: {assignment.dueDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <Leaderboard />
          </div>
        </div>
      </main>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <button
          onClick={logout}
          className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium flex items-center space-x-2 shadow-lg transition hover:shadow-xl"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout from Student Account</span>
        </button>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}