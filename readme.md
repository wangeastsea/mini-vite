#### vite特点
- 开发化境下，提供一个静态服务器，使用原生ES模块化加载代码，同时提供了丰富的内建功能。
- 在构建过程中，提供一套指令，使用rollup进行打包，使用预配置可以生成优化过的用于生产环境的静态资源
- 提供插件机制和原生javascript API，拥有强大的扩展能力，完整的类型支持。
- 不经过打包了，不存在热更新了，立即更新。

#### 实现一个 mini 版本 的 vite，便于自己去理解
我们需要实现一下几点：
- 支持 npm包的 import
```
import xx from 'vue'替换成 import xx from '/@moduels/vue'
koa监听得到/modules/开头的网络请求，就去node_module里查找
```
- 支持.vue 单文件组件的解析
.vue单文件件组件，拆成script， template
 template=> render函数 

 -  支持import css
 - 热更新等 。ts支持等 （慢慢实现其他文件的支持）

