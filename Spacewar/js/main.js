let div1;
let canv;
let imageRocket;
let imageBlast;
let imageObstacle1 ;
let imageObstacle2;
let imageObstacle3 ;
let imageship1;
let audioFire;
let audioBackground ;
let audioDestroy ;

function init(){
     imageRocket = document.getElementById('rocket');
     imageBlast = document.getElementById('blast');
     imageObstacle1 = document.getElementById('obstacle');
     imageObstacle2 = document.getElementById('obstacle2');
     imageObstacle3 = document.getElementById('obstacle3');
     imageship1=document.getElementById('mothership2');
     audioFire = document.getElementById('gunshot'); 
     audioBackground = document.getElementById('backgroundAudio'); 
     audioDestroy = document.getElementById("destroy");
     
    canv= document.getElementById("myCanvas");
    div1=document.getElementsByClassName("div1");

    div1[0].style.display="none";
    canv.style.display="block";

    if(window.innerHeight > window.innerWidth){
        canv.width = window.innerWidth;
        canv.height = window.innerWidth;
    }else{
        canv.width = window.innerWidth;
        canv.height = window.innerHeight;
    }
    play(canv);
}
//*************************** start the game*******************************************************/
function play(canv){
   let compSize=(canv.height/100)*5;//size for set the height and width of game components for responsive to different devices
//********************************instantiate the game objects******************************************************/
   const context1 = new canvas(canv);
   const rocket1 = new rocket(0,context1.height/2,compSize*3,compSize*1.5,context1,imageRocket);
   const spaceContents1 = new spaceContents(context1);
   const ship1 =[];
   ship1.push(new ship(context1.width,context1.height/2,compSize*4,compSize*3,context1,30,imageship1));
//**************************variables************************************************************/  
   let obstacles = [];
   let ships = [];
   let score = 0;
   let lives = 5;
   let stage=0;
   let btnUpPress=false;
   let btnDownPress=false;
   let btnLeftPress=false;
   let btnRightPress=false;
   let rocketMoveSpeed=10;
   let addObstacles = setInterval(addObstacle,3000);
   let animate = setInterval(animation,150);
   soundBackground();
   
//**********************************event listeners in the game on user actions ****************************************************/
   window.addEventListener("keypress",keyPressHandler);
   window.addEventListener("keydown", keyDownHandler);
   canv.addEventListener("touch", btn_Game_Controller);
   canv.addEventListener("click", btn_Game_Controller);
  //canv.addEventListener("mousemove", moveRocket_with_Mouse);

   window.addEventListener("blur",function(){
      // clearInterval(animate);
      // clearInterval(addObstacles);
       //this.clearInterval(shipMove);
    });
   window.addEventListener("focus",function(){
      // addObstacles = setInterval(addObstacle,3000);
      // animate = setInterval(animation,150);
      
    });
//***********************************add buttons on canvas for game control***************************************************/
   let btnMiddle=new button(compSize,canv.height-compSize*2,compSize,compSize,"","blue","");
   let btnLeft=new button(0,canv.height-compSize*2,compSize,compSize,"","white","");
   let btnRight=new button(compSize*2,canv.height-compSize*2,compSize,compSize,"","white","");
   let btnUp=new button(compSize,canv.height-compSize*3,compSize,compSize,"","white","");
   let btnDown=new button(compSize,canv.height-compSize,compSize,compSize,"","white","");
   let btnFire=new button(canv.width/2,canv.height-compSize,compSize,compSize,"f","white","yellow");
 //************************************move the roket on mouse move event**************************************************/
    function moveRocket_with_Mouse(evt){
        let pos=gameController1.getMousePos(canv, evt);
        rocket1.x=pos.x;
        rocket1.y=pos.y;
    }
//************************************move the roket on mouse move event**************************************************/
    let shipUp;
    let shipDown;        
    let flag=true;
//************************************move ship**************************************************/
    let moveShip=setInterval(function(){
        if(flag){
            shipUp=setInterval(function(){
                ship1[0].moveUp();
            },400);
            clearInterval(shipDown);
            flag=false;
            
        }
        else{
            shipDown= setInterval(function(){
                ship1[0].moveDown();
                ship1[0].addBomb(ship1[0].x-ship1[0].width,ship1[0].y+ship1[0].height/2);
            },400);
            clearInterval(shipUp);
            flag=true;
        }
        
    },8000);
//************************************canv_ButtonController event on controller buttons  to move the rocket with given distance, fire bullet and pause game**************************************************/
    function btn_Game_Controller(event) {
        btnLeft.bgColor=btnLeft===true?"blue":"white";
        btnDown.bgColor=btnLeft===true?"blue":"white";
        btnUp.bgColor=btnLeft===true?"blue":"white";
        btnRight.bgColor=btnLeft===true?"blue":"white";
        btnFire.bgColor=btnLeft===true?"red":"white";

        if(btnDown.isInside(canv,event)){
            rocketMoveSpeed=btnDownPress?rocketMoveSpeed+5:5;
            btnDownPress=true;btnRightPress=btnUpPress=btnLeftPress=false;
            btnDown.bgColor="blue";
        }
        if(btnUp.isInside(canv,event)){
            rocketMoveSpeed=btnUpPress?rocketMoveSpeed+5:5;
            btnUpPress=true;btnRightPress=btnLeftPress=btnDownPress=false;
            btnUp.bgColor="blue";
        }
        if(btnLeft.isInside(canv,event)){
            rocketMoveSpeed=btnLeftPress?rocketMoveSpeed+5:5;
            btnLeftPress=true; btnRightPress=btnUpPress=btnDownPress=false;
            btnLeft.bgColor="blue";
        }
        if(btnRight.isInside(canv,event)){
            rocketMoveSpeed=btnRightPress?rocketMoveSpeed+5:5;
            btnRightPress=true;btnLeftPress=btnUpPress=btnDownPress=false;
            btnRight.bgColor="blue";
        }
        if(btnMiddle.isInside(canv,event)){
            btnRightPress=btnLeftPress=btnUpPress=btnDownPress=false;
        }         
        if(btnFire.isInside(canv,event)){
            soundFiring();
            rocket1.addBullet(rocket1.x,rocket1.y+(rocket1.height/2));
            btnFire.bgColor="red";
        }
    }
//************************************add the obstacles in game with time period **************************************************/
    function addObstacle(){
      function img(){
          switch(parseInt(Math.random()*3)){
          case 0:return imageObstacle1;
          case 1:return imageObstacle2;
          case 2:return imageObstacle3;
          }
      }
      let move=parseInt(Math.random()*20)+10;
      let height=compSize*2;
      let width=compSize*2;
      obstacles.push(new obstacle(context1.width,Math.random()*(context1.height-50)+20,height,width,context1,move,img()));    
    }
//************************************draw game controller butons  **************************************************/
    function draw_Buttons(){
        btnDown.drawButton(context1.context); 
        btnUp.drawButton(context1.context); 
        btnLeft.drawButton(context1.context); 
        btnRight.drawButton(context1.context); 
        btnFire.drawButton(context1.context); 
        btnMiddle.drawButton(context1.context); 
    }
//************************************animate the game**************************************************/
    function animation(){
       context1.context.clearRect(0, 0, context1.width,context1.height);
       spaceContents1.drawStar(20,30);
       spaceContents1.moveStar(10);
       rocket1.drawBullet(20);
       drawObstacles();
       ship1[0].drawBomb(20);
       ship1[0].drawShip();
       rocket1.drawRocket();
       collision();
       moveRocket(rocketMoveSpeed);
       draw_Buttons();   


       //shipPos==="up"?ship1[0].moveDown(30):ship1[0].moveUp(30);
    }
//********************************** keyboard keypress event to move rocket, pause game and fire bullet ****************************************************/
    function keyPressHandler(e){
      if(e.which===117)  rocket1.moveUp(10);
      if(e.which===100)  rocket1.moveDown(10);
      if(e.which===114)  rocket1.moveRight(10);
      if(e.which===108)  rocket1.moveLeft(10);
      if(e.which===32){ 
          soundFiring(); rocket1.addBullet(rocket1.x,rocket1.y+(rocket1.height/2));
      }
      if(e.which===48) {
            clearInterval(animate);
            clearInterval(addObstacles);
      }
      if(e.which===49) {
            clearInterval(animate);
            clearInterval(addObstacles);
            animate=setInterval(animation,100);
            addObstacles=setInterval(addObstacle,3000);
       }
    }
//************************************move rocket on keyboard keydown event**************************************************/
    function keyDownHandler(e){
        switch (e.key) {
            case "ArrowUp":     rocket1.moveUp(10);     break;
            case "ArrowDown":   rocket1.moveDown(10);   break;
            case "ArrowRight":  rocket1.moveRight(10);  break;
            case "ArrowLeft":   rocket1.moveLeft(10);   break;
        }
    }

//**************************************play sound when rocket fire bullets************************************************/
    function soundFiring(){
        audioFire.currentTime = 0;
        audioFire.play();
        audioFire.addEventListener('timeupdate', function (){
            if (audioFire.currentTime >= 0.5) {
                audioFire.pause();
            }
        }, false);
    }   
//***********************************play sound when collision happened ***************************************************/
    function soundDestroy(){
             audioDestroy.currentTime = 0;
             audioDestroy.play();
             audioDestroy.addEventListener('timeupdate', function (){
                 if (audioDestroy.currentTime >=0.5) {
                     audioDestroy.pause();
                     }
            }, false);
    }   
//************************************play game background sound **************************************************/
    function soundBackground(){
            audioBackground.currentTime=5;
            audioBackground.play();
            audioBackground.addEventListener('timeupdate',function(){
                if(audioBackground.currentTime>=10)
                {
                    audioBackground.currentTime=5;
                }
            },false);
    }   
//************************************draw obstacles on canvas**************************************************/
    function drawObstacles(){
        for(let i in obstacles){
            obstacles[i].drawObstacle();
            obstacles[i].moveLeft();
        }
    }
//***************************************draw blast when collision happened ***********************************************/
    function drawBlast(iamge,x,y,width,height){
        context1.context.beginPath();
        context1.context.drawImage(iamge,x,y,width,height);
        context1.context.closePath();
    }
//*******************************check the obstacles are outside the canvas on left side *******************************************************/
    function isObstacle_Clash_leftofWindow(){  
        for(let j in obstacles)   
            if(obstacles[j].x<=(-obstacles[j].width)){
                obstacles.splice(j, 1);
            }
    }
//********************************check  bullet shut to obstacle******************************************************/
    function isBullet_Clash_obstacle(){
        for(let j in obstacles){      
            for(let i in rocket1.bullet){
              if((rocket1.bullet[i].y>=obstacles[j].y&&rocket1.bullet[i].y<=obstacles[j].y+obstacles[j].height)&&rocket1.bullet[i].x+40>=obstacles[j].x && rocket1.bullet[i].x<=obstacles[j].x){
                    soundDestroy();
                    drawBlast(imageBlast, obstacles[j].x+10,obstacles[j].y,obstacles[j].width+20,obstacles[j].height+20);
                    obstacles[j].x=-100;
                    rocket1.bullet[i]=context1.width+10;
                    score+=10;
                }
            }
        }    
    }
//***************************************check  rocket clash with obstacle***********************************************/
    function isRocket_Clash_obstacle(){
        for(let j in obstacles){      
            if((obstacles[j].x-rocket1.width/1.2<=rocket1.x&&obstacles[j].x>=rocket1.x)&&(obstacles[j].y>=rocket1.y-rocket1.height&&obstacles[j].y<=rocket1.y+rocket1.height)){
                obstacles[j].x=-200;
                soundDestroy();
                drawBlast(imageBlast, rocket1.x,rocket1.y-10,rocket1.width+10,rocket1.height+10);
                rocket1.x=0;
                lives-=1;
            }
        }
    }
    //***************************************check  rocket clash with obstacle***********************************************/
    function isRocket_Clash_Bomb(){
        for(let i in ship1[0].bomb){      
           if((ship1[0].bomb[i].y>=rocket1.y&&ship1[0].bomb[i].y<=rocket1.y+rocket1.height)&&ship1[0].bomb[i].x-rocket1.width<=rocket1.x && ship1[0].bomb[i].x>=rocket1.x){
                ship1[0].bomb[i].x=-200;
                soundDestroy();
                drawBlast(imageBlast, rocket1.x,rocket1.y-10,rocket1.width+10,rocket1.height+10);
                rocket1.x=0;
                lives-=1;
            }
        }
    }
    //***********************************monitors the collision in  the game ***************************************************/
    function collision(){  
        isObstacle_Clash_leftofWindow();
        isBullet_Clash_obstacle();
        isRocket_Clash_obstacle();    
        if(lives<=0){
            endGame();
        }
        draw_Score_Lives();
        isRocket_Clash_Bomb();
    }
    //***********************************monitors the collision in  the game ***************************************************/
    function endGame(){
        clearInterval(animate);
        clearInterval(drawObstacles);
        audioBackground.pause();
        alert(`Game over ! Your Score: ${score}`);
        
        canv.style.display="none";
        div1[0].style.display="block";
    }
//**************************************draw the score on canvas************************************************/
    function draw_Score_Lives(){
        context1.context.beginPath(); 
        context1.context.font = compSize+"px Arial";
        context1.context.fillStyle="yellow";
        context1.context.fillText(`Lives: ${lives}     Score: ${score} `,0,compSize,compSize*10,compSize*10);
        context1.context.fill();
        context1.context.closePath(); 
    }
//*************************** canv_ButtonController event to move the rocket with given distance***********************************************************/
    function moveRocket(dist){
        if(btnLeftPress){
            rocket1.moveLeft(dist);
        }
        if(btnRightPress){
            rocket1.moveRight(dist);
        }
        if(btnUpPress){
            rocket1.moveUp(dist);
        }
        if(btnDownPress){
            rocket1.moveDown(dist);
        }
    }
}

