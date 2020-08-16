module.exports = {
	name: 'move',
	description: 'move the board',
	execute(msg, Currentgames, move) {
        //finds out which game it is
        let game = -1;
        for(let i = 0; i < Currentgames.length; i++){
            if(Currentgames[i].turn == "White" && Currentgames[i].White == msg.author.username){
                game = i;
                break;
            }
            if(Currentgames[i].turn == "Black" && Currentgames[i].Black == msg.author.username){
                game = i;
                break;
            }
        }
        if(game == -1){
            msg.reply("you're not in a game or its not your turn");
            return;
        }
        //Attempt to make a move
        if(!Currentgames[game].makeMove(move)){
            return;
        };
        msg.channel.send('http://www.fen-to-image.com/image/' + Currentgames[0].getFEN());
        msg.reply("It is " + Currentgames[0].turn);
    },
}