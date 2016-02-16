var menuLayer = cc.Layer.extend({
	_bases:null,
	ctor:function(){
		this._super();
		this.init();
	},
	init:function(){
		//globals variable
		var winSize = cc.director.getWinSize();

		//background
		var bgSprite = cc.Sprite.create('res/background.jpg');
		bgSprite.setPosition(cc.p(winSize.width / 2, winSize.height / 2));
		this.addChild(bgSprite);

		//标题logo位置
		var logoSprite = cc.LabelTTF.create('Pic Match', 'Comic Sans MS', 30);
		var cnlogoSprite = cc.LabelTTF.create('看看都是谁', 'Comic Sans MS', 40);
		logoSprite.setPosition(cc.p(winSize.width / 2, winSize.height/2));
		cnlogoSprite.setPosition(cc.p(winSize.width / 2, winSize.height * 2 / 3));
		this.addChild(logoSprite);
		this.addChild(cnlogoSprite);
		//开始按钮
		var startGameButton = cc.MenuItemImage.create('res/btn/btnStartGameNor.png', 'res/btn/btnStartGameDown.png', this.menuCallback, this);
		var menu = cc.Menu.create(startGameButton);
		menu.setPosition(cc.p(winSize.width / 2, winSize.height  / 3));
		this.addChild(menu);

		return true;
	},
	menuCallback : function(){
		//websocket测试
		//cc.director.runScene(new runWebSocketTest());
		cc.director.runScene(new PlayScene());
	}
});

var menuScene = cc.Scene.extend({
	onEnter:function(){
		this._super();

		this.addChild(new menuLayer());
		//pic batch node
		cc.spriteFrameCache.addSpriteFrames(res.baseResource_plist);
        var baseTexture = cc.textureCache.addImage(res.baseResource_png);
        this._bases = new cc.SpriteBatchNode(baseTexture);
        this._bases.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
        this.addChild(this._bases);
	}
})
