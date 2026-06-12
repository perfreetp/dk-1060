import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  UserCheck, 
  BookOpen, 
  ArrowRight,
  Calendar,
  Target,
  CheckCircle2,
  Clock,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store';
import { positions, departments } from '../data/mockData';
import { TopicPath } from '../types';
import { mockTopicPaths, mockEntries } from '../data/mockData';

export function OnboardingPage() {
  const navigate = useNavigate();
  const { setSelectedPosition, setSelectedDepartment, currentUser, learningRecords } = useAppStore();
  const [selectedPosition, setSelectedPositionLocal] = useState(currentUser?.position || '');
  const [selectedDepartment, setSelectedDepartmentLocal] = useState(currentUser?.department || '');

  const filteredPaths = mockTopicPaths.filter(path => {
    if (!selectedPosition && !selectedDepartment) return true;
    if (selectedPosition) return path.positions.includes(selectedPosition);
    if (selectedDepartment) return path.departments.includes(selectedDepartment);
    return true;
  });

  const getRelevantEntries = (path: TopicPath) => {
    return mockEntries.filter(e => path.entries.includes(e.id));
  };

  const getEntryProgress = (entryId: string) => {
    const record = learningRecords.find(
      r => r.user_id === currentUser?.id && r.entry_id === entryId
    );
    if (!record) return 'not-started';
    if (record.quiz_passed) return 'completed';
    if (record.read) return 'read';
    return 'not-started';
  };

  const handleStartLearning = () => {
    if (!selectedPosition) return;
    setSelectedPosition(selectedPosition);
    setSelectedDepartment(selectedDepartment);
    navigate('/knowledge-map');
  };

  const handleSelectPosition = (position: string) => {
    setSelectedPositionLocal(position);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-white mb-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">欢迎加入公司知识百科</h1>
            <p className="text-primary-100 text-lg">
              新员工入职学习平台，帮助您快速了解公司文化和业务流程
            </p>
          </div>
          <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
            <UserCheck className="w-12 h-12" />
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">50+</div>
            <div className="text-sm text-primary-100">知识词条</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">10+</div>
            <div className="text-sm text-primary-100">学习路径</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">100%</div>
            <div className="text-sm text-primary-100">覆盖率</div>
          </div>
          <div className="bg-white/10 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm text-primary-100">随时学习</div>
          </div>
        </div>
      </div>

      <div className="card mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-primary-600" />
          选择您的岗位
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {positions.map((position) => (
            <button
              key={position}
              onClick={() => handleSelectPosition(position)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedPosition === position
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-100 hover:border-gray-200'
              }`}
            >
              <div className="text-sm font-medium text-gray-900">{position}</div>
              <div className="text-xs text-gray-500 mt-1">
                {departments.find(d => position.includes('工程师') ? '技术部' : position.includes('市场') ? '市场部' : position.includes('财务') ? '财务部' : position.includes('HR') ? '人力资源部' : '综合管理部')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {selectedPosition && (
        <div className="card">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-primary-600" />
            推荐学习路径
          </h2>
          
          <div className="space-y-4">
            {filteredPaths.map((path) => (
              <div key={path.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{path.name}</h3>
                    <p className="text-sm text-gray-500">{path.description}</p>
                  </div>
                  <button
                    onClick={handleStartLearning}
                    className="btn-primary flex items-center gap-1"
                  >
                    开始学习 <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {getRelevantEntries(path).map((entry) => {
                    const progress = getEntryProgress(entry.id);
                    return (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            progress === 'completed' ? 'bg-success-100' : 'bg-gray-100'
                          }`}>
                            {progress === 'completed' ? (
                              <CheckCircle2 className="w-5 h-5 text-success-600" />
                            ) : progress === 'read' ? (
                              <Clock className="w-5 h-5 text-gray-500" />
                            ) : (
                              <BookOpen className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{entry.title}</div>
                            <div className="text-xs text-gray-500">{entry.department}</div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6 mt-8">
        <div className="card">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
            <BookOpen className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">系统化学习</h3>
          <p className="text-sm text-gray-600">按岗位定制学习路径，循序渐进掌握知识</p>
        </div>
        <div className="card">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-4">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">测验巩固</h3>
          <p className="text-sm text-gray-600">每篇词条配有小测，检验学习效果</p>
        </div>
        <div className="card">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">进度追踪</h3>
          <p className="text-sm text-gray-600">实时查看学习进度，主管可追踪团队完成情况</p>
        </div>
      </div>
    </div>
  );
}
