ASSET FOLDER
============

Put all images and videos for the website in this folder.

Suggested structure:

assets/
  brand/
    civilius-logo.svg

  games/
    swimsuit-zombies/
      game-logo.svg
      gameplay-loop.mp4       <- looping landing-page gameplay video
      hero.svg                <- wide game-detail hero image
      card.svg                <- wide image used on Games page
      steam-card.svg          <- smaller store-style image
      screenshots/
        01.svg
        02.svg
        03.svg
        04.svg

You may use PNG/JPG/WEBP instead of SVG and a normal MP4/WebM for video.
After replacing a file, either keep the same filename or change its path in data/site.json.

The website does not hard-code game assets in the HTML. The paths all live in data/site.json.
