const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// 미들웨어
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 업로드 디렉토리 생성
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB 제한
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx|txt/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('지원하지 않는 파일 형식입니다.'));
    }
  }
});

// 메모리 내 데이터베이스 (실제 프로덕션에서는 실제 DB 사용)
let users = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    password: bcrypt.hashSync('admin123', 10),
    name: '관리자'
  }
];

let todos = [];
let messages = [];
let files = [];

// 인증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// API 라우트

// 인증
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password, name } = req.body;

    if (users.find(u => u.email === email)) {
      return res.status(400).json({ error: '이미 존재하는 이메일입니다.' });
    }

    if (users.find(u => u.username === username)) {
      return res.status(400).json({ error: '이미 존재하는 사용자명입니다.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      name: name || username
    };

    users.push(newUser);

    const token = jwt.sign(
      { id: newUser.id, username: newUser.username, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        name: newUser.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: '이메일 또는 비밀번호가 잘못되었습니다.' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
});

// 할 일 관리
app.get('/api/todos', authenticateToken, (req, res) => {
  const userTodos = todos.filter(t => t.userId === req.user.id);
  res.json(userTodos);
});

app.post('/api/todos', authenticateToken, (req, res) => {
  const { title, description, priority, dueDate } = req.body;
  const newTodo = {
    id: uuidv4(),
    userId: req.user.id,
    title,
    description: description || '',
    priority: priority || 'medium',
    dueDate: dueDate || null,
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.push(newTodo);
  res.json(newTodo);
});

app.put('/api/todos/:id', authenticateToken, (req, res) => {
  const todo = todos.find(t => t.id === req.params.id && t.userId === req.user.id);
  if (!todo) {
    return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });
  }

  Object.assign(todo, req.body);
  res.json(todo);
});

app.delete('/api/todos/:id', authenticateToken, (req, res) => {
  const index = todos.findIndex(t => t.id === req.params.id && t.userId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ error: '할 일을 찾을 수 없습니다.' });
  }

  todos.splice(index, 1);
  res.json({ success: true });
});

// 파일 업로드
app.post('/api/upload', authenticateToken, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: '파일이 업로드되지 않았습니다.' });
  }

  const fileData = {
    id: uuidv4(),
    userId: req.user.id,
    filename: req.file.filename,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    path: `/uploads/${req.file.filename}`,
    uploadedAt: new Date().toISOString()
  };

  files.push(fileData);
  res.json(fileData);
});

app.get('/api/files', authenticateToken, (req, res) => {
  const userFiles = files.filter(f => f.userId === req.user.id);
  res.json(userFiles);
});

app.delete('/api/files/:id', authenticateToken, (req, res) => {
  const file = files.find(f => f.id === req.params.id && f.userId === req.user.id);
  if (!file) {
    return res.status(404).json({ error: '파일을 찾을 수 없습니다.' });
  }

  const filePath = path.join(__dirname, 'public', file.path);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  const index = files.findIndex(f => f.id === req.params.id);
  files.splice(index, 1);
  res.json({ success: true });
});

// 통계 API
app.get('/api/stats', authenticateToken, (req, res) => {
  const userTodos = todos.filter(t => t.userId === req.user.id);
  const userFiles = files.filter(f => f.userId === req.user.id);
  const userMessages = messages.filter(m => m.userId === req.user.id);

  const stats = {
    totalTodos: userTodos.length,
    completedTodos: userTodos.filter(t => t.completed).length,
    pendingTodos: userTodos.filter(t => !t.completed).length,
    totalFiles: userFiles.length,
    totalFilesSize: userFiles.reduce((sum, f) => sum + f.size, 0),
    totalMessages: userMessages.length,
    todosByPriority: {
      high: userTodos.filter(t => t.priority === 'high').length,
      medium: userTodos.filter(t => t.priority === 'medium').length,
      low: userTodos.filter(t => t.priority === 'low').length
    }
  };

  res.json(stats);
});

// 메시지 히스토리
app.get('/api/messages', authenticateToken, (req, res) => {
  res.json(messages.slice(-50)); // 최근 50개만
});

// Socket.io 연결 처리
io.on('connection', (socket) => {
  console.log('새 클라이언트 연결:', socket.id);

  socket.on('join', (data) => {
    socket.join('general');
    socket.emit('connected', { message: '채팅 서버에 연결되었습니다.' });
  });

  socket.on('sendMessage', (data) => {
    const message = {
      id: uuidv4(),
      userId: data.userId,
      username: data.username,
      message: data.message,
      timestamp: new Date().toISOString()
    };
    
    messages.push(message);
    io.to('general').emit('newMessage', message);
  });

  socket.on('disconnect', () => {
    console.log('클라이언트 연결 해제:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`http://localhost:${PORT} 에서 접속하세요.`);
});
