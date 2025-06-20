# Laser Finansije Dashboard

A modern web application for tracking material consumption, income, and profit in a laser workshop. Data is automatically synchronized across all devices via a secure GitHub backend.

---

## 🚀 Features
- Track income and expenses by job and material
- Automatic calculation of profit and margin
- Real-time data visualization (charts, tables, metrics)
- Centralized material and job database
- Modular frontend (reusable components)
- Secure backend API with GitHub data sync
- Responsive and accessible UI

## 🏗️ Architecture
- **Frontend:** HTML, CSS (custom + Bootstrap), JavaScript (ES6), Chart.js
- **Backend:** Node.js (Express), GitHub REST API
- **Data Storage:** GitHub repository (JSON file)

## ⚙️ Installation & Usage

### 1. Backend Setup (Node.js)
1. Install dependencies:
   ```bash
   npm install express node-fetch dotenv body-parser
   ```
2. Configure environment variables in `.env`:
   ```env
   GITHUB_TOKEN=your_github_token
   GITHUB_USERNAME=your_github_username
   REPO_NAME=your_repo_name
   DATA_FILE=data.json
   PORT=3001
   ```
3. Start the backend server:
   ```bash
   node server.js
   ```

### 2. Frontend Setup (Local Server)
1. Start a local server (example with Python):
   ```bash
   python -m http.server 8000
   ```
2. Open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 🔄 Data Synchronization
- All data is securely stored and synchronized via the backend to GitHub.
- Any change (add, edit, delete) is instantly pushed to the repository.
- On app load, the latest data is fetched from GitHub.

## 🔒 Security
- GitHub token is stored only in the backend `.env` file (never in the browser or repo).
- `.env` is listed in `.gitignore` and never committed.

## 🤝 Contributing
- Fork the repository, create a feature branch, and submit a Pull Request.
- Please follow best practices and write clear commit messages.

## 📄 License
MIT License

---

> Developed with ❤️ for laser workshops and makers.
