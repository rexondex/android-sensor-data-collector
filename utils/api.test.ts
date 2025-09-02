import { ApiResponseSchema } from './apiSchema';

describe('ApiResponseSchema', () => {
  it('should validate a correct response', () => {
    const valid = {
      id: 'abc',
      key: 'k',
      version: 1,
      data: { url: 'u', name: 'n', value: 'v', where: 'w' },
      status: 'active',
      createdAt: '2025-09-01T12:05:20.837Z',
      prevHash: null,
      hash: null,
    };
    expect(() => ApiResponseSchema.parse(valid)).not.toThrow();
  });

  it('should fail on missing required fields', () => {
    const invalid = { key: 'k' };
    expect(() => ApiResponseSchema.parse(invalid)).toThrow();
  });
});
