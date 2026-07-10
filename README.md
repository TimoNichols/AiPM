# Orbit — Agent Studio

A self-contained front-end prototype for an AI agent workspace. It explores the product direction for coordinating Claude, Codex, Gemini, and local models from one IDE-like surface.

## Run locally

The easiest option is to double-click `start-server.bat`. Keep the terminal window open while using the app, then open <http://localhost:4173>.

Or start a static file server from this folder:

```powershell
python -m http.server 4173
```

Then open <http://localhost:4173>.

## Prototype interactions

- Select an agent card to update the assignment inspector.
- Change routing policy and token budget.
- Toggle approval requirements.
- Add context to the swarm from the composer.
- Open the provider connection modal from the connections panel.
- Use the sidebar to switch workspace views.
