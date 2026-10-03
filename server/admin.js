export function validateAdminQuestion(body) {
  const text = typeof body?.text === 'string' ? body.text.trim() : '';
  const category = typeof body?.category === 'string' ? body.category.trim() : '';
  const options = body?.options;
  const correct = body?.correct;
  const sourceUrl = typeof body?.source_url === 'string' ? body.source_url.trim() : '';
  const sourceReference = typeof body?.source_reference === 'string'
    ? body.source_reference.trim()
    : '';
  const verifiedAt = body?.verified_at || null;
  const status = body?.status || 'draft';

  if (
    !text ||
    text.length > 2000 ||
    !category ||
    category.length > 100 ||
    !Array.isArray(options) ||
    options.length < 2 ||
    options.length > 6 ||
    options.some((option) => typeof option !== 'string' || !option.trim() || option.length > 500) ||
    !Number.isInteger(correct) ||
    correct < 0 ||
    correct >= options.length ||
    !['draft', 'published'].includes(status)
  ) {
    return { error: 'Question, category, options, correct answer, or status is invalid.' };
  }
  if (sourceUrl) {
    try {
      if (!['https:', 'http:'].includes(new URL(sourceUrl).protocol)) throw new Error('Invalid protocol');
    } catch {
      return { error: 'Source URL must be a valid HTTP or HTTPS URL.' };
    }
  }
  if (
    verifiedAt &&
    (typeof verifiedAt !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(verifiedAt))
  ) {
    return { error: 'Verification date must use YYYY-MM-DD format.' };
  }
  if (verifiedAt) {
    const parsedDate = new Date(`${verifiedAt}T00:00:00.000Z`);
    if (
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== verifiedAt
    ) {
      return { error: 'Verification date must be a real calendar date.' };
    }
  }
  if (status === 'published' && (!sourceUrl || !sourceReference || !verifiedAt)) {
    return { error: 'Publishing requires a source URL, exact reference, and verification date.' };
  }
  return {
    value: {
      text,
      category,
      options: options.map((option) => option.trim()),
      correct,
      sourceUrl: sourceUrl || null,
      sourceReference: sourceReference || null,
      verifiedAt,
      status,
    },
  };
}
