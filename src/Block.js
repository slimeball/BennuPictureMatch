var BLOCK_SELECTED = 'BLOCK_SELECTED';
var gNotification = null;
var Block = cc.Sprite.extend({
	destroyed : false,
	type : 0,

	ctor:function(type){
		this._super();
		this.type = type;
		this.init(type);
	},

	init:function(type){
		gNotification = cc.NotificationCenter.getInstance();
		var frameName = 'cocos' + ('00' + type).slice(-2) + '.png';
		this.initWithSpriteFrameName(frameName);
		cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.onTouchBegan.bind(this),
            onTouchMoved: this.onTouchMoved.bind(this)

        }, this);
	},

	containsTouchLocation:function (touch) {
        var getPoint = touch.getLocation();

        var lx = 0 | (getPoint.x -  this.getPosition().x);//this.getPositionX();
        var ly = 0 | (getPoint.y -  this.getPosition().y);//this.getPositionY();
        if(lx>-22.5 && lx<22.5 && ly>-22.5 && ly<22.5)
            return true;
        return false;
    },

	onTouchBegan:function(touch, event){
		//console.log(this.row + ',' + this.col);
		if(this.containsTouchLocation(touch)){
			gNotification.postNotification(BLOCK_SELECTED, this);
			return true;
		}
		return false
	},

	onTouchMoved:function(touch, event){
		return true;
	},

	destroyBlocks:function(frames){
		this.destroyed = true;

		var destroySprite = cc.Sprite.createWithSpriteFrameName('#pattern_destroy_00.png');
		destroySprite.setPosition(22.5, 22.5);
		this.addChild(destroySprite);

		var animation = cc.Animation.create(frames, 0.025);
		destroySprite.runAction(cc.Animate.create(animation));
		var sequence = cc.Sequence.create(cc.FadeOut.create(0.5), cc.CallFunc.create(this.removeSelf, this));
		this.runAction(sequence);
		//清除的音乐
		//cc.audioEngine.playEffect(EFFECT_PATTERN_BOMB);

	},

	removeSelf:function(){
		this.getParent().removeChild(this);
	},

	onEnter:function(){
		// if(sys.platform == 'browser'){
		// 	cc.registerTargetedDelegate(1, true, this);
		// }
		// else{
		// 	cc.registerTargettedDelegate(1, true, this);
		// }
		this._super();
	},

	onExit:function(){
		this._super();
	}
});