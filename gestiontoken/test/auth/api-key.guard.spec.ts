import { expect } from 'chai';
import { UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from '../../src/auth/api-key.guard';

describe('ApiKeyGuard', () => {
  let guard: ApiKeyGuard;
  const mockContext = (headerKey?: string) => ({
    switchToHttp: () => ({
      getRequest: () => ({
        header: (key: string) => (key === 'x-api-key' ? headerKey : undefined),
        query: {}
      })
    })
  });

  beforeEach(() => {
    process.env.API_KEY_MANAGEMENT = 'super-secret-key';
    guard = new ApiKeyGuard();
  });

  it('should allow request when x-api-key matches expected', () => {
    const can = guard.canActivate(mockContext('super-secret-key') as any);
    expect(can).to.be.true;
  });

  it('should throw UnauthorizedException when x-api-key is missing', () => {
    expect(() => guard.canActivate(mockContext(undefined) as any))
      .to.throw(UnauthorizedException);
  });

  it('should throw UnauthorizedException when x-api-key is invalid', () => {
    expect(() => guard.canActivate(mockContext('wrong-key') as any))
      .to.throw(UnauthorizedException);
  });
});
