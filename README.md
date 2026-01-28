# botfromthecorner

A custom Twitch chat bot for [Callum's Corner](https://twitch.tv/callumfromthecorner) streams.

## Why this exists

This bot was created to replace some of the basic functionality that StreamElements used to provide for Callum's streams. Since we moved to a custom donation system, we needed a bot that could integrate with it directly - specifically to show what's currently playing in the media queue from donations.

## Commands

| Command | Description |
|---------|-------------|
| `!queue` | Returns a link to the queue page (queue.callumscorner.com) |
| `!donate` | Returns a link to the donation page (callumscorner.com) |
| `!np` or `!nowplaying` | Shows the currently playing video from the donation queue, including the title, who requested it, and the link |
| `!followage` | Shows how long you've been following the channel |
| `!followage @username` | Shows how long another user has been following |
| `!rage` | Displays Callum's current rage probability |
| `!poo` | Important stream information |
| `!king` | Acknowledges the real king of the corner |
| `!realtalk` | Real talk |

## Setup

### Prerequisites

- Node.js installed
- A Twitch account for the bot
- OAuth token for the bot account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Edit `bot.js` and update the following:
   - `username` - Your bot's Twitch username
   - `password` - Your bot's OAuth token (format: `oauth:xxxxxx`)
   - `channels` - The channel(s) the bot should join

### Running the bot

```bash
node bot.js
```

The bot will connect and log "Bot connected!" when ready.

## Notes

- The `!np` command fetches from an internal API (`api.donationnetwork.internal`) so it only works when connected to the donation system's network bridge
- The `!followage` command uses the DecAPI service
- For the bot to send links in chat (for `!np`), it needs to be added as a moderator in the channel

## Author

matt@callumscorner.com
