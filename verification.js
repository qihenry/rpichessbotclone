
module.exports = {
	name: 'verification',
    description: 'actual verification part. If the user reacts with the green checkmark,' +  
                 'then the bot will give it a role that will grant access to the server.'+
                 'It does this by checking if the emoji matched and then using find of' +
                 'the role cache to check if the role is present. If it is give the' +
                 'role to the reactor',
	execute(message,user) {
        console.log("that worked");
        let roleName = "member";
        let role = message.guild.roles.cache.find(r => r.name === roleName);
        if(role == null){
            console.log(roleName + " not found");
        }
        else{
            console.log(role.name);
            user.roles.add(role);
            console.log(roleName + " has been added");
        }
    },
};