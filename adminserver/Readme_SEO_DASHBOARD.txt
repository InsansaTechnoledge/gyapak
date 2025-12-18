Here is a **clean, professional, copy-paste-ready README file** (NO CODE, only documentation).
Perfect for GitHub or `/docs/google-search-integration.md`.

---

#  **Google Search Integration – Documentation**

This document explains the complete integration of **Google Search Console**, **URL Inspection API**, and **Google Indexing API** within the Gyapak Admin System.
It covers all Google services used, configuration steps, workflows, and admin-side usage.

---

# 🔧 **1. Overview**

Gyapak Admin now includes a full suite of SEO automation tools powered by Google APIs.
These tools allow admins to:

* View indexing status of any URL
* Check Google crawl information
* Submit updated sitemaps
* Accelerate indexing for JobPosting-based pages
* Remove expired job listings
* Debug SEO issues inside the admin panel

This makes Gyapak capable of managing SEO without manually visiting Google Search Console.

---

# 🏗 **2. Google Cloud Setup**

A Google Cloud project was created to securely access Google Search services.

The following Google APIs were enabled:

### **Enabled APIs**

* **Search Console API**
  Used for sitemap submission, performance data, and URL Inspection.
* **URL Inspection API**
  Used to check whether a URL is indexed and inspect crawl details.
* **Indexing API**
  Used specifically for JobPosting URLs to notify Google of new or updated content.

### **Service Account Setup**

* A **Service Account** was created inside Google Cloud.
* A private key was generated and stored securely as environment variables.
* This service account handles all communication between Gyapak backend and Google’s APIs.

---

# 🔐 **3. Search Console Ownership Setup**

To use Indexing and Inspection APIs, Google requires **verified ownership** of the domain.

Steps that were completed:

1. The domain `gyapak.in` is added in **Google Search Console**.
2. The service account email was added inside Search Console under:
   **Settings → Users and Permissions**
3. The service account was assigned the **Owner** role.
   This is required for:

   * URL Inspection API
   * Indexing API
   * Sitemap submission

Without this step, Google APIs return a `403 Permission denied` error.

---

# 🧠 **4. Features Implemented**

Gyapak Admin integrates three major Google search services.

---

## 4.1 **Sitemap Submission Tool**

* Allows admin to submit any sitemap URL to Google.
* Useful when new exams, articles, or job posts are added.
* Helps Google discover new content faster.

---

## 4.2 **URL Inspection Tool**

Replicates Google Search Console’s “URL Inspection” feature inside Gyapak.

Admin can check:

* Whether a URL is indexed
* Coverage status
* Google canonical URL
* User-declared canonical
* Last crawl time
* Whether crawling is allowed
* Whether indexing is allowed
* Sitemap associations

This tool is used to **debug indexing issues** and verify SEO correctness.

---

## 4.3 **Indexing API for JobPosting URLs**

Google allows Indexing API usage **only** for:

* JobPosting pages
* BroadcastEvent (live streams)

Gyapak uses this for:

* Government job posts
* Recruitment notifications
* Job updates that require fast indexing

Two operations are supported:

### **URL Updated**

Used when:

* A new job post is created
* Details of a job post are updated
* A job receives new information (age limit, last date, etc.)

### **URL Removed**

Used when:

* Job post expires
* Job is deleted
* Admin marks a job as inactive

This helps maintain a clean presence on Google.

---

#  **5. Structured Data Requirement (JobPosting)**

Since the Indexing API supports **only JobPosting schema**, job pages on Gyapak are required to include **Google-approved JobPosting structured data**.

This ensures:

* Google understands the page as a job listing
* Eligibility for rich results
* Validation for Indexing API notifications

Without this schema, Google may ignore Indexing API requests.

---

#  **6. Complete Workflow**

The SEO workflow implemented in Gyapak Admin works as follows:

---

## **A. When a new exam/job page is added**

1. Page is generated on the website
2. It is included in sitemap
3. Admin or backend triggers:

   * Sitemap submission
   * (If job) Indexing API notification

---

## **B. When admin wants to check indexing status**

Admin uses the **URL Inspection Tool**.
It displays:

* Indexed or not
* Google crawler history
* Canonical selection
* Problems detected
* Sitemap associations

---

## **C. When a job expires or gets deleted**

Admin triggers:

* **URL Remove** using Indexing API

Google then quickly de-indexes the page.

---

#  **7. Benefits for Gyapak**

This integration brings enterprise-grade SEO automation:

### ✔ Faster indexing of job posts

### ✔ Real-time inspection inside admin

### ✔ Better visibility for exams, current affairs, and job alerts

### ✔ Reduced manual work in Search Console

### ✔ Improved technical SEO

### ✔ Automated maintenance when content expires

The system is now equivalent to what large news and job portals use.

---

#  **8. Admin Side Tools**

The admin panel now includes:

* **Google SEO Dashboard (optional)**
* **URL Inspection Interface**
* **Sitemap Submission Tool**
* **JobPosting Indexing Trigger**
* **Expired Job URL Remover**

These tools are accessible to authorized admin users only.

---

# **9. Security Considerations**

* Private key is stored in environment variables, not in code.
* Key file is excluded from Git using `.gitignore`.
* All API interactions use Google service account → highly secure.
* Requests are rate-limited and logged to prevent abuse.

---

#  **10. Important Usage Notes**

* **Indexing API is NOT for every page**
  Only JobPosting and BroadcastEvent are officially allowed.
* Regular articles, exam pages, and current affairs should rely on:

  * Sitemap submission
  * Internal linking
  * URL Inspection for diagnostics

Google may ignore Indexing API notifications for non-job pages.

---

# **11. Current Status: Fully Integrated**

The following are all working end-to-end:

✔ Search Console API
✔ URL Inspection API
✔ Indexing API
✔ Sitemap submission
✔ URL Indexing status checks
✔ Automation for job posts
✔ Admin SEO tools

Gyapak now has a complete Google Search automation system for long-term scale.

---