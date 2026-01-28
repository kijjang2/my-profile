# 풀스택 대시보드 애플리케이션

다양한 기능을 포함한 현대적인 풀스택 웹 애플리케이션입니다.

## 주요 기능

### 🔐 인증 시스템
- 사용자 회원가입
- 로그인/로그아웃
- JWT 기반 인증
- 세션 관리 (로컬 스토리지)

### 📊 대시보드
- 실시간 통계 표시
- 차트를 통한 데이터 시각화 (Chart.js)
- 할 일, 파일, 메시지 통계
- 우선순위별 할 일 분포 차트
- 완료 현황 차트

### ✅ 할 일 관리 (CRUD)
- 할 일 추가/수정/삭제
- 할 일 완료 체크
- 우선순위 설정 (높음/보통/낮음)
- 마감일 설정
- 검색 기능
- 필터링 (전체/진행 중/완료/우선순위별)

### 📁 파일 관리
- 파일 업로드 (다중 업로드 지원)
- 파일 목록 표시
- 파일 다운로드
- 파일 삭제
- 파일 검색
- 파일 크기 및 업로드 날짜 표시
- 지원 형식: 이미지, PDF, 문서, 텍스트 파일

### 💬 실시간 채팅
- Socket.io 기반 실시간 메시징
- 채팅 히스토리
- 실시간 알림
- 사용자별 메시지 표시

### 🎨 UI/UX
- 다크 모드 지원
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 부드러운 애니메이션
- 모던한 디자인 (Glassmorphism 스타일)
- 알림 시스템
- 모달 창

### ⚙️ 설정
- 테마 설정 (라이트/다크 모드)
- 알림 설정
- 계정 정보 표시

## 기술 스택

### 백엔드
- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **Socket.io** - 실시간 통신
- **Multer** - 파일 업로드 처리
- **bcryptjs** - 비밀번호 암호화
- **jsonwebtoken** - JWT 인증
- **CORS** - 크로스 오리진 리소스 공유

### 프론트엔드
- **Vanilla JavaScript** - 바닐라 JS (프레임워크 없이)
- **Socket.io Client** - 실시간 통신 클라이언트
- **Chart.js** - 데이터 시각화
- **CSS3** - 스타일링 (CSS 변수, Flexbox, Grid)

## 설치 및 실행

### 요구사항
- Node.js (v14 이상)
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 실행

```bash
# 서버 시작
npm start

# 개발 모드 (nodemon 사용)
npm run dev
```

서버가 실행되면 브라우저에서 `http://localhost:3000`으로 접속하세요.

### 기본 계정

처음 사용하는 경우 회원가입을 하거나, 다음 계정으로 로그인할 수 있습니다:

- **이메일**: admin@example.com
- **비밀번호**: admin123

## 프로젝트 구조

```
MyProfile/
├── server.js              # Express 서버 메인 파일
├── package.json           # 프로젝트 의존성 및 스크립트
├── README.md             # 프로젝트 문서
├── .gitignore            # Git 무시 파일
└── public/               # 정적 파일 디렉토리
    ├── index.html        # 메인 HTML 파일
    ├── styles.css        # 스타일시트
    ├── app.js           # 클라이언트 사이드 JavaScript
    └── uploads/         # 업로드된 파일 저장 디렉토리
```

## API 엔드포인트

### 인증
- `POST /api/auth/register` - 회원가입
- `POST /api/auth/login` - 로그인

### 할 일 관리
- `GET /api/todos` - 할 일 목록 조회
- `POST /api/todos` - 할 일 추가
- `PUT /api/todos/:id` - 할 일 수정
- `DELETE /api/todos/:id` - 할 일 삭제

### 파일 관리
- `POST /api/upload` - 파일 업로드
- `GET /api/files` - 파일 목록 조회
- `DELETE /api/files/:id` - 파일 삭제

### 통계
- `GET /api/stats` - 통계 데이터 조회

### 메시지
- `GET /api/messages` - 메시지 히스토리 조회

### Socket.io 이벤트
- `join` - 채팅방 입장
- `sendMessage` - 메시지 전송
- `newMessage` - 새 메시지 수신

## 보안 고려사항

현재는 개발용 메모리 기반 데이터베이스를 사용하고 있습니다. 프로덕션 환경에서는:

1. 실제 데이터베이스 사용 (MongoDB, PostgreSQL 등)
2. JWT_SECRET을 환경 변수로 관리
3. 파일 업로드 크기 및 타입 제한 강화
4. HTTPS 사용
5. 비밀번호 정책 강화
6. Rate limiting 적용
7. CORS 설정 정교화

## 기능 확장 가능성

- [ ] 데이터베이스 연동 (MongoDB, PostgreSQL)
- [ ] 사용자 프로필 이미지 업로드
- [ ] 할 일 공유 기능
- [ ] 파일 공유 링크 생성
- [ ] 채팅방 생성 및 관리
- [ ] 이메일 알림
- [ ] 할 일 반복 설정
- [ ] 달력 뷰
- [ ] 파일 프리뷰 기능
- [ ] 다국어 지원

## 라이선스

MIT

## 작성자

김기정
