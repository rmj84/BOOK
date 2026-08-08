# 북로그 — 책 후기 공유 앱

읽은 책의 후기를 기록하고, 팔로우한 사람들과 공유하는 서비스입니다.

## 기술 스택

- **Next.js 16** (App Router) + **TypeScript**, **React 19**
- **Tailwind CSS v4**
- **Prisma 6** + PostgreSQL ([Neon](https://neon.tech) 호스팅)
- **Auth.js (NextAuth v5)** + Google OAuth
- **알라딘 OpenAPI** (기본 도서 검색 provider, `.env`의 `BOOK_SEARCH_PROVIDER`로 네이버/수동입력으로 전환 가능)

## 시작하기

```bash
npm install
cp .env.example .env   # 값 채우기
npx prisma migrate deploy
npm run dev
```

`.env`에서 채워야 하는 값:

| 변수 | 설명 |
|---|---|
| `DATABASE_URL` | Neon 등 호스팅 Postgres의 **풀링(pooled)** connection string. 서버리스(Vercel)에서 직접 연결을 쓰면 동시 접속이 몰릴 때 연결이 고갈되어 쓰기 작업이 실패할 수 있음 |
| `DIRECT_URL` | 같은 DB의 **직접(unpooled)** connection string. `prisma migrate`가 사용 |
| `AUTH_SECRET` | `openssl rand -base64 32`로 생성 |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | [Google Cloud Console](https://console.cloud.google.com/apis/credentials)에서 OAuth 클라이언트 ID 발급 (발급 완료) |
| `ALADIN_TTB_KEY` | 알라딘 OpenAPI TTBKey (발급 완료) |
| `NAVER_CLIENT_ID` / `NAVER_CLIENT_SECRET` | 네이버 책 검색 API (보조 provider, 발급 완료) |
| `BOOK_SEARCH_PROVIDER` | `"aladin"` \| `"naver"` \| `"manual"` — 현재 `aladin` |

`npm run build`는 배포 환경에서 `prisma migrate deploy`를 자동으로 실행하도록 되어 있어, Vercel에 올리면 DB 마이그레이션이 자동으로 적용됩니다.

## 데이터 모델

- `User`, `Account`, `Session`, `VerificationToken`: Auth.js 표준 모델
- `Book`: 외부 API 도서 또는 수동 등록 도서
- `Review`: 별점(1~5) + 텍스트 + 공개여부
- `Follow`: 유저 간 팔로우 관계

## 주요 화면

- `/` — 랜딩 (로그인 시 `/shelf`로 리다이렉트)
- `/shelf` — 책장: 인기/추천 도서 가로 스크롤 + 나와 팔로우한 사람들이 남긴 후기를 책 표지 그리드로 표시 (팔로잉이 없으면 전체 공개 후기)
- `/reviews/new` — 책 검색 → 후기 작성
- `/reviews/[id]` — 후기 상세 (OG 메타태그로 SNS 공유 미리보기 지원)
- `/reviews/[id]/edit` — 후기 수정 (작성자만)
- `/u/[id]` — 프로필 (팔로우/언팔로우, 작성한 후기 목록)
- `/books/[id]` — 책 상세 (그 책에 달린 모든 공개 후기, 평균 별점, 장르 태그)
- `/genres/[genre]` — 장르 태그로 책 검색

## 남은 작업 (2차 확장)

- 알림
- 개인화 추천 (지금은 평점/후기 수 기반 단순 랭킹)
