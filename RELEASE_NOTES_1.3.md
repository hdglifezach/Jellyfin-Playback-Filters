# Playback Filters v1.3.0

## Added

- Filter selector on item detail pages beside the audio and subtitle selectors.
- Clear LG webOS compatibility notice when a client-side filter is selected.

## Fixed

- Stop filtering the webOS player container, which changed the splash screen and
  controls without changing hardware-layer video.

## Compatibility

LG webOS hardware-layer video and native clients such as Fire TV require a
future server-side transcoding mode. Client-side filters continue to work in
compatible Jellyfin Web browsers.
