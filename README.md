# FINPAL™ SalesPal™ Widget

> Embeddable AI lead qualification chat widget for any website.

## 🚀 What It Does

Drop one script tag on any website — your visitors get an AI sales assistant that:
- Qualifies leads in real time
- Books meetings automatically
- Captures contact info into FINPAL™ CRM
- Answers product questions using your RAG knowledge base

## 📦 Installation

```html
<!-- Add to your website's <head> or before </body> -->
<script
  src="https://widget.finpal.online/widget.js"
  data-tenant-id="YOUR_TENANT_ID"
  data-theme="dark"
  data-position="bottom-right"
  defer
></script>
```

## ⚙️ Configuration Options

| Option | Default | Description |
|--------|---------|-------------|
| `data-tenant-id` | required | Your FINPAL™ tenant ID |
| `data-theme` | `dark` | `dark` or `light` |
| `data-position` | `bottom-right` | Widget position |
| `data-primary-color` | `#00D9FF` | Brand colour |
| `data-greeting` | `Hi! How can I help?` | Opening message |
| `data-agent-name` | `SalesPal™` | Agent display name |

## 🏗️ Tech Stack

- Vanilla JS (zero dependencies — fast load)
- Shadow DOM (no style conflicts)
- WebSocket connection to FINPAL™ API
- < 15KB gzipped

## 🔗 Related

- [FINPAL™ SalesOS](https://github.com/ZenithPro-sys/finpal-salesos) — Main CRM platform
- [FINPAL™ Accounting](https://github.com/ZenithPro-sys/finpal-accounting) — Accounting service

---
_FINPAL™ © 2026 • Built by Zenith Intel + Tanya AI_
