import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Map, 
  MessageCircle, 
  BookOpen, 
  BarChart3, 
  Settings,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown
} from 'lucide-react';
import { useAppStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { icon: Home, path: '/', label: '入职导航' },
  { icon: Map, path: '/knowledge-map', label: '知识地图' },
  { icon: MessageCircle, path: '/qa', label: '问答专区' },
  { icon: BarChart3, path: '/learning-progress', label: '学习进度' },
];

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, logout, switchRole } = useAppStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSwitchRole = (role: 'employee' | 'manager' | 'admin') => {
    switchRole(role);
    setShowRoleMenu(false);
  };

  const isAdmin = currentUser?.role === 'admin';
  const isManager = currentUser?.role === 'manager';

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">公司知识百科</h1>
            </div>

            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => navigate(item.path)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              {(isAdmin || isManager) && (
                <button
                  onClick={() => navigate('/admin')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">管理后台</span>
                </button>
              )}
            </nav>

            <div className="flex items-center gap-3">
              {currentUser && (
                <>
                  <div className="hidden md:flex items-center gap-2 text-sm">
                    <div className="relative">
                      <button
                        onClick={() => setShowRoleMenu(!showRoleMenu)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-primary-600" />
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">{currentUser.name}</p>
                          <p className="text-xs text-gray-500">{currentUser.role === 'admin' ? '管理员' : currentUser.role === 'manager' ? '主管' : '员工'}</p>
                        </div>
                        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {showRoleMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                          <button
                            onClick={() => handleSwitchRole('employee')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                              currentUser.role === 'employee' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <User className="w-4 h-4" />
                            <span>员工身份</span>
                          </button>
                          <button
                            onClick={() => handleSwitchRole('manager')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                              currentUser.role === 'manager' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <User className="w-4 h-4" />
                            <span>主管身份</span>
                          </button>
                          <button
                            onClick={() => handleSwitchRole('admin')}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-left text-sm transition-colors ${
                              currentUser.role === 'admin' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <Settings className="w-4 h-4" />
                            <span>管理员身份</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-600 hover:text-red-500 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">退出</span>
                  </button>
                </>
              )}
              <button
                className="md:hidden p-2 text-gray-600"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <nav className="px-4 py-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      navigate(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
              {(isAdmin || isManager) && (
                <button
                  onClick={() => {
                    navigate('/admin');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    location.pathname === '/admin'
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Settings className="w-5 h-5" />
                  <span className="font-medium">管理后台</span>
                </button>
              )}
              {currentUser && (
                <div className="pt-3 border-t border-gray-100 mt-2">
                  <div className="flex items-center gap-3 px-4 py-2">
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{currentUser.name}</p>
                      <p className="text-xs text-gray-400">{currentUser.role === 'admin' ? '管理员' : currentUser.role === 'manager' ? '主管' : '员工'}</p>
                    </div>
                  </div>
                  <div className="space-y-1 mt-2">
                    <button
                      onClick={() => {
                        handleSwitchRole('employee');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                        currentUser.role === 'employee' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>切换为员工</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSwitchRole('manager');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                        currentUser.role === 'manager' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <User className="w-4 h-4" />
                      <span>切换为主管</span>
                    </button>
                    <button
                      onClick={() => {
                        handleSwitchRole('admin');
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2 text-sm rounded-lg transition-colors ${
                        currentUser.role === 'admin' ? 'bg-primary-50 text-primary-600' : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Settings className="w-4 h-4" />
                      <span>切换为管理员</span>
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 mt-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>退出登录</span>
                  </button>
                </div>
              )}
            </nav>
          </div>
        )}
      </header>

      {showRoleMenu && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowRoleMenu(false)}
        />
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
