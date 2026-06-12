import { useState } from 'react';
import { 
  MessageCircle, 
  Plus, 
  Clock, 
  User,
  ThumbsUp,
  CheckCircle2,
  Send,
  X,
  FileText,
  Sparkles
} from 'lucide-react';
import { useAppStore } from '../store';
import { Question } from '../types';

export function QAPage() {
  const { getQuestions, addQuestion, addAnswer, adoptAnswer, convertToEntry, currentUser } = useAppStore();
  const [showAskModal, setShowAskModal] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'answered'>('all');
  const [showConvertModal, setShowConvertModal] = useState(false);

  const questions = getQuestions();

  const filteredQuestions = questions.filter(q => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'pending') return q.status === 'pending';
    if (filterStatus === 'answered') return q.status === 'answered' || q.status === 'adopted';
    return true;
  });

  const currentQuestion = selectedQuestion 
    ? questions.find(q => q.id === selectedQuestion.id) || selectedQuestion
    : null;

  const handleAskQuestion = () => {
    if (!newQuestionTitle || !newQuestionContent) return;
    addQuestion(newQuestionTitle, newQuestionContent);
    setNewQuestionTitle('');
    setNewQuestionContent('');
    setShowAskModal(false);
  };

  const handleAnswerQuestion = () => {
    if (!newAnswer || !selectedQuestion) return;
    addAnswer(selectedQuestion.id, newAnswer);
    setNewAnswer('');
    const updatedQuestions = getQuestions();
    const updatedQuestion = updatedQuestions.find(q => q.id === selectedQuestion.id);
    if (updatedQuestion) {
      setSelectedQuestion(updatedQuestion);
    }
  };

  const handleAdoptAnswer = (answerId: string) => {
    if (!selectedQuestion) return;
    adoptAnswer(selectedQuestion.id, answerId);
    const updatedQuestions = getQuestions();
    const updatedQuestion = updatedQuestions.find(q => q.id === selectedQuestion.id);
    if (updatedQuestion) {
      setSelectedQuestion(updatedQuestion);
    }
  };

  const handleConvertToEntry = () => {
    if (!selectedQuestion) return;
    convertToEntry(selectedQuestion.id);
    setShowConvertModal(false);
    setSelectedQuestion(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="badge badge-pending">待回答</span>;
      case 'answered':
        return <span className="badge badge-info">已回答</span>;
      case 'adopted':
        return <span className="badge badge-success">已采纳</span>;
      default:
        return null;
    }
  };

  const pendingCount = questions.filter(q => q.status === 'pending').length;
  const answeredCount = questions.filter(q => q.status === 'answered' || q.status === 'adopted').length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageCircle className="w-7 h-7 text-primary-600" />
            问答专区
          </h1>
          <p className="text-gray-600 mt-1">有疑问？在这里提问，大家一起解答</p>
        </div>
        <button
          onClick={() => setShowAskModal(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          发起提问
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'all'
              ? 'bg-primary-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          全部 ({questions.length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'pending'
              ? 'bg-yellow-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          待回答 ({pendingCount})
        </button>
        <button
          onClick={() => setFilterStatus('answered')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filterStatus === 'answered'
              ? 'bg-success-500 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          已回答 ({answeredCount})
        </button>
      </div>

      <div className="space-y-4">
        {filteredQuestions.map(question => (
          <div
            key={question.id}
            className="card cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedQuestion(question)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{question.title}</h3>
                  {getStatusBadge(question.status)}
                </div>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{question.content}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{question.author?.name || '匿名'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(question.created_at).toLocaleDateString()}</span>
                  </div>
                  {question.answers && (
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{question.answers.length} 个回答</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">发起提问</h2>
              <button
                onClick={() => setShowAskModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">问题标题</label>
                <input
                  type="text"
                  value={newQuestionTitle}
                  onChange={(e) => setNewQuestionTitle(e.target.value)}
                  placeholder="简洁描述您的问题"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">问题详情</label>
                <textarea
                  value={newQuestionContent}
                  onChange={(e) => setNewQuestionContent(e.target.value)}
                  placeholder="详细描述您的问题，便于他人理解"
                  rows={4}
                  className="textarea-field"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowAskModal(false)}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleAskQuestion}
                  disabled={!newQuestionTitle || !newQuestionContent}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                    newQuestionTitle && newQuestionContent
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  提交提问
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">{currentQuestion.title}</h2>
                {getStatusBadge(currentQuestion.status)}
              </div>
              <div className="flex items-center gap-2">
                {currentQuestion.status === 'adopted' && currentQuestion.answers?.some(a => a.adopted) && (
                  <button
                    onClick={() => setShowConvertModal(true)}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    生成词条
                  </button>
                )}
                <button
                  onClick={() => setSelectedQuestion(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-6">
                <p className="text-gray-600">{currentQuestion.content}</p>
                <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{currentQuestion.author?.name || '匿名'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(currentQuestion.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {currentQuestion.answers?.length || 0} 个回答
                </h3>
                <div className="space-y-4">
                  {currentQuestion.answers?.map(answer => (
                    <div
                      key={answer.id}
                      className={`p-4 rounded-xl ${
                        answer.adopted ? 'bg-success-50 border border-success-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900">{answer.content}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              <span>{answer.author?.name || '匿名'}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              <span>{new Date(answer.created_at).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </div>
                        {answer.adopted && (
                          <div className="flex items-center gap-1 text-success-600">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-medium">已采纳</span>
                          </div>
                        )}
                      </div>
                      {!answer.adopted && currentQuestion.status !== 'adopted' && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAdoptAnswer(answer.id);
                          }}
                          className="mt-3 flex items-center gap-2 text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          <ThumbsUp className="w-4 h-4" />
                          <span className="text-sm">采纳为最佳答案</span>
                        </button>
                      )}
                    </div>
                  ))}

                  {!currentQuestion.answers?.length && (
                    <div className="text-center py-8 text-gray-500">
                      <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>暂无回答，快来抢沙发吧！</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="写下您的回答..."
                  className="flex-1 input-field"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAnswerQuestion();
                    }
                  }}
                />
                <button
                  onClick={handleAnswerQuestion}
                  disabled={!newAnswer.trim()}
                  className={`p-3 rounded-lg transition-colors ${
                    newAnswer.trim()
                      ? 'bg-primary-600 text-white hover:bg-primary-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showConvertModal && currentQuestion && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">生成词条</h3>
              <p className="text-gray-600 mb-6">
                将此问答采纳内容转换为知识词条，便于更多人查阅学习
              </p>
              <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
                <div className="text-sm text-gray-500 mb-2">问题</div>
                <div className="text-gray-900 font-medium">{currentQuestion.title}</div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="btn-secondary flex-1"
                >
                  取消
                </button>
                <button
                  onClick={handleConvertToEntry}
                  className="btn-primary flex-1 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5" />
                  确认生成
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
