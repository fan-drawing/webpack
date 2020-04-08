PIXI 2D 绘图

一、 引入
    
    cnpm install pixi.js

二、使用

1. 模式获取

let type = "WebGL"
if(!PIXI.utils.isWebGLSupported()){
    type = "canvas"
}

2. 创建新的PIXI应用程序 PIXI.Application

    简单案例：

        // Create the application
        const app = new PIXI.Application();
        document.body.appendChild(app.view);
        app.stage.addChild(PIXI.Sprite.from('something.png'));
    
    进阶使用：

    const app = new PIXI.Application(options);

    options = {
        autoStart:true/false, //构造后自动开始渲染。
        width:800/number, //渲染器视图的宽度。
        height:600/number, //渲染器视图的高度。
        view:HTMLCanvasElement, // 用作视图的画布，可选。
        transparent:false/true, //渲染视图是透明的
        autoDensity:false/true, //调整渲染器视图的CSS像素大小，以允许使用非1的分辨率
        antialias:false/true,   // 设置抗锯齿
        preserveDrawingBuffer:false/true, //启用图形缓冲区保留，如果需要在WebGL上下文上调用toDataUrl，请启用此功能。
        resolution:1/number, //渲染器的分辨率/设备像素比率（视网膜）为2
        forceCanvas:false/true, 
        //阻止选择WebGL渲染器，即使存在，也仅当使用pixi.js-legacy或@ pixi / canvas-renderer模块时，此选项才可用，否则将被忽略
        backgroundColor:0x000000, //渲染区域的背景色（如果不透明则显示）
        clearBeforeRender:true/false, //这将设置渲染器是否在新的渲染过程之前清除画布
        forceFXAA:false/true, //强制在本机上使用FXAA抗锯齿。FXAA更快，但可能并不总是那么好。（仅适用于WebGL）。
        sharedTicker:false/true,  
        //true使用PIXI.Ticker.shared false创建新的代码。如果设置为false，则无法注册处理程序以在共享代码上运行的任何操作之前发生。
        //系统代码将始终在共享代码和应用程​​序代码之前运行。
        sharedLoader:false/true, //true使用PIXI.Loader.shared false创建新的Loader
        resizeTo:window|HTMLElement, //要自动调整舞台大小的外层元素
    }


3. 绑定事件

    事件区域重合触发会有问题，
    app.stage.addChild(containerBase);
    app.stage.addChild(container);
    谁在后谁的层级高

    例如：

    const texture = PIXI.Texture.from(require("../img/2752941944-5bfbec34a33cd_articlex.png").default);
    const bunny = new PIXI.Sprite(texture); 
    bunny.buttonMode = true;  // 是否为按钮  鼠标改变点击状态
    bunny.interactive = true; // 是否有事件
    bunny.on("pointerdown",function(data){ 
        var target = event.target
        alert("bunny");
        event.preventDefault();
    })

    currentTarget: 当前正在调用其事件侦听器的回调的对象。
    data: 与该事件相关的InteractionData。
    stopped:false/true,
    target: 事件点击的元素。
    type:string //类型
    reset() // 重置方法
    stopPropagation() // 防止冒泡



    1). 鼠标左键触发事件：

        click：点击事件

        mousedown：鼠标按下

        mousemove：鼠标移动

        mouseout：鼠标移出

        mouseover：鼠标经过

        mouseup：鼠标松开

        mouseupoutside：鼠标按下，移出对象松开

    2). 鼠标右键触发事件：

        rightclick：点击事件

        rightdown：鼠标按下

        rightup：鼠标松开

        rightupoutside：鼠标按下，移出对象松开

    3). 触摸屏触发事件：

        touchcancel：触摸系统cancels键

        touchend：触摸结束

        touchendoutside：触摸开始，移出对象松开

        touchmove：触摸移动

        touchstart：触摸开始

    4). 兼容鼠标和触摸屏的共同触发：

        pointercancel：触发系统cancels键

        pointerdown：触发按下

        pointermove：触发移动

        pointerout：触发移出

        pointerover：触发经过

        pointertap：触发点击

        pointerup：触发松开

4. 加载图片

    预加载：

    const loader = new PIXI.Loader(); 
    loader
    .add('bunny', require("../img/227b199eada0a2e15343f5faf8ae4115.jpg").default)
    .add('text', require("../img/2752941944-5bfbec34a33cd_articlex.png").default);
    loader.load((loader, resources) => {
        // sprites.bunny = new PIXI.TilingSprite(resources.bunny.texture,{width:100,height:100}); // 平铺精灵是渲染平铺图像的快速方法
        // sprites.spaceship = new PIXI.TilingSprite(resources.spaceship.texture);
        // sprites.scoreFont = new PIXI.TilingSprite(resources.scoreFont.texture);
        console.log(resources)
    });

    我们可以在缓存中拿数据load 的同时会把数据加入缓存中直接取但是要对数据直接操作的话如果需要二次利用建议新建一个图纹进行操作：
    
    const TextureCache = PIXI.utils.TextureCache;
    loader.add('text', require("../img/sprite.png").default);
    loader.load((loader, resources) => {
        const texture = TextureCache["text"];
        window.bunny = bunnySet(texture,new PIXI.Rectangle(0, 0, 64, 64),0, 0,);
    });
    function bunnySet(texture,rectangle,x,y){
        var t = new PIXI.Texture(texture); // 新建一个纹路填充
        t.frame = rectangle;
        let bunny = new PIXI.Sprite(t);
        bunny.interactive=true;
        bunny.x = x;
        bunny.y = y;
        bunny.width = 16*ratio;
        bunny.height = 16*ratio;
        bunny.pointerdown=function(data){
            event.stopped = true;
            data.target.x+=10*ratio;
            event.preventDefault();
        }    
        containerBase.addChild(bunny);

        return bunny;
    }


    1)、加载图片时使用进度条 监听加载的过程

        loader.onProgress.add(() => {});
        loader.onError.add(() => {});
        loader.onLoad.add(() => {});
        loader.onComplete.add(() => {});

        // 可以传变量

        例如 onProgress.add((that)=>{
            //that : {
            //  concurrency: 10
            //  baseUrl: ""
            //  progress: 100
            //  loading: false
            //} 
        })


5. 纹理

    let texture = PIXI.Texture.from('assets/image.png');
    let sprite1 = new PIXI.Sprite(texture);
    let sprite2 = new PIXI.Sprite(texture);
    

    1)、 纹理加载方式

        o1. 一般方法

        PIXI.Texture.from(url);

        o2. 新生成一个 副本

        new PIXI.Texture(Texture);
        TextureCache["text"].clone();
        Texture.clone();
        

        o3. 将纹理添加到缓存

        PIXI.Texture.addToCache(Texture,Texture_id);

        o4. 分类

            PIXI.Texture.fromBuffer

            PIXI.Texture.fromLoader

            PIXI.Texture.removeFromCache("./img/sprite.png") // 纹理id
            destroy() // 破坏某个材质

            onBaseTextureUpdated(PIXI.BaseTexture) // 更新材质
            
6. 创建

const app = new PIXI.Application({
    width:620*ratio,
    height:516*ratio,
    antialias:true,
    resizeTo:window,
    // backgroundColor:0xffffff,
    transparent:true //背景是否设定为透明
});
// 自动更新

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
// 手动更新

