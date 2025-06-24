# =================
# 1단계: 프론트엔드 빌드 스테이지
# =================
FROM node:20-slim AS frontend-builder

WORKDIR /usr/src/app
COPY ./dog-diagnosis-frontend/package*.json ./
RUN npm install
COPY ./dog-diagnosis-frontend ./
RUN npm run build

# =================
# 2단계: 백엔드 프로덕션 스테이지
# =================
FROM node:20-slim

WORKDIR /usr/src/app

# 백엔드 종속성 설치
COPY ./dog-diagnosis-backend/package*.json ./
RUN npm install --omit=dev

# 백엔드 소스 코드 복사
COPY ./dog-diagnosis-backend ./

# ⭐️ 1단계에서 빌드한 프론트엔드 결과물을 백엔드 쪽으로 복사
COPY --from=frontend-builder /usr/src/app/dist ./dog-diagnosis-frontend/dist

# 서버가 실행될 포트 노출
EXPOSE 8080

# 서버 실행 명령어
CMD [ "node", "src/server.js" ]