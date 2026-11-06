# Simulated navigation videos

The feature panels play MP4 files reconstructed from user-supplied Refract screenshots. Animated cursors and click rings lead into the matching screen. These are labeled simulated navigation, not screen recordings. Installation and update completion are not fabricated.

- `modpacks.mp4`: Library → Modpacks → Vanilla Perfected details → close → Library; 15 seconds.
- `library.mp4`: Library → Fresh & Smooth content → Updates → All → close; 15 seconds.
- `browse.mp4`: Library → Browse Mods → Library; 9 seconds.
- `settings.mp4`: Library → Settings → Manage themes → Refract Dark → custom theme → Done → Library; 23 seconds. Theme states use supplied before/after screenshots.
- `navigation.mp4`: Library → Modpacks → pack details → close → News → Library; 18 seconds. Standalone overview clip.

Each homepage feature has its own matching clip and poster. All clips are 1440×776, H.264, 30 fps, silent, with fast-start MP4 metadata. Source images retain their proportions; click coordinates account for each screenshot's size and letterboxing. The homepage hero uses `LauncherShowcase.astro` with a screenshot switcher and a separate WebGL scene.

The eight additional unique source images are stored in `assets/demo/`. Duplicate attachments were omitted. The original three sources remain in `public/images/screenshots/`.

Native controls provide play, pause, seek, and fullscreen. Clips loop while at least 25% visible, pause outside the viewport or in a hidden tab, and do not autoplay when reduced motion is requested. Manual playback remains available. Without JavaScript, native controls still work.

Regenerate with `node scripts/render-navigation-videos.mjs`. Set `FFMPEG_PATH` to an installed FFmpeg executable; the local default uses the isolated encoder in ignored `output/video-tools/`. No runtime dependency was added to the website.
