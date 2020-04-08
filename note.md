1. 创建一个 webpack 项目

第一步、

    cnpm init -y
    cnpm install webpack --save-dev
    cnpm i webpack webpack-cli -D
    
第二步、

    配置项目的文件结构

    /app
        --/css
        --/img
        --/js
        --/spirts
        index.html
        second.html
    /node_modules
    package.json
    webpack.config.js


第三步、

    配置 webpack.config.js

1. 
引入：
    (html打包插件)
        
    cnpm i webpack-dev-server  (热加载等 webpack 的相关服务)
    cnpm i clean-webpack-plugin (用于清除以前的打包数据)
    cnpm install --save-dev style-loader (css 引入到行内)
    cnpm install --save-dev css-loader  (css 加载)
    cnpm install --save-dev url-loader,cnpm install --save-dev file-loader (图片 css 加载)

    cnpm install postcss-loader --save-dev, 
    cnpm install autoprefixer --save-dev , 
    cnpm install cssnano --save-dev (css 前缀)

    cnpm install --save-dev html-loader (图片 html 加载)
    cnpm i expose-loader --save (加载器expose-loader，用于将插件暴露到全局中供其他模块使用)
    cnpm install jquery --save
    // 第一种方法：在打包入口文件中直接require并用expose-loader暴露$到全局
    // require("expose-loader?$!jquery");
    // 第二种方法：在打包入口文件引入JQuery，在配置文件中暴露到全局

    // bootstrap 
    cnpm install popper.js --save
    cnpm install bootstrap --save
    // 打包引入 js
    cnpm i uglifyjs-webpack-plugin
    // 雪碧图制作
    cnpm install --save-dev webpack-spritesmith

    // html 中图片打包
    cnpm install html-withimg-loader --save
    
    
案例：

var webpack = require('webpack');
var path = require('path');
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin'); 
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); 
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const Uglify = require('uglifyjs-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith') // 雪碧图
const devMode = process.env.NODE_ENV !== 'production';
// ES6 
cnpm install babel-core --save-dev
cnpm install babel-loader@7 --save-dev
cnpm install babel-plugin-transform-runtime --save-dev
cnpm install babel-preset-env --save-dev
cnpm install babel-polyfill --save 
cnpm install babel-runtime --save 

// 创建 .babelrc
{
    "presets": [
      [
        "env",
        {
          "targets": {
            "browsers": [ //浏览器版本
              "> 1%",
              "last 2 versions",
              "not ie <= 8",
              "iOS >= 6",
              "safari >= 6",
              "Firefox >= 20",
              "Android > 4",
              "android >= 4.4"
            ]
          }
        }
      ]
    ],
    "plugins": ["transform-runtime"]
}


// 雪碧图 缩小
const templateFunction = function (data) {
    var shared = '.icon { background-size: TWpx THpx; display: inline-block; vertical-align: middle; background-image: url(I) }'
        .replace('TW', data.sprites[0].total_width / 2)
        .replace('TH', data.sprites[0].total_height / 2)
        .replace("I", data.sprites[0].image);
            
    var perSprite = data.sprites
        .map(function(sprite) {
        return ".icon-N { width: Wpx; height: Hpx; background-position: Xpx Ypx; }"
            .replace("N", sprite.name)
            .replace("W", sprite.width/2)
            .replace("H", sprite.height/2)
            .replace("X", sprite.offset_x/2)
            .replace("Y", sprite.offset_y/2);
        })
        .join("\n");
    
    return shared + "\n" + perSprite;
};

module.exports = {

    // 需要引入  cnpm i webpack-dev-server  (热加载等 webpack 的相关服务)
    devServer:{
        host:'localhost',
        port:'8080',
        open:true,//自动拉起浏览器
        hot:true,//热加载
    },
    resolve:{
        alias:{   // 起别名 可能会造成路径混乱
            bootstrap:'bootstrap/dist/css/bootstrap.css',
            bootstrapJS:'bootstrap/dist/js/bootstrap.min.js'
        }
        // index.js 使用 import "bootstrap" 引入样式
        // index.js 使用 import "bootstrap" 引入样式
    },

    //入口文件
    entry:{
        // '生成文件位置':'源文件位置'  === >  dist/js/index.js 打包成一个js
        'js/index':'./app/js/index.js'  
         
        // 打包多个js文件
        //'js/index':'./app/js/index.js',  //入口文件 
        //'js/main':'./app/js/main.js'
        
    },

    output:{
        filename: '[name].js',      //打包后index.js的名字,.js的路径
        // __dirname 当前webpack.config
        // 这个[name]的意思是,配置入口entry键值对里的key值,app/dist/js/index,最后的index，
        // 这里无论你src/js/index.js这个脚本如何命名，打包后都将是index.js
        // path: path.resolve(__dirname)
    },

    module: {
        rules: [
            // Es 6
            {
                test: /\.(htm|html)$/i,
                loader: 'html-withimg-loader'
            },
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                  loader: "babel-loader"
                }
            },
            // 可用可不用
            {
	            test: require.resolve('jquery'), //require.resolve 用来获取模块的绝对路径 
	            use: [{
	                loader: 'expose-loader',
	                options: 'jQuery'
	            }, {
	                loader: 'expose-loader',
	                options: '$'
	            }]
	        },
            
            {
                test:/\.css$/,
                // 打包 css  cnpm install --save-dev mini-css-extract-plugin
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    "css-loader",
                    "postcss-loader"
                ]
            },
            { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: "file" },
            { test: /\.(woff|woff2)$/, loader:"url?prefix=font/&limit=5000" },
            { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=application/octet-stream" },
            { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: "url?limit=10000&mimetype=image/svg+xml" },
            {
                test:/\.(png|jpg|gif|jpeg)$/,
                use:[
                    {
                        loader: "url-loader",
                        options: {
                            name: "img/[name].[hash:5].[ext]",
                            limit: 1024, // size <= 1kib
                            // outputPath: "img",
                            publicPath: "../"
                        }
                    }
                ]
            }
        ]
    },


    //插件
    plugins:[
        new SpritesmithPlugin({
            // 目标小图标，这里就是你要生成的图片的目录
            src: {
                cwd: path.resolve(__dirname, 'app/spirts/'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件，这个是打包后，自动生成的雪碧图和样式，自己配置想生成去哪里就去哪里
            target: {
                image: path.resolve(__dirname, 'app/img/sprite.png'),
                css: path.resolve(__dirname, 'app/css/sprite.css')
            },
            // 样式文件中调用雪碧图地址写法
            apiOptions: {
                cssImageRef: '../img/sprite.png'
            },
            spritesmithOptions: {
                algorithm: 'top-down'
            }
        }),
        new Uglify(),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery"
        }),
        new HtmlWebpackPlugin({
            chunks:['js/index'],
            filename:'index.html',
            template:'app/index.html'  
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.[chunkhash:8].css',
            chunkFilename: 'css/main.[id].css'  // 添加前缀时一定要添加
        }),
        new OptimizeCSSAssetsPlugin({
            // 默认是全部的CSS都压缩，该字段可以指定某些要处理的文件
            assetNameRegExp: /\.(sa|sc|c)ss$/g,
            // 指定一个优化css的处理器，默认cssnano
            cssProcessor: require('cssnano'),  // cnpm install cssnano --save-dev  使用cssnano配置规则

            cssProcessorPluginOptions: {
                preset: ['default', {
                    discardComments: { removeAll: true }, //对注释的处理
                    normalizeUnicode: false // 建议false,否则在使用unicode-range的时候会产生乱码
                }]
            },
            canPrint: true // 是否打印编译过程中的日志
        }),
        new SpritesmithPlugin({
            // 目标小图标，这里就是你要生成的图片的目录
            src: {
                cwd: path.resolve(__dirname, 'app/spirts/'),
                glob: '*.png'
            },
            // 输出雪碧图文件及样式文件，这个是打包后，自动生成的雪碧图和样式，自己配置想生成去哪里就去哪里
            target: {
                image: path.resolve(__dirname, 'app/img/sprite.png'),
                css:[
                        [
                            path.resolve(__dirname, 'app/css/sprite.css'), 
                            {
                                format: 'function_based_template'
                            }
                        ]
                    ]
                <!--  直接使用原图
                    css: path.resolve(__dirname, 'app/css/sprite.css')
                    -->
            },
            // 样式文件中调用雪碧图地址写法
            customTemplates: {
                'function_based_template': templateFunction,
            },
            customTemplates: {
                'function_based_template': templateFunction,
            },
            apiOptions: {
                cssImageRef: '../img/sprite.png'
            },
            spritesmithOptions: {
                
                padding: 4,
            }
        }),
        new CleanWebpackPlugin(),
    ]
}


// 注意

window.setValues = function(ID) {
    $('#dateId').val(ID);
}

=== >

function setValues(ID){
    $('#dateId').val(ID);
}


ES6 

export default {
    name: 'app',
    version: '1.0.0',
    sayName: function(name){
        console.log(this.name);
    }
}
//

var c = {
    name: 'app',
    version: '1.0.0',
    sayName: function(name){
        console.log(this.name);
    }
}

export {c} // export { c as default}


