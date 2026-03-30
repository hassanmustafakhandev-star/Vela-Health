# 🪐 Vela Ecosystem: The Medical Nexus

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Firebase](https://img.shields.io/badge/Database-Firebase-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![AI-Powered](https://img.shields.io/badge/AI-Groq%20LLaMA3-fuchsia?style=flat-square)](https://groq.ai/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Vela** is a multi-dimensional clinical command center designed to bridge the gap between AI triage and human professional medicine. Built with a sleek **Cyber-Glass & Neon Pulse** aesthetic, it provides a high-performance environment for both doctors and patients, unifying the entire healthcare journey into a single digital nexus.

---

## 🏛️ Project Architecture

Vela is divided into two primary nodes:

### 1. [Frontend (Next.js Node)](./frontend)
A high-performance React application utilizing **Next.js 15 App Router** for a fluid, responsive medical portal.
- **Doctor Nexus**: Comprehensive clinical management with UHD video integration.
- **Patient Portal**: AI-First health dashboard with real-time biometric telemetry.
- **Cyber-Glass UI**: A state-of-the-art interface with glassmorphism and fluid motion.

### 2. [Backend (FastAPI Node)](./backend)
A production-grade Python API layer handling identity, complex clinical logic, and real-time syncing.
- **AI Triage Core**: Groq-powered LLaMA3/Whisper for instant symptoms analysis.
- **Firebase Core**: Real-time Firestore document syncing and secure Storage archives.
- **Clinical Logic**: Advanced scheduling, Rx generation, and automated EMR lifecycle.

---

## 🔬 Core Ecosystem Modules

### 🏥 The Clinical Loop (End-to-End)
- **AI Symptom Triage**: Descriptive triage in any language using LLaMA3.
- **UHD Video Consultation**: Encrypted WebRTC consultation room with live AI transcripts.
- **Digital Rx Builder**: High-fidelity prescription generation with meds and lab advice.
- **Pharmacy Marketplace**: Real-time inventory search and door-step medicine delivery.
- **Lab Diagnostics**: Categorized test catalog with home sampling booking protocol.

### 🛡️ Smart Triage & Emergency
- **Emergency SOS Node**: One-tap geolocation broadcast for instant rescue dispatch (1122/Edhi/Police).
- **Family Network**: Centralized command for managing dependents and senior health nodes.
- **Health Vault**: End-to-end encrypted storage for labs, scans, and clinical archives.

### 📊 Clinician Intelligence
- **Temporal Alignment**: Weekly slot management with subcollection precision.
- **Registry & EMR**: Doctors access deep patient medical history before consultations.
- **Analytics Matrix**: Real-time revenue tracking and patient density predictions.

---

## 🚀 Quick Setup (Development)

### ⚙️ Backend Setup
1. `cd backend`
2. `pip install -r requirements.txt`
3. Configure `.env` with Firebase & Groq keys.
4. `uvicorn main:socket_app --reload --port 8000`

### 🎨 Frontend Setup
1. `cd frontend`
2. `npm install`
3. `npm run dev`

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, Zustand (State), Framer Motion (Animations), TanStack Query.
- **Backend**: FastAPI, Pydantic, Firebase Admin SDK, Groq AI (LLaMA3, Whisper).
- **Communication**: WebRTC (Video), Socket.io (Signaling), Firebase Auth.

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

Developed with 💖 for a Healthy Pakistan.
