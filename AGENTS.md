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

- **Dernière mise à jour** : 27/10/2026
- **Sélecteur élève sur /progress (27/10/2026, commit `bddfcac`)** : titre « Progrès de X » + `<select>` natif (liste élèves, changement réactif vérifié browser Pierre→Geoffrey) + lien « Gérer les profils » → `/tests/qui`. État vide si aucun élève. TDD `progressReactivity.test.js`. Validation : 167/167 tests (23 fichiers), check 0, build OK.
- **Fausse panne page test (26/10/2026, aucun commit)** : `/tests/<op>?mode=` vide = dev-server Vite coincé (504 persistants `nanoid.js` + `canvas-confetti.js`, dep optimizer bloqué, nombreux process node parasites d'autres sessions). Fix : tuer l'arbre `pnpm dev`, `rm node_modules/.vite`, relancer `pnpm dev` (port 4325 du `package.json`). Parcours complet revalidé en browser (qui → exercice → mode → test, guards redirect OK). 166/166 tests, check 0, build OK. Code inchangé.
- **Sessions élèves locales (branche `geoffrey-pliez-sessions-eleves`, commit `8f15d3c`)** : profils par prénom sans mot de passe (tablette partagée, ex. Pierre/Paul). `studentStore.ts` (CRUD, validation trim/vide/doublon insensible casse/max 20, id randomUUID+fallback). `persistence.ts` : namespacing `decival_student_<id>_<suffixe>` (4 clés : maîtrise, badges, historique, stats ; préférences globales hors scope), `migrateLegacyToStudent` au premier profil, `clearStudentData`. 3 stores recâblés (`loadStudentData` + subscribe changement élève + saves scopées). Parcours 3 écrans (`f48dcdb`) : `/tests/qui` (qui joue, CTA masqué sans actif) → `/tests` hub (ligne session + redirect si aucun actif, CTA vers `/tests/mode?op=`) → `/tests/mode` (ModePicker par op, redirect si op invalide) → `/tests/<op>?mode=` (TestShell auto-start, Quitter/Fermer → mode, back-links → mode). `testModeRoute.ts` (parse/build/validate, TDD 3 tests). Accueil CTA → `/tests/qui`. Settings carte Élèves (changer/renommer via prompt/supprimer avec confirm + purge namespace). Validation : 166/166 tests (22 fichiers), check 0 erreur (warnings pré-existants), build OK. Déplacement `07fa046` : sélecteur retiré de l'accueil vers `/tests`.
- **Cohérence `/settings` 100% (branche `geoffrey-pliez-scaling-meme`, commits `d78b9ac` + `c05abc9` + `7a88224` + `533233b`)** : `currentPage="settings"` (Footer actif), wrapper `max-w-lg mx-auto py-6 px-4` identique tests, h1 `text-2xl font-bold mb-6` gauche sans `dark:text-white` redondant (Layout donne déjà `dark:text-gray-100`), `space-y-4`, cartes `p-4 border-transparent dark:border-gray-700`, h2 `text-xl` partout (Sound/Animation h3→h2), bloc version dupliquée supprimé (Footer affiche déjà `v{APP_VERSION}`). Validation : 145/145 tests, check 0, build OK.
- **Fix badges partiels + centrage `/settings` (branche `geoffrey-pliez-scaling-meme`, commits `4b93ab2` + `ec3d6a4`)** : settings colonne `max-w-lg mx-auto` + titre `text-center` ; BadgeIcon fg `height%`+`flex-end` vs bg `flex-start` → glyphes décalés en partiel → fg `clip-path: inset()` même boîte/ancrage `center`, `line-height:1`. Validation : 145/145 tests, check 0 erreur, build OK, détecteur `[]`.
- **Fix `/impeccable fixe settings.astro` (branche `geoffrey-pliez-scaling-meme`, commits `324b186` + `f37ca63`)** : `global.css` `.toggle-checkbox` + `.settings-range` partagés ; Sound/AnimationSettings bordures visibles + `<style>` dupliqués retirés + tutoiement élève ; settings.astro À propos condensé + version contrastée + carte réintégrée dans `max-w-lg` (largeur uniforme). Validation : 145/145 tests (flaky `reportBug.test.js` timeout isolé, 5/5 en rerun), check 0 erreur, build OK, détecteur `[]`.
- **Recritique `/impeccable critique tout` 28/40 → 5 recos P0→P2 traitées (branche `geoffrey-pliez-scaling-meme`)** : `f737ea3` P1 ternary → map `PROGRESS_MESSAGES` + `getProgressMessage` TDD (ProgressPanel) ; `e2d82e4` P1 CTA `min-h-[44px]` (tests/index.astro) ; `a12012c` P2 hero double entrée élève/enseignant (index.astro) ; `b45a3f2` P2 hub-reco anneau accent carte en cours (tests/index.astro) ; P2 mid-test-hint : déjà câblé (`getInTestEncouragement` + `aria-live` TestShell:31), aucun code. Validation : 59 fichiers / 145 tests, check 0 erreur, build OK.
- **Recritique `/impeccable critique tout` 25/40 → 5 fixes P0→P2 appliqués (branche `geoffrey-pliez-scaling-meme`)** : `e4c1d41` P0 titre encouragement manquant (`getTestEncouragement` retourne `title: 'À toi de jouer !'`, TDD) ; `738d78c` P1 validators unifiés (`src/types/test.ts` source unique EN→FR, TestCompleteModal traduit via `TEST_TYPE_LABELS`, supprime prop `testTypeLabel` TestShell + 4 wrappers) ; `50e2792` P1 violet résiduel → tokens accent (ProgressPanel hero + stat Tests) ; `f5826f5` P2 span Retour trompeur supprimé (beta-note reformulée) + `showDetails` replié par défaut (DiagnosticFeedback). Validation : 18 fichiers / 144 tests, check 0 erreur, build OK.
- **Critique `/impeccable critique tout` 27/40 → 4 fixes appliqués (branche `geoffrey-pliez-scaling-meme`)** : `4134937` lavis violet → neutre (TestModeSelector, ProgressPanel) ; `064cad8` Esc modale neutre + focus `[data-autofocus]` (TestCompleteModal, TestShell) ; `649f379` hub signal `getCategorySummary()` TDD + meta/CTA par carte (progressLogic, tests/index.astro) ; `089dcc4` pastille statut + bordure neutre + easing ease-out-quart (DiagnosticFeedback `tone` sémantique remplace `color` hex, animations.ts `bounce`→`pop`, MasteryEffect). Validation : 17 fichiers / 140 tests, check 0 erreur, build OK. Quirks : `<script setup>` Vue sans `lang="ts"` → pas d'annotations TS (build casse) ; Astro exige `<p></p>` explicite.
- **Décision produit (23/10/2026)** : positionnement **analyse seule** — pas de pages règles de calcul, à charge de l'enseignant de montrer méthodes/règles. Ancien essai abaque/pages règles abandonné ; P2 « couleurs abaque / motif droite numérique » rejetée comme support de règles.
- **État actuel (badges progressifs, branche `geoffrey-pliez-badges-progressifs-repartition`, commit `1cab870`)** : 15 badges (12 + LEVEL_10/20/35 alignés MrComma : 🤓 lunettes, 🛡️ cape, 🥇 couronne argent). `getBadgeProgress()` dans `progressLogic.ts` (niveau/maîtrise/streak/binaire). `BadgeIcon.vue` progressif : anneau conic-gradient + remplissage emoji 2 couches + `%` + `role=progressbar`. Unlock seuils dans `testStore.ts`. Validation : 17 fichiers / 128 tests, check 0 erreur, build OK.
- **État précédent (lot 1 carte Trello `2s5fj5bO`)** : Lot rédactionnel livré sur la branche `geoffrey-pliez-lot1-redactionnel-ui`, 6 commits :
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
