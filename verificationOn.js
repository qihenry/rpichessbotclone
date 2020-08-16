const Discord = require("discord.js");

module.exports = {
	name: 'verificationOn',
	description: 'Turns on the verification',
	execute(msg, verificationMsg) {
        //msg.channel.send('Pong.');
        var Vchannel = msg.member.guild.channels.cache.find(ch => ch.name === 'verification');
		if(!Vchannel) return;
		const suggestionEmbed = new Discord.MessageEmbed()
        .setColor('#000000')
        .setTitle("WELCOME TO RPI CHESS CLUB'S SERVER")
        .setDescription(
			":small_orange_diamond:Use common sense\n" + 
			":small_blue_diamond:No advertising: This includes other servers, services, any unknown files,  and links of anything other than server related.\n" +
			":small_orange_diamond:No spamming/spam pinging users/staff\n" +
			":small_blue_diamond:Keep contents in its appropriate channel.\n" +
			":small_orange_diamond:Keep any sort of arguments or drama out of this server.\n" + 
			":small_blue_diamond:If you need help with anything or have any questions which you believe users are not aware of, then you may create a ticket for assistance.\n" + 
			":small_orange_diamond:No inappropriate language/anything that can hurt someone.\n\n" +
			"**PRESS THE REACTION TO ACKNOWLEDGE THE RULES AND JOIN THE DISCORD**"  )
		.setThumbnail("https://images.chesscomfiles.com/uploads/v1/group/49060.f45cde6c.160x160o.ceb9eef81c0f.gif")
		
        //sending the message and using callback functions to put the emotes
        Vchannel.send(suggestionEmbed).then(embedMessage => {
            embedMessage.react("✅");
			verificationMsg.push(embedMessage.id);
			console.log(embedMessage.id + "\n" + verificationMsg);
		});
		msg.delete();
			/*if(!Vchannel) return;
        	Vchannel.messages.fetch({ limit: 1 })
        	let Vmessage = Vchannel.messages.cache.first();
        	if(Vmessage != null){
            		Vmessage.react("✅");
        	}*/
	},
};