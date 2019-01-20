/* eslint-disable no-console */
const fs = require('fs')
const path = require('path')
const del = require('delete')
const turndownInstance = new require('turndown')({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
})

const input_path = path.resolve(__dirname, 'dist', 'html')
const output_path = path.resolve(__dirname, 'dist', 'md')

console.log('clear dir...')
if (fs.existsSync(output_path)) del.sync(['dist/md/**.md'])

fs.readdirSync(input_path).forEach(file => {
  if (path.extname(file) === '.html') {
    const data = fs.readFileSync(path.resolve(input_path, file), { encoding: 'utf-8' })
    const markdown = turndownInstance.turndown(data)
    console.log(`converting ${path.parse(file).name} \n words count: ${markdown.length}`)
    fs.writeFileSync(path.resolve(output_path, path.parse(file).name) + '.md', markdown)
  }
})

console.log('all done. enjoy.')
