import { defineAction } from 'astro:actions';
import { z } from 'zod';
import { initializeApp, getApps, cert, type App } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';

let app: App | undefined;
try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    const projectId = import.meta.env.FIREBASE_PROJECT_ID;
    const clientEmail = import.meta.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = import.meta.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (projectId && clientEmail && privateKey) {
      app = initializeApp({
        credential: cert({ projectId, clientEmail, privateKey }),
        projectId,
      }, 'decival-error-reporter');
    } else {
      const options: import('firebase-admin/app').AppOptions = { projectId: projectId || 'decival-mobile' };
      app = initializeApp(options, 'decival-error-reporter');
    }
  }
} catch {
  app = undefined;
}
const db = app ? getFirestore(app) : getFirestore();

// Repo GitHub cible pour les issues de signalement (CREM-asbl/Decival-mobile)
const GITHUB_REPO = { owner: 'CREM-asbl', repo: 'Decival-mobile' };
// Delai de dedoublonnage en minutes (POC Site-CREM : 5 min)
const DEDUP_WINDOW_MS = 5 * 60 * 1000;

const reportBugSchema = z.object({
  message: z.string().min(1, { message: 'Message requis' }).max(2000),
  stack: z.string().max(8000).optional().default(''),
  page: z.string().min(1, { message: 'Page requise' }),
  appVersion: z.string().optional().default('unknown'),
  userAgent: z.string().optional().default('unknown'),
  fingerprint: z.string().min(1, { message: 'Empreinte requise' }),
  context: z.record(z.string(), z.unknown()).optional().default({}),
});

type ReportInput = z.infer<typeof reportBugSchema>;

async function findExistingIssue(fingerprint: string): Promise<string | null> {
  const cutoff = new Date(Date.now() - DEDUP_WINDOW_MS);
  const snap = await db
    .collection('reportDedup')
    .where('fingerprint', '==', fingerprint)
    .where('createdAt', '>', Timestamp.fromDate(cutoff))
    .orderBy('createdAt', 'desc')
    .limit(1)
    .get();
  if (snap.empty) return null;
  return snap.docs[0].data().issueUrl as string;
}

async function createGitHubIssue(data: ReportInput): Promise<string> {
  const token = process.env.GITHUB_TOKEN ?? import.meta.env.GITHUB_TOKEN;
  if (!token) {
    throw new Error('GITHUB_TOKEN non configure (secret manquant).');
  }

  const title = `[Bug automatique] ${data.message.slice(0, 120)}`;
  const bodyLines = [
    '## Signalement automatique (Decival-mobile)',
    '',
    `- **Message** : ${data.message}`,
    `- **Page** : ${data.page}`,
    `- **Version** : ${data.appVersion}`,
    `- **User Agent** : ${data.userAgent}`,
    `- **Empreinte** : ${data.fingerprint}`,
    `- **Date** : ${new Date().toISOString()}`,
    '',
    '### Contexte',
    '```json',
    JSON.stringify(data.context, null, 2).slice(0, 4000),
    '```',
    '',
    data.stack ? '### Stack trace' : '',
    data.stack ? '```' : '',
    data.stack ? data.stack.slice(0, 6000) : '',
    data.stack ? '```' : '',
    '',
    '_Signale par le systeme de surveillance des erreurs._',
  ].filter((l) => l !== '');

  const res = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/issues`,
    {
      method: 'POST',
      headers: {
        Authorization: "Bearer " + token,
        Accept: 'application/vnd.github+json',
        'Content-Type': 'application/json',
        'User-Agent': 'Decival-mobile-error-reporter',
      },
      body: JSON.stringify({ title, body: bodyLines.join('\n') }),
    }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GitHub API ${res.status} : ${text.slice(0, 300)}`);
  }
  const json = (await res.json()) as { html_url?: string };
  return json.html_url ?? `https://github.com/${GITHUB_REPO.owner}/${GITHUB_REPO.repo}/issues`;
}

export const reportBug = defineAction({
  accept: 'json',
  input: reportBugSchema,
  handler: async (data: ReportInput) => {
    // 1. Deduplication 5 min
    const existing = await findExistingIssue(data.fingerprint);
    if (existing) {
      return { success: true, issueUrl: existing, deduplicated: true };
    }

    // 2. Creer l'issue GitHub
    const issueUrl = await createGitHubIssue(data);

    // 3. Persister la cle de dedoublonnage (best-effort)
    if (app !== undefined) {
      try {
        await db.collection('reportDedup').add({
          fingerprint: data.fingerprint,
          issueUrl,
          message: data.message.slice(0, 200),
          page: data.page,
          appVersion: data.appVersion,
          createdAt: FieldValue.serverTimestamp(),
          expiresAt: Timestamp.fromDate(new Date(Date.now() + DEDUP_WINDOW_MS)),
        });
      } catch (dbErr) {
        console.warn('reportDedup persist skip:', dbErr instanceof Error ? dbErr.message : dbErr);
      }
    }

    return { success: true, issueUrl, deduplicated: false };
  },
});