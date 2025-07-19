# Inch Tools

A collection of practical web tools for common calculations and conversions.

## 🛠️ Available Tools

- **Net Salary Calculator**: Converts gross salary to net with French social contributions

## 🚀 Technologies

- **React Native** with Expo
- **TypeScript** for robust typing
- **Biome** for linting and formatting
- User interface in French

## 📱 Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Web version
npm run web

# Linting and formatting
npm run check
```

## 🤖 Claude Code Showcase

This project was developed in collaboration with **Claude Code**, demonstrating AI-assisted development capabilities. 

### Claude Configuration Used

Development follows strict principles configured in `~/.claude/CLAUDE.md`:

```markdown
# Claude Agent Configuration

## Code Requirements
- **MUST**: Use TypeScript exclusively - never JavaScript
- **MUST**: Provide full type annotations and interfaces for all code
- **MUST**: Correct me if I'm wrong about technical details
- **MUST**: Commit after each prompt completion using conventional commit format (title only, no description)
- **NEVER**: Use null values unless explicitly requested or absolutely necessary
- **NEVER**: Write comments unless code is extremely complex or business logic requires explanation

## Documentation and Research
- **ALWAYS**: Use context7 MCP server for library documentation and code examples before writing code
- **MUST**: Reference official documentation through context7 rather than making assumptions about APIs
- **SHOULD**: Verify library usage patterns and best practices through context7 before implementation

## Code Standards
- Prefer explicit typing over type inference where it improves readability
- Use strict TypeScript configuration
- Implement proper error handling with typed exceptions
- Follow functional programming patterns where appropriate
```

## MCP Servers
- **context7**: Documentation and code examples for libraries
- **code-reasoning**: Structured reasoning and problem solving
- **ide**: IDE integration with diagnostics and code execution

## Custom Claude Commands
- **/fix-issue**: Systematically analyze and fix GitHub issues with automated workflow

---

*Developed with Claude Code - AI-powered development assistance*
