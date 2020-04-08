import "bootstrap"
// import "bootstrapJS"
import * as PIXI from 'pixi.js'
import "../css/main.css"
import "../css/sprite.css"
require("jquery");


// function draw(){
//     var i = 0;
//     var size = 600;
//     var canvas = document.getElementById('tutorial');
//     if(!canvas.getContext) return;
//     canvas.height = size * window.devicePixelRatio;
//     canvas.width = size * window.devicePixelRatio;
//     var ctx = canvas.getContext("2d");
//     canvas.style.width = 300 + "px";
//     canvas.style.height = 300 + "px";
//     ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
//     var g = 9;
//     var imgObj = new Image();
//     imgObj.src = require("../img/c7f1898818d34df2b6fd3cb3f04e53d4.jpeg").default;
//     var imgW = '';
//     var imgH = '';
    
//     imgObj.onload = function() {
//         imgW = imgObj.width;
//         imgH = imgObj.height;
//     }


//     setInterval(()=>{
//         i++;
//         ctx.clearRect(0,0,size,size);
//         let h = imgH*size/imgW;
//         ctx.drawImage(imgObj,0,(size-h)/2,size,h)
//         // ctx.clearRect(0,0,300,300);
//         var indexColor = i%2;
//         for(let item = 0;item<g*g;item++){
//             if(item%2===indexColor){
//                 drawRanctangle(ctx,{x:(size/g)*(item%g), y:(size/g)*Math.floor(item/g),w:(size/g),h:(size/g)},"rgba(0, 0, 0, 0.5)");
//             }
//         }  
        
//         ctx.beginPath();
//         ctx.fillStyle="rgba(0,0,0,0.1)";
//         ctx.arc(size/2,size/2,size/2, 0, Math.PI * 2);
//         ctx.closePath();
//         ctx.fill();
//         ctx.clip();
        
//     },1000);
    
// }

// function drawRanctangle(ctx,points,color){
//     ctx.fillStyle = color;
//     ctx.fillRect (points.x, points.y, points.w, points.h);
// }
// draw();

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

PIXI.utils.sayHello(type)



const app = new PIXI.Application({
    width: 375,
    height: 667,
    backgroundColor: 0x1099bb,
    view: document.querySelector('#scene')
});
  
const texture = PIXI.Texture.from(require("../img/2752941944-5bfbec34a33cd_articlex.png").default);

function setPoint(index){
    const bunny = new PIXI.Sprite(texture);
    bunny.anchor.set(0);
    bunny.x = 64*index
    bunny.y = 100*index
    bunny.width = 32
    bunny.height = 32
    console.log(bunny)
    app.stage.addChild(bunny);
    var move = false;
    index = Math.random()*10;
    app.ticker.add(() => {
        var bit = move?1:-1;
        if(bunny.x<0&&bit==-1){
            move = true;
        }

        if(bunny.x>(375-32)&&bit==1){
            move = false;
        }
        
        bunny.x +=1*bit*index;
        
    });
}

setPoint(1)
setPoint(2)
setPoint(3)
setPoint(4)
setPoint(5)
setPoint(6)