
var board=new Array();
var score=0;
var hasConflicted=new Array();

$(document).ready(function (){
	newgame();
});

function newgame(){
	initial();
	generateOneNumber();
	generateOneNumber();
}

function initial(){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			var gridCell=$('#grid-cell-'+i+'-'+j);
			gridCell.css('top',getPosTop(i,j));
			gridCell.css('left',getPosLeft(i,j));
		}
	}
	for(var i=0;i<4;i++){
		board[i]=new Array();
		hasConflicted[i]=new Array();
		for(var j=0;j<4;j++){
			board[i][j]=0;
			hasConflicted[i][j]=false;
		}
	}
	updateBoardView();
	score=0;
}

function generateOneNumber(){
	if(nospace(board))return false;

	//随机一个位置
	var randx=parseInt(Math.floor(Math.random()*4));
	var randy=parseInt(Math.floor(Math.random()*4));

	var times=0;
	while(times<50){
		if(board[randx][randy]==0)break;

		randx=parseInt(Math.floor(Math.random()*4));
		randy=parseInt(Math.floor(Math.random()*4));
		times++;
	}
	if(times==50){
		for(var i=0;i<4;i++){
			for(var j=0;j<4;j++){
				if(board[i][j]==0){
					randx=i;
					randy=j;
				}
			}
		}
	}
	//随机一个数字
	var randNumber=Math.random()<0.5?2:4;
	board[randx][randy]=randNumber;
	showUnmberWithAnimation(randx,randy,randNumber);
	return true;
}

function updateBoardView(){
	//一刷新或是重新开始游戏就清除之前的数据
	$('.number-cell').remove();
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			$("#grid-container").append( '<div class="number-cell" id="number-cell-'+i+'-'+j+'"></div>' );
			var theNumberCell=$('#number-cell-'+i+'-'+j);
			if(board[i][j]==0){	
				theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
				theNumberCell.css('top',getPosTop(i,j)+50);
				theNumberCell.css('left',getPosLeft(i,j)+50);				
			}else{
				theNumberCell.css('width','100px');
				theNumberCell.css('height','100px');
				theNumberCell.css('top',getPosTop(i,j));
				theNumberCell.css('left',getPosLeft(i,j));
				theNumberCell.css('background-color',getBackgroundColor(board[i][j]));
				theNumberCell.css('color',getColor(board[i][j]));
				theNumberCell.text(board[i][j]);
			}
			hasConflicted[i][j]=false;
		}
	}
}

function getPosTop(i,j){
	return 20+120*i;
}

function getPosLeft(i,j){
	return 20+120*j;
}

function getBackgroundColor(num){
	switch(num){
        case 2:return "#eee4da";break;
        case 4:return "#ede0c8";break;
        case 8:return "#f2b179";break;
        case 16:return "#f59563";break;
        case 32:return "#f67c5f";break;
        case 64:return "#f65e3b";break;
        case 128:return "#edcf72";break;
        case 256:return "#edcc61";break;
        case 512:return "#9c0";break;
        case 1024:return "#33b5e5";break;
        case 2048:return "#09c";break;
        case 4096:return "#a6c";break;
        case 8192:return "#93c";break;
    }
    return "black";
}

function getColor(num){
	if(num<=4)return "#776e65";
    return "white";
}

function nospace(board){
	for(var i=0;i<4;i++){
		for(var j=0;j<4;j++){
			if(board[i][j]==0)return false;
		}
	}
	return true;
}

function showUnmberWithAnimation(i,j,randNumber){
	var numberCell=$('#number-cell-'+i+'-'+j);
	numberCell.css('background-color',getBackgroundColor(randNumber));
	numberCell.css('color',getColor(randNumber));
	numberCell.text(randNumber);
	numberCell.animate({
		width:'100px',
		height:'100px',
		top:getPosTop(i,j),
		left:getPosLeft(i,j)
	},50);
}

$(document).keydown(function (event){
	switch(event.keyCode){
		case 37://left
			if(moveLeft()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		case 38://up
			if(moveUp()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		case 39://right
			if(moveRight()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		case 40://down
			if(moveDown()){
				setTimeout('generateOneNumber()',210);
				setTimeout('isgameover()',300);
			}
			break;
		default:
			break;
	}
});

function isgameover(){
	if(nospace(board)&&nomove(board)){
		gameover();
	}
}

function nomove(board){
	if(canMoveLeft||canMoveRight||canMoveUp||canMoveDown)return false;
	 return true;
}

function gameover(){
	alert('gameover!');
}

function moveLeft(){
	if(!canMoveLeft(board))return false;

	//moveleft
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				for(var k=0;k<j;k++){
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//add
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}

function canMoveLeft(board){
	for(var i=0;i<4;i++){
		for(var j=1;j<4;j++){
			if(board[i][j]!=0){
				if(board[i][j-1]==0||board[i][j-1]==board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function moveRight(){
	if(!canMoveRight(board))return false;

	//moveright
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				for(var k=3;k>j;k--){
					if(board[i][k]==0&&noBlockHorizontal(i,k,j,board)){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[i][k]==board[i][j]&&noBlockHorizontal(i,k,j,board)&&!hasConflicted[i][k]){
						//move
						showMoveAnimation(i,j,i,k);
						board[i][k]+=board[i][j];
						board[i][j]=0;
						//add
						score+=board[i][k];
						updateScore(score);
						hasConflicted[i][k]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}

function canMoveRight(board){
	for(var i=0;i<4;i++){
		for(var j=2;j>=0;j--){
			if(board[i][j]!=0){
				if(board[i][j+1]==0||board[i][j+1]==board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function moveUp(){
	if(!canMoveUp(board))return false;

	//moveup
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]!=0){
				for(var k=0;k<i;k++){
					if(board[k][j]==0&&noBlockVertical(j,k,i,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(j,k,i,board)&&!hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						//add
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}

function canMoveUp(board){
	for(var j=0;j<4;j++){
		for(var i=1;i<4;i++){
			if(board[i][j]!=0){
				if(board[i-1][j]==0||board[i-1][j]==board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function moveDown(){
	if(!canMoveDown(board))return false;

	//moveup
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				for(var k=3;k>i;k--){
					if(board[k][j]==0&&noBlockVertical(j,i,k,board)){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]=board[i][j];
						board[i][j]=0;
						continue;
					}else if(board[k][j]==board[i][j]&&noBlockVertical(j,i,k,board)&&!hasConflicted[k][j]){
						//move
						showMoveAnimation(i,j,k,j);
						board[k][j]+=board[i][j];
						board[i][j]=0;
						//add
						score+=board[k][j];
						updateScore(score);
						hasConflicted[k][j]=true;
						continue;
					}
				}
			}
		}
	}
	setTimeout('updateBoardView()',200);
	return true;
}

function canMoveDown(board){
	for(var j=0;j<4;j++){
		for(var i=2;i>=0;i--){
			if(board[i][j]!=0){
				if(board[i+1][j]==0||board[i+1][j]==board[i][j]){
					return true;
				}
			}
		}
	}
	return false;
}

function noBlockHorizontal(row,col1,col2,board){
	for(var i=col1+1;i<col2;i++){
		if(board[row][i]!=0)return false;
	}
	return true;
}

function noBlockVertical(col,row1,row2,board){
	for(var i=row1+1;i<row2;i++){
		if(board[i][col]!=0)return false;
	}
	return true;
}

function showMoveAnimation(fromx,fromy,tox,toy){
	var numberCell=$('#number-cell-'+fromx+'-'+fromy);
	numberCell.animate({
		top:getPosTop(tox,toy),
		left:getPosLeft(tox,toy)
	},200);
}

function updateScore(score){
	$('#score').text(score);
}