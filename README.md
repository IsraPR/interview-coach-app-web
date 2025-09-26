# 🎙️ AI Interview Coach

This is a web application designed to help users practice for job interviews by engaging in real-time, voice-based conversations with a customizable AI interviewer. Users can create detailed job profiles, configure the interviewer's personality, and receive detailed feedback on their performance.

## ✨ Key Features

-   **Real-time Voice Conversation:** Engage in a live, speech-to-speech interview with an AI coach powered by Amazon Nova Sonic.
-   **Customizable AI Interviewer:** Before each session, configure the interviewer's name, attitude, and language to simulate different interview scenarios.
-   **Job Profile Management:** Create, update, and delete detailed job profiles, including job descriptions, responsibilities, and required skills. Set an active profile to tailor the interview content.
-   **Detailed Session Feedback:** After each interview, review a comprehensive feedback report including strengths, areas for improvement, a final rating, and a full conversation transcript.
-   **User Profile & Resume:** Manage your personal information and resume details to provide further context for the AI coach.
-   **Secure Authentication:** The application is protected by a JWT-based authentication flow.

## 🚀 Tech Stack

-   **Framework:** [React](https://reactjs.org/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **State Management:** [Zustand](https://github.com/pmndrs/zustand)
-   **Routing:** [React Router](https://reactrouter.com/)
-   **Styling:** [CSS Modules](https://github.com/css-modules/css-modules)
-   **API Communication:** [Axios](https://axios-http.com/) (REST) & Native WebSocket API
-   **Icons:** [React Icons](https://react-icons.github.io/react-icons/)

## 📂 Project Structure

The project follows a feature-sliced architecture to ensure scalability and maintainability. Key directories inside `src/` include:

```
src
├── api/             # WebSocket client and event factory
├── components/      # Reusable components (common, layout, feature-specific)
├── hooks/           # Custom React hooks (e.g., useNovaSpeech)
├── lib/             # Third-party library configurations (e.g., Axios instance)
├── pages/           # Top-level components for each route/page
├── services/        # Functions for interacting with the REST API
├── store/           # Zustand state management slices
└── types/           # Global TypeScript type definitions and interfaces
```

## 🏁 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later is recommended)
-   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/IsraPR/interview-coach-app-web.git
    cd interview-coach-app-web
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a new file named `.env` in the root of the project. Copy the contents of `.env.example` (if it exists) or use the template below and fill in the URL for your backend API.

    ```env
    # .env
    VITE_API_BASE_URL=http://localhost:8000
    ```
    > **Note:** The `VITE_` prefix is required by Vite to expose the variable to the frontend code.

4.  **Run the development server:**
    ```bash
    npm run dev
    ```

The application should now be running on `http://localhost:5173`.

## 📜 Available Scripts

In the project directory, you can run:

-   `npm run dev`: Runs the app in development mode.
-   `npm run build`: Builds the app for production to the `dist` folder.
-   `npm run lint`: Lints the code for errors and warnings.
-   `npm run preview`: Serves the production build locally to preview it.