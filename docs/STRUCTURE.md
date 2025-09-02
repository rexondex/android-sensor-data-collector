# Android Sensor Data Collector 프로젝트 구조 및 요구사항

## 1. 데이터 수집/전송 정책
- **데이터 수집 주기:** 5초마다 센서 데이터 샘플링(버퍼 저장)
- **데이터 전송 주기:** 30초 또는 1분마다 버퍼에 쌓인 데이터 일괄 POST
- **POST 엔드포인트:** 30~60초마다 여러 데이터 한 번에 전송

## 2. 센서 지원 정책
- 가능한 모든 센서 지원(가속도계, 자이로스코프, GPS 등)
- 기기에서 미지원 센서는 자동 감지 후 UI/로직에서 제외

## 3. API 요청/응답 및 실패 처리
- **API 실패 시:**
  - 즉시 재시도(최대 3회)
  - 실패 시 로컬 큐에 저장, 다음 전송 주기에 재시도
  - 연속 실패 시 사용자 알림(Toast 등)
- **API 응답 검증:** Zod로 응답 스키마 검증

## 4. API KEY 입력/관리
- 최초 실행 시, 모달/화면에서 x-api-key 입력받기
- 입력된 키는 앱 내 안전 저장(AsyncStorage 등)
- 키가 활성화되어야 데이터 전송 시작

## 5. 배터리/백그라운드 정책
- **React Native:**
  - react-native-background-fetch 또는 background-timer 사용
  - Android/iOS 모두 지원, 배터리 최적화 정책에 맞춰 동작
  - Foreground Service(안드로이드) 또는 Background Task(iOS)로 구현

## 6. 테스트/디버깅
- Jest로 핵심 로직(버퍼링, API 요청, 응답 파싱 등) 간단 테스트 코드 작성
- API 요청은 mock 처리, 응답은 Zod로 검증

## 7. UI/UX
- React Native Paper 테마 적용
- 센서 데이터 실시간 표시, 전송 상태, API Key 입력 UI 등 구현

## 8. 패키지 매니저
- pnpm 사용

## 9. 예시 패키지 설치 명령어
```bash
pnpm add react-native-paper zod @react-native-async-storage/async-storage
pnpm add react-native-background-fetch
pnpm add axios
pnpm add jest @testing-library/react-native --dev
```

## 10. 추가 고려사항
- 환경별 API Key 관리, 에러 로깅, 앱 권한 안내 등은 추후 확장 가능
