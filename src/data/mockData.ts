import { User, Entry, Question, Answer, TopicPath, QuizQuestion } from '../types';

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: '管理员',
    role: 'admin',
    department: '人力资源部',
    position: 'HR主管',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'manager@company.com',
    name: '张经理',
    role: 'manager',
    department: '技术部',
    position: '技术总监',
    created_at: '2023-06-15T00:00:00Z'
  },
  {
    id: '3',
    email: 'employee@company.com',
    name: '李明',
    role: 'employee',
    department: '技术部',
    position: '前端工程师',
    created_at: '2024-03-01T00:00:00Z'
  },
  {
    id: '4',
    email: 'wangwu@company.com',
    name: '王五',
    role: 'employee',
    department: '市场部',
    position: '市场专员',
    created_at: '2024-02-15T00:00:00Z'
  },
  {
    id: '5',
    email: 'zhangsan@company.com',
    name: '张三',
    role: 'employee',
    department: '技术部',
    position: '后端工程师',
    created_at: '2024-01-20T00:00:00Z'
  }
];

export const mockEntries: Entry[] = [
  {
    id: '1',
    title: '公司考勤制度',
    content: `## 考勤制度

### 工作时间
- 周一至周五：9:00 - 18:00
- 午休时间：12:00 - 13:30

### 打卡规定
1. 每天上下班需刷卡或使用APP打卡
2. 迟到30分钟以内视为迟到，超过30分钟视为旷工
3. 每月允许3次迟到豁免机会

### 请假流程
1. 提前提交请假申请
2. 直属上级审批
3. HR备案

### 加班规定
- 加班需提前申请
- 加班时间可用于调休或结算加班费`,
    author_id: '1',
    department: '人力资源部',
    updated_at: '2024-03-15T00:00:00Z',
    status: 'published',
    tags: ['制度', '考勤', 'HR'],
    author: mockUsers[0]
  },
  {
    id: '2',
    title: 'VPN使用指南',
    content: `## VPN使用指南

### 连接步骤
1. 下载VPN客户端
2. 安装并配置
3. 使用公司邮箱账号登录
4. 选择办公区网络

### 注意事项
- 仅在外部网络时使用
- 连接后可访问内部系统
- 离开公司网络时自动断开`,
    author_id: '1',
    department: '技术部',
    updated_at: '2024-03-10T00:00:00Z',
    status: 'published',
    tags: ['系统', 'IT', '安全'],
    author: mockUsers[0]
  },
  {
    id: '3',
    title: '报销流程',
    content: `## 报销流程

### 报销范围
- 差旅费
- 办公用品费
- 业务招待费
- 培训费

### 报销步骤
1. 收集发票
2. 填写报销单
3. 部门审批
4. 财务审核
5. 打款到账

### 注意事项
- 发票需在三个月内报销
- 金额超过5000需提前报备`,
    author_id: '1',
    department: '财务部',
    updated_at: '2024-03-05T00:00:00Z',
    status: 'published',
    tags: ['制度', '财务', '报销'],
    author: mockUsers[0]
  },
  {
    id: '4',
    title: '代码规范',
    content: `## 代码规范

### 命名规范
- 使用驼峰命名法
- 变量名清晰明了
- 避免缩写（除非广泛认可）

### 代码风格
- 统一使用ESLint
- 保持适当的注释
- 函数不超过50行

### 提交规范
- feat: 新功能
- fix: 修复bug
- docs: 文档更新
- refactor: 代码重构`,
    author_id: '2',
    department: '技术部',
    updated_at: '2024-03-01T00:00:00Z',
    status: 'published',
    tags: ['技术', '规范', '开发'],
    author: mockUsers[1]
  },
  {
    id: '5',
    title: '会议管理',
    content: `## 会议管理

### 会议类型
- 日常例会
- 项目评审会
- 培训会议
- 临时会议

### 会议流程
1. 提前发送会议邀请
2. 准备会议材料
3. 准时开始会议
4. 记录会议纪要
5. 跟踪行动项

### 会议室预订
- 通过OA系统预订
- 提前24小时预约
- 会议结束后及时释放`,
    author_id: '1',
    department: '综合管理部',
    updated_at: '2024-02-28T00:00:00Z',
    status: 'published',
    tags: ['制度', '会议', '管理'],
    author: mockUsers[0]
  },
  {
    id: '6',
    title: '客户服务规范',
    content: `## 客户服务规范

### 响应时间
- 工作时间：2小时内响应
- 非工作时间：次日10点前响应

### 沟通礼仪
- 使用礼貌用语
- 保持专业态度
- 及时反馈进度

### 投诉处理
- 24小时内受理
- 72小时内解决
- 定期回访`,
    author_id: '1',
    department: '市场部',
    updated_at: '2024-02-25T00:00:00Z',
    status: 'published',
    tags: ['服务', '客户', '规范'],
    author: mockUsers[0]
  }
];

export const mockQuestions: Question[] = [
  {
    id: '1',
    title: '请问加班工资如何计算？',
    content: '想了解一下公司加班工资的计算方式，是按基本工资还是全额工资计算？',
    author_id: '3',
    status: 'answered',
    created_at: '2024-03-20T10:00:00Z',
    author: mockUsers[2],
    answers: [
      {
        id: '1',
        content: '加班工资按基本工资的1.5倍计算，周末加班按2倍计算，法定节假日按3倍计算。',
        question_id: '1',
        author_id: '1',
        adopted: true,
        created_at: '2024-03-20T14:00:00Z',
        author: mockUsers[0]
      }
    ]
  },
  {
    id: '2',
    title: '新员工培训什么时候开始？',
    content: '刚入职，想了解新员工培训的时间安排。',
    author_id: '5',
    status: 'pending',
    created_at: '2024-03-21T09:00:00Z',
    author: mockUsers[4],
    answers: []
  },
  {
    id: '3',
    title: '年假可以跨年使用吗？',
    content: '今年的年假还没休完，想知道是否可以留到明年使用。',
    author_id: '4',
    status: 'answered',
    created_at: '2024-03-19T11:00:00Z',
    author: mockUsers[3],
    answers: [
      {
        id: '2',
        content: '年假需在当年使用完毕，不得跨年累积。请合理安排休假时间。',
        question_id: '3',
        author_id: '1',
        adopted: true,
        created_at: '2024-03-19T15:00:00Z',
        author: mockUsers[0]
      }
    ]
  },
  {
    id: '4',
    title: '如何申请外出培训？',
    content: '想参加一个外部技术培训，需要什么流程？',
    author_id: '3',
    status: 'pending',
    created_at: '2024-03-22T10:00:00Z',
    author: mockUsers[2],
    answers: []
  }
];

export const mockAnswers: Answer[] = [
  {
    id: '1',
    content: '加班工资按基本工资的1.5倍计算，周末加班按2倍计算，法定节假日按3倍计算。',
    question_id: '1',
    author_id: '1',
    adopted: true,
    created_at: '2024-03-20T14:00:00Z',
    author: mockUsers[0]
  },
  {
    id: '2',
    content: '年假需在当年使用完毕，不得跨年累积。请合理安排休假时间。',
    question_id: '3',
    author_id: '1',
    adopted: true,
    created_at: '2024-03-19T15:00:00Z',
    author: mockUsers[0]
  }
];

export const mockTopicPaths: TopicPath[] = [
  {
    id: '1',
    name: '新员工入职必学',
    description: '帮助新员工快速了解公司文化和基本制度',
    entries: ['1', '3', '5'],
    departments: ['技术部', '市场部', '财务部', '人力资源部'],
    positions: ['前端工程师', '后端工程师', '市场专员', '财务助理']
  },
  {
    id: '2',
    name: '技术开发指南',
    description: '技术人员必备的开发规范和工具使用',
    entries: ['2', '4'],
    departments: ['技术部'],
    positions: ['前端工程师', '后端工程师', '测试工程师']
  },
  {
    id: '3',
    name: '市场服务规范',
    description: '市场和客服人员的工作指南',
    entries: ['5', '6'],
    departments: ['市场部'],
    positions: ['市场专员', '客户服务']
  }
];

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: '1',
    entry_id: '1',
    question: '公司的正常工作时间是？',
    options: ['8:00-17:00', '9:00-18:00', '8:30-17:30', '9:30-18:30'],
    correct_index: 1
  },
  {
    id: '2',
    entry_id: '1',
    question: '每月允许几次迟到豁免？',
    options: ['1次', '2次', '3次', '4次'],
    correct_index: 2
  },
  {
    id: '3',
    entry_id: '4',
    question: '代码提交时表示新功能的标签是？',
    options: ['fix', 'feat', 'docs', 'refactor'],
    correct_index: 1
  },
  {
    id: '4',
    entry_id: '4',
    question: '单个函数建议不超过多少行？',
    options: ['30行', '50行', '80行', '100行'],
    correct_index: 1
  }
];

export const departments = ['技术部', '市场部', '财务部', '人力资源部', '综合管理部'];

export const positions = [
  '前端工程师',
  '后端工程师',
  '测试工程师',
  '市场专员',
  '财务助理',
  'HR主管',
  '技术总监'
];
