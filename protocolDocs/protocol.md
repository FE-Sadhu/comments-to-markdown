### 协议说明 
整体字段说明： 
|参数名|数据类型|取值范围|参数说明|
|---|---|---|---|
|switches|Array||所有通道的开关状态|
|sledOnline|String|on/off|网络指示灯|
|timers|Array| |定时器呗|
switches 字段说明： 
|参数名|数据类型|取值范围|参数说明|
|---|---|---|---|
|outlet|Number|[0, 3]|代表通道 1-4|
|switch|String|on/off|通道的开关，on 打开，of 关闭|
timers 字段说明： 
|参数名|数据类型|取值范围|参数说明|
|---|---|---|---|
|enabled|Number|N|是否启用: 0表示禁用；1表示启用|
|coolkit_timer_type|String|N|客户端使用，单次定时once；重复定时repeat；循环定时duration；延时定时delay|
|at|String|N|执行时间: 格林尼治时间，也可采用UTC时间|
|period|String|Y|延时定时专用: 延时时间，单位为分钟|
|type|String|N|设备端使用，单次定时once；重复定时repeat；循环定时duration；|
|do|Object||要执行的动作|
|mId|String|N|定时标记，可以理解为该定时器的ID，不能重复，UUID格式，可以使用库生成|
timers->do 字段说明： 
|参数名|数据类型|取值范围|参数说明|
|---|---|---|---|
|switch|String|on/off|通道的开关|
|outlet|Number|[0, 3]|通道|
