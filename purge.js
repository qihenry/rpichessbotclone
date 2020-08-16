const Discord = require("discord.js");

module.exports = {
	name: 'purge',
	description: 'Deletes x amount of messages',
	execute(msg, msgContent) {
       let deleteNum = msgContent[1];
       if(isNaN(deleteNum) || parseInt(deleteNum) < 0 || deleteNum > 100){
            msg.reply("Not a valid number, must be from 1-100");
            return;
        }
       msg.channel.bulkDelete(deleteNum, true)
       .catch(err => msg.reply('Something went wrong... ' + err));
       msg.delete();
    },
}