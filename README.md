🚀 FeedPulse | AI-Powered Product Intelligence Platform

FeedPulse is a sophisticated internal tool designed to bridge the gap between raw user feedback and actionable product strategy. By leveraging the Gemini 1.5 Flash AI, the platform automates the heavy lifting of categorizing, prioritizing, and summarizing feedback, allowing product teams to focus on building rather than sorting.

🏗️ Architecture & Engineering Decisions

As a senior-led project, the architecture follows a clean separation of concerns:

Frontend: Built with Next.js 14+ for optimized rendering and Tailwind CSS for a high-performance, glassmorphism UI.
Backend: A Node.js/Express REST API written in TypeScript to ensure type safety across the feedback lifecycle.
Intelligence Layer: Deep integration with Google Gemini 3 Flash for real-time natural language processing.
Database: MongoDB with optimized indexing on status and priority fields for high-concurrency dashboard queries.

🌟 Core Features

1. Intelligence-Driven Submission 
Public Portal: A clean, non-auth page for user submissions.
Smart Validation: Client-side checks for data integrity (20-character minimum for descriptions).
Rate Limiting: Integrated protection preventing more than 5 submissions per hour per IP.

2. Automated AI Analysis 
Sentiment Detection: Automatic "Positive," "Neutral," or "Negative" labeling.
Priority Scoring: AI-calculated urgency scores from 1 (low) to 10 (critical).
Auto-Tagging: Intelligent metadata generation (e.g., #UI, #Bug, #Mobile).
Trend Summarization: On-demand executive summaries identifying the top 3 themes from recent data.

3. Professional Admin Dashboard 
Status Management: Full lifecycle tracking (New → In Review → Resolved).
Advanced Filtering: One-click filtering by category or status.
Keyword Search: High-speed search across titles and AI-generated summaries.
Visual Analytics: Stats bar and distribution charts for at-a-glance health checks.

🛠️ Technical Stack & Dependencies

Frontend
Framework: Next.js (App Router) 
Animations: Framer 
MotionIcons: Lucide React
State/Data: Axios, React Hot Toast
Charts: Recharts

Backend
Runtime: Node.js & Express (TypeScript) 
Database: Mongoose (MongoDB) 
Security: JWT (JsonWebToken), bcrypt, 
express-rate-limitTesting: Jest, Supertest 

⚙️ Installation & Setup

Prerequisites
Node.js (v18+)
MongoDB Instance
Google AI Studio API Key 

Local Development

1.Clone the Repository:

Bashgit clone https://github.com/your-username/feedpulse.git
cd feedpulse

2.Backend Configuration:

Create backend/.env:
Code snippetPORT=4000
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_key_here
JWT_SECRET=your_secret
ADMIN_EMAIL=admin@feedpulse.com
ADMIN_PASSWORD=admin123

3.Install & Run:

Bash# In /backend
npm install && npm run dev
# In /frontend
npm install && npm run dev

