var webpack = require('webpack');
var path = require('path');

const { CleanWebpackPlugin } = require("clean-webpack-plugin");// 清除之前打包数据 cnpm i clean-webpack-plugin
const HtmlWebpackPlugin = require('html-webpack-plugin'); //打包html的插件
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); //提取 css
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin'); // 压缩css
const TerserPlugin = require('terser-webpack-plugin');
const GeneraterAssetPlugin = require('generate-asset-webpack-plugin')
// const serverConfig = require('./app/data/main.json')

// const createJson = function(compilation) {
//     return JSON.stringify(serverConfig)
// }
const SpritesmithPlugin = require('webpack-spritesmith') // 雪碧图
// css 前缀 cnpm install postcss-loader --save-dev, cnpm install autoprefixer --save-dev
const devMode = process.env.NODE_ENV !== 'production';
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
    mode:"production",
    externals: {
        "$": "$"
    },
    devServer:{
        port: 4000,
        // host: '192.168.1.103',
        open: true,
        open:true,//自动拉起浏览器
        hot:true,//热加载
    } ,
     entry:{
         
        'js/index':['jquery','./app/js/index.js'],  //入口文件
     },
     output:{
          //__dirname 当前webpack.config.js的路径
          filename: '[name].js',      //打包后index.js的名字，
                                     // 这个[name]的意思是,配置入口entry键值对里的key值,app/dist/js/index,最后的index，
                                     //这里无论你src/js/index.js这个脚本如何命名，打包后都将是index.js
        //   path: path.resolve(__dirname)
     },
     module: {
        rules: [
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
                test: /\.(png|jpg|jpeg)$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        esModule: false,
                        limit: 5000,
                        name: './img/[name].[ext]',
                    },
                },
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            }
        ]
    },

     //插件
     plugins:[
       
        new CleanWebpackPlugin(),
     
        new TerserPlugin(),
        new HtmlWebpackPlugin({
            chunks:['js/vendors','js/manifest','js/common','js/index'],
            filename:'index.html',
            template:'app/index.html'  
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            PIXI:"pixi.js",
        }),
        new MiniCssExtractPlugin({
            filename: 'css/main.[chunkhash:8].css',
            // chunkFilename: 'css/main.[id].css'  // 添加前缀时一定要添加
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
        })
     ],
     optimization: {
        // 找到chunk中共享的模块,取出来生成单独的chunk
        splitChunks: {
            chunks: "all",  // async表示抽取异步模块，all表示对所有模块生效，initial表示对同步模块生效
            cacheGroups: {
                vendors: {  // 抽离第三方插件
                    test: /[\\/]node_modules[\\/]/,     // 指定是node_modules下的第三方包
                    name: "js/vendors",
                    priority: -10                       // 抽取优先级
                },
                utilCommon: {   // 抽离自定义工具库
                    name: "js/common",
                    minSize: 0,     // 将引用模块分离成新代码文件的最小体积
                    minChunks: 2,   // 表示将引用模块如不同文件引用了多少次，才能分离生成新chunk
                    priority: -20
                }
            }
        },
        // 为 webpack 运行时代码创建单独的chunk
        runtimeChunk:{
            name:'js/manifest'
        }
    }
}

