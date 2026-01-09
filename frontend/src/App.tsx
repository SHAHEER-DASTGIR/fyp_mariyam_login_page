import { useState, useEffect } from 'react';

// Components
import Header from './components/Header';
import Footer from './components/Footer';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Courses from './pages/Courses';
import Instructor from './pages/Instructor';
import Contact from './pages/Contact';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import AdminDashboard from './pages/AdminDashboard';
import CourseManagement from './pages/CourseManagement';

// Types
import type { Page } from './types';

// Initialize mock data
const initializeMockData = () => {
  const existingStudents = localStorage.getItem('enrolledStudents');
  
  if (!existingStudents) {
    const mockStudents = [
      { id: 1, name: 'Ali Ahmed', email: 'ali@example.com', progress: 85, lastActive: 'Today', grade: 'A+' },
      { id: 2, name: 'Fatima Khan', email: 'fatima@example.com', progress: 92, lastActive: 'Yesterday', grade: 'A+' },
      { id: 3, name: 'Zainab Malik', email: 'zainab@example.com', progress: 67, lastActive: '2 days ago', grade: 'B' },
      { id: 4, name: 'Omar Farooq', email: 'omar@example.com', progress: 45, lastActive: '3 days ago', grade: 'C' },
      { id: 5, name: 'Sara Shah', email: 'sara@example.com', progress: 78, lastActive: 'Today', grade: 'B+' },
    ];
    
    localStorage.setItem('enrolledStudents', JSON.stringify(mockStudents));
  }
};

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize mock data
    initializeMockData();

    const savedUser = localStorage.getItem('user');
    const savedPage = localStorage.getItem('currentPage');

    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);

        if (savedPage) {
          setCurrentPage(savedPage as Page);
        } else {
          const role = parsedUser.role;
          if (role === 'student') setCurrentPage('studentDashboard');
          else if (role === 'instructor') setCurrentPage('instructorDashboard');
          else if (role === 'admin') setCurrentPage('adminDashboard');
        }
      } catch {
        setCurrentPage('landing');
      }
    }
    setIsLoading(false);
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    localStorage.setItem('currentPage', page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hideLayout =
    currentPage === 'login' ||
    currentPage === 'signup' ||
    currentPage === 'studentDashboard' ||
    currentPage === 'instructorDashboard' ||
    currentPage === 'coursedetails' ||
    currentPage === 'courseManagement' ||
    currentPage === 'adminDashboard';

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER */}
      {!hideLayout && (
        <Header currentPage={currentPage} onNavigate={handleNavigate} />
      )}

      {/* ROUTING */}
      {currentPage === 'landing' && <Landing onNavigate={handleNavigate} />}

      {currentPage === 'login' && (
        <Login onNavigate={handleNavigate} setUser={setUser} />
      )}

      {currentPage === 'signup' && (
        <Signup onNavigate={handleNavigate} />
      )}

      {currentPage === 'courses' && <Courses onNavigate={handleNavigate} />}
      {currentPage === 'instructor' && <Instructor onNavigate={handleNavigate} />}
      {currentPage === 'contact' && <Contact onNavigate={handleNavigate} />}

      {currentPage === 'studentDashboard' && <StudentDashboard onNavigate={handleNavigate} />}
      {currentPage === 'instructorDashboard' && <InstructorDashboard onNavigate={handleNavigate} />}
      {currentPage === 'adminDashboard' && <AdminDashboard onNavigate={handleNavigate} />}
      
      {currentPage === 'courseManagement' && (
        <CourseManagement 
          onNavigate={handleNavigate} 
          userRole={user?.role || 'student'} 
        />
      )}

      {/* FOOTER */}
      {!hideLayout && (
        <Footer onNavigate={handleNavigate} />
      )}
    </div>
  );
}

export default App;