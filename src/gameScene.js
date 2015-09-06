var mapScene = cc.Layer.extend({
    timeTotal: 0,
    progressBar : null,
    progressBarBg : null,
    scoreLabel : 0,
    patternBg : null,

    n_MatrixRow : 6, 
    n_MatrixCol : 6,

    blocksSpr : [], 
    blocksPos : [], 

    blockBatchNode : null,

    blockSelectedSpr : null,

    //current selected block
    previousBlock : null,

    //destroy frames
    destoryFrames : [],

    //Totally number of blocks
    numOfBlocks : 0,

    //Timer tally
    timerTally : 0,

    //Total socre
    gameScore : 0,

    markupMatrix : null,
    
    ctor:function(){
        this._super();
        this.init();
    },
    init:function(){
        var spriteFrameCache = cc.SpriteFrameCache.getInstance();
        spriteFrameCache.addSpriteFrames("res/baseResource.plist","res/baseResource.png");
        cc.spriteFrameCache.addSpriteFrames(res.baseResource_plist);
        winSize = cc.director.getWinSize();


        this.numOfBlocks = this.n_MatrixCol * this.n_MatrixRow;

        

        //Batch node
        this.blockBatchNode = cc.SpriteBatchNode.create('res/baseResource.png', this.n_MatrixRow * this.n_MatrixCol * 2);
        this.addChild(this.blockBatchNode);

        //Init block sprite and block position array
        this.blocksSpr = this.initArray(this.n_MatrixRow, this.n_MatrixCol, null);
        this.blocksPos = this.initArray(this.n_MatrixRow, this.n_MatrixCol, null);

        //Init markup matrix
        this.markupMatrix = this.initArray(this.n_MatrixRow + 2, this.n_MatrixCol + 2, false);


        var halfSpace = 25.0;
        var space = 2*halfSpace;

        var baseX = 160.0 + halfSpace - this.n_MatrixCol*halfSpace;
        var baseY = 240.0 + halfSpace - this.n_MatrixRow*halfSpace;

        //Init a temp matrix
        var tempMatrix = [];
        var tempMatrix_length = this.n_MatrixRow * this.n_MatrixCol;
        for(var i = 0 ; i < tempMatrix_length / 2; i++){
            var randomNumber = 0 | Math.random() * 7;
            tempMatrix[i * 2] = this.baseOne(randomNumber);
            tempMatrix[i * 2 + 1] = this.baseOne(randomNumber);
        }

        var bg = cc.Sprite.create("res/PatternBg.png");
        for(var row = 0 ; row < this.n_MatrixRow ; row ++){
            for(var col = 0 ; col < this.n_MatrixCol ; col ++){
                this.blocksPos[row][col] = cc.p(baseX + col * space, baseY + row * space);
                bg.setPosition(this.blocksPos[row][col]);
                bg.visit();

                //Randomly choose the block in tempMatrix
                var randomNumber = 0 | Math.random() * tempMatrix_length;

                var block = tempMatrix[randomNumber];
                updateMatrix(randomNumber);

                this.addOneBlock(row, col, block);
                this.markupMatrix[row + 1][col + 1] = true;
            }
        }


        //function to update the matrix
        function updateMatrix(index){
            if(index == 0){
                tempMatrix = tempMatrix.slice(1);
            }
            else{
                tempMatrix = tempMatrix.slice(0, index).concat(tempMatrix.slice(index + 1));
            }

            tempMatrix_length --;
        }


    },
    baseOne:function(type){
        var frameName = 'cocos' + ('00' + type).slice(-2) + '.png';
    },

    addOneBlock:function(row, col, block){
        //var randomNumber = 0 | Math.random() * 7;
        //this.blocksSpr[row][col] = new Block(randomNumber);
        this.blocksSpr[row][col] = block;
        this.blocksSpr[row][col].setPosition(this.blocksPos[row][col].x, this.blocksPos[row][col].y);
        this.blocksSpr[row][col].row = row;
        this.blocksSpr[row][col].col = col;
        //this.blocksSpr[row][col].type = randomNumber;
        this.blockBatchNode.addChild(this.blocksSpr[row][col]);
    }, 

    initArray:function(arow, acol, value){
        var arr = [];
        for(var row = 0 ; row < arow ; row ++){
            arr[row] = [];
            for(var col = 0 ; col < acol ; col ++){
                arr[row][col] = value;
            }
        }
        return arr;
    }
})
var gameScene = cc.Scene.extend({
    onEnter:function(){
        this._super();
        this.addChild(new mapScene());
    }
})