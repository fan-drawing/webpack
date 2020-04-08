require("../css/main.css")
import SpriteUtilities  from "./SpriteUtilities"
// require("jquery");
//创建一个 Pixi应用 需要的一些参数

let windowOptions = {
    width:window.innerWidth,
    height:window.innerHeight,
    ratio:window.devicePixelRatio||2,
}


let option = {
    resizeTo:window,
    width: windowOptions.width*windowOptions.ratio,
    height: windowOptions.height*windowOptions.ratio,
    backgroundColor:0x999999,
    transparent: false,
}
//创建一个 Pixi应用
let app = new PIXI.Application(option);
app.view.style.width  = windowOptions.width+'px';
app.view.style.height  = windowOptions.height+'px';
//获取舞台
let stage = app.stage;


window.onresize = function(){  
    windowOptions = {
        width:window.innerWidth,
        height:window.innerHeight,
        ratio:window.devicePixelRatio||2,
    } 
    app.view.style.width  = windowOptions.width+'px';
    app.view.style.height  = windowOptions.height+'px';
    
}
//获取渲染器
let renderer = app.renderer;
let playground = document.getElementById('demo');
let loader = new PIXI.Loader();
//把 Pixi 创建的 canvas 添加到页面上
playground.appendChild(renderer.view);

let su = new SpriteUtilities(PIXI);
//需要加载的雪碧图的地址（该图片服务器端已做跨域处理）
let imgURL = require("../img/Iori.png");
//加载图像，加载完成后执行setup函数 
loader.add(imgURL).load(setup);

//创建的精灵，会在多个函数中用到
let Iori;

function setup() {
    //创建纹理数组
    let frames = su.filmstrip(imgURL, 32, 48);
    //使用sprite函数创建精灵
    Iori = su.sprite(frames);
    Iori.vx = 0;
    Iori.vy = 0;
    //设置精灵的位置并将其添加到舞台上
    Iori.position.set(32, 32);
    //添加精灵到舞台上
    stage.addChild(Iori);
    //设置精灵fps来改变动画效果的速度（默认值为12）
    Iori.fps = 12;
    //定义精灵的状态
    Iori.states = {
        down: 0,
        left: 4,
        right: 8,
        up: 12,
        walkDown: [0, 3],
        walkLeft: [4, 7],
        walkRight: [8, 11],
        walkUp: [12, 15]
    };
    //捕获键盘箭头键
    let left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    //左箭头键 按下 
    left.press = () => {
        //播放精灵的 walkLeft 动画序列并设置精灵的速度
        Iori.playAnimation(Iori.states.walkLeft);
        Iori.vx = -1;
        Iori.vy = 0;
    };
    //左箭头键 释放 
    left.release = () => {
        //如果左箭头已被释放，右箭头未按下，并且精灵没有垂直移动，
        //则将 vx 设置为0来停止精灵移动，然后显示精灵的静态状态 left
        if (!right.isDown && Iori.vy === 0) {
            Iori.vx = 0;
            Iori.show(Iori.states.left);
        }
    };
    //其余的箭头键遵循相同的格式
    //Up
    up.press = () => {
        Iori.playAnimation(Iori.states.walkUp);
        Iori.vy = -1;
        Iori.vx = 0;
    };
    up.release = () => {
        if (!down.isDown && Iori.vx === 0) {
            Iori.vy = 0;
            Iori.show(Iori.states.up);
        }
    };
    //Right
    right.press = () => {
        Iori.playAnimation(Iori.states.walkRight);
        Iori.vx = 1;
        Iori.vy = 0;
    };
    right.release = () => {
        if (!left.isDown && Iori.vy === 0) {
            Iori.vx = 0;
            Iori.show(Iori.states.right);
        }
    };
    //Down
    down.press = () => {
        Iori.playAnimation(Iori.states.walkDown);
        Iori.vy = 1;
        Iori.vx = 0;
    };
    down.release = () => {
        if (!up.isDown && Iori.vx === 0) {
            Iori.vy = 0;
            Iori.show(Iori.states.down);
        }
    };

    //开始游戏循环
    gameLoop();
}

// 将游戏的当前状态设置为play：
let state = play;

function gameLoop() {
    // 循环调用gameLoop
    requestAnimationFrame(gameLoop);
    // 更新当前的游戏状态
    state();
    // 渲染舞台
    renderer.render(stage);
}

//使精灵移动的函数
function play() {
    Iori.x += Iori.vx;
    Iori.y += Iori.vy;
}

function keyboard(keyCode) {
    let key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    // 按下按键时的处理程序
    key.downHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    // 按键被松开时的处理程序
    key.upHandler = event => {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    // 添加事件监听器
    window.addEventListener("keydown", key.downHandler.bind(key), false);
    window.addEventListener("keyup", key.upHandler.bind(key), false);
    // 返回key对象
    return key;
}