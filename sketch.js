let bird;
let pipes = [];
let gameOver = false;
let gameStarted = false;
let score = 0;
let numberOfFrames = 0;
let topScores = [];
let name ='';
let isPopupOpen = false;
let isSubmitted = false;
let isGetServiceCalled = false;
let isUpdateServiceCalled = false;
let ref;
let keys = [];
let config = {
	apiKey: "AIzaSyBtEx_Svm_Ylq7KAuLu6oDI46bRtCMVz9g",
	authDomain: "flappy-bird-223716.firebaseapp.com",
	databaseURL: "https://flappy-bird-223716.firebaseio.com",
	projectId: "flappy-bird-223716",
	storageBucket: "flappy-bird-223716.appspot.com",
	messagingSenderId: "1080309426407"
};
firebase.initializeApp(config);
let database = firebase.database();

function preload() {
  bgImg = loadImage('assets/background.png');
  birdImg = loadImage('assets/bird.png');
  pipeUp = loadImage('assets/pipe-green.png');
  pipeDown = loadImage('assets/pipe-green-Copy.png');
}

function setup(){
	createCanvas(640,480);
	numberOfFrames = 0;
	isSubmitted = false;
	isGetServiceCalled = false;
	isUpdateServiceCalled = false;
	bird = new Bird();
	pipes.push(new Pipe());
	document.getElementById("name").value = '';
	ref = database.ref('scores');
	ref.once('value',gotScores, errorScores);
}

function draw(){
	image(bgImg, 0, 0);
	if(gameStarted){
		numberOfFrames++;
		for(let i = pipes.length-1;i>=0;i--){
			pipes[i].show(pipeUp, pipeDown);
			pipes[i].update();
			if(pipes[i].hits(bird)){
				gameOver = true;
			}
			if(pipes[i].offscreen()){
				pipes.splice(i,1);
			}
		}
		if(!gameOver){
			bird.update();
			image(birdImg, bird.x, bird.y, 35, 30);
			if(pipes[0].x < bird.x && !pipes[0].isCrossed){
				score++;
				pipes[0].isCrossed = true;
			}
			textSize(20);
			fill(255);
			text("Score: " + score,450,20);

			if(numberOfFrames % 80 ==0){
				pipes.push(new Pipe());
			}
		}else{
			if(!isGetServiceCalled){
				textSize(30);
				fill(255);
				textAlign(CENTER);
				text("Calculating your score...", 320,225);
			}else{
				pipes =[];
				if(!isSubmitted){
					getName();
				}
				fill(0,0,255);
				displayScoreCard();
			}
		}
	}else{
		textSize(35);
		fill(255);
		textAlign(CENTER);
		text("Flappy Bird Clone", 320, 130);
		textSize(15);
		text("Press 'S' to start the game", 320, 185);
		text("Press space to keep the bird from falling", 320, 225);
	}
}

function gotScores(data){
	topScores = [];
	let scores = data.val() ? data.val() : {};
	keys = Object.keys(scores);
	for(let i =0; i < keys.length; i++){
		let k = keys[i];
		let scoreObject = {
			"key": k,
			"name": scores[k].name,
			"score": scores[k].score
		};
		topScores.push(scoreObject);
	}
	topScores.sort(function(a,b) {return b.score - a.score});
	topScores = topScores.slice(0,5);
	for(let i = 0; i < keys.length; i++){
		let key = keys[i];
		if(topScores.findIndex(obj => obj.key == keys[i]) == -1){
			ref.child(key).remove();
		}
	}
	isGetServiceCalled = true;
}

function getName(){
	if(topScores.length < 5){
		openModal();
	}else{
		topScores.sort(function(a,b) {return b.score - a.score});
		if(topScores[4].score < score){
			openModal();
		}
	}
}

function openModal(){
	isPopupOpen = true;
	$('#overlay').css("display","block");
	$('#popup').css("display","block");
}

function displayScoreCard(){
	textAlign(CENTER);
	textSize(25);
	text("Leaderboard",320,105);
	let yOffSet = 105;
	topScores.forEach(score =>{
		yOffSet += 45;
		textSize(20);
		text(score.name, 160, yOffSet);
		text(score.score, 480, yOffSet);
	});
	yOffSet += 45;
	text("Your dodged " + score + " obstacles", 320, yOffSet);
	textSize(15);
	text("Press 'S' to start again", 320, yOffSet + 45);
}

function errorScores(err){
	console.log(err);
}

function keyPressed(){
	if(key ==' ' && !gameOver){
		bird.up();
	}
	if((key == 'S' || key == 's') && gameOver && !isPopupOpen){
		console.log('Start again');
		score = 0;
		pipes =[];
		setup();
		gameOver = false;
	}
	if((key == 'S' || key == 's')&& !gameStarted){
		gameStarted = true;
	}
}

function submit(){
	isSubmitted = true;
	name = document.getElementById("name").value;
	isPopupOpen = false;
	if(!isUpdateServiceCalled){
		let scoreObject = {
			name: name? name : '-',
			score: score,
		};
		let key = ref.push(scoreObject).key;
		scoreObject['key'] = key;
		topScores.push(scoreObject);
		topScores.sort(function(a,b) {return b.score - a.score});
		topScores = topScores.slice(0,5);
		isUpdateServiceCalled = true;
	}
	$('#popup').css("display","none");
	$('#overlay').css("display","none");
}
