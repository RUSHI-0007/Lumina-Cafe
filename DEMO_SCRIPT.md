# Lumina Café — Live Demo Script 

**Estimated Time:** 2-3 minutes
**Goal:** Show a prospective client how Lumina blends a premium visual aesthetic with seamless e-commerce and robust operational tools.

*Before starting: Ensure you are signed in with the email listed in your `.env` `ADMIN_EMAILS` variable, and have run `npx prisma db seed` to populate the board.*

---

### Step 1: The First Impression (The Landing Page)
*Start at `http://localhost:3000` (Refresh the page).*

**Speak to:** "When a customer visits the site, we don’t just show them a menu. We pull them into an experience."
*   **Action:** Let the splash screen and animated SVG droplets play.
*   **Action:** Scroll down slowly to show the GSAP text reveals and background parallax.
*   **Speak to:** "These micro-interactions build immense brand trust. It feels as premium as the coffee they are buying."

### Step 2: Frictionless E-Commerce (The Order Flow)
*Scroll down to the Menu section.*

**Speak to:** "Let’s look at how easy it is to drive revenue."
*   **Action:** Add "The Lumina Signature Cortado" to the cart. 
*   **Action:** Click the floating cart icon to open the slideout.
*   **Speak to:** "We built a seamless, highly optimized cart slideout. It feels app-like without leaving the context of the page."

### Step 3: High-Fidelity Checkout
*Inside the Cart Slideout.*

**Speak to:** "Instead of pushing users to a clunky third-party page, the checkout is completely integrated."
*   **Action:** Click **"Pay with Apple Pay"**.
*   **Speak to:** "Watch this custom transition."
*   **Action:** Observe the pulsing "Processing" ring, followed by the satisfying green checkmark.
*   **Speak to:** "That level of UX polish reduces cart abandonment."

### Step 4: Customer Retention (The Dashboard)
*You should have automatically redirected to `/dashboard`.*

**Speak to:** "Once the order is placed, they land on their personalized dashboard. This is where we drive Customer Lifetime Value."
*   **Action:** Point to the **Loyalty Card** (top right). Next to the ☕ icon, it should show points. "They automatically earn loyalty points to drive repeat visits."
*   **Action:** Point to the **Fast Pass Card** (top left). "They can 1-click reorder their favorite drink tomorrow morning."
*   **Action:** Point to the **Subscription Card** (bottom right). "We can convert one-time bean buyers into recurring weekly or monthly physical subscriptions natively."

### Step 5: Operational Control (The Admin Panel)
*Click your Avatar (top right) -> "Manage Café", or manually navigate to `http://localhost:3000/admin`.*

**Speak to:** "But a beautiful front-end is nothing without operational tools. Here is the Admin Dashboard, completely protected and accessible only to staff."
*   **Action:** Show the **Live Order Board**. Mention that it uses modern Kanban columns (Pending, Preparing, Completed).
*   **Action:** Show the **Admin Insights** (Revenue & Total Orders) at the top of the page.
*   **Action:** Click a "Pending" order and move it to "Preparing". "It’s real-time and instant."
*   **Action:** Click **Menu** on the sidebar.
*   **Speak to:** "If you run out of croissants, you don't need to call a developer."
*   **Action:** Click the "Sold Out" toggle on a pastry. "One click, and it instantly updates the public website to prevent customer frustration."

### Closing
"Lumina isn't just a website; it’s an end-to-end digital storefront designed to increase your sales, retain your customers, and make your baristas' lives easier. Are there any specific features you'd like to dive deeper into?"
