# Predictive Cash-Withdrawal Intelligence System (PCWIS)

Official prototype for the **Ministry of Home Affairs (MHA) & Indian Cybercrime Coordination Centre (I4C)** — National Cybercrime Cash-Withdrawal Predictive Analytics Portal.

## Architecture & Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS + Leaflet GIS Maps + Recharts
- **Backend**: Python FastAPI + SQLite + scikit-learn (KernelDensity Estimation)
- **Database**: SQLite (`intelligence.db`) with automated seeding of clustered crime incidents

## Key Features

- **Real-Time KPI Strip**: Displays flagged complaints (24h), active fraud networks, flagged mule accounts, predicted cash-withdrawal events, and secured capital.
- **ML Cash-Out Prediction Generator (`POST /predict`)**: Evaluates crime parameters (`fraudCategory`, `victimLat`, `victimLng`, `amount`) using Gaussian Kernel Density Estimation (KDE) to discover spatial cash-out centroids, time window delays, and weighted Explainable AI (XAI) risk factors.
- **National Complaint Register (`GET /complaints`)**: Real-time searchable and filterable database register compliant with Section 102 BNSS with Word (.DOC) & Excel (.CSV) report exports.
- **Interactive Action Directives**: Authorize mobile patrol dispatches to predicted ATM cluster coordinates, initiate RBI Sec 102 BNSS bank freeze directives, and issue Sec 91 CrPC CCTV video requisitions.

## Setup & Running Locally

### 1. Backend (FastAPI)
```bash
# Install dependencies
pip install fastapi uvicorn pydantic scikit-learn faker numpy

# Run backend server (auto-seeds database on startup)
python backend/main.py
```
The FastAPI backend will start at `http://127.0.0.1:8000`.

### 2. Frontend (React + Vite)
```bash
# Install Node dependencies
npm install

# Start Vite dev server
npm run dev
```
The React frontend will start at `http://localhost:5173`.
