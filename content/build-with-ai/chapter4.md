# Chapter 4: Website Elements — Text, Icons, Fonts & Color

> "Before you assemble a house, you need to know what a brick, a window, and a door actually are." — Royal Prince

You have your tools (Chapter 2). You know how to work with AI (Chapter 3).

Before you build your first project, you need to understand the **visual building blocks** every website is made from — text, icons, fonts, colour, spacing, and buttons. Not full sections like a navbar yet. The smaller pieces **inside** those sections.

**This chapter is hands-on.** As you read, you will see live examples embedded on the page — real font sizes, real SVG icons from this site, real colour swatches. No placeholders. Study what you see, then rebuild it in Cursor.

Chapter 5 assembles these elements into full sections (navbar, hero, product cards) using Royal Prince Hub as the reference.

---

## The Element Stack — What Users Actually See

Every screen breaks down into layers:

| Layer | What It Is | Where on This Site |
|-------|------------|-------------------|
| **Text** | Words that communicate | Navbar labels, hero headline, book descriptions |
| **Icons** | SVG symbols that guide the eye | NavIcon next to Home, moon icon for dark mode |
| **Typography** | Font family, size, weight | Inter — semibold headings, medium nav links |
| **Colour** | Backgrounds, text, accents | Slate greys, gold tags, dark primary buttons |
| **Spacing** | Padding and gaps | Card padding, space between nav links |
| **Interactive** | Buttons, links, inputs | Sign in, Order Now, theme toggle |

---

## Section 1: Text Size & Hierarchy

Not all text is equal. Professional sites use **typographic hierarchy** — different sizes and weights so the eye knows what to read first.

**Study the live scale below.** Each row shows the actual size used on Royal Prince Hub. The badge on the right is the Tailwind class you will use in your own projects.

[[DEMO:typography-scale]]

### Rules for Good Text

1. **One main headline (H1) per page** — do not compete with yourself
2. **Short subtext** — one or two sentences under the headline
3. **Uppercase labels sparingly** — small eyebrow text only ("Platform", "Price")
4. **Readable line length** — body text uses `max-width` so lines do not stretch edge-to-edge

### In Code — Navbar Text + Icon

Each nav link pairs an SVG icon with a text label:

```jsx
<Link to="/" className="pf-desktop-section-nav-link">
  <NavIcon name="home" />
  <span>{link.label}</span>
</Link>
```

The `<span>` is plain text. Font size, weight, and colour come from CSS classes — not from typing bigger letters in HTML.

### What is JSX? (If you have never seen code like this)

In React projects, HTML-looking code inside JavaScript files is called **JSX**. It lets you write structure and logic in the same file:

```jsx
// This is JSX — looks like HTML, but it is JavaScript
const greeting = "Welcome";
return <h1>{greeting}</h1>;
```

- **`className`** = React's word for HTML's `class` (because `class` is reserved in JavaScript)
- **`{greeting}`** = insert a JavaScript variable into the page
- **`<NavIcon />`** = a custom component (your own reusable building block)

You do not need to write JSX from memory. Cursor generates it. You **do** need to recognize: *this file controls what appears on screen.*

---

## Section 2: Font Weight — Same Size, Different Emphasis

**Weight** controls how thick the letter strokes are. Below: same font (Inter), same size — only the weight changes.

[[DEMO:font-weights]]

On the home page hero, the headline uses **semibold (600)** with tight letter-spacing (`tracking-[-0.04em]`). Body text stays **normal (400)**. Nav links use **medium (500)** so they feel clickable.

---

## Section 3: Font Size Scale — Do Not Guess Pixel Values

Use Tailwind's scale instead of random numbers like `17px` or `23px`.

[[DEMO:font-sizes]]

Responsive tip: hero headlines start smaller on mobile and grow on desktop:

```
text-4xl sm:text-6xl lg:text-7xl
```

That is **mobile-first typography** — design for the phone, then scale up.

### Font Family on This Site

Royal Prince Hub uses **Inter** as the only UI font:

```css
font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

The list after `Inter` is a **fallback stack**. If Inter fails to load, the browser uses system fonts — never unstyled Times New Roman.

For your first project: **one sans-serif family is enough.** Do not add a second font until the site works.

---

## Section 4: Icons — Real SVG, Not Emoji

An **icon** is a small SVG graphic — not an emoji character. The home icon means "go home." The book icon means "books." The moon icon means "switch to dark mode."

This site uses a reusable `NavIcon` component. Each icon is an SVG path stored in a lookup object:

```jsx
const NavIcon = ({ name }) => (
  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d={navIcons[name]} />
  </svg>
);
```

- **`stroke="currentColor"`** — icon inherits the parent's text colour
- **`aria-hidden="true"`** — screen readers skip decorative icons when a text label sits beside them
- **One component, many icons** — pass `name="home"` instead of duplicating SVG code

### Icon Library on This Site

[[DEMO:icon-gallery]]

### Icons Beside Text — Navbar Pattern

Never use icons alone for primary navigation. Always pair icon + label:

[[DEMO:icon-in-context]]

---

## Section 5: Colour — See the Palette

Colour tells users what is clickable, what is important, and what brand they are on. Below are the actual colours used on Royal Prince Hub.

[[DEMO:color-palette]]

### The 60-30-10 Rule

A simple framework for any page:

[[DEMO:color-6010]]

| Share | Role | Tailwind Example |
|-------|------|------------------|
| **60%** | Dominant background | `bg-slate-50` |
| **30%** | Cards, nav, surfaces | `bg-white border shadow` |
| **10%** | Accent — buttons, badges | `bg-slate-950`, gold tags |

### Light & Dark Theme Variables

This site stores colours as CSS custom properties so the theme toggle swaps everything at once:

[[DEMO:theme-variables]]

```css
:root {
  --primary-color: #4f46e5;
  --text-primary: #111827;
  --text-secondary: #6b7280;
  --bg-color: #f3f4f6;
  --card-bg: #ffffff;
}
```

Toggle dark mode on this site (moon icon in the navbar) and watch these values change live.

### Contrast — Readable vs Too Light

Pretty grey text fails in practice. Compare:

[[DEMO:contrast]]

**Squint test:** if you cannot read it when squinting, your users cannot read it on a phone in sunlight.

### Semantic Colours

| Purpose | Colour | Used For |
|---------|--------|----------|
| Primary action | Slate-950 / dark fill | Order Now, Sign in |
| Secondary | Outline / muted | Learn More |
| Success | Green `#047857` | Payment confirmed |
| Danger | Red `#ef4444` | Delete, errors |
| Muted meta | Slate-500 | Timestamps, captions |

---

## Section 6: Buttons & Interactive Elements

### Links vs Buttons

| Element | Use When |
|---------|----------|
| **`<Link>` / `<a>`** | Navigating to another page or section |
| **`<button>`** | Toggling theme, submitting a form, opening a modal |

The navbar uses `<Link>` for pages. The theme toggle uses `<button>` because it changes state without leaving the page.

### Button Styles on This Site

[[DEMO:buttons]]

Primary = filled, high contrast, one per section. Secondary = outline or softer — for alternative actions.

---

## Section 7: Spacing, Borders & Depth

When a layout feels "off" but you cannot explain why, it is usually **spacing** — not colour or font.

[[DEMO:spacing]]

Cards on `/all-books` also use glass-style depth:

```jsx
className="rounded-3xl border border-white/70 bg-white/70 shadow-sm backdrop-blur"
```

- **`border-white/70`** — semi-transparent border
- **`backdrop-blur`** — frosted glass effect
- **`shadow-sm`** — lifts the card off the background

### Visual Hierarchy Recap

```
Size     →  Headline largest, labels smallest
Weight   →  Headings semibold, body regular
Colour   →  Headings dark (slate-950), body muted (slate-600)
Space    →  Consistent padding (p-5, p-8) and gap (gap-4, gap-6)
Accent   →  One colour for primary actions only
```

When you critique your UI with AI (Chapter 3), ask about all five — not just "does it look good?"

---

## Map What You Learned to the Live Site

Open royalprincehub.com and match each element:

| Page Area | Text | Icons | Colour |
|-----------|------|-------|--------|
| **Navbar** | Home, Books, Blog | NavIcon per link | White/dark nav bg |
| **Home hero** | Ownership. Curiosity. Execution. | — | Gradient + slate |
| **Book cards** | Title, price, description | — | Gold tags, slate text |
| **Footer** | Quote, links, copyright | — | Muted background |

Chapter 5 breaks these into full **sections** with live previews embedded in this chapter.

---

## Working With Cursor on Elements

Practice one element at a time before building a full navbar:

**Typography:**
```
Create a hero text block with uppercase eyebrow, semibold headline (text-4xl), and muted subheading (text-slate-600). Use Tailwind. Match Royal Prince Hub hierarchy.
```

**Icons:**
```
Create a NavIcon component with SVG paths for home, book, blog, moon. Use stroke="currentColor". Show icons beside text labels in a nav row.
```

**Colour:**
```
Set up CSS variables for light/dark theme: --bg-color, --card-bg, --text-primary, --primary-color. Apply the 60-30-10 rule on a sample card layout.
```

**Critique (Chapter 3):**
```
Review my typography and colours. Does body text have enough contrast? More than one font family? What would a senior designer fix?
```

---

## Common Beginner Mistakes

1. **Everything the same size** — no hierarchy
2. **Emoji instead of SVG icons** — inconsistent across devices, looks unprofessional
3. **Icons without text labels** — users guess what buttons do
4. **Body text too light** — slate-300 on white looks minimal but fails readability
5. **Random spacing** — different padding on every card
6. **Too many accent colours** — no clear primary action
7. **Jumping to full pages** — build elements first, sections second

---

## Conclusion

You did not just read about website elements — you **saw** them on this page. Real sizes. Real icons. Real colours. That is the standard for everything you build next.

Chapter 5 assembles these pieces into full sections with live UI previews in the book reader. Open the live site, name what you see, then rebuild one element in Cursor today.

---

### Action Points

1. **Scroll back through this chapter** and screenshot each embedded demo for your `my-reference` folder.

2. **Open royalprincehub.com** — find one example of each: H1 headline, body text, NavIcon, primary button, accent colour.

3. **Right-click → Inspect** on a navbar link. Find the SVG and the `<span>` label beside it. Confirm `currentColor` on the stroke.

4. **Pick your brand palette** — one background (60%), one surface (30%), one accent (10%). Write the hex codes before you code.

5. **Recreate the typography scale demo in Cursor** — eyebrow, H1, H2, body, caption. Match the Tailwind classes shown in this chapter.

6. **Read Chapter 5 next** — study each embedded UI preview and connect it to the elements you learned here.
