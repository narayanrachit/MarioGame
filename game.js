
let config = {
    type:Phaser.AUTO,
    
    scale:{
        mode:Phaser.Scale.EXACT_FIT,
        width : 1500,
        height :750,
    },
    
   
    
    physics:{
        default:'arcade',
        arcade :{
            gravity:{
                y:1000, 
            },
            debug:false,
        }
    },
    
    scene : {
     preload:preload,
     create : create,
     update : update,
    }
};

var score = 0;
var scoreText;

let game = new Phaser.Game(config);

let player_config = {
    player_speed : 200,
    player_jumpspeed : -800,
}


function preload(){
    
   
    this.load.image("ground","topground.png");
    this.load.image("sky","1937.jpg");
    this.load.spritesheet("dude","dude.png",{frameWidth:32,frameHeight:48});
    this.load.image("coin", "coin.png");
    this.load.image("ray","ray.png");
    this.load.image("carL", "carL.png")
    this.load.image("carR", "carR.png")
    
}



function create(){
    
    W = game.config.width;
    H = game.config.height;
    
    //add tilesprites
    let ground = this.add.tileSprite(0,H-128,W,128,'ground');
    ground.setOrigin(0,0);
    
    //try to create a background
    let background = this.add.sprite(0,0,'sky');
    background.setOrigin(0,0);
    background.displayWidth = W;
    background.displayHeight = H;
    background.depth = -2;
    
    //create rays on the top of the background
    let rays = [];
    
    for(let i=-10;i<=10;i++){
        let ray = this.add.sprite(W/2,H-100,'ray');
        ray.displayHeight = 1.5*H;
        ray.setOrigin(0.5,1);
        ray.alpha = 0.2;
        ray.angle = i*20;
        ray.depth = -1;
        rays.push(ray);
    }
    console.log(rays);
    
    //tween
    this.tweens.add({
        targets: rays,
        props:{
            angle:{
                value : "+=20"
            },
        },
        duration : 8000,
        repeat : -1
    });
    
    
    
    
    this.player = this.physics.add.sprite(100,100,'dude',4);
    this.player.setScale(2,2);
    console.log(this.player);
    
    
    
    //set the bounce values
    this.player.setBounce(0.5);
    this.player.setCollideWorldBounds(true);
    //player animations and player movements
    
    this.anims.create({
        key : 'left',
        frames: this.anims.generateFrameNumbers('dude',{start:0,end:3}),
        frameRate : 10,
        repeat : -1
    });
    this.anims.create({
        key : 'center',
        frames: [{key:'dude',frame:4}],
        frameRate : 10,
    });
    this.anims.create({
        key : 'right',
        frames: this.anims.generateFrameNumbers('dude',{start:5,end:8}),
        frameRate : 10,
        repeat : -1
    });
    
    
    // keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    
    
    //create coins
    let coins = this.physics.add.staticGroup();
    coins.create(700,300,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(40,90,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(40,400,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(550,500,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(550,100,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(450,270,'coin').setScale(0.07,0.07).refreshBody();
     coins.create(850,70,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(950,425,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(1400,70,'coin').setScale(0.07,0.07).refreshBody();
    coins.create(1400,500,'coin').setScale(0.07,0.07).refreshBody();
    
    
    
    
    //create more platforms
    let platforms = this.physics.add.staticGroup();
    platforms.create(500,400,'ground').setScale(0.3,0.3).refreshBody();
    platforms.create(850,150,'ground').setScale(0.3,0.3).refreshBody();
    platforms.create(100,250,'ground').setScale(0.3,0.3).refreshBody();
     platforms.create(980,490,'ground').setScale(0.3,0.3).refreshBody();
    platforms.create(1320,300,'ground').setScale(0.3,0.3).refreshBody();
    platforms.create(100,570,'carL').setScale(0.7,0.7).refreshBody();
    platforms.create(1395,570,'carR').setScale(0.3,0.4).refreshBody();
    
    platforms.add(ground);
    
    this.physics.add.existing(ground,true);

    
    
    //add a collision detection between player and ground
    this.physics.add.collider(platforms,this.player);

    this.physics.add.overlap(this.player,coins,takeCoin,null,this);
    
    
    //create cameras
    this.cameras.main.setBounds(0,0,W,H);
    this.physics.world.setBounds(0,0,W,H);
    
    this.cameras.main.startFollow(this.player,true,true);
    this.cameras.main.setZoom(1.5);
    
    scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
    //scoreText.fixedToCamera = true;
    scoreText.setScrollFactor(1);
    //scoreText .cameraOffset.setTo(16, 16);
    
}

function update(){
    
    if(this.cursors.left.isDown){
        this.player.setVelocityX(-player_config.player_speed);
        this.player.anims.play('left',true);
    }
    else if(this.cursors.right.isDown){
        this.player.setVelocityX(player_config.player_speed);
        this.player.anims.play('right',true);
    }
    else{
        this.player.setVelocityX(0);
        this.player.anims.play('center');
    }
    
    //add jumping ability , stop the player when in air
    if(this.cursors.up.isDown && this.player.body.touching.down){
        this.player.setVelocityY(player_config.player_jumpspeed);
    }
    
}

function takeCoin(player,coins){
    coins.disableBody(true,true);
    
    score += 10;
    scoreText.setText('Score: ' + score);
}
