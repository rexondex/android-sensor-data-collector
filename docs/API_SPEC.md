# Sensor Data Collector API 명세

## 엔드포인트

- **URL**: `https://data-anchor-api-173411279831.asia-northeast3.run.app/records`
- **Method**: `POST`
- **Headers**:
  - `Content-Type`: `application/json`
  - `x-api-key`: (필수)

---

## 요청 메시지 예시

```json
{
  "key": "example-data-2",
  "data": {
    "url": "http://localhost:3000",
    "name": "example-data-2",
    "value": "this is example data two.",
    "where": "created by Data Anchor Dashboard"
  }
}
```

- `key`: 데이터 구분용 문자열
- `data`: 센서 데이터 및 부가 정보 객체

---

## 응답 메시지 예시

- **Status Code**: `201 Created`
- **Body**:

```json
{
  "id": "18c28d23-6faa-4764-b91e-d5846696576d",
  "key": "example-data-2",
  "version": 1,
  "data": {
    "url": "http://localhost:3000",
    "name": "example-data-2",
    "value": "this is example data two.",
    "where": "created by Data Anchor Dashboard"
  },
  "status": "active",
  "createdAt": "2025-09-01T12:05:20.837Z",
  "prevHash": null,
  "hash": null
}
```

- `id`: 생성된 레코드의 고유 ID
- `createdAt`: 생성 시각(ISO8601)
- `status`: 상태값(예: active)
- 기타 메타데이터 포함

---

## 참고 사항

- 모든 요청에 `x-api-key` 헤더 필수
- 응답 스키마는 Zod 등으로 검증 권장
- 실패 시 재시도 및 로컬 큐 저장 정책 적용
