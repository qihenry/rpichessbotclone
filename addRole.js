module.exports = {
	name: 'RoleReact',
	description: 'adds role',
	execute(emoji, member, msg, add) {
        var roleName = "";
        if(emoji === "👶"){
            roleName = "Novice";
        }
        if(emoji === "❤️"){
            roleName = "Chess Lover";
        }
        if(emoji === "⚡"){
            roleName = "Speed Demon";
        }
        if(emoji === "🗑️"){
            roleName = "Trash Talk Master";
        }
        if(emoji === "4️⃣"){
            roleName = "4p Chess";
        }
        if(emoji === "🍏"){
            roleName = "1300+";
        }
        if(emoji === "🍎"){
            roleName = "1500+";           
        }
        if(emoji === "🍐"){
            roleName = "1700+";
        }
        if(emoji === "🍊"){
            roleName = "1900+";           
        }
        if(emoji === "🍋"){
            roleName = "Titled";           
        }
        if(emoji === "🍇"){
            console.log("reacted with a grape")
            roleName = "Tourney Player";
        }
        
        var role = msg.guild.roles.cache.find(r => r.name === roleName);
        if(role == null){
            console.log(roleName + " not found");
        }
        else{
            if(add === "add"){
                member.roles.add(role); 
                console.log(roleName + " has been added");
            }
            if(add === "remove"){
                member.roles.remove(role);
                console.log(roleName + " has been removed");               
            }
        }
    },
};