# PixelSync - Real-Time Interactive Gallery

PixelSync is a real-time collaborative gallery application where users can view high-quality images, react with emojis, and comment instantly across all connected sessions.

## 🚀 Setup Instructions

### Prerequisites
- Node.js 18+ installed
- npm or yarn

### Installation

1.  **Clone the repository** (if you haven't already):
    ```bash
    git clone <https://github.com/Sravan1011/Gallery-App.git>
    cd galleryapp
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file in the root directory and add your keys:
    ```env
    NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=your_unsplash_access_key
    NEXT_PUBLIC_INSTANTDB_APP_ID=your_instantdb_app_id
    ```
    > **Note**: If you don't provide an Unsplash key, the app will gracefully fall back to mock data.

4.  **Run the application**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser.

## 📡 API Handling Strategy

PixelSync uses a **hybrid approach** for data fetching:

*   **Unsplash API (Images)**: We integrate directly with the Unsplash API on the client-side using the `unsplash-js` SDK.
    *   *Why Client-Side?*  For this real-time interaction demo, responsiveness was prioritized. The `createUnsplash` instance (exported as `unsplash`) is initialized with the public key.
    *   *Robustness*: The app includes a robust fallback mechanism. If the API key is missing or rate limits are hit, a simulated mock data layer activates automatically, ensuring the UI never breaks.

*   **InstantDB (Interactions)**: All user interactions (reactions, comments) are handled via **InstantDB**, a modern database that syncs state to clients in real-time without needing a dedicated backend API server.

## 💾 InstantDB Schema & Usage

We utilize **InstantDB** for its "backend-less" real-time capabilities. The schema is inferred from usage but follows this structure:

### `reactions`
Stores emoji reactions on specific images.
*   `id`: Unique ID (UUID)
*   `imageId`: ID of the Unsplash photo
*   `emoji`: The emoji character (e.g., "❤️", "🔥")
*   `userId`: Session-based user ID
*   `timestamp`: Time of reaction

### `comments`
Stores text-based conversation.
*   `id`: Unique ID (UUID)
*   `imageId`: ID of the Unsplash photo
*   `text`: The comment content
*   `userId`: Session-based user ID
*   `userName`: Generated alias (e.g., "User A1B2")
*   `userAvatar`: DiceBear avatar URL based on userID
*   `timestamp`: Time of comment

**Usage Pattern**:
We use the `db.useQuery()` hook in React components to subscribe to data. Changes made by one user (via `db.transact()`) are instantly pushed to all other connected clients viewing the same image.

## ⚛️ Key React Decisions

1.  **Client-Side Rendering (CSR)**:
    *   The core gallery experience (`app/gallery/page.tsx`) is a Client Component (`'use client'`). This is essential for the heavy interactivity required by `framer-motion` animations and the real-time subscriptions of InstantDB.

2.  **Framer Motion**:
    *   Used extensively for micro-interactions (hover cards, modal expansion) and layout transitions (staggered grid entry). This creates a "premium" feel compared to static CSS.

3.  **URL-Driven State**:
    *   We use `next/navigation`'s `useSearchParams` to manage the selected photo state (`?photoId=...`). This allows deep-linking—users can share a URL to a specific photo, and the app correctly opens the modal on load.

4.  **Suspense Boundaries**:
    *   Since we use `useSearchParams` in client components, we wrap the main page content in `<Suspense>`. This prevents Next.js de-optimization warnings and build errors related to accessing search parameters during static generation.

## 🚧 Challenges & Solutions

### 1. Build Failures with Suspense
*   **Challenge**: "useSearchParams() should be wrapped in a suspense boundary." The Next.js build failed because our client component accessed search parameters without a proper boundary.
*   **Solution**: We extracted the main logic into a `GalleryContent` component and wrapped it with `<Suspense fallback={<Loader />}>` in the default export.

### 2. Template Literal Parsing Errors
*   **Challenge**: The Turbopack/Webpack parser in the build pipeline threw syntax errors on specific template literals containing complex expressions inside JSX attributes (e.g., `router.push(\`/gallery?...\`)`).
*   **Solution**: We simplified these specific lines to standard string concatenation (`'/gallery?photoId=' + id`), which is more robust across different parser versions.

### 3. Infinite Navigation Loops
*   **Challenge**: Updating the URL when closing a modal caused re-renders that would sometimes re-open the modal or flicker.
*   **Solution**: We implemented careful checks (`if (!photoId)`) and utilized `scroll: false` in `router.push` to maintain user scroll position while updating the history stack.

## 🚀 Improvements (With More Time)

*   **Server-Side Rendering (SSR)**: Move the initial Unsplash data fetching to a Server Component. This would improve LCP (Largest Contentful Paint) and SEO by rendering the initial grid HTML on the server.
*   **Infinite Scrolling**: Replace the "Next/Previous" pagination buttons with an `IntersectionObserver`-based infinite scroll for a more fluid browsing experience.
*   **Optimistic UI**: Implement optimistic updates for comments/reactions so the UI updates literally instantly (0ms) while the database transaction confirms in the background.
*   **Virtualization**: Use `react-window` for the comments section to handle threads with thousands of comments efficiently.
