const config = {
    database: {
        path: './database.yml' // The database path.
    },
    development: {
        enabled: true, // If true, the bot will register all application commands to a specific guild (not globally).
        guildId: '1250575584107565056',
    },
    commands: {
        prefix: 'e', // For message commands, prefix is required. This can be changed by a database.
        message_commands: true, // If true, the bot will allow users to use message (or prefix) commands.
        application_commands: {
            chat_input: true, // If true, the bot will allow users to use chat input (or slash) commands.
            user_context: false, // If true, the bot will allow users to use user context menu commands.
            message_context: false // If true, the bot will allow users to use message context menu commands.
        }
    },
    users: {
        ownerId: '1125672885143490641', // The bot owner ID, which is you.
        developers: ['1125672885143490641', '620910853377622036'] // The bot developers, remember to include your account ID with the other account IDs.
    },
    messages: { // Messages configuration for application commands and message commands handler.
        NOT_BOT_OWNER: 'You do not have the permission to run this command because you\'re not the owner of me!',
        NOT_BOT_DEVELOPER: 'You do not have the permission to run this command because you\'re not a developer of me!',
        NOT_GUILD_OWNER: 'You do not have the permission to run this command because you\re not the guild owner!',
        CHANNEL_NOT_NSFW: 'You cannot run this command in a non-NSFW channel!',
        MISSING_PERMISSIONS: 'You do not have the permission to run this command, missing permissions.',
        COMPONENT_NOT_PUBLIC: 'You are not the author of this button!',
        GUILD_COOLDOWN: 'You are currently in cooldown, you have the ability to re-use this command again in \`%cooldown%s\`.'
    }
}

module.exports = config;