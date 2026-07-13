---
title: Refract 1.3.0 brings Quick Play, smarter imports, and smaller builds
description: Launch straight into a world or server, export mrpack files, import backup worlds, and get a more reliable Linux experience.
publishedAt: 2026-07-11
tags: [release, launcher]
hero: /images/screenshots/library.png
---

Refract 1.3.0 makes the distance between choosing a world and playing it much shorter. **Quick Play** can launch directly into a server or world, and desktop shortcuts can target one specific destination.

## Playing

- Play Offline is offered when Microsoft authentication servers are unavailable.
- Each instance can set its own window size, fullscreen mode, and launch hooks.
- Refract warns when available system RAM is below an instance's allocation.
- Game options can be synchronized between instances.

## Instances and content

Instances can now be exported in Modrinth's `.mrpack` format. ZIP world backups can be imported, and archive imports automatically detect their layout, mod loader, and Minecraft version. Datapacks also participate in content update checks.

## Reliability

The release adds Java 25 detection, writes failed game launches to the launcher log, fixes several Linux window issues, and reduces packaged binary sizes. The full change list and signed assets are available on the [GitHub release](https://github.com/RefractMC/Refract_MC/releases/tag/v1.3.0).
