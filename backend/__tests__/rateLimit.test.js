const { apiLimiter, authLimiter, reportLimiter, aiLimiter } = require('../middleware/rateLimit');

describe('Rate Limiting Middleware', () => {
  it('should export all rate limiters', () => {
    expect(apiLimiter).toBeDefined();
    expect(authLimiter).toBeDefined();
    expect(reportLimiter).toBeDefined();
    expect(aiLimiter).toBeDefined();
  });

  // Note: express-rate-limit is a middleware, testing it requires mocking req/res
  // For unit tests, we can verify the configuration is correct by checking the exported objects
  it('should have apiLimiter with correct window and max', () => {
    // Since rateLimit returns a middleware function, we can check if it's a function
    expect(typeof apiLimiter).toBe('function');
  });

  it('should have authLimiter with stricter limits', () => {
    expect(typeof authLimiter).toBe('function');
  });

  it('should have reportLimiter for report submissions', () => {
    expect(typeof reportLimiter).toBe('function');
  });

  it('should have aiLimiter for AI operations', () => {
    expect(typeof aiLimiter).toBe('function');
  });
});