const tmi = require('tmi.js');
const http = require('http');

const BOT_API_KEY = 'notarealtoken';

const client = new tmi.Client({
  identity: {
    username: 'botfromthecorner',
    password: 'oauth:oauthtokenhere'
  },
  channels: ['callumfromthecorner']
});

client.connect();

client.on('connected', () => {
  console.log('Bot connected');
});

const quotes = [
  "RIGHT deep breath in BOYCOTT BT BECAUSE THEY ARE A BAG OF ARSE",
  "Why am I sitting here with my ARSE POUNDING?!?",
  "Am wankin off in front of mah family!",
  "Equals pequals.",
  "THE FUCK IS GOIN ON?! I'M OUT, I AM FUCKING OUT, THAT IS DISGUSTING!!! THE FUCK IS WRONG WITH YOU?!",
  "FuuuuuuUUUUUUCK!!! NO NO NO NO NO, IM FUCKED IM FUCKED, MY ARSE IS ABSOLUTELY FILLED WITH COCK!!",
  "Ample, but quite firm buttocks.",
  "Absolootleh gorgeous! LLOVLEH!",
  "E-E-E- HE LIKES TO OBTAIN THE CUMMIE WUMMIES! FROM ELDERLY MEN AND SMEAR IT ON HIS FACE, AS HE CONSIDERS IT AN ELIXER OF YOUTH.. WHAT ARE YEW TALKING ABOUT?!?!",
  "YOU'VE GOT GINGER HAIR",
  "What do you expect it's MERMAID PORN!",
  "I don't want to wake up with dildos, I don't want to wake up to toasters... toasters... toasters... TOASTERS, I DON'T NEED ANY MORE TOASTERS MY TOASTERS BETTER THAN ALL OF THESE TOASTERS STOP SENDING ME TOASTERS!! Little notes in there \"enjoy your toast Callum\"... You're mental. WHY ARE YOU SPENDING YOUR MONEY ON THIS?!",
  "My face... POO SMEARED ON IT",
  "The jokes on you pringles ill just buy two tubs now!",
  "Locked away in the bathroom bloodeh wankin it away on pornhub in incognito mode",
  "Ayup, it's Callum. I'm doing a one off video blog tonight",
  "Im not standing for it, and its getting banned and im writing that in CAPITAL SODDING LETTERS \"COCKS\" but tonights stream will be a cock-free environment I can promise you that much.",
  "What the fuck is he doing? Oh hes hoovering his cock!",
  "Hes smearing poo on himself like hes on the banks of the bloody nile.",
  "WHY AM I ON PORNHUB?!",
  "I just wanted a chicken kebab, and I had to watch this Spazmoid sniff cheese.",
  "This is dedicated to one special little spazmoid on the bus who tried to trigger me - you have FAILED.",
  "GAYYUPP!",
  "Speckatron, you've got NHS glasses!",
  "I felt like a speck orbiting a distant planet.",
  "SCCHHHTUUPID! Driving instructor!",
  "She's MOANED about my cake!",
  "And Aimee's playing...interracial bingo or whatever it is. Must be close to full house now, judging by the state of the bloody kids.",
  "I need a revenge bunch of flowers because I found out my ex girlfriend is cheating on me. Do you do any bunches that include burning dog shit?",
  "REEEVOLTINGLY LARGE PENIS!",
  "That SNES has more in common with you than you think, AIMEE! Half the lads in my school have had a go on you!",
  "We need to talk about Virgin bloody Media. How can they call themselves Virgins when they're schhhhh...schhafting me up the arse!",
  "You...are a conversational rapist.",
  "My boppit abilities are still unmatched.",
  "I saved a pigeon from being nonced on.",
  "Leave him alone! I mean, he's ginger, he's newly gay.",
  "You're telling me to get back in my box? Well go back to your cell, Afghan. Oh wait, you're already there.",
  "I thought I was going to have to beat a pensioner to death with a metre long tube of jaffa cakes.",
  "Cone headed cunt.",
  "I've got a blister on my tongue and AARRGGHH, AVE JUST BITTEN IIITTTT!",
  "ER NO HIS NAMES GEORGE FOCKING FLOYD. TRAPPING ME IN A BOX YOU DEVIANT LITTLE CONT",
  "MEN'S PENISES, OTHER MEN'S PENSISES I FIND ABSOLUTELY REPUGNANT IN EVERY WAY SHAPE AND FORM. PARTICULARLY THE END OF IT- THE BELLENDIUS OF IT.",
  "THERE WAS A LITTLE GIF OF A BLOKE WITH A... A REVOLTINGLY LARGE PENIS- PFFF- SPLAFFIN HIS LOAD ALL OVER A WOMAN'S FACE... And that's next to my face!",
];

const randomQuote = () => quotes[Math.floor(Math.random() * quotes.length)];

const BOT_PORT = 3005;

const notificationServer = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/notify/credit-redemption') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { username } = data;
        const msg = `@${username} just redeemed a free Twitch dono!`;
       // client.say('#callumfromthecorner', msg); disabled for now cos its annoying asfff
        console.log(`${msg}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Error parsing notification:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.method === 'POST' && req.url === '/notify/server-status') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const { status } = data;
        let msg;
        if (status === 'started') {
          msg = 'The API server is back online.';
        } else if (status === 'stopping') {
          // todo : also check the api heartbeat too, so if the api goes down without alerting it will still fire
          msg = 'The API server appears to be offline. This could be due to a restart, or a failure. Donations and other services will not work until it is back up. I will check again in 30 seconds. @MattFromTheCorner';
        } else {
          msg = `API server status: ${status}`;
        }
        client.say('#callumfromthecorner', msg);
        console.log(`${msg}`);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('Error parsing notification:', err);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid JSON' }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/health') {
    // this section is for the healthcheck in docker
    const connected = client.readyState() === 'OPEN';
    const status = connected ? 200 : 503;
    res.writeHead(status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: connected ? 'healthy' : 'unhealthy',
      connected,
      uptime: Math.floor(process.uptime()),
      channels: client.getChannels(),
    }));
  } else {
    res.writeHead(404);
    res.end();
  }
});

notificationServer.listen(BOT_PORT, '0.0.0.0', () => {
  console.log(`Bot listener running on http://0.0.0.0:${BOT_PORT}`);
});

const creditReminderCache = new Set();

const checkUserCreditReminder = async (channel, username) => {
  const key = username.toLowerCase();
  if (creditReminderCache.has(key)) return;
  creditReminderCache.add(key);

  try {
    console.log(`checking ${username}...`);
    const res = await fetch('https://api.callumscorner.com/twitch/pending-credit-reminders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Bot-Api-Key': BOT_API_KEY },
      body: JSON.stringify({ check: username }),
    });
    const data = await res.json();
    console.log(`Response for ${username}:`, JSON.stringify(data));

    if (data.due) {
      client.say(channel, `@${username}, your free subscriber dono for this month is ready. Head to callumscorner.com and log in with Twitch to use it.`);
      console.log(`Sent to ${username}`);
    } else {
      console.log(`${username} is not due a reminder.`);
    }
  } catch (err) {
    console.error(`Error checking ${username}:`, err.message);
    creditReminderCache.delete(key); // try again next time
  }
};

client.on('message', (channel, tags, message, self) => {
  if (self) return;

  // not really the best way to do it but i dont care
  checkUserCreditReminder(channel, tags.username);

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
    fetch('https://api.callumscorner.com/media/queue')
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const item = data[0];
          const response = `Now Playing: ${item.video_title} requested by ${item.donor_name}. Link : ${item.media_url}`;
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

  if (msg === '!quote') {
    const quote = randomQuote();
    client.say(channel, `@${tags.username} "${quote}"`);
    console.log(`Replied to ${tags.username} with callum quote: ${quote}`);
  }

  if (msg.startsWith('!credits')) {
    const args = message.trim().split(/\s+/);
    // check if mod through the tags in the irc message. easier than through helix
    const isMod = tags.mod || tags.badges?.broadcaster === '1';
    const targetUser = args[1] ? args[1].replace('@', '').toLowerCase() : null;
    const isLookup = targetUser && isMod;
    const lookupUsername = isLookup ? targetUser : tags.username;

    if (targetUser && !isMod) {
      client.say(channel, `@${tags.username} Only moderators can check other users' credits.`);
      return;
    }

    fetch('https://api.callumscorner.com/twitch/bot-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Bot-Api-Key': BOT_API_KEY },
      body: JSON.stringify({ username: lookupUsername }),
    })
      .then(res => res.json())
      .then(data => {
        if (!data.found) {
          client.say(channel, `@${tags.username} ${isLookup ? `${targetUser}'s Twitch account is not linked.` : data.message}`);
        } else {
          let response;
          if (isLookup) {
            response = `@${tags.username} ${data.displayName || targetUser} has ${data.donosAvailable} free dono${data.donosAvailable !== 1 ? 's' : ''} available.`;
            if (data.subscriberTier && data.nextCreditDate) {
              const next = new Date(data.nextCreditDate);
              const daysLeft = Math.max(0, Math.ceil((next - Date.now()) / 86400000));
              response += ` Next free one in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} (${data.subscriberTier} sub).`;
            }
          } else {
            response = `@${tags.username} Your Twitch account has ${data.donosAvailable} free dono${data.donosAvailable !== 1 ? 's' : ''} available.`;
            if (data.subscriberTier && data.nextCreditDate) {
              const next = new Date(data.nextCreditDate);
              const daysLeft = Math.max(0, Math.ceil((next - Date.now()) / 86400000));
              response += ` Your next free one is in ${daysLeft} day${daysLeft !== 1 ? 's' : ''} since you are a ${data.subscriberTier} sub.`;
            }
            response += ` Use your free donos at callumscorner.com.`;
          }
          client.say(channel, response);
        }
        console.log(`Replied to ${tags.username} with credits info${isLookup ? ` (lookup: ${targetUser})` : ''}`);
      })
      .catch(err => {
        console.error('Error fetching credits:', err);
        client.say(channel, `@${tags.username} An error occured when trying to check your balance, try again later.`);
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

  if (msg === '!commands') {
    client.say(channel, `@${tags.username} Available commands: !donate, !queue, !np, !credits, !quote, !followage, !rage, !poo, !king, !realtalk`);
    console.log(`Replied to ${tags.username} with commands list`);
  }

  if (msg.startsWith('!followage')) {
    const channelName = channel.replace('#', '');
    const args = message.trim().split(/\s+/);
    const targetUser = args[1] ? args[1].replace('@', '').toLowerCase() : tags.username;
    const isCheckingOther = targetUser !== tags.username.toLowerCase();

    fetch(`https://decapi.me/twitch/followage/${channelName}/${targetUser}?token=k24JdxuTODgxxDOJMuyzcm1aWZuISQLLBKQuUu23`)
      .then(res => res.text())
      .then(data => {
        let response;
        if (isCheckingOther) {
          response = `@${tags.username}, ${targetUser} has been following for ${data}`;
        } else {
          response = `@${tags.username}, You've been following for ${data}`;
        }
        if (targetUser === 'callumfromthecorner') {
          response = `@${tags.username}, hmm, callum cannot follow himself.`;
        }
        client.say(channel, response);
        console.log(`Replied to ${tags.username} with followage: ${response}`);
      })
      .catch(err => {
        console.error('Error fetching followage:', err);
        client.say(channel, `@${tags.username} I ran into an error while fetching the followage. My auth token to access Cal's Twitch data probably expired. @MattFromTheCorner fix this pls!!`);
      });
  }
});