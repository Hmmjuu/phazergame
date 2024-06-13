	//part 1
	//config configures the games base
	var config = {
		//if browser supports webgl-drawing,
		//use it, otherwise use
		//HTML5 canvas drawing tools
		type: Phaser.AUTO,
		//size of gamescreen in pixels
		width: 800,
		height: 600,
		 physics: {
        default: 'arcade',
		//gravity
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
		//preload
		//loads the games files in advance
		//create
		//makes the backgrounds and objects for the game
		//update
		//keeps the game in an active loop while the game is active
		scene: {
			preload: preload,
			create: create,
			update: update
		}
	};
	
	var music ='';
	var ded ='';
	var ding ='';
	var player;
	var stars;
	var bombs;
	var platforms;
	var cursors;
	var score = 0;
	var gameOver = false;
	var scoreText;
	
	var game = new Phaser.Game(config);

	//part 2
	//load the files for game in advance
	function preload ()
	{
		this.load.image('sky', 'assets/winxp2.png');	 //background
        this.load.image('ground', 'assets/WinXP.png'); //platforms
        this.load.image('star', 'assets/file.png');  //points
        this.load.image('bomb', 'assets/windowsxpcrash.png');  //enemies
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });
		this.load.audio('bgmusic', 'assets/re-win.mp3');//background-music
		this.load.audio('dingg','assets/ding-win.mp3');//point-ding
		this.load.audio('deded','assets/ded.mp3');//point-ding
	}


	function create ()
	{
		//picture is placed according to the middle of the screen
		//this.add.image(400, 300, 'sky');
		this.add.image(0, 0, 'sky').setOrigin(0, 0)
		
		//adds physics to platforms
		platforms = this.physics.add.staticGroup();
		//places ground
		platforms.create(400, 1020, 'ground').setScale(2).refreshBody();
		platforms.create(1200, 1020, 'ground').setScale(2).refreshBody();
		platforms.create(1800, 1020, 'ground').setScale(2).refreshBody();
		//places platforms
		platforms.create(600, 400, 'ground');
		platforms.create(1200, 400, 'ground');
		platforms.create(1000, 850, 'ground');
		platforms.create(1700, 850, 'ground');
		platforms.create(300, 850, 'ground');
		platforms.create(600, 700, 'ground');
		platforms.create(1200, 700, 'ground');
		platforms.create(1000, 550, 'ground');
		platforms.create(1700, 550, 'ground');
		platforms.create(300, 550, 'ground');
		platforms.create(1000, 250, 'ground');
		platforms.create(1700, 250, 'ground');
		platforms.create(300, 250, 'ground');
		
		//part 5
		//displays the player and applies physics to the player
		player = this.physics.add.sprite(100, 450, 'dude');

        player.setBounce(0 );
		//applies collision to the player
        player.setCollideWorldBounds(true);

		//part 5
		//anims commands animate the player character
        this.anims.create({
            key: 'left',
			//shows frames 0-3
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
			//set how many frames of the sprtiesheet are shown per second
            frameRate: 10,
			//makes possible to move infintely
            repeat: -1
        });
		
		//"idle"
		//shows frame 4
        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });
		
		//move right
        this.anims.create({
            key: 'right',
			//shows frames 5-8
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
			//set how many frames of the sprtiesheet are shown per second
            frameRate: 10,
			//makes possible to move infintely
            repeat: -1
        });
		//translates keyboard inputs into player character movement
		cursors = this.input.keyboard.createCursorKeys();
		//part 8
		//physics for stars
		stars = this.physics.add.group({
            key: 'star',
            repeat: 14,
            setXY: { x: 10, y: 0, stepX: 120 }
        });

        stars.children.iterate(function (child) {

		//bounce of stars
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

        });
		
		//physics of bombs
		 bombs = this.physics.add.group();
		//part 9
		//score
		scoreText = this.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
		
		//allows player to collide with platforms
        this.physics.add.collider(player, platforms);
		//allows stars/points to collide with platforms
		this.physics.add.collider(stars, platforms);
		//allows bombs/enemies to collide with platforms
		this.physics.add.collider(bombs, platforms);

		//allows player to collect points
        this.physics.add.overlap(player, stars, collectStar, null, this);
		//allows enemies to hit the player
		this.physics.add.collider(player, bombs, hitBomb, null, this);
		//music
		music = this.sound.add('bgmusic', {loop : true, volume : 0.1});
		
		music.play();
		
		//following cam
		this.physics.world.setBounds(0, 0, 1920, 1080);
		this.cameras.main.setBounds(0, 0, 1920, 1080);
		this.cameras.main.startFollow(player);
		
		
	}//create end

	function update ()
	{	
		//following score
		scoreText.x = this.cameras.main.worldView.x;
		scoreText.y = this.cameras.main.worldView.y;
	
		//part 7
		//applies the velocity of the player character
		 if (cursors.left.isDown)
        {
            player.setVelocityX(-400);

            player.anims.play('left', true);
        }
        else if (cursors.right.isDown)
        {
            player.setVelocityX(400);

            player.anims.play('right', true);
        }
        else
        {
            player.setVelocityX(0);

            player.anims.play('turn');
        }

        if (cursors.up.isDown && player.body.touching.down)
        {
            player.setVelocityY(-400);
        }
	}
		//part 8
		//allows the collected points to add to the "score" counter
	    function collectStar (player, star)
{
    star.disableBody(true, true);
	//part 9
    //  updates the score
    score += 10;
    scoreText.setText('Score: ' + score);
	

    if (stars.countActive(true) === 0)
    {
        // makes new stars to collect
        stars.children.iterate(function (child) {

            child.enableBody(true, child.x, 0, true, true);

        });
		
        var x = (player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

		//controlls the gravity and velocity of the bombs/enemies
        var bomb = bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
        bomb.allowGravity = false;
    }

	ding = this.sound.add('dingg', {loop : false});
		
	ding.play();

}

//part 10
//makes it so that when an enemy hit the player  
function hitBomb (player, bomb)
{
    this.physics.pause();
	//the player turns red
    player.setTint(0xff0000);

    player.anims.play('turn');
	//and gets a game over
    gameOver = true;
	music.stop();
	ded = this.sound.add('deded', {loop : false});
		
	ded.play();
}


