Portage du vieux projet Decival accessible dans le dossier ./old pour le rendre mobile.
Le portage sera en HTML5 dans l'architecture Astro.

## Étapes de développement avec l'approche TDD (Test-Driven Development)

### 1. Analyse préliminaire
- [ ] Analyser l'application Decival existante et identifier les fonctionnalités clés
- [ ] Déterminer les besoins spécifiques pour la version mobile
- [ ] Définir l'architecture de l'application sous Astro

### 2. Configuration de l'environnement de test
- [ ] Installer et configurer un framework de tests (Jest, Vitest ou Playwright)
- [ ] Mettre en place la structure des tests (dossier `/tests` ou `/src/__tests__`)
- [ ] Configurer les tests pour les composants Astro

### 3. Développement des composants UI principaux
- [ ] **Étape 1**: Écrire les tests pour le composant A
- [ ] Implémenter le composant A jusqu'à ce que les tests passent
- [ ] **Étape 2**: Écrire les tests pour le composant B
- [ ] Implémenter le composant B jusqu'à ce que les tests passent
- [ ] Refactoriser le code tout en maintenant les tests au vert

### 4. Adaptation des fonctionnalités principales
Pour chaque fonctionnalité du projet original à porter:
- [ ] Écrire les tests correspondants
- [ ] Implémenter la fonctionnalité dans l'architecture Astro
- [ ] Vérifier que les tests passent
- [ ] Refactoriser si nécessaire

### 5. Développement des fonctionnalités spécifiques mobile
- [ ] Écrire des tests pour les interactions tactiles
- [ ] Implémenter le responsive design (tests avec différentes tailles d'écran)
- [ ] Tester et implémenter les fonctionnalités hors ligne
- [ ] Optimiser les performances sur appareils mobiles

### 6. Intégration et tests système
- [ ] Écrire des tests d'intégration
- [ ] Réaliser des tests end-to-end (E2E)
- [ ] Corriger les bugs détectés
- [ ] Optimiser les performances globales

### 7. Tests utilisateurs et finitions
- [ ] Réaliser des tests avec de vrais utilisateurs
- [ ] Collecter et analyser les retours d'expérience
- [ ] Apporter les ajustements finaux
- [ ] Préparer la documentation utilisateur

### 8. Déploiement
- [ ] Préparer la configuration de production
- [ ] Déployer l'application
- [ ] Effectuer des tests post-déploiement
- [ ] Mettre en place un système de monitoring et d'analyse de performances