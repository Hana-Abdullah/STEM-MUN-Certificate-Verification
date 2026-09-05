---
name: QR dependency after merges
description: Preserve QR generation and its package dependency when certificate app changes are merged.
---

Certificate QR rendering depends on both the QR component and the app-local `qrcode` package; a merge can remove either even when certificate verification routes still work.

**Why:** A merged certificate update left verification links available but removed the visible QR renderer and its dependency, so the issue only appeared during a visual preview.

**How to apply:** After merges affecting `artifacts/stem-mun-certificates`, check the certificate card for a visible QR and run the app typecheck before delivery.