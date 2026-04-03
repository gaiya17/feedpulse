# 🚀 FeedPulse | AI-Powered Product Intelligence Platform

**FeedPulse** is a sophisticated internal tool designed to bridge the gap between raw user feedback and actionable product strategy. By leveraging the Gemini 1.5 Flash AI, the platform automates the heavy lifting of categorizing, prioritizing, and summarizing feedback, allowing product teams to focus on building rather than sorting.

## 🏗️ Architecture & Engineering Decisions

As a senior-led project, the architecture follows a clean separation of concerns:

**Frontend**: Built with Next.js 14+ for optimized rendering and Tailwind CSS for a high-performance, professional UI.

**Backend**: A Node.js/Express REST API written in TypeScript to ensure type safety and maintainability across the feedback lifecycle.

**Intelligence Layer**: Deep integration with Google Gemini 1.5 Flash for real-time natural language processing and sentiment analysis.

**Database**: MongoDB with optimized indexing on status, category, and priority fields for high-concurrency dashboard queries.

## 🌟 Core Features

**🛠️ Intelligence-Driven Submission**

**Public Portal**: A clean, accessible page for user submissions.

**Smart Validation**: Client-side and server-side checks for data integrity (e.g., 20-character minimum for descriptions).

**Rate Limiting**: Integrated protection preventing more than 5 submissions per hour per IP to prevent spam.

**Visual Feedback**: Real-time character counters and interactive loading states.

**🧠 Automated AI Analysis**

**Sentiment Detection**: Automatic "Positive," "Neutral," or "Negative" labeling.

**Priority Scoring**: AI-calculated urgency scores from 1 (low) to 10 (critical).

**Auto-Tagging**: Intelligent metadata generation (e.g., #UI, #Bug, #Mobile) for better organization.

**Trend Summarization**: On-demand AI summaries identifying the top themes and pain points from current data.

**Manual Re-trigger**: Admin capability to re-run AI analysis on any specific item if context changes.

**📊 Professional Admin Dashboard**

**Status Management**: Full lifecycle tracking (New → In Review → Resolved).

**Advanced Filtering**: One-click filtering by category or status.

**Smart Sorting**: Organize feedback by date or AI-calculated priority score.

**Keyword Search**: High-speed search across titles and AI-generated summaries.

**Visual Analytics**: Interactive pie charts and stats bars for at-a-glance health checks.

## 🛠️ Technical Stack & Dependencies

**Frontend**

**Framework**: Next.js (App Router)

**Styling**: Tailwind CSS

**Animations**: Framer Motion

**Icons**: Lucide React

**Charts**: Recharts

**Feedback**: React Hot Toast

**Backend**

**Runtime**: Node.js & Express (TypeScript)

**Database**: Mongoose (MongoDB)

**Security**: JWT (JsonWebToken), bcrypt, NoSQL Injection protection.

**Spam Protection**: express-rate-limit

## ⚙️ Installation & Setup

**Prerequisites**

Node.js (v20+)

Docker Desktop (for containerized setup)

Google AI Studio API Key

**🐳 Run with Docker (Recommended)**

The entire FeedPulse ecosystem is dockerized for easy deployment. You can start the Frontend, Backend, and MongoDB with one command:

1. Create a .env file in the root folder.

2. Run the following: docker-compose up --build

3. Access the application:

**Frontend**: http://localhost:3000

**Admin Dashboard**: http://localhost:3000/login

**Local Development (Alternative)**

1. Clone the Repository:

git clone <your-repo-url>
cd feedpulse

2. Environment Variables: Create a .env in /backend with:

MONGO_URI, GEMINI_API_KEY, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD.

3. Install & Run:

**In /backend**: 
npm install && npm run dev

**In /frontend**: 
npm install && npm run dev

<img width="1919" height="1146" alt="Feedback Form" src="https://github.com/user-attachments/assets/631ee50e-1c09-4092-8036-ec279947f13d" />

<img width="1919" height="1138" alt="Login Page" src="https://github.com/user-attachments/assets/30cb5c1b-484a-409f-bce7-f75769a5acb3" />

<img width="1919" height="1137" alt="Admin Dashboard" src="https://github.com/user-attachments/assets/b6c79cc5-5fd4-428d-a8a3-7b11e13dcb78" />

<img width="1919" height="1141" alt="Feedback Preview" src="https://github.com/user-attachments/assets/3ccdf81c-8578-4cff-999c-065db0bcb3c0" />


