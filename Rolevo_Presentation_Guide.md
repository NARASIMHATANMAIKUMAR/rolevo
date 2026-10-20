# Rolevo - Presentation & Viva Preparation Guide

**Project Title:** Rolevo - Smart Job Application Tracker  
**Author:** Narasimha  
**Email:** narasimhatanmaikumar@gmail.com  
**Tech Stack:** MERN (MongoDB, Express.js, React 18, Node.js) + Vite + Vanilla CSS  

---

## 1. Project Elevator Pitch (What to say in the first 60 seconds)

> *"Good morning / afternoon professors. Today I am presenting **Rolevo**, a smart full-stack job application tracker designed to help students and job seekers streamline their career search. 
> 
> During campus placements or off-campus hunting, students apply to dozens of companies across LinkedIn, Naukri, and company portals. Tracking when you applied, which round you are currently in, when interviews are scheduled, and whether you need to send a follow-up email quickly becomes chaotic.
> 
> **Rolevo solves this problem** by providing:
> 1. A centralized, secure dashboard with **private accounts**.
> 2. A **status workflow** (Applied → Interview → Offer / Rejected) with an **audit timeline**.
> 3. An automated **7-day follow-up detector**.
> 4. A **Dream Company Priority Bookmark (⭐)** to highlight high-priority applications.
> 5. A one-click **CSV/Excel Export feature** to generate application reports for college placement records or offline tracking."*

---

## 2. Live Demo Script (Step-by-Step Walkthrough)

1. **Login Screen:**
   * Go to `http://localhost:5173`.
   * Point out the clean **Emerald Green design system** and click the **"Auto-fill"** demo button (`narasimhatanmaikumar@gmail.com` / `rolevo123`).
   * Click **Sign in**. Explain that authentication is handled statelessly via **JWT tokens** stored in `localStorage` and passwords are encrypted using **bcrypt**.

2. **Dashboard Overview:**
   * **Real-time Stat Cards:** Show Total Applications, counts per status, and the **Response Rate percentage** (calculated dynamically using a MongoDB aggregation pipeline).
   * **Dual Viewing Modes:** Show the **List View** (with salary tags and star bookmarks) and toggle to the **Board View** (a 4-column visual Kanban layout).

3. **Demonstrating Features:**
   * **Dream Company Star (⭐):** Click the star next to any company (e.g., Google or Zoho). Show how it instantly toggles in the database without reloading the page. Click the **"⭐ Starred Only"** filter button in the toolbar to display only your dream companies.
   * **Automated Follow-up Flag:** Point out the yellow **"Follow up"** badge on applications that have been in "Applied" status for more than 7 days.
   * **Export to CSV (📥):** Click **"📥 Export CSV"**. Open the downloaded `.csv` file in Excel/Notepad to show that all company details, dates, statuses, CTC, and notes are exported cleanly.
   * **Timeline Audit Trail:** Click on any application (e.g., Google or Microsoft) to open the detail page. Show the status history timeline displaying the dates each transition happened.

4. **Adding an Application:**
   * Click **"+ New Application"**, fill in a test company (e.g., *NVIDIA - Systems Engineer, 24 LPA*), check the **"Mark as Dream Company"** box, and click Save.
   * Show that it appears immediately in the database and list.

---

## 3. Key Viva / Examiner Questions & Answers

### Q1: Why did you choose MERN stack for Rolevo instead of SQL and standard HTML/PHP?
**Answer:**
* **MongoDB:** In job applications, the status change history is an array of timestamped events (`statusHistory`). In relational databases (SQL), this requires creating a separate table and performing relational `JOIN` operations every time an application is viewed. In MongoDB, we embed `statusHistory` as an array of subdocuments directly inside the application document. One single query loads the entire application and its history with zero join overhead.
* **React + Vite:** React provides a responsive single-page application (SPA) where components (cards, tables, badges) update dynamically without full page reloads. Vite provides instantaneous Hot Module Replacement (HMR) and optimized builds.
* **Node + Express:** Provides an asynchronous, non-blocking REST API architecture that seamlessly handles JSON payloads.

---

### Q2: How do you prevent User A from seeing or deleting User B's job applications?
**Answer:**
* We use **Server-Side Tenant Isolation**.
* The user ID is **never trusted from the request body or query parameters**.
* When a user logs in, the backend signs a JWT with the user's ID.
* On every request, the `auth` middleware verifies the token signature and extracts `req.user.id`.
* Every single MongoDB query has `{ user: req.user.id }` injected:
  ```javascript
  Application.find({ user: req.user.id });
  Application.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  ```
* If someone attempts to access an application ID that belongs to another user, MongoDB returns `null`, and our server sends back a `404 Not Found`.

---

### Q3: What is the difference between PUT and PATCH in your API?
**Answer:**
* **PUT (`/api/applications/:id`)** is idempotent and replaces/edits the application's core metadata (company, role, location, salary, notes). It intentionally ignores the `status` field.
* **PATCH (`/api/applications/:id/status`)** updates only the status and triggers a critical side-effect: it appends a new `{ status, changedAt: new Date() }` entry to the `statusHistory` audit trail.
* **PATCH (`/api/applications/:id/star`)** toggles the boolean `isStarred` priority bookmark.

---

### Q4: How is the Response Rate calculated in MongoDB?
**Answer:**
We use a MongoDB **Aggregation Pipeline** (`$match` and `$group`):
```javascript
const groups = await Application.aggregate([
  { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
  { $group: { _id: '$status', count: { $sum: 1 } } }
]);
```
Then the server calculates:
$$\text{Response Rate} = \frac{\text{Interview} + \text{Offer} + \text{Rejected}}{\text{Total Applications}} \times 100\%$$
This runs directly on the database engine rather than loading all records into Node memory.

---

### Q5: How does the "Follow up" reminder work? Is it a cron job?
**Answer:**
No database cron job is needed! The follow-up rule is computed dynamically:
$$\text{Status} == \text{'Applied'} \quad \text{AND} \quad (\text{Current Time} - \text{Applied Date}) > 7 \text{ days}$$
Because it depends on the current date, computing it on demand prevents stale database states and saves server resources.

---

## 4. Architecture Summary for Diagrams

* **Client:** React 18, React Router v6, Axios with JWT interceptors, Context API.
* **Server:** Node.js, Express.js REST API with CORS, Dotenv, and JWT Auth middleware.
* **Database:** MongoDB Community Server (Local on port 27017, database: `rolevo`) / MongoDB Atlas.
* **Collections:** `users`, `applications`.
