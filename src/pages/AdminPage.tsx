import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Settings, 
  BookOpen, 
  FolderOpen, 
  Plus, 
  Edit, 
  Trash2, 
  X,
  Save,
  ChevronRight,
  CheckCircle2
} from 'lucide-react';
import { useAppStore } from '../store';
import { Entry, TopicPath } from '../types';
import { departments, positions } from '../data/mockData';

type TabType = 'entries' | 'paths';

export function AdminPage() {
  const navigate = useNavigate();
  const { 
    entries, 
    topicPaths, 
    currentUser,
    addEntry, 
    updateEntry, 
    deleteEntry,
    addTopicPath,
    updateTopicPath,
    deleteTopicPath
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<TabType>('entries');
  const [showEntryModal, setShowEntryModal] = useState(false);
  const [showPathModal, setShowPathModal] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [editingPath, setEditingPath] = useState<TopicPath | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    department: '',
    tags: ''
  });
  const [pathFormData, setPathFormData] = useState({
    name: '',
    description: '',
    departments: [] as string[],
    positions: [] as string[],
    entries: [] as string[]
  });

  const handleOpenEntryModal = (entry?: Entry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        title: entry.title,
        content: entry.content,
        department: entry.department,
        tags: entry.tags.join(', ')
      });
    } else {
      setEditingEntry(null);
      setFormData({
        title: '',
        content: '',
        department: departments[0],
        tags: ''
      });
    }
    setShowEntryModal(true);
  };

  const handleOpenPathModal = (path?: TopicPath) => {
    if (path) {
      setEditingPath(path);
      setPathFormData({
        name: path.name,
        description: path.description,
        departments: [...path.departments],
        positions: [...path.positions],
        entries: [...path.entries]
      });
    } else {
      setEditingPath(null);
      setPathFormData({
        name: '',
        description: '',
        departments: [],
        positions: [],
        entries: []
      });
    }
    setShowPathModal(true);
  };

  const handleSaveEntry = () => {
    if (!formData.title || !formData.content) return;
    
    const tags = formData.tags.split(',').map(t => t.trim()).filter(t => t);
    
    if (editingEntry) {
      updateEntry(editingEntry.id, {
        title: formData.title,
        content: formData.content,
        department: formData.department,
        tags
      });
    } else {
      addEntry({
        title: formData.title,
        content: formData.content,
        author_id: currentUser?.id || '',
        department: formData.department,
        tags,
        author: currentUser
      });
    }
    
    setShowEntryModal(false);
    setEditingEntry(null);
  };

  const handleSavePath = () => {
    if (!pathFormData.name) return;
    
    if (editingPath) {
      updateTopicPath(editingPath.id, pathFormData);
    } else {
      addTopicPath(pathFormData);
    }
    
    setShowPathModal(false);
    setEditingPath(null);
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('确定删除此词条？')) {
      deleteEntry(id);
    }
  };

  const handleDeletePath = (id: string) => {
    if (confirm('确定删除此主题路径？')) {
      deleteTopicPath(id);
    }
  };

  const toggleDepartment = (dept: string) => {
    setPathFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const togglePosition = (pos: string) => {
    setPathFormData(prev => ({
      ...prev,
      positions: prev.positions.includes(pos)
        ? prev.positions.filter(p => p !== pos)
        : [...prev.positions, pos]
    }));
  };

  const toggleEntry = (entryId: string) => {
    setPathFormData(prev => ({
      ...prev,
      entries: prev.entries.includes(entryId)
        ? prev.entries.filter(e => e !== entryId)
        : [...prev.entries, entryId]
    }));
  };

  if (!currentUser || (currentUser.role !== 'admin' && currentUser.role !== 'manager')) {
    return (
      <div className="text-center py-16">
        <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">您没有权限访问此页面</p>
        <button onClick={() => navigate('/')} className="btn-primary mt-4">
          返回首页
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-7 h-7 text-primary-600" />
            管理后台
          </h1>
          <p className="text-gray-600 mt-1">维护知识内容和主题路径</p>
        </div>
      </div>

      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('entries')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'entries'
              ? 'bg-white shadow-sm text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          知识词条
        </button>
        <button
          onClick={() => setActiveTab('paths')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors ${
            activeTab === 'paths'
              ? 'bg-white shadow-sm text-primary-600'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <FolderOpen className="w-5 h-5" />
          主题路径
        </button>
      </div>

      {activeTab === 'entries' && (
        <>
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">词条列表</h2>
              <button
                onClick={() => handleOpenEntryModal()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                新增词条
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {entries.map(entry => (
              <div key={entry.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                      <span className="badge badge-info">{entry.department}</span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{entry.content}</p>
                    <div className="flex items-center gap-4">
                      <div className="flex flex-wrap gap-1">
                        {entry.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        更新于 {new Date(entry.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleOpenEntryModal(entry)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEntry(entry.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'paths' && (
        <>
          <div className="card mb-6">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">主题路径列表</h2>
              <button
                onClick={() => handleOpenPathModal()}
                className="btn-primary flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                新增路径
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {topicPaths.map(path => (
              <div key={path.id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{path.name}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{path.description}</p>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 mr-2">适用部门:</span>
                        {path.departments.map(dept => (
                          <span key={dept} className="px-2 py-0.5 bg-blue-100 text-blue-600 text-xs rounded-full">
                            {dept}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 mr-2">适用岗位:</span>
                        {path.positions.map(pos => (
                          <span key={pos} className="px-2 py-0.5 bg-green-100 text-green-600 text-xs rounded-full">
                            {pos}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-gray-500 mr-2">包含词条:</span>
                        {path.entries.map(entryId => {
                          const entry = entries.find(e => e.id === entryId);
                          return (
                            <span key={entryId} className="px-2 py-0.5 bg-purple-100 text-purple-600 text-xs rounded-full">
                              {entry?.title || entryId}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleOpenPathModal(path)}
                      className="p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeletePath(path.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {showEntryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingEntry ? '编辑词条' : '新增词条'}
              </h2>
              <button
                onClick={() => {
                  setShowEntryModal(false);
                  setEditingEntry(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">词条标题</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="输入词条标题"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">适用部门</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                  className="input-field"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">标签（逗号分隔）</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="制度, 流程, HR"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">词条内容</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="输入词条内容，支持 Markdown 格式"
                  rows={8}
                  className="textarea-field"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowEntryModal(false);
                    setEditingEntry(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleSaveEntry}
                  disabled={!formData.title || !formData.content}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    formData.title && formData.content
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPathModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">
                {editingPath ? '编辑主题路径' : '新增主题路径'}
              </h2>
              <button
                onClick={() => {
                  setShowPathModal(false);
                  setEditingPath(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">路径名称</label>
                <input
                  type="text"
                  value={pathFormData.name}
                  onChange={(e) => setPathFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="输入路径名称"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">路径描述</label>
                <textarea
                  value={pathFormData.description}
                  onChange={(e) => setPathFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="输入路径描述"
                  rows={3}
                  className="textarea-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">适用部门</label>
                <div className="flex flex-wrap gap-2">
                  {departments.map(dept => (
                    <button
                      key={dept}
                      onClick={() => toggleDepartment(dept)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        pathFormData.departments.includes(dept)
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">适用岗位</label>
                <div className="flex flex-wrap gap-2">
                  {positions.map(pos => (
                    <button
                      key={pos}
                      onClick={() => togglePosition(pos)}
                      className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                        pathFormData.positions.includes(pos)
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">包含词条</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {entries.map(entry => (
                    <button
                      key={entry.id}
                      onClick={() => toggleEntry(entry.id)}
                      className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                        pathFormData.entries.includes(entry.id)
                          ? 'bg-purple-50 border border-purple-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {pathFormData.entries.includes(entry.id) && (
                          <CheckCircle2 className="w-5 h-5 text-purple-600" />
                        )}
                        <span className="text-gray-900">{entry.title}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPathModal(false);
                    setEditingPath(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleSavePath}
                  disabled={!pathFormData.name}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    pathFormData.name
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Save className="w-5 h-5" />
                  保存
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
