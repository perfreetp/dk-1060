import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  FolderOpen,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Users,
  Clock,
  Tag
} from 'lucide-react';
import { useAppStore } from '../store';
import { mockEntries, mockTopicPaths } from '../data/mockData';
import { Entry } from '../types';

export function KnowledgeMapPage() {
  const navigate = useNavigate();
  const { selectedPosition, learningRecords, currentUser } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<string[]>(['1']);

  const relevantPaths = selectedPosition
    ? mockTopicPaths.filter(p => p.positions.includes(selectedPosition))
    : mockTopicPaths;

  const filteredEntries = mockEntries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || entry.department === selectedDepartment;
    return matchesSearch && matchesDepartment;
  });

  const getEntryProgress = (entryId: string) => {
    const record = learningRecords.find(
      r => r.user_id === currentUser?.id && r.entry_id === entryId
    );
    if (!record) return 'not-started';
    if (record.quiz_passed) return 'completed';
    if (record.read) return 'read';
    return 'not-started';
  };

  const togglePath = (pathId: string) => {
    setExpandedPaths(prev => 
      prev.includes(pathId) 
        ? prev.filter(id => id !== pathId)
        : [...prev, pathId]
    );
  };

  const departments = [...new Set(mockEntries.map(e => e.department))];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索知识词条..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="input-field"
            >
              <option value="">全部部门</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <FolderOpen className="w-6 h-6 text-primary-600" />
            学习路径
          </h2>
          
          <div className="space-y-3">
            {relevantPaths.map((path) => {
              const entries = mockEntries.filter(e => path.entries.includes(e.id));
              const total = entries.length;
              const completed = entries.filter(e => getEntryProgress(e.id) === 'completed').length;
              
              return (
                <div key={path.id} className="card">
                  <button
                    onClick={() => togglePath(path.id)}
                    className="w-full flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FolderOpen className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-gray-900">{path.name}</h3>
                        <p className="text-sm text-gray-500">{path.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-sm text-gray-600">
                        {completed}/{total} 已完成
                      </div>
                      {expandedPaths.includes(path.id) ? (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                  </button>

                  {expandedPaths.includes(path.id) && (
                    <div className="mt-4 space-y-2">
                      {entries.map((entry) => {
                        const progress = getEntryProgress(entry.id);
                        return (
                          <div
                            key={entry.id}
                            onClick={() => navigate(`/entry/${entry.id}`)}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                              progress === 'completed' 
                                ? 'bg-success-50 border border-success-200' 
                                : progress === 'read'
                                ? 'bg-blue-50 border border-blue-200'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <BookOpen className={`w-5 h-5 ${
                                  progress === 'completed' ? 'text-success-600' : 'text-gray-400'
                                }`} />
                                <div>
                                  <div className="font-medium text-gray-900">{entry.title}</div>
                                  <div className="text-xs text-gray-500">
                                    {entry.department} · 更新于 {new Date(entry.updated_at).toLocaleDateString()}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-xs px-2 py-1 rounded-full ${
                                progress === 'completed' 
                                  ? 'bg-success-100 text-success-700'
                                  : progress === 'read'
                                  ? 'bg-blue-100 text-blue-700'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {progress === 'completed' ? '已完成' : progress === 'read' ? '已阅读' : '未开始'}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">快速统计</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">总词条数</span>
                <span className="font-bold text-gray-900">{mockEntries.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">已阅读</span>
                <span className="font-bold text-blue-600">
                  {learningRecords.filter(r => r.user_id === currentUser?.id && r.read).length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">已完成</span>
                <span className="font-bold text-success-600">
                  {learningRecords.filter(r => r.user_id === currentUser?.id && r.quiz_passed).length}
                </span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">热门标签</h3>
            <div className="flex flex-wrap gap-2">
              {['制度', '技术', '流程', '规范', '系统', '客服'].map(tag => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-100 hover:text-primary-600 cursor-pointer transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-4">部门分类</h3>
            <div className="space-y-2">
              {departments.map(dept => {
                const count = mockEntries.filter(e => e.department === dept).length;
                return (
                  <button
                    key={dept}
                    onClick={() => setSelectedDepartment(selectedDepartment === dept ? '' : dept)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                      selectedDepartment === dept 
                        ? 'bg-primary-50 text-primary-600' 
                        : 'hover:bg-gray-50 text-gray-600'
                    }`}
                  >
                    <span>{dept}</span>
                    <span className="text-sm">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
