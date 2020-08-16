/*const Discord = require("discord.js");
const move = require("./move");*/

module.exports = {
    name: 'createGame',
    description: 'create a chess game',
	execute(msg, msgContent, Currentgames) {
        msg.reply(msg.author.username + " created a game");
        var chessGame = {
            White    : msg.author.username,
            Black    : "",
            result   : "",
            turn     :"White",
            whitePieces : ['R','N','B','Q','K','P'],
            blackPieces : ['r','n','b','q','k','p'],
            promotionPieces : ['r', 'n', 'b', 'q'],
            kingMoved : false,
            rookMoved : [], //Array that puts the rook from the 4 corners when it moves
            W_oo  : true,
            W_ooo : true,
            B_oo  : true,
            B_ooo : true,
            //NOTE: EVERYTHING IS WRONG, THE ROWS AND COLUMNS DONT MATCH THE CHESS BOARD. EXAMPLE [1][2] is c7
            //ALSO: I IS THE ROW AND J IS THE COLUMN
            position : [ ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],   //8
                         ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],   //7
                         ['1', '1', '1', '1', '1', '1', '1', '1'],   //6
                         ['1', '1', '1', '1', '1', '1', '1', '1'],   //5
                         ['1', '1', '1', '1', '1', '1', '1', '1'],   //4
                         ['1', '1', '1', '1', '1', '1', '1', '1'],   //3
                         ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],   //2
                         ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'] ], //1
                         //A    B    C    D    E    F    G    H
            
            //Loops through the position to generate a FEN which would be used to display the board
            getFEN   : function() {
                let fen = "";
                for(let i = 0; i < 8; i++){
                    for(let j = 0 ; j < 8; j++){
                        fen = fen + this.position[i][j];
                    }
                    if(i != 7){
                        fen = fen + "/";
                    }
                }
                return fen;
            },
            //Change the turn
            switchTurn : function(){
                if(this.turn === "White"){
                    this.turn = "Black";
                }
                else{
                    this.turn = "White";
                }
            },
            //See if it can capture the piece
            canCapture : function(piece, target){
                //If the piece is a black piece
                if(piece === piece.toLowerCase()){
                    //If the target is white, then capture is true
                    if(this.whitePieces.includes(target)){
                        return true;
                    }
                    //else you can't capture
                    else{
                        return false;
                    }
                }
                //if the piece is a white piece
                else{
                    //if the piece is a black piece, we can take
                    if(this.blackPieces.includes(target)){
                        return true;
                    }
                    //else we can't take
                    else{
                        return false;
                    }
                }
            },
            //Given an notation, find the correlating i and j.
            getPosition : function(position){
                let i = parseInt(position.charAt(1));//i is the row 
                let j;//j is the column
                if(position.charAt(0) == 'a'){
                    j = 0;
                }
                if(position.charAt(0) == 'b'){
                    j = 1;
                }
                if(position.charAt(0) == 'c'){
                    j = 2;
                }
                if(position.charAt(0) == 'd'){
                    j = 3;
                }
                if(position.charAt(0) == 'e'){
                    j = 4; 
                }
                if(position.charAt(0) == 'f'){
                    j = 5;
                }
                if(position.charAt(0) == 'g'){
                    j = 6;
                }
                if(position.charAt(0) == 'h'){
                    j = 7;
                }
                //Since the 1st row is actually the last row, gotta inverse it
                if(i === 8){
                    i = 0;
                }
                else if(i === 1){
                    i = 7;
                }
                else if(i === 2){
                    i = 6;
                }
                else if(i === 3){
                    i = 5;
                }
                else if(i === 4){
                    i = 4;
                }
                else if(i === 5){
                    i = 3;
                }
                else if(i === 6){
                    i = 2;
                }
                else if(i === 7){
                    i = 1;
                }
                return[i,j];
            },
            //sets the position with an FEN
            setPosition : function(FEN){
                let FENposition = 0;
                for(let i = 0; i < 8; i++){
                    for(let j = 0; j < 8; j++){
                        if(FEN.charAt(FENposition) == '/'){
                            FENposition++;
                            j--;
                        }
                        else{
                            this.position[i][j] = FEN.charAt(FENposition);
                            FENposition++; 
                        }
                    }
                }
            },
            //returns the index i and j as notation.
            getNotation : function(i,j){
                let notation = "";
                let newi; 
                if(j === 0){
                    notation = 'a';
                }
                else if(j === 1){
                    notation = 'b';
                }
                else if(j === 2){
                    notation = 'c';
                }
                else if(j === 3){
                    notation = 'd';
                }
                else if(j === 4){
                    notation = 'e';
                }
                else if(j === 5){
                    notation = 'f';
                }
                else if(j === 6){
                    notation = 'g';
                }
                else if(j === 7){
                    notation = 'h';
                }
                //inverse the i because row index mismatch
                if(i === 0){
                    newi = 8;
                }
                else if(i === 1){
                    newi = 7;
                }
                else if(i === 2){
                    newi = 6;
                }
                else if(i === 3){
                    newi = 5;
                }
                else if(i === 4){
                    newi = 4;
                }
                else if(i === 5){
                    newi = 3;
                }
                else if(i === 6){
                    newi = 2;
                }
                else if(i === 7){
                    newi = 1;
                }
                notation = notation + newi;
                return notation;
            },
            //Returns an array that list all the possible places the piece can go.
            //@param: piece = Specifies which colored piece moves.
            //@param: i and j = specifies the index of the position.
            //@param: capture = Boolean, specifies if there's a capture.
            //NOTE: GOT TO PUT TAKE and WHO's MOVE for PARAMETER
            movesForPiece : function(piece, i, j, capture) {
                let moves = [];
                //PAWN
                if(piece.toLowerCase() === 'p'){
                    //If it captures, then it must go sideways
                    if(capture){
                        if(piece === 'p'){
                            if(this.canCapture(piece, this.position[i + 1][j - 1])){
                                moves.push(this.getNotation(i + 1,j - 1));
                            }
                            if(this.canCapture(piece, this.position[i + 1][j + 1])){
                                moves.push(this.getNotation(i + 1,j + 1));
                            }
                            return moves;
                        }
                        if(piece === 'P'){
                            if(this.canCapture(piece, this.position[i - 1][j - 1])){
                                moves.push(this.getNotation(i - 1,j - 1));
                            }
                            if(this.canCapture(piece, this.position[i - 1][j + 1])){
                                moves.push(this.getNotation(i - 1,j + 1));
                            }
                            return moves;
                        }
                    }
                    //If it does not capture, it can only go forward
                    else {
                        if(piece === 'p' && this.position[i + 1][j] == "1"){
                            if(i === 1){
                                moves.push(this.getNotation(i + 1,j));
                                if(this.position[i + 2][j] == "1"){
                                    moves.push(this.getNotation(i + 2,j));
                                }
                            }
                            else{
                                moves.push(this.getNotation(i + 1,j));
                            }
                            return moves;
                        }
                        if(piece === 'P' && this.position[i - 1][j] == "1"){
                            if(i === 6 ){
                                moves.push(this.getNotation(i - 1,j));
                                if(this.position[i - 2][j] == "1"){
                                    moves.push(this.getNotation(i - 2,j));            
                                }
                            }
                            else{
                                moves.push(this.getNotation(i - 1,j));
                            }
                            return moves;
                        }
                    }
                }
                //ROOK
                if(piece.toLowerCase() === 'r'){
                    console.log("Going down the board: ");
                    for(let i2 = i + 1; i2 < 8; i2++){
                        console.log(this.position[i2][j] + " ");
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j])){
                                moves.push(this.getNotation(i2,j));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j] === "1"){
                                moves.push(this.getNotation(i2,j));
                            }
                            else break;
                        }
                    }
                    console.log("\nGoing up the board: ");
                    for(let i2 = i - 1; i2 >= 0; i2--){
                        console.log(this.position[i2][j] + " ");
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j])){
                                moves.push(this.getNotation(i2,j));
                                break;
                            }
                        }
                        else{    
                            if(this.position[i2][j] === "1"){
                                moves.push(this.getNotation(i2,j));
                            }
                            else break;
                        }
                    }
                    console.log("\nGoing left the board: ");
                    for(let j2 = j - 1; j2 >= 0; j2--){
                        console.log(this.position[i][j2] + " ");
                        if(capture){
                            if(this.canCapture(piece,this.position[i][j2])){
                                moves.push(this.getNotation(i,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i][j2] === "1"){
                                moves.push(this.getNotation(i,j2));
                            }
                            else break;
                        }
                    }
                    console.log("\nGoing Right the board: ");
                    for(let j2 = j + 1; j2 < 8; j2++){
                        console.log("hi");
                        console.log(this.position[i][j2] + " ");
                        if(capture){
                            if(this.canCapture(piece,this.position[i][j2])){
                                moves.push(this.getNotation(i,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i][j2] === "1"){
                                moves.push(this.getNotation(i,j2));
                            }
                            else break;
                        }
                    }
                    return moves;
                }
                //KNIGHT
                if(piece.toLowerCase() === 'n'){
                    if(capture){
                        if(i - 2 >= 0 && j - 1 >= 0 && this.canCapture(piece,this.position[i - 2][j - 1])){//out of bounds
                            moves.push(this.getNotation(i - 2,j - 1));
                        }
                        if(i - 2 >= 0 && j + 1 <= 7 && this.canCapture(piece,this.position[i - 2][j + 1])){
                            moves.push(this.getNotation(i - 2,j + 1));
                        }
                        if(i + 2 <= 7 && j - 1 >= 0 && this.canCapture(piece,this.position[i + 2][j - 1])){
                            moves.push(this.getNotation(i + 2,j - 1));
                        }
                        if(i + 2 <= 7 && j + 1 <= 7 && this.canCapture(piece,this.position[i + 2][j + 1])){
                            moves.push(this.getNotation(i + 2,j + 1));
                        }
                        if(i - 1 >= 0 && j - 2 >= 0 && this.canCapture(piece,this.position[i - 1][j - 2])){
                            moves.push(this.getNotation(i - 1,j - 2));
                        }
                        if(i - 1 >= 0 && j + 2 <= 7 && this.canCapture(piece,this.position[i - 1][j + 2])){
                            moves.push(this.getNotation(i - 1,j + 2));
                        }
                        if(i + 1 <= 7 && j + 2 <= 7 && this.canCapture(piece,this.position[i + 1][j + 2])){
                            moves.push(this.getNotation(i + 1,j + 2));
                        }
                        if(i + 1 <= 7 && j - 2 >= 0 && this.canCapture(piece,this.position[i + 1][j - 2])){
                            moves.push(this.getNotation(i + 1,j - 2));
                        }  
                    }
                    else{//gotta make sure the square is empty(king too)
                        if(i - 2 >= 0 && j + 1 <= 7 && this.position[i - 2][j + 1] === '1'){
                            moves.push(this.getNotation(i - 2,j + 1));
                        }
                        if(i - 2 >= 0 && j - 1 >= 0 && this.position[i - 2][j - 1] === '1'){
                            moves.push(this.getNotation(i - 2,j - 1));
                        }
                        if(i + 2 <= 7 && j + 1 <= 7 && this.position[i + 2][j + 1] === '1'){
                            moves.push(this.getNotation(i + 2,j + 1));  
                        }
                        if(i + 2 <= 7 && j - 1 >= 0 && this.position[i + 2][j - 1] === '1'){
                            moves.push(this.getNotation(i + 2,j - 1));
                        }
                        if(i - 1 >= 0 && j + 2 <= 7 && this.position[i - 1][j + 2] === '1'){
                            moves.push(this.getNotation(i - 1,j + 2));
                        }
                        if(i - 1 >= 0 && j - 2 >= 0 && this.position[i - 1][j - 2] === '1'){
                            moves.push(this.getNotation(i - 1,j - 2));
                        }
                        if(i + 1 <= 7 && j - 2 >= 0 && this.position[i + 1][j - 2] === '1'){
                            moves.push(this.getNotation(i + 1,j - 2));
                        }
                        if(i + 1 <= 7 && j + 2 <= 7 && this.position[i + 1][j + 2] === '1'){
                            moves.push(this.getNotation(i + 1,j + 2));
                        }
                    }
                    return moves;
                }
                //BISHOP
                if(piece.toLowerCase() === 'b'){
                    for(let i2 = i + 1, j2 = j + 1; j2 < 8 && i2 < 8; j2++, i2++){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }
                    }
                    for(let i2 = i + 1, j2 = j - 1; j2 >= 0 && i2 < 8; j2--, i2++){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }
                    }
                    for(let i2 = i - 1, j2 = j - 1; j2 >= 0 && i2 >= 0; j2--, i2--){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }
                    }
                    for(let i2 = i - 1, j2 = j + 1; j2 < 8 && i2 >= 0; j2++, i2--){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }   
                    }
                    return moves;
                }
                //QUEEN
                if(piece.toLowerCase() === 'q'){
                    for(let i2 = i + 1, j2 = j + 1; j2 < 8 && i2 < 8; j2++, i2++){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }
                    }
                    for(let i2 = i + 1, j2 = j - 1; j2 >= 0 && i2 < 8; j2--, i2++){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }
                    }
                    for(let i2 = i - 1, j2 = j - 1; j2 >= 0 && i2 >= 0; j2--, i2--){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }
                    }
                    for(let i2 = i - 1, j2 = j + 1; j2 < 8 && i2 >= 0; j2++, i2--){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j2])){
                                moves.push(this.getNotation(i2,j2));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j2] === "1"){
                                moves.push(this.getNotation(i2,j2));
                            }
                            else break;
                        }
                    }
                    for(let i2 = i + 1; i2 < 8; i2++){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j])){
                                moves.push(this.getNotation(i2,j));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j] === "1"){
                                moves.push(this.getNotation(i2,j));
                            }
                            else break;
                        }
                        
                    }
                    for(let i2 = i - 1; i2 >= 0; i2--){
                        if(capture){
                            if(this.canCapture(piece,this.position[i2][j])){
                                moves.push(this.getNotation(i2,j));
                                break;
                            }
                        }
                        else{
                            if(this.position[i2][j] === "1"){
                                moves.push(this.getNotation(i2,j));
                            }
                            else break;
                        }
                    }
                    for(let j2 = j - 1; j2 >= 0; j2--){
                        if(capture){
                            if(this.canCapture(piece,this.position[i][j2])){
                                moves.push(this.getNotation(i,j2));
                                break;
                            }
                        }
                        if(this.position[i][j2] === "1"){
                            moves.push(this.getNotation(i,j2));
                        }
                        else break;
                    }
                    for(let j2 = i + 1; j2 < 8; j2++){
                        if(capture){
                            if(this.canCapture(piece,this.position[i][j2])){
                                moves.push(this.getNotation(i,j2));
                                break;
                            }
                        }
                        if(this.position[i][j2] === "1"){
                            moves.push(this.getNotation(i,j2));
                        }
                        else break;
                    }
                    return moves;
                }
                //KING
                if(piece.toLowerCase() === 'k'){
                    if(i + 1 < 8 && j - 1 >= 0 && this.position[i + 1][j - 1] === '1'){
                        moves.push(this.getNotation(i + 1,j - 1));    
                    }
                    if(i + 1 < 8 && this.position[i + 1][j] === '1'){
                        moves.push(this.getNotation(i + 1,j));    
                    }
                    if(i + 1 < 8 && j + 1 < 8 && this.position[i + 1][j + 1] === '1'){
                        moves.push(this.getNotation(i + 1,j + 1));    
                    }
                    if(j - 1 >= 0 && this.position[i][j - 1] === '1'){
                        moves.push(this.getNotation(i, j - 1));    
                    }
                    if(j + 1 < 8 && this.position[i][j + 1] === '1'){
                        moves.push(this.getNotation(i,j + 1));    
                    }
                    if(i - 1 >= 0 && j - 1 >= 0 && this.position[i - 1][j - 1] === '1'){
                        moves.push(this.getNotation(i - 1,j - 1));
                    }
                    if(i - 1 >= 0 && this.position[i - 1][j] === '1'){
                        moves.push(this.getNotation(i - 1,j));     
                    }
                    if(i - 1 >= 0 && j + 1 < 8 && this.position[i - 1][j + 1] === '1'){
                        moves.push(this.getNotation(i - 1,j + 1));    
                    }   
                }
                return moves;
            },
            //Basically, I have to iterate through the position ot find the piece that
            //is going to move. Then I have to check if it can reach the target square.
            //If it can't, it will continue to iterate to look for the piece that can.
            //*==========================================================================*
            //*NOTE: Case where 2 pieces can go there. Have to rely on specific notation.*
            //*Example N2d3;                                                             *
            //*==========================================================================*
            whichPieceMoves : function(piece, target, capture) {
                let Piece = piece;
                if(this.turn === "Black"){
                    Piece = piece.toLowerCase();
                }
                //iterates through the board to look for the piece that will be moving to the target
                for(let i = 0; i < 8; i++){
                    for(let j = 0; j < 8; j++){
                        if(this.position[i][j] === Piece){
                            let moveList = this.movesForPiece(piece,i,j,capture);
                            if(moveList != null && moveList.includes(target)){
                                return [i,j];
                            }
                        }
                    }
                }
                //returns null if it is not a possible move
                return null;
            },
            makeMove : function(move) { //NOTE: I can check The notation to see if its valid.
                //If there is a capture, gotta change this, it should be looking or an 'x'
                let capture = false;
                let promotion = 0;
                //See if the move captures something
                if(move.includes('x')){
                    capture = true;
                }
                //Which piece moved
                let piece = move.charAt(0);
                //if the first char is lowercase, then it is a pawn
                if(piece === piece.toLowerCase()){
                    piece = 'P';
                }
                //See if the piece is black or white
                if(this.turn === "White"){
                    piece = piece.toUpperCase();
                }
                else{
                    piece = piece.toLowerCase();
                }
                //see if the move is a promotion
                if(move.includes('=')){
                    //If they're not moving the pawn, then it is illegal
                    if(piece.toLowerCase() != 'p'){    
                        msg.reply("illegal move: Can't promote a piece other than the pawn");
                        return false;
                    }
                    promotion = move.slice(-1);//finds out what you're promoting too
                    //If they try to promote to an unknown piece, then it is illegal.
                    if(!this.promotionPieces.includes(promotion.toLowerCase())){
                        msg.reply("illegal move: Can't promote to specified piece");
                        return false;
                    }
                    //Find the color of the promotion piece
                    if(this.turn === "White"){
                        promotion = promotion.toUpperCase();
                    }
                    else{
                        promotion = promotion.toLowerCase();
                    }
                    move = move.slice(0,-2); // get rids of the =Q part.
                    //If it tries to promote not at the back rank, it is illegal.
                    msg.reply(parseInt(move.slice(-1)) + " move is " + move);
                    if(parseInt(move.slice(-1)) != 1 && parseInt(move.slice(-1)) != 8){
                        msg.reply("Promotion only occur at back rank. Illegal move");
                        return false;
                    }
                }
                //What to do at a castle

                
                //Where the piece will move, which will be the last 2 char;
                let target = move.slice(-2);
                //Find out which piece moved to the target square
                let initial = this.whichPieceMoves(piece, target, capture);
                //print debg
                console.log("target: " + target + "\ninitial: " + initial +
                             "\npiece: " + piece + "\ncapture: " + capture + "\npromotion: " +
                             promotion + "\n=================\n ");
                //If it it fails, then the move was probably illegal
                if(initial === null){
                    msg.reply("illegal move");
                    return false;
                }
                //Make a move by changing the position
                let i = initial[0];
                let j = initial[1];
                
                this.position[i][j] = '1';
                let final = this.getPosition(target);
                if(promotion == 0){
                    this.position[final[0]][final[1]] = piece;
                }
                else{
                    console.log("Promoted to: " + promotion + "\n final[0]: " + final[0] + "\n final[1]: " + final[1] + "\ntarger: " + target);
                    this.position[final[0]][final[1]] = promotion;
                }
                //made a move, so now got to switch turns;
                this.switchTurn();
                return true;
            } 
        };
        if(msgContent.length == 2){
            chessGame.setPosition(msgContent[1]);
        }
        msg.channel.send('http://www.fen-to-image.com/image/' + chessGame.getFEN());
        Currentgames.push(chessGame);
    },
}