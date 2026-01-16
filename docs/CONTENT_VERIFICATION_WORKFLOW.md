# Strict Content Verification Workflow

This document outlines the "Element-Level Audit" process used to ensure the Shopify Advertorial Landing Page (`page.adv-ly1-gm`) matches the reference site (`https://thegrounding.co/pages/adv-ly1-gm`) with high fidelity.

## Philosophy: "Source-Truth" Verification
Instead of comparing code against "extracted notes," we compare code against the **live reference page** element-by-element.

## Step 1: Automated Reference Extraction (The "Truth")
We use browser automation scripts to crawl the reference URL and generate a linear "Content Map".
**Target Scope:** Main Article Column (ignoring sticky sidebars/footers).

**Extraction Components:**
*   **Headings (H1-H6):** Capture exact text.
*   **Paragraphs (P):** Capture text content (first 50 chars for matching).
*   **Images (IMG):** Capture Source URL and Alt Text.
*   **Lists (UL/OL):** Capture list items.

**Output Format:**
```text
[Index 1] TYPE: H1 | CONTENT: "Leading Physical Therapist Discovers..."
[Index 2] TYPE: P  | CONTENT: "WARNING: If lymphedema has left you..."
[Index 3] TYPE: IMG| SRC: ".../image-uuid.jpg"
...
```

## Step 2: Local Implementation Mapping
We parse the local Shopify JSON template (`templates/page.adv-ly1-gm.json`) to build a parallel list.
*   **Sections:** Iterate through `order` array.
*   **Blocks:** Inside each section, read `settings.heading`, `settings.content`, and `settings.asset_image`.

## Step 3: The "Diff" Process
We compare the two lists content-block by content-block.

| Check | Criteria | Action on Mismatch |
| :--- | :--- | :--- |
| **Existence** | Does the element exist in the JSON at the expected relative position? | **Add new block** (update JSON) |
| **Type Match** | Is a Heading implemented as a Heading (not P)? | **Fix Schema/Liquid** |
| **Asset Match** | Does the image visual match the reference? | **Download & Link Asset** |
| **Sequence** | Is the flow logical (Timeline -> Science -> Solution)? | **Reorder Sections** |

## Step 4: Remediation Loop
1.  **Identify Gap**: (e.g., "Missing text paragraph after Limb Progression image").
2.  **Locate Asset**: (if image missing) or Copy Text (if text missing).
3.  **Update JSON**: Modify `page.adv-ly1-gm.json`.
4.  **Push to GitHub**: Commit changes.
5.  **Re-run Comparison**: Verify the fix.

## Success Metric
The verification is considered complete ONLY when the "Diff" between the Reference Map and Local Map returns **zero** structural or content discrepancies.
