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

- **Dernière mise à jour** : 12/05/2026
- **État actuel** : Retour de l'interface de comparaison à la version historique : l'utilisateur clique directement sur le nombre le plus grand ou sur un bouton "=" central pour plus de clarté, remplaçant les anciens boutons "<, =, >". Suppression de l'affichage du résultat après chaque réponse dans les tests (diagnostique) pour éviter d'influencer l'élève. Le passage à la question suivante est désormais immédiat. Les sons de feedback (correct/incorrect) ont été remplacés par un son de clic neutre durant le test. Le workflow Addy's Skill est maintenu rigoureusement.
