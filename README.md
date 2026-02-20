# Deployment Instructions for Vercel

This project is ready to be deployed to [Vercel](https://vercel.com).

## Prerequisites

1.  A Vercel account.
2.  The project pushed to a Git repository (GitHub, GitLab, or Bitbucket).

## Steps

1.  **Import Project**:
    -   Go to your Vercel Dashboard.
    -   Click "Add New..." -> "Project".
    -   Import the Git repository containing this code.

2.  **Configure Project**:
    -   **Framework Preset**: Vercel should automatically detect **Vite**. If not, select "Vite".
    -   **Root Directory**: Leave as `./` (default).
    -   **Build Command**: `npm run build` (default).
    -   **Output Directory**: `dist` (default).

3.  **Environment Variables** (Crucial):
    -   Expand the "Environment Variables" section.
    -   Add the following variable:
        -   **Key**: `GEMINI_API_KEY`
        -   **Value**: Your Google Gemini API Key (starts with `AIza...`).

4.  **Deploy**:
    -   Click "Deploy".

## Notes

-   **API Key Security**: Since this is a client-side application, the API key will be embedded in the browser bundle. This is generally **not recommended** for production apps with paid keys, as users can inspect the code to find the key. For a more secure setup, consider moving the API calls to a backend (e.g., Vercel Functions).
-   **Styling**: The project uses Tailwind CSS via a CDN for simplicity. For better performance in production, consider setting up Tailwind CSS as a build dependency.
