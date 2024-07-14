const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fetch = require("node-fetch");
const path = require("path");
const fs = require("fs");

module.exports = new ApplicationCommand({
  command: {
    name: 'deobfuscate',
    description: 'Deobfuscate Lua File.',
    type: 1,
    options: [{
      name: 'file',
      description: 'Obfuscated Lua file to deobfuscate.',
      type: ApplicationCommandOptionType.Attachment,
      required: true
    }]
  },
  options: {
    botOwner: true
  },
  /**
   * 
   * @param {DiscordBot} client 
   * @param {ChatInputCommandInteraction} interaction 
   */
  run: async (client, interaction) => {
    await interaction.deferReply();

    const file = interaction.options.getAttachment("file");
    const key = "pr1s";  // Ensure this matches the key used in obfuscation

    if (!file.name.endsWith(".lua") && !file.name.endsWith(".txt")) {
      return interaction.editReply({
        content: "Please upload a .lua or .txt file!",
        ephemeral: true,
      });
    }

    const response = await fetch(file.url);
    const fileData = await response.text();

    // Extract the encrypted part of the script
    const encryptedPartMatch = fileData.match(/local encrypted = {(.+)};/);
    if (!encryptedPartMatch) {
      return interaction.editReply({
        content: "Could not find encrypted part in the script!",
        ephemeral: true,
      });
    }

    const encryptedPart = encryptedPartMatch[1].split(',').map(Number);

    // XOR decryption function
    const xorDecrypt = (data, key) => {
      const result = [];
      for (let i = 0, j = 0; i < data.length; i++, j = (j + 1) % key.length) {
        result.push(data[i] ^ key.charCodeAt(j));
      }
      return String.fromCharCode(...result);
    };

    // Deobfuscate the script
    const decryptedScript = xorDecrypt(encryptedPart, key);

    // Send the deobfuscated script back to the user
    await interaction.editReply({
      content: "Here is your deobfuscated Lua script:",
      files: [
        new AttachmentBuilder(Buffer.from(decryptedScript, 'utf-8'), { name: `Dec_${file.name}` })
      ]
    });
  }
}).toJSON();