# Chapter 5: Anatomy of a Website — See It, Then Build It

> "You cannot build what you cannot see. First understand the parts — then assemble the whole." — Royal Prince

You understand the **elements** from Chapter 4 — text, icons, fonts, colour. Now we assemble them into **full sections** you see on every professional website.

**This chapter is visual-first.** You will not read code blocks here. You will **see** each component exactly as it looks on Royal Prince Hub — the navbar, hero, book cards, forms, sidebar, footer, and full page. Below each live preview is a **Cursor prompt** you can copy to recreate that component yourself.

Every preview is embedded right here in the chapter — scroll, study, copy the prompt, build.

---

## How to Use This Chapter

1. **Look** at the UI preview embedded below each section
2. **Notice** what makes it professional — spacing, hierarchy, one clear action
3. **Copy** the Cursor prompt under the preview (use the **Copy prompt** button in the reader)
4. **Paste** into Cursor Agent mode and build that one component
5. **Compare** your result to the preview — use the Critique Pattern from Chapter 3

**This chapter is for studying and practice.** When you are ready to build a **full project** from scratch, go to **Chapter 6** — it has step-by-step prompts with file checklists for every stage.

You do not need to understand every line of code on this page. You need to **see** what good looks like, then let AI help you build it.

---

## What Makes a Website? The Big Picture

| Building Block | What Users See | Live on This Site |
|----------------|----------------|-------------------|
| **Navbar** | Top bar — logo, links, sign in | `/all-books`, `/blog` |
| **Hero** | Big headline, button, image | Home page `/` |
| **Product Cards** | Grid of items with price | `/all-books` |
| **Forms & Buttons** | Inputs and actions | `/login`, contact forms |
| **Sidebar** | Vertical app navigation | Taskboard, book reader |
| **Footer** | Links and copyright at bottom | Every content page |
| **Full Page** | All sections stacked | Home + store pattern |

**Project 1** (portfolio): Navbar + Hero + sections + Footer  
**Project 2** (store): adds Product Cards + Forms + backend

---

## Section 1: The Navbar — Your Site's Compass

The **navbar** sits at the top. It answers: *Where am I?* and *Where can I go?*

On Royal Prince Hub you see:

- **RP** brand mark (home link) on the left
- **Icon + text links** — Home, Books, Blog, Taskboard, Noteboard
- **Sign in** and **theme toggle** on the right
- **Active page highlighted** — so users always know their location

### See the navbar

[[DEMO:navbar-ui]]

### Best practices

- Keep **3–6 links** on simple marketing sites
- Always pair **icons with text labels**
- Put the **logo top-left**
- On mobile, collapse into a menu — never squeeze twelve links in one row

---

## Section 2: The Hero — Your First Impression

The **hero** is the first thing visitors see without scrolling. You have about **three seconds** to convince them to stay.

It must answer:

1. **What is this?**
2. **Why should I care?**
3. **What do I do next?**

On the home page (`/`) you see a multi-line headline, short subtext, one primary button, tech tags, and a portrait.

### See the hero

[[DEMO:hero-ui]]

---

## Section 3: Product Cards — Store Listing UI

**Product cards** show items in a grid — books, courses, templates, services. Each card shows a cover image, genre, price, title, description, and one action button.

On `/all-books`, this is how the digital store looks before a user clicks into a book.

### See the product cards

[[DEMO:product-cards-ui]]

In Project 2, the same card layout will pull data from MongoDB. The **look stays the same** — only the data source changes.

---

## Section 4: Forms & Buttons — Where Users Act

**Buttons** trigger actions. **Forms** collect information. Users should never guess what to click or what a field is for.

On this site:

- **Primary buttons** — dark, filled — main action (Order Now, Sign in, Read)
- **Secondary buttons** — outline or softer — alternative actions
- **Login panel** — one clear "Continue with Google" action
- **Contact forms** — every field labelled

### See forms & buttons

[[DEMO:forms-ui]]

---

## Section 5: Sidebar Layouts — When and Why

A **sidebar** is vertical navigation on the left. The main content sits beside it.

| Use a sidebar | Skip the sidebar |
|---------------|------------------|
| Dashboards, admin panels | Simple landing pages |
| Course platforms, docs | Portfolio homepages |
| Apps with many sections | One-page marketing sites |

**Rule:** Marketing site = top navbar only. Web app = sidebar + content.

This book reader uses a sidebar for chapter navigation — that is intentional.

### See the sidebar layout

[[DEMO:sidebar-ui]]

---

## Section 6: The Footer — Closing With Purpose

The **footer** is the bottom of every page. Users scroll here when they cannot find something in the navbar. A store without a footer feels untrustworthy.

Royal Prince Hub's footer includes a quote, contact links, and copyright.

### See the footer

[[DEMO:footer-ui]]

---

## Section 7: The Full Page — Putting It All Together

A complete landing page stacks sections in order:

**Navbar → Hero → Content / Store → Footer**

This is the blueprint for **Project 1**. Build one section at a time — not the whole page in one Cursor session.

### See the full page assembled

[[DEMO:full-page-ui]]

### Assembly order for your project

1. Set up Vite + React + Tailwind
2. Build the **navbar** — get it working alone
3. Add the **hero**
4. Add **about / work / services** sections (your content)
5. Add **product cards** if you are showcasing offerings
6. Add **contact form**
7. Add **footer**
8. Deploy to Vercel

Do not deploy before steps 2–7 work on localhost.

---

## Landing Page vs E-Commerce

### Project 1: Portfolio / Landing Page

| Layer | Needed? |
|-------|---------|
| React + Tailwind | Yes |
| Backend API | Usually no |
| Database | No |
| Auth | No |

**Use sections:** Navbar, Hero, Forms, Footer, Full Page preview

### Project 2: Digital Store

| Layer | Needed? |
|-------|---------|
| React + Tailwind | Yes |
| Node + Express | Yes |
| MongoDB | Yes |
| Google OAuth + JWT | Yes |
| Flutterwave payments | Yes |

**Use all sections** — especially Product Cards and Forms

---

## How a Full Store Works (Simple Overview)

When you add a backend in Project 2, every feature follows the same loop:

1. User clicks something on the **website you built**
2. The site asks the **server** for data or to save something
3. The server talks to the **database**
4. The site updates what the user sees

Example — buying a book: Click Buy Now → pay with Flutterwave → server confirms → user can read the book.

You will learn the technical details during Project 2. For now, focus on **building the UI sections** you can see in this chapter.

---

## Common Beginner Mistakes

1. **Reading without looking** — study each UI preview above
2. **Building the full page first** — navbar alone, then hero, then footer
3. **Ignoring mobile** — resize your browser; half your users are on phones
4. **No footer** — looks unfinished
5. **Sidebar on a landing page** — usually wrong for Project 1
6. **Copying my words** — use the structure, write your own content
7. **Skipping the Cursor prompt** — that is how you actually build

---

## Your Learning Path

Chapter 4: Elements (text, icons, colour)  
↓  
Chapter 5: Sections (you are here — see UI, copy prompts, build)  
↓  
Project 1: Your portfolio landing page  
↓  
Project 2: Your digital store  
↓  
Deploy and share your live URL

---

## Conclusion

You did not pay to stare at code you do not understand yet. You paid to **see professional UI** and learn to recreate it with AI.

Every section above showed you the real thing from Royal Prince Hub. Every prompt below each preview is your next step in Cursor.

Study the navbar preview first. Copy its prompt. Build it this week — nothing else until it works.

Let us build.

---

### Action Points

1. **Scroll through every UI preview** in this chapter. Screenshot each for your `my-reference` folder.

2. **Copy the navbar prompt** and build only the navbar in Cursor. Compare your result to the preview.

3. **Visit the live site** — `/`, `/all-books`, `/login` — and confirm the book previews match reality.

4. **Use the Critique Pattern** from Chapter 3 after each component: *"Compare my navbar to Royal Prince Hub. What spacing or hierarchy is off?"*

5. **Sketch your full page** on paper using the Full Page preview as the template before you code Project 1.

6. **Build one section per session** — navbar session, hero session, footer session. Do not rush.
