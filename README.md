# youtube-dl-feeds

A tiny node server that spits out youtube atom feeds for
gmakepod. Supports channels, users & playlists.

Usage:

    $ curl https://youtube-dl-feeds.herokuapp.com/https://www.youtube.com/user/StonedMeadowOfDoom93

It grabs a youtube feed & augments it w/ `<link rel="enclosure" .../>`
tags.

Refer to https://github.com/gromnitsky/gmakepod for the docs.

## License

MIT.
