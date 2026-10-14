const CLIENT_REQUEST_ID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

/**
 * Desktop and web clients send this when a save may be retried after a cold start.
 * Returns null when the field is absent. Invalid values are rejected.
 */
const normalizeClientRequestId = (value) => {
  if (value == null || value === '') return null;
  const id = String(value).trim().toLowerCase();
  if (!CLIENT_REQUEST_ID_RE.test(id)) {
    return { error: 'Invalid clientRequestId' };
  }
  return { id };
};

module.exports = { normalizeClientRequestId };
