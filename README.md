# React SPA Showcase

This project is a feature-rich Single Page Application (SPA) built with modern React, TypeScript, and a host of powerful libraries. It demonstrates proficiency in creating complex user interfaces, managing server and client state, implementing advanced animations, and ensuring code quality through comprehensive unit testing.

The application consists of three main pages:
1.  A full **CRUD Recipe Dashboard** for managing recipe data.
2.  A visually appealing **Recipe Discovery Page** with fluid animations.
3.  A functional **Daily Calorie & Macro Calculator**.

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

You will need the following software installed on your machine:
* [Node.js](https://nodejs.org/en/) (v18 or later is recommended)
* [npm](https://www.npmjs.com/) (which comes with Node.js) or [yarn](https://yarnpkg.com/)

### Environment variables

This project uses Vite. Sensitive configuration (Firebase) must be provided via a `.env` file at the project root. Do not commit your `.env`.

1. Copy the example file and fill in your values:
   ```bash
   cp .env.example .env
   # then edit .env to set VITE_FIREBASE_* values
   ```
2. For tests (Jest), dummy values are used automatically if `.env` is not present, so tests can run without real credentials.

### Installation & Running Locally

1.  **Clone the repository:**
    ```bash
    git clone <your-repository-url>
    cd <repository-folder>
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application should now be running on `http://localhost:5173` (or the next available port).

---

## 📝 Report

### What’s Done: A Summary of Features

* **Full CRUD Recipe Dashboard:** A complete interface for Creating, Reading, Updating, and Deleting recipes, interacting with a live JSONPlaceholder API.
* **Asynchronous State Management:** All API interactions are handled robustly, with clear loading and error states managed by TanStack Query.
* **Interactive Modals:** Seamless modal dialogs for creating, editing, and confirming the deletion of recipes.
* **Animated Recipe Discovery Page:** A beautiful, grid-based UI for browsing recipes, featuring advanced shared layout animations using Framer Motion for a "magic move" effect when a user selects a recipe.
* **Functional Calorie Calculator:** A helpful utility page that calculates daily calorie and macronutrient needs based on user input, demonstrating complex form handling and state logic.
* **Global Dark/Light Mode:** A persistent, application-wide theme toggle that respects user's system preferences and saves their choice in `localStorage`.
* **Comprehensive Unit Testing:** A full test suite built with Jest and React Testing Library that covers all major components and user flows, ensuring the application is reliable and maintainable.

### How It’s Done: Tools, Libraries, and Approach

This project was built with a modern, type-safe, and efficient tech stack.

* **Core Framework:** **React** with **TypeScript** for robust, scalable, and maintainable code, bootstrapped with **Vite** for a lightning-fast development experience.
* **UI & Styling:**
    * **Material-UI (MUI):** Leveraged for its rich set of pre-built, accessible components like `Dialog`, `Card`, `Button`, and form inputs, which significantly sped up development.
    * **Tailwind CSS:** Used on the recipe discovery page to demonstrate utility-first styling for rapid and responsive UI development.
* **State Management:** A multi-layered approach was used to handle different types of state efficiently:
    * **Local State:** React's built-in `useState` hook was used for simple, component-level state (e.g., managing form inputs or modal visibility).
    * **Server State:** **TanStack (React) Query** is the star of the dashboard page. It handles all data fetching, caching, and mutations (create, update, delete), elegantly managing loading and error states and keeping the UI in sync with the server.
    * **Global State:** The **React Context API** was implemented to manage the global theme (light/dark mode), making the theme state and toggle function available to the entire application without prop drilling.
* **Animations:**
    * **Framer Motion:** Integrated throughout the application to create a fluid and engaging user experience. Key features used include `AnimatePresence` for exit animations and the powerful `layoutId` prop for creating seamless shared layout transitions between the recipe cards and the details modal.
* **Testing:**
    * **Jest:** Used as the core test runner.
    * **React Testing Library (RTL):** Used for rendering components and simulating user interactions in a way that mirrors how users experience the app.
    * **Mock Service Worker (MSW):** Used to intercept all API calls during testing, providing a mock server that returns predictable responses. This makes tests fast, reliable, and independent of the actual network.

### Challenges Faced and How They Were Resolved

1.  **Integrating Framer Motion with Material-UI:** The biggest challenge was creating the "magic move" animation for the `Dialog` component on the `TailwindPage`.
    * **Problem:** Directly animating MUI's `Paper` component with `layoutId` caused a "ghost rectangle" to appear at the final destination while the animation was running. Furthermore, making the `Paper` component animatable with `motion()` led to complex TypeScript errors and deprecation warnings.
    * **Solution:** The final, robust solution was to decouple the concerns. Instead of animating the `Paper` itself, I made it completely invisible (`background: 'transparent'`, `boxShadow: 'none'`). Then, a standard `<motion.div>` was placed *inside* the `Dialog` to handle all visuals and animations. This pattern proved to be clean, stable, and free of type errors.

2.  **Configuring Jest for a Modern TypeScript/Vite Project:** The initial test setup was a significant hurdle.
    * **Problem:** The project's modern module system (`"type": "module"` in `package.json`) and strict TypeScript settings (like `"verbatimModuleSyntax": true`) conflicted deeply with Jest's traditional CommonJS environment. This led to a cascade of `ReferenceError`s for browser APIs (`Response`, `TextEncoder`, `TransformStream`, `BroadcastChannel`) that don't exist in Node.js.
    * **Solution:** This required a multi-step solution:
        1.  Creating a separate `tsconfig.test.json` to override the problematic `verbatimModuleSyntax` rule just for the test environment.
        2.  Explicitly telling Jest (in `jest.config.cjs`) to use this test-specific tsconfig.
        3.  Systematically polyfilling the missing browser APIs in `src/setupTests.ts` by manually assigning them to the `global` object, including creating a custom mock for `BroadcastChannel` to resolve a final conflict with `jsdom`.

### Showcase: What I'm Proud Of

I am particularly proud of two features that represent the most significant challenges and the most polished results: the **Dark Mode Toggle** and the **Shared Layout Animations**.

* **Dark Mode & Animations:** This feature, while seemingly simple, required the careful integration of multiple systems. The React Context API manages the global state, `localStorage` provides persistence across sessions, and Material-UI's theming system dynamically responds to the changes. What makes me proud is how Framer Motion's animations are layered on top of this, ensuring that all transitions—from a card opening to the theme itself changing—are fluid and interruptible. The `layoutId` animation on the `TailwindPage`, where a recipe card seamlessly expands into a modal, is a prime example of a complex but highly rewarding user experience that was achieved.

* **The Calorie Calculator:** I also take pride in the `MuiPage` calculator. It's a practical and helpful tool that demonstrates solid, self-contained component logic. It handles user input from various form controls, performs calculations correctly, and presents the results in a clean, digestible format, all within a well-structured and accessible Material-UI form.

---

## 🧪 Running the Tests

A comprehensive suite of unit tests has been written to ensure the application's components are working as expected.

To run the tests, use the following command:
```bash
npm test

