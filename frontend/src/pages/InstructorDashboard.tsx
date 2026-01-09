import { useEffect, useState } from 'react';
import {
  User, BookOpen, Users, Video, DollarSign, Star, LogOut,
  Settings, BarChart3, ChevronRight
} from 'lucide-react';
import Footer from "../components/Footer";
import type { Page } from '../types';

interface Props {
  onNavigate: (page: Page) => void;
}

interface Course {
  id: number;
  title: string;
  category: string;
  students: number;
  lectures: number;
  rating: number;
  revenue: number;
  status: 'published' | 'draft' | 'archived';
  lastUpdated: string;
}

interface Lecture {
  id: string;
  title: string;
  duration: string;
  uploadDate: string;
  views: number;
  studentsCompleted: number;
  type: 'video' | 'pdf' | 'quiz';
}

interface Student {
  id: number;
  name: string;
  email: string;
  progress: number;
  lastActive: string;
  grade?: string;
}

export default function InstructorDashboard({ onNavigate }: Props) {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const [courses, setCourses] = useState<Course[]>([
    {
      id: 1,
      title: 'Introduction to Computer Technology',
      category: 'Computer Science',
      students: 0,
      lectures: 0,
      rating: 5.0,
      revenue: 0,
      status: 'published',
      lastUpdated: new Date().toLocaleDateString()
    }
  ]);

  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));

    const savedLectures = localStorage.getItem('courseLectures');
    if (savedLectures) {
      const parsedLectures = JSON.parse(savedLectures);
      const formattedLectures = parsedLectures.slice(0, 4).map((lec: any) => ({
        id: lec.id,
        title: lec.title,
        duration: lec.duration,
        uploadDate: lec.uploadDate,
        views: Math.floor(Math.random() * 100),
        studentsCompleted: Math.floor(Math.random() * 80),
        type: 'video' as const
      }));
      setLectures(formattedLectures);
    }

    const savedStudents = localStorage.getItem('enrolledStudents');
    if (savedStudents) {
      const parsedStudents = JSON.parse(savedStudents);
      setStudents(parsedStudents.sort((a: Student, b: Student) => b.progress - a.progress).slice(0, 4));
    }

    const updateCourseStats = () => {
      const lecturesData = localStorage.getItem('courseLectures');
      const studentsData = localStorage.getItem('enrolledStudents');

      const lectureCount = lecturesData ? JSON.parse(lecturesData).length : 0;
      const studentCount = studentsData ? JSON.parse(studentsData).length : 0;

      setCourses(prevCourses => prevCourses.map(course => ({
        ...course,
        lectures: lectureCount,
        students: studentCount,
        revenue: studentCount * 10
      })));
    };

    updateCourseStats();
  }, []);

  const logout = () => {
    localStorage.removeItem('user');
    setShowProfileDropdown(false);
    onNavigate('landing');
  };

  const totalStudents = courses.reduce((sum, course) => sum + course.students, 0);
  const totalLectures = courses.reduce((sum, course) => sum + course.lectures, 0);
  const totalRevenue = courses.reduce((sum, course) => sum + course.revenue, 0);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'lectures', label: 'Lectures', icon: Video },
    { id: 'students', label: 'Students', icon: Users },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
              <p className="text-gray-600">Welcome back, {user?.name || 'Instructor'}! Here's what's happening with your courses.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Courses</p>
                    <p className="text-3xl font-bold text-teal-600 mt-2">{courses.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-teal-600" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">1 Published</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Students</p>
                    <p className="text-3xl font-bold text-blue-600 mt-2">{totalStudents}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Active enrollments</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Lectures</p>
                    <p className="text-3xl font-bold text-purple-600 mt-2">{totalLectures}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">Total uploaded</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold text-green-600 mt-2">${totalRevenue}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500">From enrollments</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">My Courses</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition">
                    <div className="flex justify-between items-start mb-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {course.status}
                      </span>
                      <span className="text-sm text-gray-500">{course.lastUpdated}</span>
                    </div>

                    <h3 className="text-lg font-bold mb-2">{course.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">{course.category}</p>

                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Students</span>
                        <span className="font-medium">{course.students}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Lectures</span>
                        <span className="font-medium">{course.lectures}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Rating</span>
                        <span className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {course.rating}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('courseManagement')}
                      className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm"
                    >
                      Manage Course
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Recent Lectures</h3>
                {lectures.length === 0 ? (
                  <div className="text-center py-8">
                    <Video className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No lectures uploaded yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {lectures.map((lecture) => (
                      <div key={lecture.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 bg-red-100">
                            <Video className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium">{lecture.title}</p>
                            <p className="text-sm text-gray-500">{lecture.duration}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{lecture.views} views</p>
                          <p className="text-xs text-gray-500">{lecture.uploadDate}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => onNavigate('courseManagement')}
                  className="w-full mt-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50"
                >
                  View All Lectures
                </button>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4">Top Students</h3>
                {students.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No students enrolled yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-teal-600" />
                          </div>
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-600 h-2 rounded-full"
                                style={{ width: `${student.progress}%` }}
                              ></div>
                            </div>
                            <span className="font-bold text-green-700 text-sm">{student.progress}%</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">Active: {student.lastActive}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setActiveTab('students')}
                  className="w-full mt-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
                >
                  View All Students
                </button>
              </div>
            </div>
          </div>
        );

      case 'courses':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Course Management</h1>
              <p className="text-gray-600">Manage and monitor all your courses</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{course.title}</h3>
                      <p className="text-gray-600">{course.category}</p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                      {course.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Students</p>
                      <p className="text-lg font-bold">{course.students}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lectures</p>
                      <p className="text-lg font-bold">{course.lectures}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Rating</p>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-500 mr-1" />
                        <span className="font-bold">{course.rating}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Revenue</p>
                      <p className="text-lg font-bold text-green-600">${course.revenue}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => onNavigate('courseManagement')}
                    className="w-full px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Manage Content
                  </button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'lectures':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Lecture Management</h1>
                <p className="text-gray-600">View and manage all your course lectures</p>
              </div>
              <button
                onClick={() => onNavigate('courseManagement')}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
              >
                Go to Course
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              {lectures.length === 0 ? (
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No lectures uploaded yet</p>
                  <button
                    onClick={() => onNavigate('courseManagement')}
                    className="px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                  >
                    Upload First Lecture
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {lectures.map((lecture) => (
                    <div key={lecture.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <Video className="w-8 h-8 text-red-600 mr-3" />
                        <div>
                          <p className="font-bold">{lecture.title}</p>
                          <p className="text-sm text-gray-500">{lecture.duration} • {lecture.uploadDate}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{lecture.views} views</p>
                        <p className="text-xs text-gray-500">{lecture.studentsCompleted} completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'students':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Management</h1>
              <p className="text-gray-600">Track student progress and performance</p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6">
              {students.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No students enrolled yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {students.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mr-4">
                          <User className="w-6 h-6 text-teal-600" />
                        </div>
                        <div>
                          <p className="font-bold">{student.name}</p>
                          <p className="text-sm text-gray-500">{student.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2 mb-1">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <span className="font-bold text-sm">{student.progress}%</span>
                        </div>
                        <p className="text-xs text-gray-500">Grade: {student.grade}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => onNavigate('landing')}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                <span className="text-2xl font-bold text-white">L</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-gray-900">LearnHub</span>
                <p className="text-xs text-gray-500 -mt-1">Instructor Portal</p>
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="text-right hidden md:block">
                  <p className="text-sm font-semibold text-gray-800">{user?.name || 'Instructor'}</p>
                  <p className="text-xs text-gray-500">Instructor</p>
                </div>
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-teal-600" />
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border z-50">
                  <div className="p-4 border-b">
                    <p className="font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <span className="inline-block mt-2 px-3 py-1 bg-teal-100 text-teal-800 text-xs rounded-full">
                      Instructor
                    </span>
                  </div>
                  <div className="py-2">
                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center">
                      <User className="w-4 h-4 mr-3" />
                      My Profile
                    </button>
                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-center">
                      <Settings className="w-4 h-4 mr-3" />
                      Settings
                    </button>
                    <div className="border-t my-2"></div>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-white shadow-lg flex-shrink-0">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-5 h-5" />}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {renderContent()}
          </div>
        </main>
      </div>

      <Footer onNavigate={onNavigate} />
    </div>
  );
}
