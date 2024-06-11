const styleguide = require('@vercel/style-guide/prettier');

module.exports = {
  ...styleguide,
  plugins: [...styleguide.plugins, 'prettier-plugin-tailwindcss'],
  printWidth: 80, // 一行最多 80 字符
  tabWidth: 2, // 使用 2 个空格缩进
  // useTabs: false, // 不使用 tab 缩进，而使用空格
  semi: false, // 行尾需要有分号
  singleQuote: true, // 使用单引号代替双引号
  quoteProps: 'as-needed', // 对象的 key 仅在必要时用引号
  // jsxSingleQuote: false, // jsx 不使用单引号，而使用双引号
  trailingComma: 'all', // 末尾使用逗号
  bracketSpacing: true, // 大括号内的首尾需要空格 { foo: bar }
  // jsxBracketSameLine: false, // jsx 标签的反尖括号需要换行
  arrowParens: 'always', // 箭头函数，只有一个参数的时候，也需要括号
  // 每个文件格式化的范围是文件的全部内容
  rangeStart: 0,
  rangeEnd: Infinity,
  requirePragma: false, // 不需要写文件开头的 @prettier
  insertPragma: false, // 不需要自动在文件开头插入 @prettier
  proseWrap: 'preserve', // 使用默认的折行标准
  htmlWhitespaceSensitivity: 'css', // 根据显示样式决定 html 要不要折行
  endOfLine: 'auto', // 换行符使用 auto
}
