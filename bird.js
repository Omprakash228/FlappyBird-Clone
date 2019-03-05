function Bird(){
	this.y = height/2;
	this.x = 64;
	this.direction = 0;
	this.gravity = 0.56;
	this.lift = -12.2;
	this.velocity = 0;
	
	this.up = function (){
		this.velocity += this.lift;
		this.direction = 1;
	}
	
	this.update = function(){
		this.velocity += this.gravity;
		this.y += this.velocity;
		this.direction = 0;
		if(this.y > height){
			this.y = height;
			this.velocity =0;
		}
		
		if(this.y < 0){
			this.y =0;
			this.velocity = 0;
		}
	}
}
