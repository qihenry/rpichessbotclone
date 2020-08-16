
const Discord = require("discord.js");

module.exports = {
	name: 'addRoles',
	description: 'Sends an embedded message that will allow users to react in order to add Roles',
	execute(msg, pinnedMsg) {
        //The embedded message
        const suggestionEmbed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle('REACT FOR ROLES')
        .setDescription("React with one of the emoji's below to add a role" + '\n' + 
                        ':baby: ➥ Novice' + '\n' + 
                        ':heart: ➥ Chess Lover' + '\n' +  
                        ':zap: ➥ Speed Demon' + '\n' +
                        ':wastebasket: ➥ Trash Talk Master' + '\n' +
                        ':four: ➥ 4p Chess' + '\n' +
                        ':green_apple: ➥ 1300+' + '\n' + 
                        ':apple: ➥ 1500+' + '\n' +
                        ':pear: ➥ 1700+ ' + '\n' +
                        ':tangerine: ➥ 2000+ ' + '\n' +
                        ':lemon: ➥ Titled' + '\n' +
                        ':grapes: ➥ Tourney Player' )
        //sending the message and using callback functions to put the emotes
        msg.channel.send(suggestionEmbed).then(embedMessage => {
            embedMessage.react("👶");
            embedMessage.react("❤️");
            embedMessage.react("⚡");
            embedMessage.react("🗑️");
            embedMessage.react("4️⃣");
            embedMessage.react("🍏");
            embedMessage.react("🍎");
            embedMessage.react("🍐");
            embedMessage.react("🍊");
            embedMessage.react("🍋");
            embedMessage.react("🍇");
            pinnedMsg.push(embedMessage.id);
        })
        msg.delete();  
    },
};