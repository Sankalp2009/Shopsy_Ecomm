import { jest, beforeAll, afterAll } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET_KEY = 'test-jwt-secret-key-for-testing';
process.env.SUPER_ADMIN_EMAIL = 'admin@test.com';
process.env.SUPER_ADMIN_PASSWORD = 'adminpassword123';
process.env.SUPER_ADMIN_NAME = 'Super Admin';

// Increase timeout for async operations
jest.setTimeout(30000);

// Mock console.error and console.log to reduce noise in tests
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  jest.spyOn(console, 'log').mockImplementation(() => {});
});

afterAll(() => {
  console.error.mockRestore();
  console.log.mockRestore();
});
