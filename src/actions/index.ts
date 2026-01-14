import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';
import { initializeApp } from 'firebase-admin/app';
import { FieldValue, getFirestore, Timestamp } from 'firebase-admin/firestore';
import nodemailer from 'nodemailer';

const app = initializeApp({
  projectId: import.meta.env.FIREBASE_PROJECT_ID,
})
const db = getFirestore()

// Schéma de validation pour le feedback
const feedbackSchema = z.object({
  category: z.string().min(1, 'Catégorie requise'),
  rating: z.number().min(1).max(5, 'Note doit être entre 1 et 5'),
  comment: z.string().min(10, 'Commentaire doit faire au moins 10 caractères'),
  email: z.string().email().optional().or(z.literal('')),
  page: z.string(),
  userAgent: z.string(),
  timestamp: z.string(),
});

// Initialiser le transporteur Nodemailer
const hasEmailCreds = !!process.env.FEEDBACK_EMAIL_PASSWORD;
const transporter = hasEmailCreds
  ? nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.FEEDBACK_EMAIL_USER || 'info@crem.be',
      pass: process.env.FEEDBACK_EMAIL_PASSWORD,
    },
  })
  : null;

export const server = {
  sendFeedback: defineAction({
    accept: 'json',
    input: feedbackSchema,
    handler: async (data) => {
      try {
        // 1️⃣ Enregistrer dans Firestore (si disponible)
        let feedbackId = 'dev-local';
        if (app) {
          try {
            const feedbackRef = await db.collection('feedback').add({
              category: data.category,
              rating: data.rating,
              comment: data.comment,
              email: data.email || 'anonymous@feedback.local',
              page: data.page,
              userAgent: data.userAgent,
              timestamp: Timestamp.fromDate(new Date(data.timestamp)),
              createdAt: FieldValue.serverTimestamp(),
            });
            feedbackId = feedbackRef.id;
          } catch (dbErr) {
            console.warn('Firestore indisponible en dev, skip persist.', dbErr);
          }
        } else {
          console.info('Firebase Admin non initialisé, mode dev local sans persistance.');
        }

        // 2️⃣ Envoyer email de confirmation (si config présente)
        if (transporter) {
          await transporter.sendMail({
            from: process.env.FEEDBACK_EMAIL_USER || 'pliezgeoffrey@gmail.com',
            to: 'pliezgeoffrey@gmail.com',
            subject: `[Feedback Décimal] ${data.category} - ${data.rating}/5 ⭐`,
            html: `
<html>
  <head>
    <meta charset="UTF-8">
    <style>
      body { font-family: Arial, sans-serif; color: #333; }
      .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background: #f9f9f9; }
      .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
      .field { margin: 15px 0; padding: 10px; background: white; border-left: 4px solid #667eea; }
      .label { font-weight: bold; color: #667eea; }
      .value { margin-top: 5px; color: #555; white-space: pre-wrap; }
      .rating { font-size: 24px; color: #ffc107; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h2>📊 Nouveau Feedback Décimal Beta</h2>
      </div>

      <div class="field">
        <div class="label">🏷️ Catégorie</div>
        <div class="value">${data.category}</div>
      </div>

      <div class="field">
        <div class="label">⭐ Évaluation</div>
        <div class="value rating">${'★'.repeat(data.rating)}${'☆'.repeat(5 - data.rating)}</div>
      </div>

      <div class="field">
        <div class="label">📝 Commentaire</div>
        <div class="value">${data.comment.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
      </div>

      <div class="field">
        <div class="label">👤 Email utilisateur</div>
        <div class="value">${data.email || 'anonymous'}</div>
      </div>

      <div class="field">
        <div class="label">📍 Page</div>
        <div class="value">${data.page}</div>
      </div>

      <div class="field">
        <div class="label">🆔 ID Firestore</div>
        <div class="value" style="font-family: monospace; font-size: 12px;">${feedbackId}</div>
      </div>
    </div>
  </body>
</html>
          `,
          });
        }

        return {
          success: true,
          message: 'Merci pour ton retour !',
        };
      } catch (error) {
        console.error('Erreur lors du traitement du feedback:', error);
        throw new Error('Impossible de traiter ton feedback. Veuillez réessayer.');
      }
    },
  }),
};

