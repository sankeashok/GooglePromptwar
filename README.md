# 🌉 LifeBridge: Universal Intent Resolution System

![PromptWars FINAL](https://img.shields.io/badge/Status-Production_Ready-success) ![Cloud Run](https://img.shields.io/badge/Deployed_on-Google_Cloud_Run-blue) ![Google AI](https://img.shields.io/badge/Powered_by-Gemini_2.5_Flash-orange)

LifeBridge is a high-performance **Universal Bridge** designed for the Google PromptWars challenge. It acts as an intelligent translator between messy, unstructured human intent (panicked voice calls, clinical notes, weather feeds, or disaster photos) and the complex, structured actions required to save lives.

## 🚀 Experience the Live App
**Public Cloud Run URL:** [https://lifebridge-446421530034.us-central1.run.app](https://lifebridge-446421530034.us-central1.run.app)

---

## 🛠️ The PromptWars Engineering Stack

| Component | Technology | Rationale |
| :--- | :--- | :--- |
| **Logic Engine** | **Gemini 2.5 Flash** | Chosen for its multimodal capability and industry-leading inference speed. |
| **Infrastructure** | **Google Cloud Run** | Enables sub-second cold starts and infinite horizontal auto-scaling. |
| **Web Server** | **Nginx Alpine** | Ultra-lightweight containerized engine for secure, 24/7 static serving. |
| **Security** | **BYOK (Bring Your Own Key)** | Decentralized API calls. No hardcoded keys = 100% security for the user. |
| **Build System** | **Docker (Multi-Stage)** | Optimized 22-alpine pipeline ensuring reliable cross-environment builds. |

## 🛠️ Technical Architecture

### 1. Model-Agnostic Adapter Pattern
LifeBridge is built on a **Universal Intent Resolver** interface located in `src/services/intentResolver.js`. This decouples the application UI from the underlying AI model (e.g., Gemini). By implementing this **Bridge Pattern**, the system is future-proof: any future LLM can be integrated by adding a single adapter function without rewriting any front-end components.

### 2. Secure Hybrid Key Strategy
We implement a multi-tier security model for API Key management:
- **Client-Side BYOK**: Keys are stored exclusively in `localStorage` for user privacy.
- **Secure Cloud-Injection**: In production, keys are injected as build-time environment variables directly on **Google Cloud Build**, ensuring the GitHub repository remains 100% secure with zero leakage.

## 🚀 360-Degree Quality Assurance
- **Resolution Accuracy**: Verified against 10 "Gold Standard" disaster scenarios in `accuracy.test.js`.
- **Infrastructure**: Served via **Nginx Alpine** on **Google Cloud Run** with Brotli/Gzip compression.
- **Mobility**: Full **PWA Support** for "Panic Button" home-screen access.

## 💡 How it Solves the Challenge
LifeBridge isn't built for a single niche; it is a **Universal System**. It understands context dynamically:

- **Emergency Dispatch**: Translates panicked transcripts into a structured report for paramedics.
- **Medical Decoder**: Scans messy doctor notes to extract medication, age, and diagnostic plans.
- **Disaster Bridge**: Analyzes weather/news feeds to suggest immediate evacuation routes.

## ⚙️ Project Setup & Deployment

### Local Development
1. Clone the repo:
   ```bash
   git clone https://github.com/sankeashok/GooglePromptwar.git
   ```
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`
4. Access at `localhost:5173` and input your Google AI API key in the top-right Settings.

### Production Push
To redeploy this infrastructure to your own Cloud Run instance:
```bash
gcloud run deploy lifebridge --source . --port 8080 --allow-unauthenticated
```

---
*Built with excellence by Sanke Ashok as part of the Google PromptWar Sprint.*
