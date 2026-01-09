import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Upload, Video, FileText, Play, Download, 
  Trash2, Clock, BookOpen
} from 'lucide-react';
import type { Page } from '../types';

interface Lecture {
  id: string;
  title: string;
  duration: string;
  uploadDate: string;
  videoUrl?: string;
}

interface Material {
  id: string;
  title: string;
  type: string;
  size: string;
  uploadDate: string;
}

interface Props {
  onNavigate: (page: Page) => void;
  userRole: 'student' | 'instructor';
}

export default function CourseManagement({ onNavigate, userRole }: Props) {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [showLectureUpload, setShowLectureUpload] = useState(false);
  const [showMaterialUpload, setShowMaterialUpload] = useState(false);
  
  const [lectureTitle, setLectureTitle] = useState('');
  const [lectureDuration, setLectureDuration] = useState('');
  const [lectureFile, setLectureFile] = useState<File | null>(null);
  
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialFile, setMaterialFile] = useState<File | null>(null);

  useEffect(() => {
    const savedLectures = localStorage.getItem('courseLectures');
    const savedMaterials = localStorage.getItem('courseMaterials');
    
    if (savedLectures) setLectures(JSON.parse(savedLectures));
    if (savedMaterials) setMaterials(JSON.parse(savedMaterials));
  }, []);

  const handleLectureUpload = () => {
    if (!lectureTitle || !lectureDuration || !lectureFile) {
      alert('Please fill all fields');
      return;
    }

    const newLecture: Lecture = {
      id: Date.now().toString(),
      title: lectureTitle,
      duration: lectureDuration,
      uploadDate: new Date().toLocaleDateString(),
      videoUrl: lectureFile.name
    };

    const updatedLectures = [...lectures, newLecture];
    setLectures(updatedLectures);
    localStorage.setItem('courseLectures', JSON.stringify(updatedLectures));
    
    setLectureTitle('');
    setLectureDuration('');
    setLectureFile(null);
    setShowLectureUpload(false);
    alert('Lecture uploaded successfully!');
  };

  const handleMaterialUpload = () => {
    if (!materialTitle || !materialFile) {
      alert('Please fill all fields');
      return;
    }

    const fileSize = (materialFile.size / (1024 * 1024)).toFixed(2);
    const fileType = materialFile.name.split('.').pop()?.toUpperCase() || 'FILE';

    const newMaterial: Material = {
      id: Date.now().toString(),
      title: materialTitle,
      type: fileType,
      size: `${fileSize} MB`,
      uploadDate: new Date().toLocaleDateString()
    };

    const updatedMaterials = [...materials, newMaterial];
    setMaterials(updatedMaterials);
    localStorage.setItem('courseMaterials', JSON.stringify(updatedMaterials));
    
    setMaterialTitle('');
    setMaterialFile(null);
    setShowMaterialUpload(false);
    alert('Material uploaded successfully!');
  };

  const deleteLecture = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lecture?')) return;
    const updatedLectures = lectures.filter(l => l.id !== id);
    setLectures(updatedLectures);
    localStorage.setItem('courseLectures', JSON.stringify(updatedLectures));
  };

  const deleteMaterial = (id: string) => {
    if (!window.confirm('Are you sure you want to delete this material?')) return;
    const updatedMaterials = materials.filter(m => m.id !== id);
    setMaterials(updatedMaterials);
    localStorage.setItem('courseMaterials', JSON.stringify(updatedMaterials));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <button
            onClick={() => onNavigate(userRole === 'instructor' ? 'instructorDashboard' : 'studentDashboard')}
            className="flex items-center text-white hover:text-teal-200 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">Introduction to Computer Technology</h1>
              <p className="text-teal-100 text-lg mt-2">
                {userRole === 'instructor' ? 'Manage your course content' : 'Access your learning materials'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              {userRole === 'instructor' ? 'Uploaded Lectures' : 'Course Lectures'}
            </h2>
            {userRole === 'instructor' && (
              <button
                onClick={() => setShowLectureUpload(true)}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Video Lecture
              </button>
            )}
          </div>

          {lectures.length === 0 ? (
            <div className="text-center py-12">
              <Video className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No lectures uploaded yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lectures.map((lecture) => (
                <div key={lecture.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition">
                  <div className="bg-gradient-to-br from-teal-500 to-blue-500 h-40 flex items-center justify-center">
                    <Video className="w-16 h-16 text-white opacity-80" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2">{lecture.title}</h3>
                    <div className="flex items-center text-sm text-gray-600 mb-3">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{lecture.duration}</span>
                      <span className="mx-2">•</span>
                      <span>{lecture.uploadDate}</span>
                    </div>
                    <div className="flex space-x-2">
                      {userRole === 'student' ? (
                        <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center">
                          <Play className="w-4 h-4 mr-2" />
                          Watch
                        </button>
                      ) : (
                        <>
                          <button className="flex-1 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 flex items-center justify-center">
                            <Play className="w-4 h-4 mr-2" />
                            Preview
                          </button>
                          <button
                            onClick={() => deleteLecture(lecture.id)}
                            className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Additional Materials</h2>
            {userRole === 'instructor' && (
              <button
                onClick={() => setShowMaterialUpload(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Material
              </button>
            )}
          </div>

          {materials.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No materials uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {materials.map((material) => (
                <div key={material.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{material.title}</h4>
                      <p className="text-sm text-gray-600">
                        {material.type} • {material.size} • {material.uploadDate}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </button>
                    {userRole === 'instructor' && (
                      <button
                        onClick={() => deleteMaterial(material.id)}
                        className="px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showLectureUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Upload Video Lecture</h3>
              <button onClick={() => setShowLectureUpload(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lecture Title</label>
                <input 
                  type="text" 
                  value={lectureTitle}
                  onChange={(e) => setLectureTitle(e.target.value)}
                  placeholder="e.g., Introduction to Programming" 
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <input 
                  type="text" 
                  value={lectureDuration}
                  onChange={(e) => setLectureDuration(e.target.value)}
                  placeholder="e.g., 45:30" 
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video File</label>
                <input 
                  type="file" 
                  accept="video/*"
                  onChange={(e) => setLectureFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-teal-500"
                />
                <p className="text-sm text-gray-500 mt-2">Supports: MP4, AVI, MOV</p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowLectureUpload(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleLectureUpload}
                  className="flex-1 px-4 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showMaterialUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Upload Material</h3>
              <button onClick={() => setShowMaterialUpload(false)} className="text-gray-400 hover:text-gray-600">
                ✕
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Material Title</label>
                <input 
                  type="text" 
                  value={materialTitle}
                  onChange={(e) => setMaterialTitle(e.target.value)}
                  placeholder="e.g., Course Syllabus" 
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File</label>
                <input 
                  type="file" 
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  onChange={(e) => setMaterialFile(e.target.files?.[0] || null)}
                  className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-sm text-gray-500 mt-2">Supports: PDF, DOC, DOCX, PPT, PPTX</p>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowMaterialUpload(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleMaterialUpload}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}