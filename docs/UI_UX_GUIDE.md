# UI/UX 가이드 및 일관성 점검

## 테마 및 스타일
- 전체적으로 React Native Paper, ThemedText, ThemedView 등 일관된 테마 컴포넌트 사용
- 다크/라이트 모드 지원 (useColorScheme, Colors.ts)
- 주요 색상, 폰트, 버튼 스타일 등은 constants/Colors.ts, ThemedText.tsx 등에서 통일

## 네비게이션/레이아웃
- expo-router 기반 파일 라우팅, (tabs) 구조로 메인/탭 화면 분리
- ParallaxScrollView, Stack, Tabs 등 일관된 레이아웃 컴포넌트 사용

## 센서 데이터/상태 UI
- 센서 데이터 실시간 패널, 버퍼 크기, API Key 입력 등 주요 상태를 명확하게 UI로 표시
- 미지원 센서는 자동 감지 후 UI에서 제외
- Alert, Modal 등으로 사용자 피드백 제공

## 접근성/반응성
- 버튼, 입력창, 텍스트 등 기본 접근성 속성 활용
- 다양한 화면 크기에서 레이아웃이 깨지지 않도록 padding, gap, flex 등 사용

## 확장성
- UI 컴포넌트 분리, 스타일 상수화, 테마 적용 등으로 확장/유지보수 용이

## 결론
- 전체적으로 일관적이고 표준적인 UI/UX 구조를 따르고 있음
- 추가 개선점: React Native Paper 컴포넌트 적극 활용, 사용자 안내 메시지/상태 표시 강화 등
