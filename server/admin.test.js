import test from 'node:test';
import assert from 'node:assert/strict';
import { validateAdminQuestion } from './admin.js';

const draftQuestion = {
  text: 'What is a safe practice?',
  category: 'Prevention',
  options: ['Assess the risk', 'Ignore the risk'],
  correct: 0,
};

test('accepts a valid draft without publication metadata', () => {
  const result = validateAdminQuestion(draftQuestion);
  assert.equal(result.error, undefined);
  assert.equal(result.value.status, 'draft');
  assert.equal(result.value.options.length, 2);
});

test('requires source details and a verification date before publishing', () => {
  const result = validateAdminQuestion({ ...draftQuestion, status: 'published' });
  assert.match(result.error, /Publishing requires/);
});

test('rejects invalid calendar dates', () => {
  const result = validateAdminQuestion({
    ...draftQuestion,
    status: 'published',
    source_url: 'https://example.org/source',
    source_reference: 'Section 2',
    verified_at: '2025-02-30',
  });
  assert.match(result.error, /real calendar date/);
});

test('rejects non-HTTP source URLs', () => {
  const result = validateAdminQuestion({
    ...draftQuestion,
    source_url: 'javascript:alert(1)',
  });
  assert.match(result.error, /HTTP or HTTPS/);
});

test('accepts complete, source-backed publication data', () => {
  const result = validateAdminQuestion({
    ...draftQuestion,
    status: 'published',
    source_url: 'https://example.org/source',
    source_reference: 'Section 2',
    verified_at: '2025-02-28',
  });
  assert.equal(result.error, undefined);
  assert.equal(result.value.status, 'published');
});
