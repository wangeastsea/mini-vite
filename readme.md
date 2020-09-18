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