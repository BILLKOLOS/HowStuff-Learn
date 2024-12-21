import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/slices/authSlice';
import {
  BookOpen,
  Calendar,
  Settings,
  HelpCircle,
  BarChart2,
  Star,
  Brain
} from 'lucide-react';
import Greeting from '../../components/Greeting/Greeting';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import ProgressSection from '../../components/ProgressSection/ProgressSection';
import ScheduleSection from '../../components/ScheduleSection/ScheduleSection';
import NotificationsSection from '../../components/NotificationsSection/NotificationsSection';
import QuickActionsSection from '../../components/QuickActionsSection/QuickActionsSection';

const Sidebar = ({ isMobile, setMobileMenuOpen }) => {
  const mainMenuItems = [
    { icon: BarChart2, text: 'Dashboard', active: true },
    { icon: BookOpen, text: 'My Courses' },
    { icon: Brain, text: 'Interactive Learning' },
    { icon: Star, text: 'Achievements' },
    { icon: Calendar, text: 'Schedule' }
  ];

  const subjectItems = [
    { text: 'Physics', color: 'blue' },
    { text: 'Chemistry', color: 'green' },
    { text: 'Biology', color: 'yellow' },
    { text: 'Mathematics', color: 'purple' },
    { text: 'Engineering', color: 'red' }
  ];

  return (
    <div className={`${isMobile ? 'fixed inset-0 z-50 bg-white' : 'w-64'} min-h-screen border-r border-gray-200 flex flex-col`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
          <span className="font-semibold">HowStuff & Learn</span>
        </div>
        {isMobile && (
          <button onClick={() => setMobileMenuOpen(false)} className="text-gray-500">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="flex flex-col flex-1 pt-4 overflow-y-auto">
        <div className="px-4 text-xs font-medium text-gray-500 mb-2">MAIN MENU</div>
        <nav className="space-y-1">
          {mainMenuItems.map((item, i) => (
            <a
              key={i}
              href="#"
              className={`flex items-center space-x-2 px-4 py-2 text-sm ${item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.text}</span>
            </a>
          ))}
        </nav>

        <div className="px-4 pt-6 text-xs font-medium text-gray-500 mb-2">SUBJECTS</div>
        <nav className="space-y-1">
          {subjectItems.map((item, i) => (
            <a key={i} href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <span className={`w-2 h-2 rounded-full bg-${item.color}-500`}></span>
              <span>{item.text}</span>
            </a>
          ))}
        </nav>

        <div className="mt-auto">
          <div className="px-4 py-2">
            <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
            <a href="#" className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              <HelpCircle className="w-5 h-5" />
              <span>Help Center</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar isMobile={false} />
      <div className="flex-1 p-6 bg-gray-100">
        <Greeting username={user?.username} progress={user?.progress || 0} />
        <SummaryCards />
        <ProgressSection />
        <QuickActionsSection />
        <NotificationsSection />
        <ScheduleSection />
      </div>
    </div>
  );
};

export default Dashboard;
