import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  AlertCircle, 
  MessageCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  TrendingUp,
  Target,
  User
} from 'lucide-react';
import { useAppStore } from '../store';
import { mockEntries } from '../data/mockData';

export function LearningProgressPage() {
  const { 
    currentUser, 
    learningRecords, 
    getLearningProgress,
    getTeamProgress,
    getWeakPoints,
    getUnansweredQuestions
  } = useAppStore();
  
  const [viewMode, setViewMode] = useState<'personal' | 'team'>('personal');

  const progress = getLearningProgress();
  const teamProgress = getTeamProgress();
  const weakPoints = getWeakPoints();
  const unansweredQuestions = getUnansweredQuestions();

  const completionRate = progress.total > 0 ? Math.round((progress.completed / progress.total) * 100) : 0;
  const readRate = progress.total > 0 ? Math.round((progress.read / progress.total) * 100) : 0;

  const userRecords = learningRecords.filter(r => r.user_id === currentUser?.id);
  const userEntries = mockEntries.map(entry => {
    const record = userRecords.find(r => r.entry_id === entry.id);
    return {
      ...entry,
      read: record?.read || false,
      completed: record?.quiz_passed || false,
      completed_at: record?.completed_at
    };
  });

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-7 h-7 text-primary-600" />
            学习进度
          </h1>
          <p className="text-gray-600 mt-1">追踪您的学习进度和团队表现</p>
        </div>
        
        {(currentUser?.role === 'manager' || currentUser?.role === 'admin') && (
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('personal')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'personal'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              个人进度
            </button>
            <button
              onClick={() => setViewMode('team')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                viewMode === 'team'
                  ? 'bg-white shadow-sm text-primary-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              团队管理
            </button>
          </div>
        )}
      </div>

      {viewMode === 'personal' ? (
        <>
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-primary-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{completionRate}%</div>
              <div className="text-gray-600">完成率</div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary-600 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{progress.read}/{progress.total}</div>
              <div className="text-gray-600">已阅读</div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-500"
                  style={{ width: `${readRate}%` }}
                />
              </div>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{progress.completed}/{progress.total}</div>
              <div className="text-gray-600">已完成</div>
              <div className="mt-4 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-500 rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary-600" />
              学习记录
            </h2>
            <div className="space-y-3">
              {userEntries.map(entry => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-xl ${
                    entry.completed 
                      ? 'bg-success-50 border border-success-200'
                      : entry.read
                      ? 'bg-blue-50 border border-blue-200'
                      : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      entry.completed ? 'bg-success-100' : 'bg-gray-100'
                    }`}>
                      {entry.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-success-600" />
                      ) : entry.read ? (
                        <Clock className="w-5 h-5 text-blue-500" />
                      ) : (
                        <BookOpen className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{entry.title}</div>
                      <div className="text-sm text-gray-500">
                        {entry.department} · 更新于 {new Date(entry.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${
                    entry.completed ? 'text-success-600' : entry.read ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {entry.completed ? '已完成' : entry.read ? '已阅读' : '未开始'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="card mb-6">
            <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary-600" />
              团队完成率
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {teamProgress.map(team => (
                <div key={team.department} className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-900">{team.department}</span>
                    <span className="text-2xl font-bold text-primary-600">{team.completion_rate}%</span>
                  </div>
                  <div className="h-3 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div 
                      className="h-full bg-primary-600 rounded-full transition-all duration-500"
                      style={{ width: `${team.completion_rate}%` }}
                    />
                  </div>
                  <div className="text-sm text-gray-600">
                    {team.completed_employees}/{team.total_employees} 人完成
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
                薄弱知识点
              </h2>
              <div className="space-y-4">
                {weakPoints.map(point => {
                  const failureRate = Math.round((point.failed_count / point.attempted_count) * 100);
                  return (
                    <div key={point.entry_id} className="bg-yellow-50 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{point.entry_title}</span>
                        <span className="text-lg font-bold text-yellow-600">{failureRate}%</span>
                      </div>
                      <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-yellow-500 rounded-full"
                          style={{ width: `${failureRate}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        失败 {point.failed_count} 次 / 尝试 {point.attempted_count} 次
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="card">
              <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                待回复问题
              </h2>
              <div className="space-y-3">
                {unansweredQuestions.map(question => (
                  <div key={question.id} className="bg-blue-50 rounded-xl p-4">
                    <div className="font-medium text-gray-900 mb-2">{question.title}</div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="w-4 h-4" />
                      <span>{question.author?.name}</span>
                      <span className="mx-2">·</span>
                      <span>{new Date(question.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
                
                {unansweredQuestions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>暂无待回复问题</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
