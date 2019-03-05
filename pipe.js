function Pipe(){
	this.spacing = 125;
	this.top = random(height /6, 6/10*height);
	this.bottom = height-(this.top+this.spacing);
	this.x = width;
	this.w = 50;
	this.isCrossed = false;
	this.speed = 6;


	this.hits = function(bird){
		if(bird.y <= this.top + 10 || bird.y >= height- this.bottom - 10){
			if(bird.x >= this.x && bird.x <= this.x + this.w){
				return true;
			}
		}
		this.highlight = false;
		return false;
	}


	this.show = function(pipeUp, pipeDown){
		let downHeight = this.top - 320;
		let upHeight = 480 - this.bottom;
		image(pipeDown, this.x, downHeight, 50, 320);
		image(pipeUp, this.x, upHeight, 50, 320);
	}

	this.update = function(){
		this.x -= this.speed;
	}

	this.offscreen = function(){
		if(this.x < -this.w){
			return true;
		}
		else{
			return false;
		}
	}
}
