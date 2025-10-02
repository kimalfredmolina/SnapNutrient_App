// ✅ Extend Jest matchers FIRST
import '@testing-library/jest-native/extend-expect';

// ✅ Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

// ✅ Mock Reanimated (avoid Babel plugin warnings)
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {}; // Fix undefined function bug
  return Reanimated;
});

// ✅ Mock expo-linking (prevents reading app.json during tests)
jest.mock('expo-linking', () => ({
  createURL: jest.fn(() => 'mock://url'),
  parse: jest.fn(() => ({})),
  makeUrl: jest.fn(() => 'mock://url'),
}));

// ✅ Mock expo-auth-session (fix makeRedirectUri error)
jest.mock('expo-auth-session', () => ({
  makeRedirectUri: jest.fn(() => 'mock://redirect'),
  startAsync: jest.fn(() => Promise.resolve({ type: 'success' })),
}));

// ✅ Mock Firebase (optional, prevents real Firebase calls during tests)
jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
}));
jest.mock('firebase/database', () => ({
  getDatabase: jest.fn(),
}));
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [
    {}, // mock request
    {}, // mock response
    jest.fn(), // mock promptAsync
  ]),
}));

// Mock the server config
jest.mock('./server', () => ({
  default: {
    API_URL: 'http://mock-api-url',
    // Add any other config properties your app needs
  }
}));

