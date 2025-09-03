# Expo 53 → 52 트러블슈팅 가이드

## 문제 요약
- Expo SDK 53에서 EAS Android 빌드 시 `ExpoModulesPackage` 관련 오류(`import expo.core.ExpoModulesPackage;`)로 빌드 실패
- 원인: expo-task-manager 등 일부 Expo 공식 패키지가 여전히 `unimodules-app-loader`를 의존성으로 포함
- autolinking 시스템이 legacy unimodules 코드를 생성하여 빌드가 불가능함

## 시도한 해결 방법
- pnpm → yarn으로 패키지 매니저 전환 및 lockfile 재생성
- expo-task-manager 등 모든 Expo 패키지 최신화
- node_modules, lockfile, android/ios 디렉토리 삭제 후 재설치 및 prebuild
- 공식 문서/깃허브 이슈 확인: Expo 53에서도 unimodules-app-loader가 남아있는 현상은 미해결 상태

## 결론
- Expo 53 + expo-task-manager 조합에서 빌드 불가 현상은 Expo 공식 패키지의 미해결 이슈임
- Expo 52는 LTS 성격의 안정 버전으로, background fetch/task-manager 등 모든 기능이 정상 동작

## 권장 조치
- Expo 52로 다운그레이드 후 빌드 진행
- Expo 53 이상에서 background 기능이 꼭 필요하다면, Expo 공식 이슈 트래커에 참여 및 추후 패키지 업데이트 확인

---

# Expo 버전 다운그레이드 방법

1. package.json의 Expo 관련 패키지 버전을 52 계열로 변경
2. yarn.lock, node_modules, android, ios 디렉토리 삭제
3. yarn install → expo prebuild → expo doctor → eas build

---

# 참고 링크
- [Expo 공식 TaskManager 문서](https://docs.expo.dev/versions/latest/sdk/task-manager/)
- [Expo 깃허브 이슈](https://github.com/expo/expo/issues)
