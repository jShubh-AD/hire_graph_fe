# GraphHire Frontend

GraphHire is a modern, graph-powered recruitment platform designed to connect talent with opportunities through intelligent relationship mapping and AI-driven skill extraction. This frontend application provides a seamless, interactive interface for candidates and recruiters, leveraging the power of TigerGraph for complex networking and recommendations.

## 🚀 Features

- **AI-Powered Resume Analysis**: Automatically extract technical skills and experience from PDF resumes.
- **Graph-Based Networking**: Visualize professional connections and suggest relevant industry contacts.
- **Intelligent Job Recommendations**: Personalized job matching based on verified skills and graph relationships.
- **Skill Library Integration**: Seamless mapping of user expertise to a standardized skills ontology.
- **Dynamic Dashboard**: Real-time insights into application status and network growth.

## 🛠️ Tech Stack

- **Core**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Navigation**: [React Router 7](https://reactrouter.com/)
- **API Client**: [Axios](https://axios-http.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 💻 Local Setup

Follow these steps to get the development environment running on your local machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/jShubh-AD/hire_graph_fe.git
   cd graph_hire_fe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory (or copy from `.env.example` if available):
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```
   *Note: Ensure your backend server is running at this address.*

4. **Start the Development Server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

### Building for Production

To create an optimized production build:
```bash
npm run build
```
The output will be in the `dist/` folder.

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI components (Drawers, Modals, Nav)
├── pages/          # Full-page components (Home, Network, Profile)
├── assets/         # Static assets (images, fonts)
├── App.jsx         # Main application component & routes
└── main.jsx        # Application entry point
```

## 🌐 Related Projects

- **GraphHire Backend**: A FastAPI-based service utilizing TigerGraph for data storage and processing.

---
