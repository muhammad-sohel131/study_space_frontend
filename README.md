# StudySpace Frontend

A premium, high-performance user interface for the StudySpace platform, built with Next.js 16 and Tailwind CSS 4.

## ✨ Premium Features

- **Interactive Seat Map**: High-end physical grid layout with "glassmorphism" design.
- **Availability Tooltips**: Hover over seats to see their daily booking schedule.
- **Admin Dashboard**: Full CRUD management for centers and physical seat coordinates.
- **Tier Comparison**: Beautifully visualized "Regular vs Premium" feature lists.
- **Responsive Design**: Ultra-fast, mobile-first experience using Tailwind CSS 4.
- **State Management**: Zero-latency UI updates using Zustand and TanStack Query.

## 🛠️ Technology Stack & Package Rationale

| Package | Purpose | Why We Chose It |
| :--- | :--- | :--- |
| **Next.js 16** | Core Framework | Server-side rendering and App Router for superior SEO and performance. |
| **Tailwind CSS 4** | Styling | Next-gen utility-first CSS for rapid development and high-end animations. |
| **TanStack Query** | Data Fetching | Efficient caching, synchronization, and "stale-while-revalidate" data patterns. |
| **Zustand** | State Management | Lightweight, fast alternative to Redux for global application state. |
| **Lucide React** | Icons | Extensive, consistent, and beautiful icon set for modern UI. |
| **GraphQL Request** | API Client | Minimalist client to interact with our backend GraphQL endpoint. |
| **Date-fns** | Date Handling | Lightweight and robust library for complex booking time calculations. |

## ⚙️ Installation & Setup

1. **Clone & Install**:
   ```bash
   cd frontend
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   NEXT_PUBLIC_GRAPHQL_URL=http://localhost:5000/graphql
   NEXT_PUBLIC_CLOUDINARY_API_URL=http://localhost:5000
   ```

3. **Run Development**:
   ```bash
   npm run dev
   ```

## 🎨 Design Philosophy

- **Modern Aesthetics**: Deep shadows, vibrant gradients, and subtle micro-animations.
- **Intuitive UX**: Predictive UI elements, helpful empty states, and clear calls to action.
- **Performance First**: Optimized image loading and minimal client-side JavaScript.
