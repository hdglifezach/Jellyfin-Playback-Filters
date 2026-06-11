# Jellyfin Playback Filters

Client-side video filters for Jellyfin Web, rendered by the browser GPU without
forcing a server transcode.

The plugin adds a filter button beside the Sleep Timer button in Jellyfin's
playback bar. It includes grouped movie, black-and-white, color, comfort, and
fun presets, including an animated Rainbow Shift mode.

## Features

- More than 30 grouped filter presets
- Multiple black-and-white and noir looks
- Movie styles such as Cinema, Blockbuster, Horror, and Vintage Film
- Comfort presets such as Dim, Night, and Soft Contrast
- Fun presets such as Alien Vision, X-Ray, Radioactive, and Rainbow Shift
- Persistent filter selection per browser
- `Alt+F` shortcut to cycle filters
- Preserves direct play and direct stream

## Requirements

- Jellyfin Server 10.11.x
- [JavaScript Injector](https://github.com/n00bcodr/Jellyfin-JavaScript-Injector)
- Jellyfin Web or another client that loads the server-provided Jellyfin Web UI

Native clients such as Roku, Kodi, and some television apps do not execute
Jellyfin Web JavaScript, so filters cannot be displayed in those clients.

## Install From Jellyfin Catalog

1. Install JavaScript Injector.
2. In Jellyfin, open **Dashboard > Plugins > Catalog > Settings**.
3. Add this repository URL:

   ```text
   https://raw.githubusercontent.com/TheRealZachTV/Jellyfin-Playback-Filters/main/manifest.json
   ```

4. Save, open the catalog, and install **Playback Filters**.
5. Restart Jellyfin and fully refresh or reopen Jellyfin Web.

## Manual Install

Download the latest ZIP from
[Releases](https://github.com/TheRealZachTV/Jellyfin-Playback-Filters/releases),
extract it into Jellyfin's plugins directory, and restart Jellyfin.

## Build

Requires the .NET 9 SDK:

```powershell
dotnet publish .\Jellyfin.Plugin.PlaybackFilters\Jellyfin.Plugin.PlaybackFilters.csproj -c Release
```

## Notes

The official black-and-white presentation of a movie or show may use a custom
shot-by-shot grade. These filters provide real-time approximations rather than
reproducing an official alternate grade exactly.

## License

MIT
