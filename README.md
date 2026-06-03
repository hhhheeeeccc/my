# Personal Portfolio - Marwan Yahya Hassan Ghazi

[العربية (Arabic)](./README.ar.md)

A high-performance, bilingual (English & Arabic) personal portfolio website built with React 19 and Tailwind CSS v4. This project showcases the work, skills, and professional philosophy of Marwan Yahya Hassan Ghazi, a Senior Frontend & Desktop Application Developer and Software Architect.

## 🌟 Visual Experience

![Website Preview Placeholder](https://placehold.co/1200x630/0f172a/ffffff?text=Marwan+Yahya+Hassan+Ghazi+Portfolio\nBilingual+High-Performance+Design)

The portfolio features a "Legendary" visual design with:
- **Custom Animated Cursor:** A reactive cursor that tracks movement and scales when hovering over interactive elements.
- **Scroll Progress Indicator:** A gradient progress bar at the top of the viewport that tracks reading progress (handles RTL/LTR).
- **Dynamic Hero Section:** Floating background blobs with continuous fluid motion and staggered entrance animations.
- **Advanced Scroll Animations:** Using Framer Motion's intersection observer to reveal content smoothly as you scroll.
- **Interactive Card Hover:** Cards in the Skills and Projects sections feature "tilt" and "glow" effects with sophisticated shadow transitions.

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
├── assets/          # Images and static assets
├── components/      # UI Components
│   ├── admin/       # Content Management Dashboard components
│   ├── common/      # Shared components (e.g., Custom Cursor)
│   ├── layout/      # Layout components (Footer, Navbar)
│   └── sections/    # Main page sections (Hero, About, Skills, etc.)
├── context/         # React Context for state management
├── icons/           # Custom and library icons
├── styles/          # Global styles and Tailwind configuration
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
    *Note: --legacy-peer-deps is recommended due to strict versioning in some dependencies.*

3.  Start the development server:
    ```bash
    npm run d""ev
    ```

### Building for Production

To create a production build:
```bash
npm run b""uild
```
The output will be in the dist/ directory.

## 👨‍💻 About the Developer

Marwan Yahya Hassan Ghazi is a Software Architect specializing in the React and JavaScript/TypeScript ecosystems. He has extensive experience in building complex web and desktop applications (Electron.js) and optimizing large-scale enterprise codebases.

Beyond engineering, Marwan is also passionate about gemology, specifically Yemeni Agate.

---

Built with ❤️ by Marwan Yahya Hassan Ghazi
