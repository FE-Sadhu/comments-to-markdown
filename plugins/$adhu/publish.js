/**
 * 
 */
const fs = require('fs')
const path = require('path')
const util = require("util")
const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

const LIMIT = 4

/**
 * 工具对象
 */
const utils = {
  objFactor: () => {
    return new Object({
      name: new Array(),
      type: new Array(),
      range: new Array(),
      desc: new Array()
    })
  },
  _read: async (filePath) => {
    try {
      return await readFile(filePath, "utf-8")
    } catch (e) {
      console.log('read file wrong:', e)
    }
  },
  _write: async (filePath, content) => {
    try {
      return await writeFile(filePath, content)
    } catch (e) {
      console.log('写入 markdown 失败')
    }
  },
  isArray: (val) => {
    return Object.prototype.toString.call(val) === '[object Array]'
  },
  isObject: (val) => {
    return Object.prototype.toString.call(val) === '[object Object]'
  },
  isFunction: (val) => {
    return Object.prototype.toString.call(val) === '[object Function]'
  },
  isString: (val) => {
    return Object.prototype.toString.call(val) === '[object String]'
  },
  isNumber: (val) => {
    return Object.prototype.toString.call(val) === '[object Number]'
  }
}


const serializeDoclets = (doclets, opts) => {
  const outputRoad = path.join(__dirname, '..', '..', opts.destination);

  let protocolName = '',
      fileNames = null,
      scriptRoad = '';

  doclets.map(doclet => {
    if (doclet.hasOwnProperty('fileNames')) {
      fileNames = doclet.fileNames
      protocolName = doclet.meta.filename
      scriptRoad = doclet.meta.path + '/' + protocolName
    }
  })
  
  // 拓展口: 同时跑多个类模块，下面的 fileXXXX 都是针对类模块，非协议模块
  const fileName = fileNames[0].name
  const filePath = path.join(__dirname, '..', 'defineProtocol', fileName + '.js')
  // debugger
  utils._read(filePath).then(content => {
    const render = new Function(content + `return new ${fileName}`)
    output(render(), protocolName, outputRoad)
  })

  console.log(`%c                                                                            
                                                                                                                                         
                           %c ${protocolName} 模块的 Markdown 协议文档正在生成... %c                                
                                                                                                                                                     
%c                            模块路径：${scriptRoad}    
                            文档输出路径：${outputRoad}                  
                                                                                                                                                                                                                   
`,
    'background: #000; font-size: 18px; font-family: monospace',
    'background: #f33; font-size: 18px; font-family: monospace; color: #eee; text-shadow:0 0 1px #fff',
    'background: #000; font-size: 18px; font-family: monospace',
    'background: #000; font-size: 18px; font-family: monospace; color: #ddd; text-shadow:0 0 2px #fff'
  )
}

const output = (protocol, protocolName, outputRoad) => {
  const mainObj = {
    title: '整体字段说明：',
    mainTable: utils.objFactor(),
    nested: []
  }

  for (const [key, value] of Object.entries(protocol)) {
    if (key === 'function') {
      // 拓展处
      continue
    }
    mainObj.mainTable.name.push(key)
    mainObj.mainTable.range.push(value.range)
    mainObj.mainTable.desc.push(value.desc)

    let val = value.value
    mainObj.mainTable.type.push(
      utils.isArray(val) ?
      'Array' : utils.isObject(val) ?
      'Object' : utils.isFunction(val) ?
      'Function' : utils.isString(val) ?
      'String' : utils.isNumber(val) ?
      'Number' : ' '
    )
    // debugger
    if (!utils.isString(val) && !utils.isNumber(val) && val !== null && val !== undefined) {
      recursion(val, mainObj, `${key} 字段说明：`, key)
    }
  }
  /**
   * recursion 递归序列化得到目标数据结构，如下：
   * 
   *                  dataStructure = {
	 *                      title: 'String', 							                  // 第一层协议字段表格的描述
	 *                      mainTable: { 									                  // 第一层协议字段表格
   *                      	  name: ['String', ...], 							          // 字段名
   *                      	  type: ['String', ...],							          // 数据类型
   *                      	  range: ['String | Number | Array', ...],	    // 取值范围
   *                      	  desc: ['String', ...]					                // 协议字段说明
	 *                      },
	 *                      nested: [{ 											                // 嵌套字段的说明表格，
	 *                      	  nestedTitle: 'String',							            // 该嵌套字段表格的描述
	 *                      	  nestedTable: {									                // 该嵌套协议字段表格
   *                      	  	   name: ['String', ...], 							          // 字段名
   *                      	  	   type: ['String', ...],							          // 数据类型
   *                      	  	   range: ['String | Number | Array', ...],	    // 取值范围
   *                      		     desc: ['String', ...]					                // 协议字段说明
	 *                          }, {	
   *                            // 和上一个格式一样
	 *                          },
	 *                          ...
   *                      ]
   *                  }
   * 
   */
  sortNested(mainObj.nested)
  // debugger
  // console.log(mainObj.nested)
  const res = {
    markdown: ''
  }
  template(mainObj.mainTable, '### 协议说明 \n' + mainObj.title, res, mainObj)
  // console.log(res)
  generatorMarkdown(res, protocolName, outputRoad)
  
}

/**
 * 递归序列化
 * @param {Array | Object} nest 
 * @param {Object} mainObj 
 * @param {String} title 
 * @param {String} prefix 
 */
const recursion = (nest, mainObj, title, prefix = '') => {
  utils.isArray(nest) && (nest = nest[0])

  const newObj = utils.objFactor()
  for (const [key, value] of Object.entries(nest)) {
    newObj.name.push(key)
    newObj.range.push(value.range)
    newObj.desc.push(value.desc)

    let val = value.value
    newObj.type.push(
      utils.isArray(val) ?
      'Array' : utils.isObject(val) ?
      'Object' : utils.isFunction(val) ?
      'Function' : utils.isString(val) ?
      'String' : utils.isNumber(val) ?
      'Number' : ' '
    )

    if (!utils.isString(val) && !utils.isNumber(val) && val !== null && val !== undefined) {
      const fullTitle = prefix.length > 0 ? `${prefix}->${key}` : key
      recursion(val, mainObj, `${fullTitle} 字段说明：`, fullTitle)
    }
  }

  mainObj.nested.push({
    nestedTitle: title,
    nestedTable: newObj
  })
}

/**
 * 滑动窗口变种，动态双指针变更 nested 位置
 * @param {Object} nested 
 */
const sortNested = (nested) => {
  let start = 0,
      end = 0;

  nested.reduce((prev, next, index) => {
    let prevTitle = prev.nestedTitle
    let nextTitle = next.nestedTitle
    if (nextTitle.split('->')[0].includes(prevTitle.split('->')[0])) {
      end = index
      if (index != nested.length - 1) {
        return next
      } else {
        // 滑动窗口 right 在结尾
        // end must larger than start 
        while (end > start) {
          const swap = nested[end]
          nested[end] = nested[start]
          nested[start] = swap
          end--
          start++
        }
        return
      }
    } else if (end > start) {
      const cache = end
      while (end > start) {
        const swap = nested[end]
        nested[end] = nested[start]
        nested[start] = swap
        end--
        start++
      }
      start = cache + 1
      return utils.isObject(nested[start + 1]) ? next : '';
    }
    start = index
    return next
  })
}

/**
 * 每递归一次生成一个 table
 * @param {Object?} data 
 * @param {String} title 
 * @param {Object} res
 * @param {Object} mainObj 带有 nested 字段的对象，作为嵌套协议的递归出口
 */
const template = (data, title, res, mainObj) => {
  if (!data) return

  let row = data['desc'].length
  let column = LIMIT
  let i = 0,
      j = 1;

  res.markdown += `${title} \n`
  
  const tmp = ['参数名', '数据类型', '取值范围', '参数说明']
  const intervalLen = tmp.length

  while(column--) {
    tmp.push('---')
  }
  
  while(i < row) {
    tmp.push(data['name'][i], data['type'][i], data['range'][i], data['desc'][i])
    i++
  }
  
  const len = tmp.length
  let count = Math.floor(len/intervalLen)

  while(j <= count) {
    tmp.splice(intervalLen * j + (j - 1), 0, '\n')
    j++
  }
  tmp[tmp.length - 1] !== '\n' && (tmp.push('\n'))

  res.markdown += '|' + tmp.join('|')
  
  const helper = mainObj.nested
  if (helper.length) {
    for (let i = 0; i < helper.length; i++) {
      template(helper[i].nestedTable, helper[i].nestedTitle, res, {
        nested: [] // 递归出口
      })
    }
  }
  return
}

const generatorMarkdown = (content, protocolName, outputRoad) => {
  // debugger
  const mdStation = outputRoad + protocolName
  utils._write(mdStation.replace('.js', '.md'), content.markdown).then(err => {
    if (!err) {
      console.log(`
                            成功生成！
      `)
    }
  })
}

exports.publish = (taffyData, opts) => {
  let docs = null,
    data = null;

  data = taffyData

  /**
   * taffyDB 数据库 -> https://github.com/typicaljoe/taffydb
   * 
   * 此处可以拓展：
   * 把 jsDoc parser 结果 remove 掉不需要的 members，
   * 这里仅仅 removed 掉 undocumented members，还可 remove `@ignore`（或自己决定）等 tags 的 members。
   * 可参考 jsDoc 源码 jsdoc/lib/jsdoc/util/templateHelper.js 用法
   */
  data({
    undocumented: true
  }).remove()

  docs = data().get() // an array of Doclet objects
  // debugger
  serializeDoclets(docs, opts)

}