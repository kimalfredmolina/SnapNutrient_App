// ✅ Extend Jest matchers FIRST
import '@testing-library/jest-native/extend-expect';

// Set EXPO_OS environment variable
process.env.EXPO_OS = 'web';

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
jest.mock('firebase/database', () => {
  const mockRef = {
    off: jest.fn(),
    on: jest.fn(),
  };

  return {
    getDatabase: jest.fn(),
    ref: jest.fn(() => mockRef),
    set: jest.fn(),
    get: jest.fn(() => Promise.resolve({ val: () => ({}) })),
    child: jest.fn(() => mockRef),
    push: jest.fn(),
    onValue: jest.fn((_, callback) => {
      callback({ val: () => ({}) });
      return jest.fn();
    }),
    query: jest.fn(),
    orderByChild: jest.fn(),
    off: jest.fn(),
    startAt: jest.fn(),
    endAt: jest.fn(),
  };
});
jest.mock('expo-auth-session/providers/google', () => ({
  useAuthRequest: jest.fn(() => [
    {}, // mock request
    {}, // mock response
    jest.fn(), // mock promptAsync
  ]),
}));


