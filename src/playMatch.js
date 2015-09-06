var ORIENTATION = {UP:"UP", RIGHT:"RIGHT", DOWN:"DOWN", LEFT:"LEFT"};

function Point(x, y){
	this.x = x;
	this.y = y;
	this.hasUp = false;
	this.hasDown = false;
	this.hasLeft = false;
	this.hasRight = false;
	this.orientation = null;
}

var TestLink = cc.Class.extend({
	previous : null,
	current : null,
	markupMatrix : null, 

	path : [],

	turnNums : 0,

	can : false,

	ctor:function(previous, current, markupMatrix){
		//this._super();
		this.previous = new Point(previous.row + 1, previous.col + 1);
		this.current = new Point(current.row + 1, current.col + 1);
		this.markupMatrix = markupMatrix;
		//cc.log(this.path);
		//this.turnNums = 0;

		console.log('ctor');
		this.turnNums = 0;
		console.log('turnNums: ' + this.turnNums);
		//cc.log(this.path);

		console.log(this.previous.x + ',' + this.previous.y);
		console.log(this.current.x + ',' + this.current.y);
	},

	canLink:function(){

		this.can = false;
		this.tryAllPaths(this.previous);
		return this.can;
	},
	tryAllPaths:function(startPoint){
		cc.log(startPoint.x + ',' + startPoint.y);
		cc.log(this.path);

		if(this.canGoUp(startPoint)){
			this.goUp(startPoint);
		}
		else if(this.canGoRight(startPoint)){
			this.goRight(startPoint);
		}
		else if(this.canGoDown(startPoint)){
			this.goDown(startPoint);
		}
		else if(this.canGoLeft(startPoint)){
			this.goLeft(startPoint);
		}
		else{
			this.moveBack();
		}
	},
	moveBack:function(){

		if(this.path.length == 0){
			cc.log('Stack empty, should end recursion.');
			return;
		}
		else{
			if(this.path.length >= 2){
				if(this.path[this.path.length - 1].orientation != this.path[this.path.length - 2].orientation){
					this.turnNums --;
				}
			}
			this.tryAllPaths(this.path.pop());
		}
		
	},

	canGoUp:function(startPoint){

		if(startPoint.hasUp == true){
			return false;
		}

		var upPoint = new Point(startPoint.x + 1, startPoint.y);
		if(!this.isInRange(upPoint)){
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.UP){
				return false;
			}
		}

		if(this.markupMatrix[upPoint.x][upPoint.y] == true){
			if(upPoint.x == this.current.x && upPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		return true;
	},
	canGoDown:function(startPoint){
		if(startPoint.hasDown == true){
			return false;
		}

		var downPoint = new Point(startPoint.x - 1, startPoint.y);
		if(!this.isInRange(downPoint)){
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length -1].orientation != ORIENTATION.DOWN){
				return false;
			}
		}

		if(this.markupMatrix[downPoint.x][downPoint.y] == true){
			if(downPoint.x == this.current.x && downPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		return true;
	},
	canGoLeft:function(startPoint){
		if(startPoint.hasLeft == true){
			return false;
		}

		var leftPoint = new Point(startPoint.x, startPoint.y - 1);
		if(!this.isInRange(leftPoint)){
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length -1].orientation != ORIENTATION.LEFT){
				return false;
			}
		}

		if(this.markupMatrix[leftPoint.x][leftPoint.y] == true){
			if(leftPoint.x == this.current.x && leftPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		return true;
	},

	canGoRight:function(startPoint){
		if(startPoint.hasRight == true){
			return false;
		}

		var rightPoint = new Point(startPoint.x, startPoint.y + 1);
		if(!this.isInRange(rightPoint)){
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.LEFT){
				return false;
			}
		}

		if(this.markupMatrix[rightPoint.x][rightPoint.y] == true){
			if(rightPoint.x == this.current.x && rightPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		return true;
	},

	goUp:function(startPoint){
		cc.log('go up');
		startPoint.hasUp = true;
		startPoint.orientation = ORIENTATION.UP;

		if(this.path.length > 0){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.UP){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var upPoint = new Point(startPoint.x + 1, startPoint.y);
		upPoint.hasDown = true;
		this.tryAllPaths(upPoint);
	},

	goRight:function(startPoint){
		cc.log('go right');
		startPoint.hasRight = true;
		startPoint.orientation = ORIENTATION.RIGHT;

		if(this.path.length > 0){
			if(this.path[this.path.length -1].orientation != ORIENTATION.RIGHT){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var rightPoint = new Point(startPoint.x, startPoint.y + 1);
		rightPoint.hasLeft = true;
		this.tryAllPaths(rightPoint);
	},

	goDown:function(startPoint){
		cc.log('go down');
		startPoint.hasDown = true;
		startPoint.orientation = ORIENTATION.DOWN;

		if(this.path.length > 0){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.DOWN){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var downPoint = new Point(startPoint.x - 1 , startPoint.y);
		downPoint.hasUp = true;
		this.tryAllPaths(downPoint);

	},

	goLeft:function(startPoint){
		cc.log('go left');
		startPoint.hasLeft = true;
		startPoint.orientation = ORIENTATION.LEFT;

		if(this.path.length > 0){
			if(this.path[this.path.length -1].orientation != ORIENTATION.LEFT){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var leftPoint = new Point(startPoint.x, startPoint.y - 1);
		leftPoint.hasRight = true;
		this.tryAllPaths(leftPoint);
	},

	isInRange:function(point){
		if(point.x >= 0 && point.x < 8 && point.y >= 0 && point.y < 8){
			return true;
		}
		else{
			return false;
		}
	}
})

//Test Class
function Test(previous, current, markupMatrix){
	this.previous = new Point(previous.row + 1, previous.col + 1);
	this.current = new Point(current.row + 1, current.col + 1);
	this.markupMatrix = markupMatrix;
	this.path = [];
	this.turnNums = 0;
}


Test.prototype = {
	canLink:function(){
		this.can = false;
		this.tryAllPaths(this.previous);

		return this.can;
	},

	tryAllPaths:function(startPoint){
		var uuid = getUUID();

		cc.log(startPoint.x + ',' + startPoint.y);

		if(this.canGoUp(startPoint)){
			this.goUp(startPoint);
		}
		else if(this.canGoRight(startPoint)){
			this.goRight(startPoint);
		}
		else if(this.canGoDown(startPoint)){
			this.goDown(startPoint);
		}
		else if(this.canGoLeft(startPoint)){
			this.goLeft(startPoint);
		}
		else{
			this.moveBack(flag, startPoint);
		}

		var flag = false;
		if(startPoint.x == 1 && startPoint.y == 1){
			//cc.log('Now is (1,1)');
			//cc.log(startPoint);
			//cc.log(this.path);
			flag = true;
			//cc.log('tryAllPathEnd.');
		}
		if(this.path.length == 0){
			//return ;
		}
		

		//cc.log('tryAllPaths ' + uuid + ' end.');
		
	},

	moveBack:function(flag, point){
		var uuid = getUUID();
		//cc.log('moveback ' + uuid + ' begin.');

		if(this.path.length == 0){
			cc.log('Stack empty, should end recursion.');
			cc.log('current point:' + point.x + ',' + point.y);
			//cc.log('moveback ' + uuid + ' end.');
			return;
		}
		else{
			if(this.path.length >= 2){
				if(this.path[this.path.length - 1].orientation != this.path[this.path.length - 2].orientation){
					this.turnNums --;
				}
			}
			this.tryAllPaths(this.path.pop());
		}
		
		//cc.log('moveback ' + uuid + ' end.');
	},

	canGoUp:function(startPoint){

		if(startPoint.hasUp == true){
			return false;
		}

		var upPoint = new Point(startPoint.x + 1, startPoint.y);
		if(!this.isInRange(upPoint)){
			return false;
		}

		if(this.markupMatrix[upPoint.x][upPoint.y] == true){
			if(upPoint.x == this.current.x && upPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.UP){
				return false;
			}
		}

		return true;
	},

	canGoDown:function(startPoint){
		if(startPoint.hasDown == true){
			return false;
		}

		var downPoint = new Point(startPoint.x - 1, startPoint.y);
		if(!this.isInRange(downPoint)){
			return false;
		}

		if(this.markupMatrix[downPoint.x][downPoint.y] == true){
			if(downPoint.x == this.current.x && downPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length -1].orientation != ORIENTATION.DOWN){
				return false;
			}
		}

		return true;
	},

	canGoLeft:function(startPoint){
		if(startPoint.hasLeft == true){
			return false;
		}

		var leftPoint = new Point(startPoint.x, startPoint.y - 1);
		if(!this.isInRange(leftPoint)){
			return false;
		}

		if(this.markupMatrix[leftPoint.x][leftPoint.y] == true){
			if(leftPoint.x == this.current.x && leftPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length -1].orientation != ORIENTATION.LEFT){
				return false;
			}
		}

		return true;
	},

	canGoRight:function(startPoint){
		if(startPoint.hasRight == true){
			return false;
		}

		var rightPoint = new Point(startPoint.x, startPoint.y + 1);
		if(!this.isInRange(rightPoint)){
			return false;
		}

		if(this.markupMatrix[rightPoint.x][rightPoint.y] == true){
			if(rightPoint.x == this.current.x && rightPoint.y == this.current.y){
				this.can = true;
			}
			return false;
		}

		if(this.turnNums >= 2){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.LEFT){
				return false;
			}
		}

		return true;
	},

	goUp:function(startPoint){
		cc.log('go up');
		startPoint.hasUp = true;
		startPoint.orientation = ORIENTATION.UP;

		if(this.path.length > 0){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.UP){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var upPoint = new Point(startPoint.x + 1, startPoint.y);
		upPoint.hasDown = true;
		this.tryAllPaths(upPoint);
	},

	goRight:function(startPoint){
		cc.log('go right');
		startPoint.hasRight = true;
		startPoint.orientation = ORIENTATION.RIGHT;

		if(this.path.length > 0){
			if(this.path[this.path.length -1].orientation != ORIENTATION.RIGHT){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var rightPoint = new Point(startPoint.x, startPoint.y + 1);
		rightPoint.hasLeft = true;
		this.tryAllPaths(rightPoint);
	},

	goDown:function(startPoint){
		cc.log('go down');
		startPoint.hasDown = true;
		startPoint.orientation = ORIENTATION.DOWN;

		if(this.path.length > 0){
			if(this.path[this.path.length - 1].orientation != ORIENTATION.DOWN){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var downPoint = new Point(startPoint.x - 1 , startPoint.y);
		downPoint.hasUp = true;
		this.tryAllPaths(downPoint);

	},

	goLeft:function(startPoint){
		cc.log('go left');
		startPoint.hasLeft = true;
		startPoint.orientation = ORIENTATION.LEFT;

		if(this.path.length > 0){
			if(this.path[this.path.length -1].orientation != ORIENTATION.LEFT){
				this.turnNums ++;
			}
		}
		this.path.push(startPoint);

		var leftPoint = new Point(startPoint.x, startPoint.y - 1);
		leftPoint.hasRight = true;
		this.tryAllPaths(leftPoint);
	},

	isInRange:function(point){
		if(point.x >= 0 && point.x < 3 && point.y >= 0 && point.y < 3){
			return true;
		}
		else{
			return false;
		}
	}
}

var block1 = {row : 0, col : 0};
var block2 = {row : 100, col : 100};
var markup = [];
markup[0] = [false, false, false];
markup[1] = [false, false, false];
markup[2] = [false, false, false];

// for(var i = 0 ; i < 3 ; i++){
// 	for(var j = 0 ; j < 3 ; j ++){
// 		markup[i][j] = true;
// 	}
// }

markup[2][1] = false;

markup[block1.row + 1][block1.col + 1] = true;
//markup[block2.row + 1][block.col + 1] = true;
var test = new Test(block1, block2, markup);

//test.tryAllPaths(test.previous);