const { Client, GatewayIntentBits } = require('discord.js');
const fetch = require('node-fetch');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const WEBHOOK_URL = process.env.WEBHOOK_URL;
const CHANNEL_ID = process.env.CHANNEL_ID;

client.once('ready', () => {
  console.log(`Bot is online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  if (message.channel.id !== CHANNEL_ID) return;

  const content = message.content;
  const lower = content.toLowerCase();

  if (!lower.includes('for vc') && !lower.includes('for follow up vc')) return;

  try {
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: content,
        channel_id: message.channel.id,
        message_id: message.id,
        guild_id: message.guild.id,
        author: message.author.username,
      }),
    });
    console.log('Forwarded to n8n:', content);
  } catch (err) {
    console.error('Failed:', err);
  }
});

client.login(process.env.DISCORD_TOKEN);
