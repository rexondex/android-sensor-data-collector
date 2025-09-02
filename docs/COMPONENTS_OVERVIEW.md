# 주요 컴포넌트 구조 및 역할

## 1. ThemedText, ThemedView
- 앱 전체에서 일관된 색상/폰트/배경을 제공하는 테마 컴포넌트
- 다크/라이트 모드 지원

## 2. SensorDataPanel
- 지원 센서 자동 감지 및 실시간 데이터 표시
- 미지원 센서는 UI에서 제외

## 3. ApiKeyModal
- 최초 실행 시 API Key 입력 및 SecureStore 저장
- 모달 UI로 사용자 경험 향상

## 4. ParallaxScrollView
- 헤더 이미지와 함께 부드러운 스크롤/레이아웃 제공

## 5. Collapsible, ExternalLink 등
- 문서/탭/링크 등 부가 기능 UI 컴포넌트

## 6. 버퍼/큐/전송 로직
- hooks, utils로 분리하여 UI와 로직 분리, 확장성/테스트 용이

---

각 컴포넌트는 역할별로 분리되어 있고, UI/UX 일관성과 유지보수성을 고려해 설계되어 있습니다.
