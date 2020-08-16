//to hide token
//require("dotenv").config()
//need discord API library
require("dotenv").config()
const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client({partials: ['MESSAGE', 'REACTION']});
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
var verifiationMsg = [];
var roleMsg = [];
var CurrentGames = [];
var emojis = ["👶", "❤️", "⚡", "🗑️", "🍏", "🍎", "🍐", "🍊" , "🍋", "4️⃣", "🍇"];
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", msg =>{
    if(msg.author.bot) return;
    // Also good practice to ignore any message that does not start with our prefix, 
    // which is set in the configuration file.
    if(msg.content[0] !== '!') return;
    var msgContent = msg.content.split(" ");
    if(msgContent[0] === "!ping" ){
        msg.reply("pong");
        return;
    }
    let senderRoles = msg.member.roles.cache.find(role => role.name === "Admin");
    if(isNaN(senderRoles)){
        msg.reply("user is not an admin");
        return;
    }
    else if(msgContent[0] == "!serverStats"){
        client.commands.get("serverStats").execute(msg, msgContent);
    }
    else if(msgContent[0] == "!verificationOn"){
        client.commands.get("verificationOn").execute(msg, verifiationMsg);
    }
    else if(msgContent[0] == "!addRoles"){
        client.commands.get("addRoles").execute(msg, roleMsg);
    }
    else if(msgContent[0] == "!purge"){
        client.commands.get("purge").execute(msg, msgContent);
    }
    else if(msgContent[0] == "!createGame"){
        client.commands.get("createGame").execute(msg, msgContent, CurrentGames);
    }
    else if(msgContent[0] == "!test"){
        client.commands.get("test").execute(msg,CurrentGames);
    }
    else if(msgContent[0] == "!move"){
        client.commands.get("move").execute(msg,CurrentGames, msgContent[1]);
    }
    else if(msgContent[0] == "!accept"){
        client.commands.get("accept").execute(msg,msgContent, CurrentGames);
    }
});
client.on("messageReactionAdd", async (reaction, user) => {
    if(user.bot) return;
    // When we receive a reaction we check if the reaction is partial or not
    let message = reaction.message;
    let emoji = reaction.emoji;
    //If the message is not cached, the bot will need to fetch it.
    if (message.partial) {
        console.log('The message is partial.');
        await message.fetch()
        .then(fullmessage => {
            if(fullmessage.embeds[0].title === "REACT FOR ROLES"){
                console.log("added the id " + fullmessage.id);
                roleMsg.push(fullmessage.id);  
            } 
            if(fullmessage.embeds[0].title === "WELCOME TO RPI CHESS CLUB'S SERVER"){
                verifiationMsg.push(fullmessage.id);
            }
        })
        .catch(error => {
            console.log('Something went wrong when fetching the message: ', error);
        });         
    } 
    else {
        console.log('The message is not partial.');
    }
    if(emoji.name === "✅" && verifiationMsg.includes(message.id)) {
        client.commands.get("verification").execute(message,message.guild.member(user));
    }
    if(emojis.includes(emoji.name) && roleMsg.includes(message.id)){
        client.commands.get("RoleReact").execute(emoji.name,message.guild.member(user), message, "add");
    }
});
client.on("messageReactionRemove", async (reaction, user) => {
    if(user.bot) return;
    let message = reaction.message;
    let emoji = reaction.emoji;
    if (message.partial) {
        console.log('The message is partial.');
        await message.fetch()
        .then(fullmessage => {
            if(fullmessage.embeds[0].title === "REACT FOR ROLES"){
                console.log("added the id " + fullmessage.id);
                roleMsg.push(fullmessage.id);  
            } 
            if(fullmessage.embeds[0].title === "WELCOME TO RPI CHESS CLUB'S SERVER"){
                verifiationMsg.push(fullmessage.id);
            }
        })
        .catch(error => {
            console.log('Something went wrong when fetching the message: ', error);
        });         
    } 
    else {
        console.log('The message is not partial.');
    }
   
    if(emojis.includes(emoji.name) && roleMsg.includes(message.id)){
        client.commands.get("RoleReact").execute(emoji.name, message.guild.member(user), message, "remove");
    }
    
})
//count members


client.login(process.env.token);