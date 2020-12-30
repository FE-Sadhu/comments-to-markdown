/**
 * 一、为什么不直接用对象或 JSON 而用类描述？
 *        ↓
 * 之后可以整理一下所有设备协议，抽取出公共部分写在基类用于继承。
 * 
 * 二、为什么不用 TypeScript?
 *        ↓
 * TS 的类型检查仅仅用于约束开发者的写法，假如定义一个 interface 来被 A 类 implements，
 * 作用是 当开发者来编写 A 类的实例/静态属性/原型方法时必须按照接口定义的来写，否则编辑器 or 终端
 * 在编译时会报错。
 * 在此工具中假如要引入 TS，主要目的是拿到属性的 Type，而非类型检查，没用到 TS 的最大优势。
 * 那么怎样才能拿到属性的 Type? 
 * 方法 1. Type 要么从接口定义文件中拿
 * 方法 2. 要么就在词法分析、语法分析（编译时）阶段拿到
 * 对于方法 1，开发者要额外维护一份描述接口文件，然而用 JS 可以在该工具内部更直接地实现目标，不用额外维护一份接口文件。
 * 对于方法 2，只能结合研究下 V8 和 TS 编译相关部分了，时间？
 * 
 * 故在该工具的实现中，不用 TS。
 * 
 * 注意：该文件名要与类名相同！！！
 */

class MULTIPLE_CHANNEL_PROTOCOL {
  /**
   * 原始协议的每个字段的 value 写成对象，格式：
   * {
   *    value: 协议值,      // 或者把 value 换成 Type
   *    range: 'xx/xx/...' // 取值范围
   *    desc: '通道的开关'   // 协议字段的描述
   * }
   */

  switches = {
    value: [{
      outlet: {
        value: 0,
        range: '[0, 3]',
        desc: '代表通道 1-4'
      },
      switch: {
        value: 'on',
        range: 'on/off',
        desc: '通道的开关，on 打开，of 关闭'
      }
    }],
    range: '',
    desc: '所有通道的开关状态'
  }
  
  // sledOnline = 'on'
  sledOnline = {
    value: 'on',
    range: 'on/off',
    desc: '网络指示灯'
  }

  timers = {
    value: [{
      "enabled": {
        value: 1,
        range: 'N',
        desc: '是否启用: 0表示禁用；1表示启用'
      },
      "coolkit_timer_type": { 
        value: "delay",
        range: 'N',
        desc: '客户端使用，单次定时once；重复定时repeat；循环定时duration；延时定时delay'
      },
      "at": {
        value: "2019-05-28T09:50:00.460Z",
        range: 'N',
        desc: '执行时间: 格林尼治时间，也可采用UTC时间'
      },
      "period": {
        value: "5",
        range: 'Y',
        desc: '延时定时专用: 延时时间，单位为分钟'
      },
      "type": {
        value: "once",
        range: 'N',
        desc: '设备端使用，单次定时once；重复定时repeat；循环定时duration；'
      },
      "do": {
        value: {
          "switch": {
            value: "on",
            range: 'on/off',
            desc: '通道的开关'
          },
          "outlet": {
            value: 0,
            range: '[0, 3]',
            desc: '通道'
          }
        },
        range: '',
        desc: '要执行的动作'
      },
      "mId": {
        value: "140f500c-3951-6a20-7082-611397d6c539",
        range: 'N',
        desc: '定时标记，可以理解为该定时器的ID，不能重复，UUID格式，可以使用库生成'
      }
    }],
    range: ' ',
    desc: '定时器呗'
  }

  function = [
    {
    title: '设置通电反应',
    desc: '设置通道一在断电后通电时打开开关',
    JSON: {
      "configure":[
          {
              "outlet":0,
              "startup":"on"
          },
          {
              "startup":"off",
              "outlet":1
          },
          {
              "outlet":2,
              "startup":"on"
          },
          {
              "outlet":3,
              "startup":"off"
          }
      ]
    }
  },{
    title: 'xxxx',
    desc: 'xxx',
    JSON: {}
  }
  ]
}
