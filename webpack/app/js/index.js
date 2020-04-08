import "bootstrap"
// import "bootstrapJS"
// import * as PIXI from 'pixi.js'
import "../css/main.css"
import "../css/sprite.css"
require("jquery");
const moduleName = require('./module').default

console.log(moduleName)

const ratio = window.devicePixelRatio||2;

let renderer = PIXI.autoDetectRenderer(
  { 
      width:200,
      height:200,
      backgroundColor: 0x999999, 
      antialias: false, 
      transparent: false,
      resolution: 1
  }
);
const loader = new PIXI.Loader(); 
var container = new PIXI.Container();
loader.add('backgroundImg', require("../img/2752941944-5bfbec34a33cd_articlex.png")).load((loader, resources)=>{
    console.log(resources['backgroundImg'].texture)
    let BGIMG = new PIXI.TilingSprite(resources['backgroundImg'].texture);
    container.addChild(BGIMG);   
    gameLoop();
});

document.getElementById("demo").appendChild(renderer.view);


function gameLoop() {
    // 循环调用gameLoop
    requestAnimationFrame(gameLoop);
    // 更新当前的游戏状态
    // 渲染舞台
    renderer.render(container); 
}


