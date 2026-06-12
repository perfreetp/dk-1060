import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Entry, Question, LearningRecord, TeamProgress, WeakPoint, TopicPath } from '../types';
import { mockUsers, mockEntries, mockQuestions, mockTopicPaths, mockQuizQuestions } from '../data/mockData';

interface AppState {
  currentUser: User | null;
  entries: Entry[];
  questions: Question[];
  learningRecords: LearningRecord[];
  selectedPosition: string;
  selectedDepartment: string;
  topicPaths: TopicPath[];
  
  setCurrentUser: (user: User | null) => void;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: 'employee' | 'manager' | 'admin') => void;
  
  getEntriesByDepartment: (department: string) => Entry[];
  getEntriesByPosition: (position: string) => Entry[];
  getEntryById: (id: string) => Entry | undefined;
  addEntry: (entry: Omit<Entry, 'id' | 'updated_at' | 'status'>) => void;
  updateEntry: (id: string, updates: Partial<Entry>) => void;
  deleteEntry: (id: string) => void;
  
  getQuestions: () => Question[];
  getUnansweredQuestions: () => Question[];
  addQuestion: (title: string, content: string) => void;
  addAnswer: (questionId: string, content: string) => void;
  adoptAnswer: (questionId: string, answerId: string) => void;
  convertToEntry: (questionId: string) => void;
  
  markEntryRead: (entryId: string) => void;
  getLearningProgress: () => { total: number; read: number; completed: number };
  getTeamProgress: () => TeamProgress[];
  getWeakPoints: () => WeakPoint[];
  
  setSelectedPosition: (position: string) => void;
  setSelectedDepartment: (department: string) => void;
  
  getQuizQuestions: (entryId: string) => typeof mockQuizQuestions;
  submitQuiz: (entryId: string, answers: number[]) => boolean;
  
  addTopicPath: (path: Omit<TopicPath, 'id'>) => void;
  updateTopicPath: (id: string, updates: Partial<TopicPath>) => void;
  deleteTopicPath: (id: string) => void;
}

const initialLearningRecords: LearningRecord[] = [
  { id: '1', user_id: '3', entry_id: '1', read: true, quiz_passed: true, completed_at: '2024-03-20T10:00:00Z' },
  { id: '2', user_id: '3', entry_id: '2', read: true, quiz_passed: false, completed_at: null },
  { id: '3', user_id: '3', entry_id: '3', read: false, quiz_passed: false, completed_at: null },
];

const persistConfig = {
  name: 'knowledge-base-storage',
  getStorage: () => localStorage,
  partialize: (state: AppState) => ({
    learningRecords: state.learningRecords,
    questions: state.questions,
    entries: state.entries,
    topicPaths: state.topicPaths,
    currentUser: state.currentUser,
  }),
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: mockUsers[2],
      entries: mockEntries,
      questions: mockQuestions,
      learningRecords: initialLearningRecords,
      selectedPosition: '',
      selectedDepartment: '',
      topicPaths: mockTopicPaths,
      
      setCurrentUser: (user) => set({ currentUser: user }),
      
      login: (email, password) => {
        const user = mockUsers.find(u => u.email === email);
        if (user) {
          set({ currentUser: user });
          return true;
        }
        return false;
      },
      
      logout: () => set({ currentUser: null }),
      
      switchRole: (role) => {
        const state = get();
        if (!state.currentUser) return;
        const roleMap: Record<string, User> = {
          employee: mockUsers[2],
          manager: mockUsers[1],
          admin: mockUsers[0],
        };
        set({ currentUser: roleMap[role] });
      },
      
      getEntriesByDepartment: (department) => {
        return get().entries.filter(e => e.department === department);
      },
      
      getEntriesByPosition: (position) => {
        const state = get();
        const relevantPaths = state.topicPaths.filter(p => p.positions.includes(position));
        const entryIds = new Set(relevantPaths.flatMap(p => p.entries));
        return state.entries.filter(e => entryIds.has(e.id));
      },
      
      getEntryById: (id) => {
        return get().entries.find(e => e.id === id);
      },
      
      addEntry: (entry) => {
        const state = get();
        const newEntry: Entry = {
          ...entry,
          id: Date.now().toString(),
          updated_at: new Date().toISOString(),
          status: 'published',
        };
        set({ entries: [...state.entries, newEntry] });
      },
      
      updateEntry: (id, updates) => {
        const state = get();
        set({
          entries: state.entries.map(e => 
            e.id === id ? { ...e, ...updates, updated_at: new Date().toISOString() } : e
          )
        });
      },
      
      deleteEntry: (id) => {
        const state = get();
        set({
          entries: state.entries.filter(e => e.id !== id),
          topicPaths: state.topicPaths.map(p => ({
            ...p,
            entries: p.entries.filter(eid => eid !== id)
          }))
        });
      },
      
      getQuestions: () => get().questions,
      
      getUnansweredQuestions: () => {
        return get().questions.filter(q => q.status === 'pending');
      },
      
      addQuestion: (title, content) => {
        const state = get();
        const newQuestion: Question = {
          id: Date.now().toString(),
          title,
          content,
          author_id: state.currentUser?.id || '',
          status: 'pending',
          created_at: new Date().toISOString(),
          author: state.currentUser,
          answers: []
        };
        set({ questions: [...state.questions, newQuestion] });
      },
      
      addAnswer: (questionId, content) => {
        const state = get();
        const newAnswer = {
          id: Date.now().toString(),
          content,
          question_id: questionId,
          author_id: state.currentUser?.id || '',
          adopted: false,
          created_at: new Date().toISOString(),
          author: state.currentUser
        };
        set({
          questions: state.questions.map(q => 
            q.id === questionId 
              ? { ...q, answers: [...(q.answers || []), newAnswer], status: 'answered' as const }
              : q
          )
        });
      },
      
      adoptAnswer: (questionId, answerId) => {
        const state = get();
        set({
          questions: state.questions.map(q => {
            if (q.id === questionId) {
              return {
                ...q,
                status: 'adopted' as const,
                answers: q.answers?.map(a => ({ ...a, adopted: a.id === answerId }))
              };
            }
            return q;
          })
        });
      },
      
      convertToEntry: (questionId) => {
        const state = get();
        const question = state.questions.find(q => q.id === questionId);
        if (!question) return;
        
        const adoptedAnswer = question.answers?.find(a => a.adopted);
        if (!adoptedAnswer) return;
        
        const entryContent = `## ${question.title}\n\n### 问题\n${question.content}\n\n### 回答\n${adoptedAnswer.content}`;
        
        const newEntry: Entry = {
          id: Date.now().toString(),
          title: question.title,
          content: entryContent,
          author_id: adoptedAnswer.author_id,
          department: state.currentUser?.department || '',
          updated_at: new Date().toISOString(),
          status: 'published',
          tags: ['问答沉淀'],
          author: adoptedAnswer.author
        };
        
        set({ 
          entries: [...state.entries, newEntry],
          questions: state.questions.map(q => 
            q.id === questionId ? { ...q, status: 'adopted' as const } : q
          )
        });
      },
      
      markEntryRead: (entryId) => {
        const state = get();
        const existingRecord = state.learningRecords.find(
          r => r.user_id === state.currentUser?.id && r.entry_id === entryId
        );
        
        if (existingRecord) {
          set({
            learningRecords: state.learningRecords.map(r =>
              r.id === existingRecord.id ? { ...r, read: true } : r
            )
          });
        } else {
          const newRecord: LearningRecord = {
            id: Date.now().toString(),
            user_id: state.currentUser?.id || '',
            entry_id: entryId,
            read: true,
            quiz_passed: false,
            completed_at: null
          };
          set({ learningRecords: [...state.learningRecords, newRecord] });
        }
      },
      
      getLearningProgress: () => {
        const state = get();
        const userRecords = state.learningRecords.filter(r => r.user_id === state.currentUser?.id);
        const relevantEntries = state.selectedPosition 
          ? get().getEntriesByPosition(state.selectedPosition)
          : state.entries;
        
        const total = relevantEntries.length;
        const read = userRecords.filter(r => r.read).length;
        const completed = userRecords.filter(r => r.quiz_passed).length;
        
        return { total, read, completed };
      },
      
      getTeamProgress: () => {
        const departments = ['技术部', '市场部', '财务部'];
        return departments.map(dept => ({
          department: dept,
          completion_rate: dept === '技术部' ? 68 : dept === '市场部' ? 82 : 75,
          total_employees: dept === '技术部' ? 15 : dept === '市场部' ? 8 : 6,
          completed_employees: dept === '技术部' ? 10 : dept === '市场部' ? 7 : 4
        }));
      },
      
      getWeakPoints: () => {
        return [
          { entry_id: '1', entry_title: '公司考勤制度', failed_count: 5, attempted_count: 12 },
          { entry_id: '4', entry_title: '代码规范', failed_count: 8, attempted_count: 15 },
          { entry_id: '2', entry_title: 'VPN使用指南', failed_count: 3, attempted_count: 8 }
        ];
      },
      
      setSelectedPosition: (position) => set({ selectedPosition: position }),
      
      setSelectedDepartment: (department) => set({ selectedDepartment: department }),
      
      getQuizQuestions: (entryId) => {
        return mockQuizQuestions.filter(q => q.entry_id === entryId);
      },
      
      submitQuiz: (entryId, answers) => {
        const state = get();
        const quizQuestions = mockQuizQuestions.filter(q => q.entry_id === entryId);
        
        if (quizQuestions.length === 0) return true;
        
        const correctCount = quizQuestions.reduce((acc, q, index) => {
          return acc + (answers[index] === q.correct_index ? 1 : 0);
        }, 0);
        
        const passed = correctCount >= quizQuestions.length * 0.6;
        
        if (passed) {
          const existingRecord = state.learningRecords.find(
            r => r.user_id === state.currentUser?.id && r.entry_id === entryId
          );
          
          if (existingRecord) {
            set({
              learningRecords: state.learningRecords.map(r =>
                r.id === existingRecord.id 
                  ? { ...r, quiz_passed: true, completed_at: new Date().toISOString() }
                  : r
              )
            });
          }
        }
        
        return passed;
      },
      
      addTopicPath: (path) => {
        const state = get();
        const newPath: TopicPath = {
          ...path,
          id: Date.now().toString(),
        };
        set({ topicPaths: [...state.topicPaths, newPath] });
      },
      
      updateTopicPath: (id, updates) => {
        const state = get();
        set({
          topicPaths: state.topicPaths.map(p => 
            p.id === id ? { ...p, ...updates } : p
          )
        });
      },
      
      deleteTopicPath: (id) => {
        const state = get();
        set({ topicPaths: state.topicPaths.filter(p => p.id !== id) });
      },
    }),
    persistConfig
  )
);
