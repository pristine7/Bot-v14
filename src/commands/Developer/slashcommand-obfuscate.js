const { ChatInputCommandInteraction, ApplicationCommandOptionType, AttachmentBuilder } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fetch = require("node-fetch");
const fs = require("fs");
const path = require("path");

module.exports = new ApplicationCommand({
  command: {
    name: 'obfuscate',
    description: 'Obfuscate Lua File.',
    type: 1,
    options: [{
      name: 'file',
      description: 'Lua file to obfuscate.',
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
    const key = "pr1s";

    if (!file.name.endsWith(".lua") && !file.name.endsWith(".txt")) {
      return interaction.editReply({
        content: "Please upload a .lua or .txt file!",
        ephemeral: true,
      });
    }

    const response = await fetch(file.url);
    const fileData = await response.text();

    // Generate random characters for obfuscation
    const generateRandomString = (length) => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    const randomStrings = Array.from({ length: 6 }, () => generateRandomString(128));

    // XOR encryption function
    const xorEncrypt = (text, key) => {
      const result = [];
      for (let i = 0, j = 0; i < text.length; i++, j = (j + 1) % key.length) {
        result.push(text.charCodeAt(i) ^ key.charCodeAt(j));
      }
      return result;
    };

    // Obfuscation logic
    const encryptedScript = xorEncrypt(fileData, key);
    const templateE = `local key=[[${key}]];${randomStrings[0]}z="Encrypt By EDITH Community";${randomStrings[1]}=${randomStrings[0]};${randomStrings[2]}=${randomStrings[1]};${randomStrings[3]}=${randomStrings[2]};${randomStrings[4]}=${randomStrings[3]};${randomStrings[5]}=${randomStrings[4]};`;

    const obfuscatedScript = `${templateE}local function decrypt(t) local s = ""; for i = 1, #t do local c = t[i] - key:byte((i - 1) % #key + 1); s = s .. string.char(c); end; return s; end; local encrypted = {${encryptedScript.join(",")}}; local decrypted = decrypt(encrypted); load(decrypted)()`;

    // Send the obfuscated script back to the user
    await interaction.editReply({
      content: "Here is your obfuscated Lua script:",
      files: [
        new AttachmentBuilder(Buffer.from(obfuscatedScript, 'utf-8'), { name: `Enc_${file.name}` })
      ]
    });
  }
}).toJSON();