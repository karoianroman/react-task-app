# React Task App (Cloud Native)

A modern Task Management application built with **React** and **Vite**, featuring a professional-grade **DevSecOps** pipeline for automated deployment to **Google Cloud Platform**.

## 🚀 Project Goal

The main objective of this project is to demonstrate how a containerized frontend application can be securely managed and deployed using industry-standard automation tools and serverless cloud infrastructure.

## 🛠 Tech Stack

- **Frontend:** React, Vite, pnpm
- **Environment:** Node.js 20+
- **Cloud Infrastructure:** Google Cloud Run, Artifact Registry
- **CI/CD & Security:** GitHub Actions, Gitleaks, Hadolint, Trivy

---

## 🏗 CI/CD & DevSecOps Pipeline

This project utilizes a robust GitHub Actions workflow to ensure security and stability:

### 🛡️ Security Gates
* **Gitleaks:** Scans for sensitive data and secrets in the codebase.
* **Hadolint:** Validates the `Dockerfile` for optimization and security best practices.
* **Trivy:** Audits the final Docker image for vulnerabilities before it is deployed to production.

### 📦 Automation & Deployment
* **Workload Identity Federation:** Implements keyless authentication to GCP for enhanced security.
* **Containerization:** Automates the build and push process to **Google Artifact Registry**.
* **Serverless Deployment:** Deploys to **Cloud Run**, ensuring high availability and automatic scaling.

### 🔥 Verification
* **Post-Deployment Smoke Test:** Automatically verifies the live application endpoint using `curl` to ensure 100% uptime after updates.

---

## 🚦 Getting Started

### Local Setup
1. **Install dependencies:**
   ```bash
   pnpm install

    Run development server:
    Bash

    pnpm dev

Docker Execution
Bash

docker build -t react-task-app .
docker run -p 8080:8080 react-task-app