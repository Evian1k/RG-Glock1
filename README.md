# RG-Glock1 Project

## Table of Contents
- [Project Overview](#project-overview)
- [Getting Started](#getting-started)
- [Dependencies & Packages](#dependencies--packages)
- [Folder Structure](#folder-structure)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
- [Environment Variables & Configuration](#environment-variables--configuration)
- [Testing](#testing)
- [Contributing](#contributing)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

**RG-Glock1** is a full-stack application featuring a Python backend and a modern React frontend. The backend provides APIs for marketplace, payment, analytics, and more, while the frontend offers a rich user interface with features like marketplace, wallet, social hub, and more.

---

## Getting Started

To get your development environment up and running, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd RG-Glock1
   ```
2. **Set up the backend:**
   - Install Python (3.8+)
   - Install pipenv: `pip install pipenv`
   - Install dependencies:
     ```bash
     cd backend
     pipenv install
     ```
   - Run the backend server:
     ```bash
     ./run_api.sh
     ```
3. **Set up the frontend:**
   - Install Node.js (v18+ recommended)
   - Install dependencies:
     ```bash
     cd frontend
     npm install
     ```
   - Run the development server:
     ```bash
     npm run dev
     ```

---

## Dependencies & Packages

### Backend (Python)
- Python 3.8+
- pipenv
- Flask
- stripe
- requests
- (See `backend/Pipfile` for the full list)

### Frontend (Node.js/React)
- Node.js v18+
- React
- Vite
- Tailwind CSS
- PostCSS
- (See `frontend/package.json` for the full list)

---

## Folder Structure

```
RG-Glock1/
├── backend/                # Python backend (APIs, business logic)
│   ├── marketplace_api.py  # Marketplace API endpoints
│   ├── payment_api.py      # Payment API endpoints
│   ├── run_api.sh          # Script to run backend server
│   ├── Pipfile, Pipfile.lock # Python dependencies
│   ├── postman-examples/   # Postman collection for API testing
│   └── project/            # Core backend modules
│       ├── admin.py, ai_utils.py, ... # Various backend utilities
│       └── __pycache__/    # Python bytecode cache
│   └── templates/          # HTML templates (e.g., products.html)
├── frontend/               # React frontend (Vite + Tailwind)
│   ├── index.html          # Main HTML entry
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   ├── postcss.config.js   # PostCSS config
│   ├── plugins/            # Custom Vite/React plugins
│   ├── src/                # Main React source code
│   │   ├── App.jsx, main.jsx, index.css
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Feature-specific components
│   │   ├── layout/         # Layout components
│   │   ├── sections/       # Main app sections (Marketplace, Wallet, etc.)
│   │   ├── ui/             # UI primitives (button, card, etc.)
│   │   ├── config/         # App configuration
│   │   └── lib/            # Utility functions
│   └── public/             # Static assets (e.g., logo)
└── README.md               # Project documentation
```

---

## Backend Setup

1. **Install Python (3.8+)**
2. **Install pipenv:**
   ```bash
   pip install pipenv
   ```
3. **Install dependencies:**
   ```bash
   cd backend
   pipenv install
   ```
4. **Run the backend server:**
   ```bash
   ./run_api.sh
   ```
   Or, if you want to run a specific API module:
   ```bash
   pipenv run python project/api_server.py
   ```

---

## Frontend Setup

1. **Install Node.js (v18+ recommended)**
2. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```
3. **Run the development server:**
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or as shown in the terminal).

---

## Running the Application

- **Development:**
  - Start backend (see above)
  - Start frontend (see above)
- **Production:**
  - Build frontend:
    ```bash
    npm run build
    ```
  - Serve the built frontend with your preferred static server (e.g., `serve` npm package) or integrate with backend as needed.
  - Deploy backend using your preferred method (e.g., Gunicorn, Docker, cloud service).

---

## Environment Variables & Configuration

- **Backend:**
  - Configure environment variables as needed for database, API keys, etc. (see code for details)
  - Example: `.env` file or export variables in shell
- **Frontend:**
  - Configure API endpoints in `src/lib/utils.js` or as needed

---

## Testing

- **Backend:**
  - Use Postman collection in `backend/postman-examples/postman.json` to test API endpoints
  - Add Python tests as needed (pytest recommended)
- **Frontend:**
  - Add tests using your preferred React testing library (e.g., Jest, React Testing Library)

---

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## API Documentation

- See `backend/postman-examples/postman.json` for example requests
- Main API modules: `marketplace_api.py`, `payment_api.py`, `project/api_server.py`
- Add docstrings and comments in code for further documentation

---

## Deployment

- **Backend:**
  - Deploy using Gunicorn, Docker, or a cloud provider (Azure, AWS, etc.)
- **Frontend:**
  - Deploy static files to Vercel, Netlify, Azure Static Web Apps, or your own server

## Deployment on Render

You can deploy both the backend (Python API) and frontend (React/Vite) to Render using the provided `render.yaml` for Infrastructure as Code (IaC) deployment.

### 1. Prerequisites
- Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
- [Create a Render account](https://render.com/).

### 2. Deploy Using `render.yaml`
Render will automatically detect the `render.yaml` file and set up both services:

1. **Connect your repository to Render.**
2. On the Render dashboard, click **New +** > **Blueprint**.
3. Select your repo and follow the prompts. Render will read `render.yaml` and create:
   - A **Web Service** for the backend:
     - Build Command: `pip install pipenv && pipenv install --deploy --ignore-pipfile`
     - Start Command: `pipenv run python backend/marketplace_api.py`
     - Environment: Python
     - PORT: 10000 (or as required by your app)
   - A **Static Site** for the frontend:
     - Build Command: `cd frontend && npm install && npm run build`
     - Publish Directory: `frontend/dist`

4. **Set any required environment variables** in the Render dashboard for secrets, API keys, etc.
5. **Deploy!** Render will build and deploy both services. You’ll get public URLs for both frontend and backend.

#### Manual (No `render.yaml`)
You can also create the services manually:
- **Backend:** New Web Service > Python > set build/start commands as above.
- **Frontend:** New Static Site > set build command and publish directory as above.

---

## Troubleshooting

- **Backend:**
  - Ensure all dependencies are installed with pipenv
  - Check Python version compatibility
  - Review logs for errors
- **Frontend:**
  - Ensure Node.js version is compatible
  - Delete `node_modules` and reinstall if issues occur
  - Check browser console for errors

---

## License

Specify your license here (e.g., MIT, Apache 2.0, etc.)

---

## Collaborators & Contributors

We have worked with the following people on this project:

- **owen akelo** — Awaiting 4zz268’s response (Pending Invite)
- **Ali-Sheikh-Zubeir-Noor** (@Ali-Sheikh-Zubeir-Noor) — Collaborator
- **kxshiii** (@kxshiii) — Collaborator
- **Leon Kipchumba** (@LeonKipchumba) — Collaborator
- **rejo132** (@rejo132) — Collaborator
- **tresoraban** (@tresoraban)  — Collaborator
- **wairimu273** (@wairimu273) — Collaborator

---

## Contact

For questions or support, open an issue or contact the maintainer.
