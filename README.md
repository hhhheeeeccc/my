# Personal Portfolio - Marwan Yahya Hassan Ghazi

A high-performance, bilingual (English & Arabic) personal portfolio website built with React 19 and Tailwind CSS v4. This project showcases the work, skills, and professional philosophy of Marwan Yahya Hassan Ghazi, a Senior Frontend & Desktop Application Developer and Software Architect.

## 🚀 Features

-   **Bilingual Support (EN/AR):** Full localization using `i18next` with automatic direction (LTR/RTL) switching.
-   **Dark/Light Mode:** Seamless theme toggling with Tailwind CSS v4.
-   **Content Management Dashboard:** An integrated Admin Panel for real-time content updates without touching the code.
-   **High-Performance Optimizations:** Implements advanced techniques like event coalescing for smooth interactions.
-   **Responsive Design:** Fully mobile-responsive layout using modern CSS Grid and Flexbox.
-   **Zero-Bug Philosophy:** Built with a modular clean architecture to ensure robustness and scalability.

## 🛠️ Tech Stack

-   **Frontend:** [React 19](https://react.dev/)
-   **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animations:** [Framer Motion](https://www.framer.com/motion/)
-   **Localization:** [i18next](https://www.i18next.com/) & [react-i18next](https://react.i18next.com/)
-   **Icons:** [Lucide React](https://lucide.dev/) & Custom SVGs
-   **Build Tool:** [Vite](https://vitejs.dev/)

## 📂 Project Structure

```text
src/
├── components/      # UI Components (Hero, About, Projects, etc.)
│   └── Admin/       # Content Management Dashboard components
├── context/         # React Context for state management
├── icons/           # Custom and library icons
├── translations/    # Localization files (i18n)
├── App.jsx          # Main application entry point
├── i18n.js          # i18next configuration
└── main.jsx         # Vite entry point
```

## ⚙️ Getting Started

### Prerequisites

-   Node.js (Latest LTS recommended)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    ```
2.  Install dependencies:
    ```bash
    npm install --legacy-peer-deps
    ```
    *Note: `--legacy-peer-deps` is recommended due to strict versioning in some dependencies.*

3.  Start the development server:
    ```bash
    npm run dev
    ```

### Building for Production

To create a production build:
```bash
npm run build
```
The output will be in the `dist/` directory.

## 👨‍💻 About the Developer

Marwan Yahya Hassan Ghazi is a Software Architect specializing in the React and JavaScript/TypeScript ecosystems. He has extensive experience in building complex web and desktop applications (Electron.js) and optimizing large-scale enterprise codebases.

Beyond engineering, Marwan is also passionate about gemology, specifically Yemeni Agate.

---

Built with ❤️ by Marwan Yahya Hassan Ghazi
