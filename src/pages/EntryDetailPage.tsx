import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  User, 
  Building2, 
  Clock, 
  BookOpen,
  CheckCircle2,
  PlayCircle,
  MessageCircle,
  Tag,
  ChevronRight
} from 'lucide-react';
import { useAppStore } from '../store';
import { mockEntries } from '../data/mockData';

export function EntryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    markEntryRead, 
    learningRecords, 
    currentUser,
    getQuizQuestions,
    submitQuiz
  } = useAppStore();
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<'pending' | 'passed' | 'failed'>('pending');
  const [isMarkingRead, setIsMarkingRead] = useState(false);

  const entry = mockEntries.find(e => e.id === id);
  
  useEffect(() => {
    if (!entry) return;
    markEntryRead(entry.id);
  }, [entry, markEntryRead]);

  const getEntryProgress = () => {
    const record = learningRecords.find(
      r => r.user_id === currentUser?.id && r.entry_id === id
    );
    if (!record) return 'not-started';
    if (record.quiz_passed) return 'completed';
    if (record.read) return 'read';
    return 'not-started';
  };

  const quizQuestions = getQuizQuestions(id || '');

  const handleAnswerChange = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...quizAnswers];
    newAnswers[questionIndex] = answerIndex;
    setQuizAnswers(newAnswers);
  };

  const handleSubmitQuiz = () => {
    if (quizAnswers.length < quizQuestions.length) return;
    const passed = submitQuiz(id || '', quizAnswers);
    setQuizResult(passed ? 'passed' : 'failed');
  };

  const handleRetryQuiz = () => {
    setQuizAnswers([]);
    setQuizResult('pending');
  };

  if (!entry) {
    return (
      <div className="text-center py-16">
        <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">词条不存在</p>
        <button onClick={() => navigate('/knowledge-map')} className="btn-primary mt-4">
          返回知识地图
        </button>
      </div>
    );
  }

  const progress = getEntryProgress();

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/knowledge-map')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回知识地图</span>
      </button>

      <div className="card mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{entry.title}</h1>
              <span className={`badge ${
                progress === 'completed' ? 'badge-success' : 
                progress === 'read' ? 'badge-info' : 'badge-pending'
              }`}>
                {progress === 'completed' ? '已完成' : 
                 progress === 'read' ? '已阅读' : '未开始'}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{entry.author?.name || '未知'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                <span>{entry.department}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>更新于 {new Date(entry.updated_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {entry.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="card mb-6">
        <div className="prose prose-gray max-w-none">
          {entry.content.split('\n').map((line, index) => {
            if (line.startsWith('## ')) {
              return <h2 key={index} className="text-xl font-bold text-gray-900 mt-6 mb-3">{line.slice(3)}</h2>;
            }
            if (line.startsWith('### ')) {
              return <h3 key={index} className="text-lg font-semibold text-gray-800 mt-4 mb-2">{line.slice(4)}</h3>;
            }
            if (line.startsWith('- ')) {
              return <li key={index} className="ml-4 text-gray-600">{line.slice(2)}</li>;
            }
            if (line.match(/^\d+\./)) {
              return <li key={index} className="ml-4 text-gray-600">{line}</li>;
            }
            if (line.trim()) {
              return <p key={index} className="text-gray-600 mb-2">{line}</p>;
            }
            return null;
          })}
        </div>
      </div>

      {quizQuestions.length > 0 && (
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <PlayCircle className="w-5 h-5 text-primary-600" />
              知识测验
            </h3>
            <button
              onClick={() => {
                setShowQuiz(!showQuiz);
                if (!showQuiz) {
                  setQuizAnswers([]);
                  setQuizResult('pending');
                }
              }}
              className={`btn-primary flex items-center gap-2 ${
                showQuiz ? 'bg-gray-600 hover:bg-gray-700' : ''
              }`}
            >
              {showQuiz ? '收起测验' : '开始测验'}
            </button>
          </div>

          {showQuiz && (
            <div className="space-y-6">
              {quizResult === 'pending' ? (
                <>
                  {quizQuestions.map((question, qIndex) => (
                    <div key={question.id} className="border border-gray-200 rounded-xl p-4">
                      <p className="font-medium text-gray-900 mb-3">{qIndex + 1}. {question.question}</p>
                      <div className="space-y-2">
                        {question.options.map((option, oIndex) => (
                          <button
                            key={oIndex}
                            onClick={() => handleAnswerChange(qIndex, oIndex)}
                            className={`w-full text-left px-4 py-3 rounded-lg border-2 transition-colors ${
                              quizAnswers[qIndex] === oIndex
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-100 hover:border-gray-200'
                            }`}
                          >
                            <span className="font-medium text-gray-900">{String.fromCharCode(65 + oIndex)}. </span>
                            <span className="text-gray-600">{option}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={quizAnswers.length < quizQuestions.length}
                    className={`w-full py-3 rounded-lg font-medium transition-colors ${
                      quizAnswers.length >= quizQuestions.length
                        ? 'bg-success-500 text-white hover:bg-success-600'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    提交答案
                  </button>
                </>
              ) : (
                <div className={`text-center py-8 ${
                  quizResult === 'passed' ? 'bg-success-50' : 'bg-red-50'
                } rounded-xl`}>
                  {quizResult === 'passed' ? (
                    <>
                      <CheckCircle2 className="w-16 h-16 text-success-600 mx-auto mb-4" />
                      <h4 className="text-xl font-bold text-success-700 mb-2">恭喜通过!</h4>
                      <p className="text-success-600 mb-4">您已完成本词条的学习</p>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl font-bold text-red-600">✗</span>
                      </div>
                      <h4 className="text-xl font-bold text-red-700 mb-2">未通过</h4>
                      <p className="text-red-600 mb-4">请重新阅读词条内容并再次尝试</p>
                    </>
                  )}
                  <button
                    onClick={handleRetryQuiz}
                    className="btn-primary"
                  >
                    重新测验
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3 className="font-semibold text-gray-900 mb-4">相关阅读</h3>
        <div className="space-y-3">
          {mockEntries
            .filter(e => e.id !== id && e.department === entry.department)
            .slice(0, 3)
            .map(related => (
              <button
                key={related.id}
                onClick={() => navigate(`/entry/${related.id}`)}
                className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-900">{related.title}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}
