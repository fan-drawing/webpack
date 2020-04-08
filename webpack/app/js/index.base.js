import "bootstrap"
// import "bootstrapJS"
// import * as PIXI from 'pixi.js'
import "../css/main.css"
import "../css/sprite.css"
require("jquery");

const ratio = window.devicePixelRatio||2;

// Create a new application
const app = new PIXI.Application({
    width:620*ratio,
    height:516*ratio,
    antialias:true,
    resizeTo:window,
    // backgroundColor:0xffffff,
    transparent:true //背景是否设定为透明
});
let appState = app.stage;
let renderer = app.renderer;
window.onresize = function(){   
    app.view.style.width  = window.innerWidth+'px';
    app.view.style.height  = window.innerHeight+'px';
    BGIMG.width = window.innerWidth;
    BGIMG.height = window.innerHeight;
}



const containerBase = new PIXI.Container();
const TextureCache = PIXI.utils.TextureCache;
const container = new PIXI.Container();
const loader = new PIXI.Loader(); 
window.bunny = null;
window.onkeydown=function(){
    // 上38  下40 左37 右39
    // 　console.log(event.keyCode)
    let width = app.view.width;
    let height = app.view.height;
    switch(event.keyCode){
        case 38:
            if(window.bunny.y<49*ratio){window.bunny.y=0;}else{window.bunny.y -=100*ratio;}
            break; 
        case 40:
            if(window.bunny.y>(height-200)*ratio){window.bunny.y=(height-100)*ratio;}else{window.bunny.y +=100*ratio;}  break;
        case 37:
            if(window.bunny.x<49*ratio){window.bunny.x = 0;}else{window.bunny.x -=100*ratio;}  break;
        case 39:
            if(window.bunny.x>(width-200)*ratio){window.bunny.x = (width-100)*ratio;}else{window.bunny.x +=100*ratio;} break;
        default:
            break; 
    }
}
  
var BGIMG = null; // 背景图走　　
loader.add('backgroundImg', require("../img/2752941944-5bfbec34a33cd_articlex.png") )
      .add('text', require("../img/sprite.png") );  //2752941944-5bfbec34a33cd_articlex.png
loader.load((loader, resources) => {
    BGIMG = new PIXI.TilingSprite(TextureCache["backgroundImg"],app.view.width,app.view.height);
    containerBase.addChild(BGIMG);

    PIXI.Texture.removeFromCache("./img/sprite.png")

    
    const texture = TextureCache["text"];
    window.bunny = bunnySet(texture,new PIXI.Rectangle(0, 0, 100*ratio, 100*ratio),0, 0);
    
    bunnySet(texture,new PIXI.Rectangle(0, 104*ratio, 100*ratio, 100*ratio),0,104*ratio);
    
    // bunnySet(texture,new PIXI.Rectangle(0, 208*ratio, 100*ratio, 100*ratio),0,208*ratio);
    // bunnySet(texture,new PIXI.Rectangle(0, 312*ratio, 100*ratio, 100*ratio),0,312*ratio);
    // bunnySet(texture,new PIXI.Rectangle(0, 416*ratio, 100*ratio, 100*ratio),0,416*ratio);
    // bunnySet(texture,new PIXI.Rectangle(104*ratio, 0, 100*ratio, 100*ratio),104*ratio, 0);
    // bunnySet(texture,new PIXI.Rectangle(104*ratio, 104*ratio, 100*ratio, 100*ratio),104*ratio,104*ratio);
    // bunnySet(texture,new PIXI.Rectangle(104*ratio, 208*ratio, 100*ratio, 100*ratio),104*ratio,208*ratio);
    // bunnySet(texture,new PIXI.Rectangle(104*ratio, 312*ratio, 100*ratio, 100*ratio),104*ratio,312*ratio);
    // bunnySet(texture,new PIXI.Rectangle(104*ratio, 416*ratio, 100*ratio, 100*ratio),104*ratio,416*ratio);
    
    // bunnySet(texture,new PIXI.Rectangle(208*ratio, 0, 100*ratio, 100*ratio),208*ratio, 0);
    // bunnySet(texture,new PIXI.Rectangle(208*ratio, 104*ratio, 100*ratio, 100*ratio),208*ratio,104*ratio);
    // bunnySet(texture,new PIXI.Rectangle(208*ratio, 208*ratio, 100*ratio, 100*ratio),208*ratio,208*ratio);
    // bunnySet(texture,new PIXI.Rectangle(208*ratio, 312*ratio, 100*ratio, 100*ratio),208*ratio,312*ratio);
    // bunnySet(texture,new PIXI.Rectangle(208*ratio, 416*ratio, 100*ratio, 100*ratio),208*ratio,416*ratio);

    // bunnySet(texture,new PIXI.Rectangle(312*ratio, 0, 100*ratio, 100*ratio),312*ratio, 0);
    // bunnySet(texture,new PIXI.Rectangle(312*ratio, 104*ratio, 100*ratio, 100*ratio),312*ratio,104*ratio);
    // bunnySet(texture,new PIXI.Rectangle(312*ratio, 208*ratio, 100*ratio, 100*ratio),312*ratio,208*ratio);
    // bunnySet(texture,new PIXI.Rectangle(312*ratio, 312*ratio, 100*ratio, 100*ratio),312*ratio,312*ratio);
    // bunnySet(texture,new PIXI.Rectangle(312*ratio, 416*ratio, 100*ratio, 100*ratio),312*ratio,416*ratio);
    gameLoop();
    return false;
});

loader.onProgress.add((that) => {console.log(that)}); 
appState.addChild(containerBase);
appState.addChild(container);
const zhuantex = PIXI.Texture.from(require("../img/227b199eada0a2e15343f5faf8ae4115.jpg") );
const rect = new PIXI.Graphics()
    // .beginFill(0x000000)
    .beginTextureFill(zhuantex)
    .drawCircle(20*ratio, 20*ratio, 20*ratio)
    // .drawEllipse(x,y,width,height);
    // .drawRect(20*ratio, 20*ratio, 50*ratio, 50*ratio);
rect.buttonMode = true;
rect.interactive = true;
container.zIndex = 1;
rect.x = 0;
rect.y = 0;
// rect.angle  = 10;
// rect.cacheAsBitmap = true;
rect.alpha = 1;

rect.on("mouseover",function(data){
    alert("rect");
    event.preventDefault();
})
const rectBlur = new PIXI.Graphics()
    .beginFill(0x000000)
    .drawRect(20*ratio, 100*ratio, 50*ratio, 50*ratio); 
const texture = PIXI.Texture.from(require("../img/2752941944-5bfbec34a33cd_articlex.png") );

// PIXI.Texture.addToCache(texture,'00001');

console.log(TextureCache)

function bunnySet(texture,rectangle,x,y){
    //Tell the texture to use that rectangular section
    // let pifu = texture;
    var t = TextureCache["text"].clone();
    t.frame = rectangle;
    let bunny = new PIXI.Sprite(t);
    Object.assign(bunny,{x:x,y:y,width:100*ratio,height:100*ratio,interactive:true})

    bunny.pointerdown=function(data){
        // event.stopped = true;
        // data.target.x+=10*ratio;
        containerBase.removeChild(bunny);
        event.preventDefault();
        // alert("bunny");
        // console.log(data.target)
    }    
    containerBase.addChild(bunny);

    return bunny;
}



const fragment = `
    varying vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void)
    {
        gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

let state = play;
function gameLoop() {
    // 循环调用gameLoop
    requestAnimationFrame(gameLoop);
    // 更新当前的游戏状态
    state();
    // 渲染舞台
    // renderer.render({});
}

//使精灵移动的函数
function play() {
    BGIMG.tilePosition.x -= 1;
}

document.getElementById("demo").appendChild(app.view);