import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPasswordResetToken,
  hashPasswordResetToken,
  isValidEmail,
} from './passwordReset.js';

test('creates a high-entropy reset token and stores only its one-way hash', () => {
  const token = createPasswordResetToken();
  const tokenHash = hashPasswordResetToken(token);

  assert.match(token, /^[a-f0-9]{64}$/);
  assert.match(tokenHash, /^[a-f0-9]{64}$/);
  assert.notEqual(tokenHash, token);
  assert.equal(hashPasswordResetToken(token), tokenHash);
});

test('validates email addresses before password reset requests', () => {
  assert.equal(isValidEmail('person@example.com'), true);
  assert.equal(isValidEmail('person+sst@example.tn'), true);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(isValidEmail('person@'), false);
  assert.equal(isValidEmail(null), false);
});
