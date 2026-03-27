# 🪐 Vela Ecosystem: The Medical Nexus

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Vela** is a multi-dimensional clinical command center designed to bridge the gap between AI triage and human professional medicine. Built with a sleek **Cyber-Glass & Neon Pulse** aesthetic, it provides a high-performance environment for both doctors and patients.

---

## 🏛️ Project Architecture

Vela is divided into two primary nodes:

### 1. [Frontend (Next.js Node)](./frontend)
A high-performance React application utilizing **Next.js 15 App Router** for a fluid, responsive medical portal.
- **Doctor Nexus**: Comprehensive dashboard for clinical practice management.
- **Patient Portal**: Secure access to medical records, appointments, and AI triage.
- **Cyber-Glass UI**: A futuristic, state-of-the-art interface with glassmorphism and fluid animations.

### 2. [Backend (FastAPI Node)](./backend)
A production-grade Python API layer handling identity, complex clinical logic, and real-time syncing.
- **Firebase Core**: Real-time Firestore document syncing and secure Auth.
- **Clinical Routers**: Dedicated points for doctor registration, appointment scheduling, and revenue analytics.
- **AI Triage Integration**: Leveraging state-of-the-art LLMs for diagnostic assistance.

---

## 🧪 Key Features

- **🛡️ Multi-Phase Guarding**: Strict authentication and roles-based gating for unverified, pending, and verified providers.
- **📊 Financial Intelligence**: Real-time revenue analytics and automated yield tracking for clinicians.
- **🗓️ Temporal Command**: Advanced weekly scheduling system with subcollection-level precision.
- **🏥 Patient Archives**: Full EMR (Electronic Medical Record) lifecycle management.
- **🚑 Live Availability**: Real-time toggling for clinical sessions with instant patient notification.

---

## 🚀 Deployment & Local Setup

### ⚙️ Backend Setup
1. `cd backend`
2. `python -m venv .venv`
3. `source .venv/bin/activate` (or `.venv\Scripts\activate` on Windows)
4. `pip install -r requirements.txt`
5. `uvicorn main:socket_app --reload`

### 🎨 Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 🛠️ Tech Stack & Dependencies

- **Frontend**: React 19, Next.js 15, Zustand (State), Framer Motion (Animations), Tailwind CSS.
- **Backend**: Python 3.10+, FastAPI, Pydantic, Firebase Admin SDK.
- **Infrastructure**: Groq/HuggingFace (AI), Vercel/Render (Deployment).

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with 💖 by the **Vela Development Team**.
