const fs = require('fs')
const path = require('path')
const Koa = require('koa')
const mount = require('koa-mount')
const Router = require('koa-router')
// 解析 templage 模板
const compilerSfc = require('@vue/compiler-sfc')
// 编辑 vdom 为 render 函数
const compilerDom = require('@vue/compiler-dom')
const {rewriteImport } = require('./utils/common/index')
var app = new Koa();
var router = new Router();
let  descriptor = ''
router.get('/', async (ctx) => {
    const { request: { url, query } } = ctx
    // 访问根目录 渲染我们的index.html
    // egg是基于koa开发的
    console.log('url', url)
    let content = fs.readFileSync('./index.html', 'utf-8')
    // 注入一个全局变量
    content = content.replace('<script', `
        <script>
        // 注入一个socket客户端
        // 后端的文件变了，通知前端去更新
            window.process = {
                env: {NODE_EV:'dev'}
            }
        </script>
        <script
    `)
    ctx.type = "text/html"
    ctx.body = content
}).get(/\.css$/g, async (ctx) => {
    const { request: { url, query } } = ctx
    // 你还可以支持less ，sass ，stylus
    // 或者.ts, 乱遭的 都可以
    const p = path.resolve(__dirname, url.slice(1))
    const file = fs.readFileSync(p,'utf-8')
    const content = `
        const css = "${file.replace(/\n/g,'')}"
        const link = document.createElement('style')
        link.setAttribute('type', 'text/css')
        document.head.appendChild(link)
        link.innerHTML = css
        export default css
    `
    ctx.type = 'application/javascript'
    ctx.body = content
}).get(/\.vue/g, async (ctx) => {
    const { request: { url, query } } = ctx
     // import xx from 'xx.vue'
    // 1. 单文件组件解析
    console.log('vue url', url)
    const p = path.resolve(__dirname, url.split('?')[0].slice(1))
    // 解析单文件组件，需要官方的库
    const compileData  = compilerSfc.parse(fs.readFileSync(p,'utf-8'))
    descriptor = compileData.descriptor
    if(!query.type){
      // js内容
        ctx.type = 'application/javascript'
        ctx.body = `
            ${rewriteImport(descriptor.script.content.replace('export default ','const __script = '))}
            import {render as __render} from "${url}?type=template"
            __script.render = __render
            export default __script
        `}
}).get(/\.js$/g,async (ctx) => {
    const { request: { url } } = ctx
    const p = path.resolve(__dirname,url.slice(1))
    const content = fs.readFileSync(p,'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(content)
}).get(/@modules/g, async (ctx) => {
    const { request: { url } } = ctx
     // 这个模块，不是本地文件，而是node_module里查找
    const prefix = path.resolve(__dirname, 'node_modules',url.replace('/@modules/',''))
    const module = require(prefix+'/package.json').module
    const p = path.resolve(prefix,module)
    const ret = fs.readFileSync(p,'utf-8')
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(ret)
})
// todo
router.url(/\.vue/g, { query: { type: 'template' } }, async (ctx) => {
    // 解析我们的template 编程render函数
    console.log('here')
    const template = descriptor.template
    const render = compilerDom.compile(template.content, {mode:"module"}).code
    ctx.type = 'application/javascript'
    ctx.body = rewriteImport(render)
})
app.use(router.routes()).use(router.allowedMethods())
app.listen(3038, () => {
    console.log('listen 3038')
})
