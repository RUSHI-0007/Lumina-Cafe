# Lumina Café — Digital Experience Platform

![Lumina Café Header](https://images.unsplash.com/photo-1497935586351-b67a49e012bf?q=80&w=2000&auto=format&fit=crop)

Lumina Café is a modern, high-performance digital storefront and management dashboard designed to elevate the artisanal coffee shop experience. Built for a premium aesthetic, it seamlessly blends cinematic user engagement with robust operational tools.

## 🌟 Business Value & Features

Our platform is engineered not just to look beautiful, but to drive real business outcomes:

### 1. Increased Customer Retention
*   **Integrated Loyalty Program:** Customers automatically earn points on every order, driving repeat visits and higher Customer Lifetime Value (LTV).
*   **The Roaster's Subscription:** Seamlessly converts one-time buyers into recurring revenue through weekly, bi-weekly, or monthly automated physical subscriptions.
*   **"Fast Pass" Reordering:** A 1-click reorder system for a customer's favorite menu item, removing friction from their morning routine.

### 2. Operational Efficiency
*   **Live Order Kanban Board:** A real-time, 3-column operational view (Pending → Preparing → Completed) for baristas, reducing ticket confusion and order fulfillment time.
*   **1-Click Menu Management:** Instantly toggle the "Sold Out" status of any item from the Admin Dashboard. This immediately updates the public menu without requiring a full site rebuild, preventing customer frustration.
*   **Digital Reservations Desk:** Streamlined management of standard tables and specialized Tasting Room events.

### 3. Elevated Brand Perception
*   **Cinematic Intro Sequence:** A custom SVG animation and pre-loader that establishes a premium brand identity the moment a user lands on the site.
*   **Micro-Interactions:** Smooth Framer Motion transitions, GSAP scroll effects, and custom UI components ensure the digital experience matches the quality of the physical product.

---

## 🛠 Technology Stack

Lumina Café is built on a modern, enterprise-grade stack prioritizing performance, security, and developer velocity.

*   **Framework:** Next.js 15 (App Router, Server Components, Server Actions)
*   **Language:** TypeScript (Strict Mode)
*   **Styling:** Tailwind CSS v4 & custom CSS variables
*   **Animations:** GSAP (ScrollTrigger) & Framer Motion
*   **Database:** PostgreSQL (Supabase) via Prisma ORM (`@prisma/adapter-pg`)
*   **Authentication:** Clerk (Email-whitelist Admin RBAC & Secure Customer Login)
*   **State Management:** Zustand (Persisted Cart State)
*   **Simulated Payments:** High-fidelity mock checkout flow for presentations

---

## 🚀 Quick Start Guide

To run Lumina Café locally for development or demonstration:

### Prerequisites
*   Node.js 20+
*   A Supabase PostgreSQL database
*   A Clerk Application

### 1. Clone & Install
```bash
git clone https://github.com/your-org/lumina-cafe.git
cd lumina-cafe
npm install
```

### 2. Environment Variables
Create a `.env` file based on `.env.example`:
```env
# Database
DATABASE_URL="postgresql://user:pass@host:6543/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://user:pass@host:5432/postgres"

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Admin Whitelist
ADMIN_EMAILS=your.email@example.com
```

### 3. Database Setup (Prisma v7)
Because this project uses Prisma 7 with the `@prisma/adapter-pg` driver adapter, ensure your `DIRECT_URL` points to standard port 5432, while `DATABASE_URL` can point to a transaction pooler (e.g., Supabase port 6543).

```bash
# Push schema changes
npx prisma db push --accept-data-loss

# Generate client
npx prisma generate

# Seed database with premium placeholder data
npx prisma db seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📱 Architecture Highlights

*   **React Server Components (RSC):** The menu, user profile, and admin dashboards are completely rendered on the server, drastically reducing the JavaScript bundle sent to the client.
*   **Optimistic UI:** Admin actions (like marking an order "Preparing" or a product "Sold Out") use Next.js `revalidatePath` while the client components optimistically update their local state to provide a 0-latency feel.
*   **Secure Server Actions:** All database mutations (ordering, updating menu, modifying user subscriptions) run securely entirely on the backend, bypassing the need for traditional API route scaffolding. All admin actions are protected via a reusable `requireAdmin()` execution guard.

---
*Crafted for high-end digital experiences.*
