# LifeBridge: Intent Translation System 🌉

![PromptWars MVP](https://img.shields.io/badge/Status-Completed-success) ![Framework](https://img.shields.io/badge/Vite-React-blue) ![Google AI](https://img.shields.io/badge/Powered_by-Gemini-orange)

LifeBridge is an MVP built for the **PromptWars Challenge**. It acts as a universal bridge between messy, unstructured human intent (like voice transcripts, weather reports, raw emergency data, or images) and complex responding systems.

It instantly parses, categorizes, and outputs verified, life-saving structured actions using the deepest capabilities of Google's Gemini multimodal models.

## Core Features
- **Instant Intent Translation**: Converts raw text or images into structured JSON with categorized urgency levels.
- **"Bring Your Own Key" (BYOK)**: 100% secure architecture. Users input their own Gemini API key into the browser—it's never stored on the server or committed to GitHub.
- **Glassmorphic UI**: High-contrast, highly responsive custom dark-mode interface built for speed and accessibility.
- **Multi-Modal Engine**: Seamlessly processes both text and image streams through `gemini-2.5-flash`.

## Local Development
Since this project utilizes the Bring-Your-Own-Key model, you can run it perfectly locally without complicated backend setups.

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the lightning-fast Vite server:
   ```bash
   npm run dev
   ```
4. Open the browser, click the **Settings icon** on the top right, and paste your Google AI Studio API key.

## Cloud Run Deployment ☁️
This project contains a multi-stage `Dockerfile` and `nginx.conf` specifically engineered for **Google Cloud Run** to serve the static bundle securely.

To deploy it:
1. Ensure you have the `gcloud` CLI installed and authenticated.
2. From the project root, run:
   ```bash
   gcloud run deploy lifebridge --source . --port 8080 --allow-unauthenticated
   ```
3. Wait for the build to complete, and copy the `https://lifebridge-...run.app` URL for your PromptWars submission!

---
*Built within 45 minutes for Google PromptWars.*
