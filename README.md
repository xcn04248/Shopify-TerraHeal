# Terraheal Shopify Theme

This is a premium Shopify theme built for **Terraheal**, optimized for conversion and high performance.

## Theme Architecture

The theme follows the standard Shopify 2.0 structure:
- **/assets**: Contains CSS (`base.css`, `secondary.js`, etc.) and images.
- **/blocks**: Custom Liquid blocks for theme sections.
- **/config**: Theme settings and schema (`settings_schema.json`).
- **/layout**: Main layout files (`theme.liquid`). Includes integrations for LayoutHub and Gempages.
- **/locales**: Translation files for multi-language support.
- **/sections**: Modular theme sections (90+ sections available).
- **/snippets**: Reusable Liquid snippets (130+ snippets).
- **/templates**: Template JSON files for pages, products, etc.

## Key Features

- **Shrine Theme Core**: Optimized for speed and conversion.
- **LayoutHub & GemPages Integration**: Enhanced landing page building capabilities.
- **Custom Sections**: Includes specialized sections like `bundle-deals`, `comparison-slider`, `insta-stories`, and `tiktok-videos`.
- **Performance Optimized**: Uses lazy loading and optimized script delivery.

## Local Development

To work on this theme locally, it is recommended to use the **Shopify CLI**.

### 1. Install Shopify CLI
If you haven't already, install the Shopify CLI:
```bash
brew install shopify-cli
```

### 2. Login to your store
```bash
shopify auth login --store your-store-name.myshopify.com
```

### 3. Preview changes
```bash
shopify theme dev
```

## Git Workflow

The project has been initialized with Git. 
- `.gitignore` is configured to ignore common temporary files and `settings_data.json` to avoid accidentally overwriting live settings.
