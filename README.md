# 북로그 — 책 후기 공유 앱

읽은 책의 후기를 기록하고, 팔로우한 사람들과 공유하는 서비스입니다.

## 기술 스택

- **Next.js 16** (App Router) + **TypeScript**, **React 19**
- **Tailwind CSS v4**
- **Prisma 6** + SQLite(로컬 개발) — 배포 시 PostgreSQL(Neon/Supabase 등)로 전환 가능
- **Auth.js (NextAuth v5)** + Google OAuth
- **알라딘 OpenAPI** (기본 도서 검색 provider, `.env`의 `BOOK_SEARCH_PROVIDER`로 네이버/수동입력으로 전환 가능)

## 시작하기

```bash
npm install
cp .env.example .env   # 이미 있다면 값 채우기
npx prisma migrate dev
npm run dev
```

`.env`에서 채워야 하는 값:

| 변수 | 설명 |
|---|---|
| `AUTH_SECRET` | `openssl rand -base64 32`로 생성 |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 OAuth 클라이언트 ID 발급 (아직 미발급 — 로그인 기능을 쓰려면 필요) |
| `ALADIN_TTB_KEY` | 알라딘 OpenAPI TTBKey (발급 완료) |
| `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` | 네이버 책 검색 API (보조 provider, 발급 완료) |
| `BOOK_SEARCH_PROVIDER` | `"aladin"` \| `"naver"` \| `"manual"` — 현재 `aladin` |

## 데이터 모델

- `User`, `Account`, `Session`, `VerificationToken`: Auth.js 표준 모델
- `Book`: 외부 API 도서 또는 수동 등록 도서
- `Review`: 별점(1~5) + 텍스트 + 공개여부
- `Follow`: 유저 간 팔로우 관계

## 주요 화면

- `/` — 랜딩 (로그인 시 `/feed`로 리다이렉트)
- `/feed` — 팔로우한 사람들의 공개 후기 피드 (팔로잉이 없으면 전체 최신 공개 후기)
- `/reviews/new` — 책 검색 → 후기 작성
- `/reviews/[id]` — 후기 상세 (OG 메타태그로 SNS 공유 미리보기 지원)
- `/reviews/[id]/edit` — 후기 수정 (작성자만)
- `/u/[id]` — 프로필 (팔로우/언팔로우, 작성한 후기 목록)

## 남은 작업 (2차 확장)

- 좋아요 / 댓글
- 책 상세 페이지 (책별 후기 모아보기)
- 알림
- 배포 (Vercel + 호스팅 Postgres)
