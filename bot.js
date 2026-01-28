const tmi = require('tmi.js');

const client = new tmi.Client({
  identity: {
    username: 'botfromthecorner',
    password: 'oauth:REDACTEDOAUTHTOKEN'
  },
  channels: ['callumfromthecorner']
});

client.connect();

client.on('connected', () => {
  console.log('Bot connected!');
});

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  const msg = message.toLowerCase().trim();

  if (msg === '!queue') {
    client.say(channel, `@${tags.username} https://queue.callumscorner.com`);
    console.log(`Replied to ${tags.username} with: https://queue.callumscorner.com`);
  }

  if (msg === '!donate') {
    client.say(channel, `@${tags.username} callumscorner.com`);
    console.log(`Replied to ${tags.username} with: callumscorner.com`);
  }

  if (msg === '!np' || msg === '!nowplaying') {
    fetch('http://api.donationnetwork.internal/media/queue')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const item = data[0];
          const response = `Now Playing: ${item.video_title} requested by ${item.donor_name}. Link : ${item.media_url}. I can't send links right now until clom adds this bot as a Moderator. so you will probably see *** instead. sorreh`;
          client.say(channel, `@${tags.username} ${response}`);
          console.log(`Replied to ${tags.username} with: ${response}`);
        } else {
          client.say(channel, `@${tags.username} No videos in queue`);
          console.log(`Replied to ${tags.username} with: No videos in queue`);
        }
      })
      .catch(err => {
        console.error('Error fetching queue:', err);
        client.say(channel, `@${tags.username} Error fetching queue`);
      });
  }

  if (msg === '!rage') {
    client.say(channel, `@${tags.username} There is currently an 86% chance Callum will rage`);
    console.log(`Replied to ${tags.username} with: There is currently an 86% chance Callum will rage`);
  }

  if (msg === '!poo') {
    client.say(channel, `@${tags.username} Callum will do a poo this stream`);
    console.log(`Replied to ${tags.username} with: Callum will do a poo this stream`);
  }

  if (msg === '!king') {
    client.say(channel, `@${tags.username} King Ian Moore is the real king of the corner`);
    console.log(`Replied to ${tags.username} with: King Ian Moore is the real king of the corner`);
  }

  if (msg === '!realtalk') {
    client.say(channel, `@${tags.username}, Real talk : Brad and Blackhawk are massive gimps`);
    console.log(`Replied to ${tags.username} with: Real talk : Brad and Blackhawk are massive gimps`);
  }

  if (msg.startsWith('!followage')) {
    const channelName = channel.replace('#', '');
    const args = message.trim().split(/\s+/);
    const targetUser = args[1] ? args[1].replace('@', '').toLowerCase() : tags.username;
    const isCheckingOther = targetUser !== tags.username.toLowerCase();

    fetch(`https://decapi.me/twitch/followage/${channelName}/${targetUser}?token=REDACTEDTOKEN`)
      .then(res => res.text())
      .then(data => {
        let response;
        if (isCheckingOther) {
          response = `@${tags.username}, ${targetUser} has been following for ${data}`;
        } else {
          response = `@${tags.username}, You've been following for ${data}`;
        }
        client.say(channel, response);
        console.log(`Replied to ${tags.username} with followage: ${response}`);
      })
      .catch(err => {
        console.error('Error fetching followage:', err);
        client.say(channel, `@${tags.username} I ran into an error while fetching the followage. My auth token to access Cal's Twitch data probably expired. @MattJGH fix this pls!!`);
      });
  }
});