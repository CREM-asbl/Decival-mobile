import { describe, it, expect, vi, beforeEach } from 'vitest';

  const addMock = vi.fn();
  const whereMock = vi.fn();
  const orderByMock = vi.fn();
  const limitMock = vi.fn();
  const getMock = vi.fn();

  function chain() {
    const c = { add: addMock };
    c.where = whereMock;
    c.orderBy = orderByMock;
    c.limit = limitMock;
    c.get = getMock;
    return c;
  }

  const collectionChain = chain();
  whereMock.mockReturnValue(collectionChain);
  orderByMock.mockReturnValue(collectionChain);
  limitMock.mockReturnValue(collectionChain);

  vi.mock('firebase-admin/app', () => ({ initializeApp: () => ({}) }));
  vi.mock('firebase-admin/firestore', () => {
    return {
      FieldValue: { serverTimestamp: () => ({ _sv: true }) },
      Timestamp: {
        fromDate: (d) => ({ _ts: d, seconds: Math.floor(d.getTime() / 1000) }),
        now: () => ({ _ts: new Date(), seconds: Math.floor(Date.now() / 1000) }),
      },
      getFirestore: () => ({ collection: () => collectionChain }),
    };
  });

  const fetchMock = vi.fn();
  global.fetch = fetchMock;

  describe('reportBug action', () => {
    beforeEach(() => {
      vi.resetModules();
      fetchMock.mockReset();
      addMock.mockReset();
      whereMock.mockReset();
      orderByMock.mockReset();
      limitMock.mockReset();
      getMock.mockReset();
      whereMock.mockReturnValue(collectionChain);
      orderByMock.mockReturnValue(collectionChain);
      limitMock.mockReturnValue(collectionChain);
      getMock.mockResolvedValue({ empty: true, docs: [] });
      process.env.GITHUB_TOKEN = 'test-token';
    });

  it('rejects empty message', async () => {
      const mod = await import('../../src/actions/reportBug');
      const { reportBug } = mod;
      await expect(reportBug({ message: '', page: '/x', fingerprint: 'fp' })).rejects.toBeDefined();
    });

  it('creates a GitHub issue when no dedup hit', async () => {
    fetchMock.mockResolvedValueOnce({
      ok: true,
      status: 201,
      json: async () => ({ html_url: 'https://github.com/CREM-asbl/Decival-mobile/issues/42' }),
    });

    const { reportBug } = await import('../../src/actions/reportBug');
    const result = await reportBug({
      message: 'Cannot read property of undefined',
      stack: 'Error: x\n    at foo (a.js:1:1)',
      page: '/tests',
      appVersion: '1.0.2-beta',
      userAgent: 'Mozilla/5.0',
      fingerprint: 'fp1',
      context: { source: 'window.onerror' },
    });

    expect(result.success).toBe(true);
    expect(result.deduplicated).toBe(false);
    expect(result.issueUrl).toContain('/issues/42');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe('Bearer test-token');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).title).toContain('Cannot read property');
  });

  it('deduplicates within the 5-minute window', async () => {
    getMock.mockResolvedValue({
      empty: false,
      docs: [{ data: () => ({ issueUrl: 'https://github.com/CREM-asbl/Decival-mobile/issues/7' }) }],
    });

    const { reportBug } = await import('../../src/actions/reportBug');
    const result = await reportBug({ message: 'repeat error', page: '/progress', fingerprint: 'fp-dup' });

    expect(result.success).toBe(true);
    expect(result.deduplicated).toBe(true);
    expect(result.issueUrl).toContain('/issues/7');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('throws when GITHUB_TOKEN is missing', async () => {
    delete process.env.GITHUB_TOKEN;
    const { reportBug } = await import('../../src/actions/reportBug');
    await expect(reportBug({ message: 'no token', page: '/x', fingerprint: 'fp3' })).rejects.toThrow(/GITHUB_TOKEN/);
  });

  it('handles GitHub API failure', async () => {
      fetchMock.mockResolvedValueOnce({ ok: false, status: 401, text: async () => 'Bad credentials' });
      const { reportBug } = await import('../../src/actions/reportBug');
      await expect(reportBug({ message: 'fail', page: '/x', fingerprint: 'fp4' })).rejects.toThrow(/401/);
    });
});