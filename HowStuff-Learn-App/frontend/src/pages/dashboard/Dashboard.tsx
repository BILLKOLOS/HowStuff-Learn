import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/slices/authSlice';
import {
    BookOpen,
    Calendar,
    Settings,
    HelpCircle,
    BarChart2,
    Bell,
    Star,
    Brain
} from 'lucide-react';
interface SidebarProps {
    isMobile: boolean;
    setMobileMenuOpen?: (v: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = (isMobile, setMobileMenuOpen) => {
    const mainMenuItems = [
        { icon: BarChart2, text: 'Dashboard', active: true },
        { icon: BookOpen, text: 'My Courses' },
        { icon: Brain, text: 'Interactive Learning' },
        { icon: Star, text: 'Achievements' },
        { icon: Calendar, text: 'Schedule' },
    ];

    const subjectItems = [
        { text: 'Physics', color: 'blue' },
        { text: 'Chemistry', color: 'green' },
        { text: 'Biology', color: 'yellow' },
        { text: 'Mathematics', color: 'purple' },
        { text: 'Engineering', color: 'red' },
    ];

    return (
        <div className={`${!isMobile ? 'fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out' : 'w-64'} min-h-screen bg-white border-r border-gray-200 flex flex-col`}>
            <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
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
            </div>

            <div className="flex flex-col flex-1 pt-4 overflow-y-auto">
                <div className="px-4 text-xs font-medium text-gray-500 mb-2">MAIN MENU</div>
                <nav className="space-y-1">
                    {mainMenuItems.map((item, i) => (
                        <a
                            key={i}
                            href="#"
                            className={`flex items-center space-x-2 px-4 py-2 text-sm ${item.active ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.text}</span>
                        </a>
                    ))}
                </nav>

                <div className="px-4 pt-6 text-xs font-medium text-gray-500 mb-2">SUBJECTS</div>
                <nav className="space-y-1">
                    {subjectItems.map((item, i) => (
                        <a
                            key={i}
                            href="#"
                            className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
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

const ProgressSection = () => (
    <div className="p-6 bg-white rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Learning Progress</h2>
            <button className="text-sm text-blue-600">View All Courses</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">Physics</label>
                    <span className="text-sm font-medium">85%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">Chemistry</label>
                    <span className="text-sm font-medium">72%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-green-600 rounded-full" style={{ width: '72%' }}></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">Biology</label>
                    <span className="text-sm font-medium">68%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-yellow-600 rounded-full" style={{ width: '68%' }}></div>
                </div>
            </div>
            <div className="space-y-2">
                <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-500">Mathematics</label>
                    <span className="text-sm font-medium">91%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-purple-600 rounded-full" style={{ width: '91%' }}></div>
                </div>
            </div>
        </div>
    </div>
);

const ScheduleSection = () => (
    <div className="p-6 bg-white rounded-lg shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4 sm:mb-0">
                <h2 className="text-lg font-semibold mb-2 sm:mb-0">Today's Schedule</h2>
                <div className="flex space-x-2">
                    <button className="px-3 py-1 text-sm rounded bg-blue-100 text-blue-600">Live Classes</button>
                    <button className="px-3 py-1 text-sm rounded">Projects</button>
                </div>
            </div>
            <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Jan 25, 2024</span>
                <button className="px-3 py-1 text-sm rounded bg-blue-600 text-white">Join Class</button>
            </div>
        </div>
        <div className="space-y-4">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="ml-3">
                    <div className="text-sm font-medium">Physics: Principles of Flight</div>
                    <div className="text-xs text-gray-500">10:00 AM - 11:30 AM</div>
                </div>
                <button className="ml-auto px-3 py-1 text-xs rounded bg-green-100 text-green-600">Live Now</button>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="ml-3">
                    <div className="text-sm font-medium">Chemistry Lab: Reactions</div>
                    <div className="text-xs text-gray-500">2:00 PM - 3:30 PM</div>
                </div>
                <button className="ml-auto px-3 py-1 text-xs rounded bg-gray-100 text-gray-600">Upcoming</button>
            </div>
        </div>
    </div>
);

const Dashboard = () => {
    const { user, isAuthenticated } = useAuthStore();
    const [isMobileMenuOpen, setMobileMenuOpen] = React.useState(false);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <div className="hidden md:block">
                <Sidebar isMobile={false} />
            </div>

            {isMobileMenuOpen && (
                <Sidebar isMobile={true} setMobileMenuOpen={setMobileMenuOpen} />
            )}

            <div className="flex-1">
                <div className="p-4 md:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <button
                            className="md:hidden text-gray-500"
                            onClick={() => setMobileMenuOpen(true)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <div className="flex items-center space-x-4">
                            <button className="p-2 text-gray-500 hover:text-gray-700">
                                <Bell className="w-5 h-5" />
                            </button>
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                                <span className="text-sm font-medium hidden sm:block">{user?.name || 'Student'}</span>
                            </div>
                        </div>
                    </div>

                    <ProgressSection />
                    <ScheduleSection />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
