const Discord = require("discord.js");
function Update(msg){
    let serverSize = msg.guild.members.cache.size;
    msg.reply(serverSize);
    console.log("it worked");
}
module.exports = {
	name: 'serverStats',
	description: 'keep track of the amount of people in the server',
	execute(msg, msgContent) {
        let id;
        if(msgContent[1] == 'clear'){
            if(!isNaN(id)){
                clearInterval(id);
                console.log("cleared");
            }
            console.log("clear didn't work");
        }
        else{
            msg.reply("hi");
            id = setInterval(Update, 3000, msg);
        }
    },
};