---
title: Refract moves to Tauri
description: Version 1.2 keeps launcher data in place while moving the native shell and backend to Tauri and Rust.
publishedAt: 2026-07-02
tags: [development, release]
hero: /images/screenshots/settings.png
---

Refract 1.2 moved the desktop app from Electron to **Tauri** without changing the app identity or launcher data folder. Existing instances, settings, themes, worlds, screenshots, options, and server lists remain in place.

## What changed

The React renderer still powers the interface. Rust now handles installation, launching, authentication, Java management, content, worlds, screenshots, servers, skins, logs, and platform integration through Tauri.

Microsoft accounts require one sign-in after migration because credentials move into a new secure vault. Offline accounts continue to work without that step.

## Why it matters

The migration creates a smaller native foundation with hardened capabilities and a signed updater path. It also gives the project one shared renderer for future platform work.
