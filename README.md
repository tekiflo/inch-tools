# Inch Tools

Une collection d'outils web pratiques pour les calculs et conversions courantes.

## 🛠️ Outils Disponibles

- **Calculateur de Salaire Net** : Convertit le salaire brut en net avec les cotisations sociales françaises

## 🚀 Technologies

- **React Native** avec Expo
- **TypeScript** pour un typage robuste
- **Biome** pour le linting et formatage
- Interface utilisateur en français

## 📱 Développement

```bash
# Installation des dépendances
npm install

# Démarrage en mode développement
npm start

# Version web
npm run web

# Linting et formatage
npm run check
```

## 🤖 Claude Code Showcase

Ce projet a été développé en collaboration avec **Claude Code**, démontrant les capacités d'assistance au développement avec IA. 

### Configuration Claude utilisée

Le développement suit ces principes configurés dans `~/.claude/CLAUDE.md` :

```markdown
# Claude Agent Configuration

## Important Instructions
- **SHOULD**: Use TypeScript over JavaScript whenever possible.
- **MUST**: Correct me if I'm wrong.
- **MUST**: If code has been written, commit after each prompt completion using conventional commits format (no description, only one-line title)
- Never use null values unless I explicitly say so or if it's absolutely needed

## Context Usage
- Use context7 for specific tasks and reference

## Code Style
- Avoid comments unless the code is extremely complex

## MCP Servers
- **context7**: Documentation et exemples de code pour les bibliothèques
- **code-reasoning**: Raisonnement structuré et résolution de problèmes
- **ide**: Intégration IDE avec diagnostics et exécution de code
```

---

*Développé avec Claude Code - Intelligence artificielle au service du développement*
