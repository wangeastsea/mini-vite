exports.rewriteImport = function (content) {
    // 目的是改造.js文件内容， 不是/ ./ ../开头的import，替换成/@modules/开头的
    // todo 正则可以优化
    return content.replace(/ from ['|"]([^'"]+)['|"]/g, function (s0, s1) {
        // / ./ ../开头的import
        if (s1[0] !== '.' && s1[1] !== '/') {
            return ` from '/@modules/${s1}'`
        } else {
            return s0
        }
    })
}