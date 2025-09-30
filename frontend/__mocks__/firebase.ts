export const getAuth = jest.fn(() => ({
  onAuthStateChanged: jest.fn((cb) => {
    cb({ uid: "test-user" }); // fake user
    return jest.fn(); // unsubscribe mock
  }),
  currentUser: { uid: "test-user" },
}));

export const getDatabase = jest.fn(() => ({}));

export const ref = jest.fn();
export const get = jest.fn(() => Promise.resolve({ val: () => ({}) }));
export const set = jest.fn();
export const update = jest.fn();
export const remove = jest.fn();
