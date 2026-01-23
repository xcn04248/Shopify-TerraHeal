# AGENTS.md - Terraheal Shopify Theme

> Guidelines for AI agents operating in this Shopify 2.0 theme repository.

## Project Overview

Premium Shopify 2.0 theme for **Terraheal**, built on Shrine Theme core with LayoutHub & GemPages integration.

---

## Build & Development Commands

```bash
# Install Shopify CLI (macOS)
brew install shopify-cli

# Login to store
shopify auth login --store your-store-name.myshopify.com

# Start development server with live preview
shopify theme dev

# Push/pull theme
shopify theme push
shopify theme pull

# Check theme for errors (linting)
shopify theme check
shopify theme check --path sections/header.liquid
```

**Note:** No npm/yarn/test suites. All validation via `shopify theme check`.

---

## Directory Structure

```
theme/
├── assets/         # Static resources - NO subdirectories allowed
├── blocks/         # Reusable block components (OS 2.0+)
├── config/         # Theme settings (settings_schema.json)
├── docs/           # Project documentation
├── layout/         # Layout files (theme.liquid required)
├── locales/        # Translation files (en.default.json)
├── sections/       # Modular content sections (90+)
├── snippets/       # Reusable Liquid code (130+)
└── templates/      # Page template JSON files
    └── customers/  # Only allowed subdirectory
```

---

## File Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Sections/Snippets/Blocks | `kebab-case.liquid` | `featured-collection.liquid` |
| Assets | `prefix-description.ext` | `lp-hero-banner.png` |
| Templates | `{type}.{variant}.json` | `page.contact.json` |

**Forbidden:** Spaces, camelCase, subdirectories in `assets/`, special characters (except hyphens)

---

## Liquid Code Style

```liquid
{% comment %}
  Renders a product price display
  Accepts:
  - product: {Object} Product Liquid object
  - use_variant: {Boolean} Use variant price (optional)
  Usage: {% render 'price', product: product %}
{% endcomment %}

{%- liquid
  assign target = product.selected_or_first_available_variant
  assign price = target.price | default: 1999
  if settings.currency_code_enabled
    assign money_price = price | money_with_currency
  endif
-%}
```

### CSS Patterns
```liquid
{%- style -%}
  #Section-{{ section.id }} .element {
    --custom-property: {{ section.settings.value }}px;
  }
  @media screen and (min-width: 750px) {
    #Section-{{ section.id }} .element { padding: {{ section.settings.padding }}px; }
  }
{%- endstyle -%}
```

### JavaScript Patterns
- Use Web Components (Custom Elements)
- Defer scripts: `defer="defer"`
- Use IntersectionObserver for lazy loading

```javascript
class ProductRecommendations extends HTMLElement {
  connectedCallback() {
    new IntersectionObserver(this.handleIntersect.bind(this)).observe(this);
  }
}
customElements.define('product-recommendations', ProductRecommendations);
```

---

## Schema Definition

```liquid
{% schema %}
{
  "name": "Section Name",
  "tag": "section",
  "settings": [
    { "type": "select", "id": "setting_id", "label": "Label", "default": "value" }
  ],
  "blocks": [],
  "presets": [{ "name": "Section Name" }]
}
{% endschema %}
```

---

## Critical Rules

### DO:
- Use `{%- -%}` (hyphenated tags) to strip whitespace
- Use `{{ 'asset.css' | asset_url }}` for asset references
- Use `loading="lazy"` on images below the fold
- Scope CSS to section IDs: `#Section-{{ section.id }}`
- Use translation keys: `{{ 'products.product.price.regular_price' | t }}`

### DO NOT:
- Create subdirectories in `assets/`
- Hardcode text - use translation keys from `locales/en.default.json`
- Commit `config/settings_data.json` (store-specific settings)
- Use deprecated Liquid filters

---

## Landing Page Assets

Prefix with `lp-`: `lp-hero-banner.png`, `lp-testimonial-video.mp4`

Refer to `docs/IMAGE-POSITION-MAPPING.md` for asset positioning.

---

## Git Commit Style

```
feat: Add new feature
fix: Correct specific issue
refactor: Restructure without behavior change
docs: Update documentation
chore: Maintenance tasks
```

---

## External Integrations

- **Shrine Theme Core**: js.shrinetheme.com
- **LayoutHub/GemPages**: Page builders
- **Google Fonts**: Material Symbols Outlined

---

## Verification Workflow

1. Run `shopify theme check` for linting
2. Test with `shopify theme dev` for live preview
3. Verify mobile responsiveness (750px breakpoint)
4. Check translation key usage
5. For landing pages: follow `docs/CONTENT_VERIFICATION_WORKFLOW.md`
