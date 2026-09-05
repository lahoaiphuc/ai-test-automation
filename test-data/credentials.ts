export const credentials = {
  valid: {
    email: process.env.VALID_EMAIL ?? 'admin@example.com',
    password: process.env.VALID_PASSWORD ?? '123456',
  },
  invalid: {
    email: 'wrong@example.com',
    password: 'wrongpass',
  },
};
