## overview
Base on jsDoc, this project is like a custom tool which for compiling a file then auto generate a markdown document.

## project structure
```
.
├── conf.json                             // jsdoc config file
├── package-lock.json
├── package.json
├── plugins                               
│   ├── $adhu
│   │   └── publish.js                    // template output plugin
│   ├── custom-tag.js                     // custom tag plugin
│   └── defineProtocol 
│       └── MULTIPLE_CHANNEL_PROTOCOL.js  // 描述待编译类文件的协议（任何）字段
├── protocol.js                           // File to be complied(待编译类文件)
├── protocolDocs                          // markdown 
│   └── protocol.md
└── run.sh
```

## how to use
`npm run toDocs -- -p yourCompiledFile.js`

