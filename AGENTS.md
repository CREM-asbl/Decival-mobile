# Decival Mobile - Agent Workflow (Addy's Agent Skills)

Ce document définit le workflow rigoureux que tout agent IA doit suivre pour ce projet. Il est basé sur le framework **Agent Skills** d'Addy Osmani, adapté aux spécificités de **Decival-mobile**.

---

## 🚀 Le Workflow "Addy's Skill"

Tout développement doit suivre ces phases séquentielles pour garantir la qualité et la maintenabilité.

### 1. `/spec` - Spécification
Avant d'écrire du code, l'agent doit définir :
- L'objectif métier.
- Les cas limites (edge cases).
- L'impact sur l'existant.
- **Livrable** : Un PRD court ou une mise à jour de `docs/specifications-techniques.md`.

### 2. `/plan` - Planification
Découpage de la spec en tâches atomiques.
- Chaque tâche doit être vérifiable.
- Définir les critères d'acceptation.
- **Livrable** : Un plan d'implémentation dans un artifact ou `docs/roadmap.md`.

### 3. `/build` - Construction (TDD)
Implémentation par "vertical slices" fines.
- Suivre l'approche **TDD** définie dans le `README.md`.
- Écrire le test d'abord (Vitest/Playwright), puis le code.
- Prioriser les **Aesthetics First** : Designs premium, Vanilla CSS, animations fluides.

### 4. `/test` - Validation
Exécution de la pyramide de tests.
- Tests unitaires (logique pédagogique).
- Tests de composants Astro.
- Tests E2E si nécessaire.

### 5. `/review` - Revue de Code
Auto-critique basée sur 5 axes :
- Robustesse (gestion d'erreurs).
- Lisibilité & Documentation.
- Performance (surtout mobile).
- Accessibilité (A11y).
- Adéquation avec la pédagogie Decival.

### 6. `/ship` - Déploiement
Préparation à la mise en production.
- Validation des Firebase Security Rules.
- Vérification du build de production Astro.
- Documentation de la modification dans `AGENTS.md` ou un changelog.

---

## 🛠 Conventions Spécifiques au Projet

Tout agent doit respecter ces règles techniques impératives :

### Architecture & Routing
- **Astro Routing** : Utiliser systématiquement `index.astro` dans un répertoire (ex: `src/pages/comptes/index.astro`) pour permettre les sous-routes et éviter les conflits de fichiers.
- **Astro Actions** : Ne pas ajouter explicitement `integrations: [actions()]` dans `astro.config.mjs`, c'est une fonctionnalité native.
- **Tailwind CSS** : Ne pas utiliser par défaut. Privilégier le **Vanilla CSS** avec un design premium (glassmorphism, gradients, micro-animations).

### Pédagogie & UI
- **Abaque (Bouclier)** : Respecter les couleurs standards par rang (U, D, C, etc.) pour l'alignement des chiffres.
- **Terminologie** : Utiliser les termes pédagogiques officiels de la FWB (Fédération Wallonie-Bruxelles).

---

## 🧠 Mémoire de l'Agent
Les agents doivent mettre à jour cette section après chaque changement majeur pour conserver le contexte entre les sessions.

- **Dernière mise à jour** : 30/09/2026
- **État actuel (lot 1 carte Trello `2s5fj5bO`)** : Lot rédactionnel livré sur la branche `geoffrey-pliez-lot1-redactionnel-ui`, 6 commits :
  - `fa30067` — **inversion de décision sur les icônes d'opération**. `2edcb70` les avait dessinées en SVG stroke dans `Icon.astro` ; le rendu **emoji** des badges étant préféré, `tests/index.astro` affiche désormais `OPERATION_ICONS` (nouvelle constante dérivée de `BADGES` dans `badgeStore.ts`, source unique des symboles) en `text-4xl`, **sans pastille teintée** (les emoji ignorent `currentColor`) ; `sr-only` conserve la description accessible. Les 4 SVG `compare|plus|minus|times`, devenus inutiles, sont retirés de l'**union `Props.name` ET de la map `icons`** d'`Icon.astro`. Issue **#6** (« Unifier les icônes de badges avec le jeu SVG d'Icon.astro ») consigne le verdict inversé.
  - `2edcb70` — `tests/index.astro` : les périphrases sous les opérations sont remplacées par une **icône d'opération** + `sr-only` conservant le texte accessible. (Rendu SVG remplacé depuis par `fa30067`.) Ajouter une icône impose de toucher **l'union `Props.name` ET la map `icons`**.
  - `8d670e9` — « types d'opération maîtrisés » → « **sous-compétences maîtrisées** » (`ProgressPanel.vue`, 7 descriptions de `badgeStore.ts`, commentaires `typeMasteryStore.ts`). Vocabulaire enseignant (« type d'item ») laissé intact.
  - `9341f6c` — tutoiement de l'élève (7 chaînes : `progress/index.astro`, `ProgressChartClient.vue`, `ErrorAnalysisPanel.vue`, `ProgressPanel.vue`, `additionLogic.ts`, `subtractionLogic.ts` ×2). Le vouvoiement restant concerne l'enseignant ou la page Paramètres, hors périmètre.
  - `TestCompleteModal.vue` — « disponible dans ton profil » → « disponible dans **tes progrès** » : cohérent avec la cible réelle du lien (`/progress`), avec le bouton « Voir progrès » et avec le message l.35.
  - Validation : `pnpm test` 13 fichiers / 83 tests, `pnpm check` 0 erreur, `pnpm build` OK (warnings pré-existants : `getStaticPaths` ignoré sur `progress/feedback/[id].astro`, import dynamique `firebase/analytics`).
  - Reporté : refonte de l'encouragement / de l'indicateur de progression → **issue GitHub #5** (`enhancement`), traçabilité commentée sur la carte Trello.
  - **Convention d'icônes d'opération** : les **emoji de `BADGES`** (`badgeStore.ts`) sont la référence esthétique ; `OPERATION_ICONS` en dérive pour `/tests` et les badges n'ont donc plus de symbole dupliqué. Divergence acceptée : le glyphe emoji varie selon la plateforme (Segoe UI Emoji / Noto / Apple), contrairement à un SVG.
  - **Investigations (lot 2, aucun code modifié)** : (1) la série d'exercices **n'est pas adaptative** — les items sont générés une seule fois à la création du test (`create*Test` → `generateDistributed*Items`), distribution uniforme par type puis shuffle, sans lecture de l'historique ni de la maîtrise ; la maîtrise n'est consommée qu'en affichage/badges. (2) Il n'existe **pas de route `/profile`** : le profil de facto est **`/progress`** (nav « Progrès », `Footer.astro:14`) ; le libellé incohérent de `TestCompleteModal.vue` (« ton profil ») a été corrigé dans le commit de clôture du lot 1.
  - **À signaler, hors périmètre** : `test/logic/decimalGeneration.test.js` (« Multiplication avec décimaux > items uniques ») est **flaky** (`expected 0.75 to be close to 0.8`) — aléatoire + incohérence interne l.130-141 vs l.158-168.

- **État antérieur** : Audit CI/CD implémenté. Workflow `ci.yml` réécrit : pnpm (frozen lockfile), jobs `check` (`astro check`, 0 erreur), `test` (81/81 Vitest), `build`, `preview` PR, `deploy-production` via rollout App Hosting backend `decival`. Ajout deps `@astrojs/check` + `typescript@6`, script `pnpm check`, correction 12 erreurs TS pré-existantes (InstallPWA, Toast, useMathTest, index/MrComma).
