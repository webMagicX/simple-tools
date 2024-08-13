# `simple-tools` 介绍

> `simple-tools` 是一个工具集，目前有`useData`和`useApi`两个方法，用于提高代码质量下限，减少bug率，提升开发效率

## 安装

### npm
```
npm i simple-tools
```

### yarn
```
yarn add simple-tools
```

## 1. `useData` 方法

> 用于声明数据模型，重置/合并数据，规范代码块；适用场景：重置查询条件、重置表单数据等;

```typescript
import { useData } from 'simple-tools'
// data 为声明的数据，merge 为合并数据的方法
const [data, merge] = useData(() => {
    name: '',
    mobile: ''
})
merge({ name: 'name_tst' })    // 等同于 data.name = 'name_tst'
merge({}, true)    // data 数据重置，回到声明数据时的状态

// vue 动态数据
const [dv, mergeDV] = useData(() => reactive({
    name: '',
    mobile: ''
}))
setTimeout(() => {
    mergeDV({ name: 'name_dv' })  
}, 1000)
dv.name  // 动态数据，页面会自动更新

// 内置方法
useData.getDataType(data.name)    // 获取数据类型
// useData.mergeData(object1, object2)    // 把object2 合并到 object1 上，此方法用于一些没有使用 useData 声明数据的场景
```
### useData 参数
| 参数 | 返回值 |
| - | :-: |
| useData(func: () => object)  | Array[object, merge:Function] |

### useData 返回值: merge方法
| 参数 | 返回值 | 说明 |
| - | :-: | - |
| merge(object, boolean) | object | 当第二个参数为 `true` 时，会重置声明数据后，再合并object |

### useData Methods
| 方法名 | 说明 | 参数 |
| - | - | - |
| getDataType | 获取数据类型 | useData.getDataType(data:any): string |
| mergeData | 合并数据，将 object2 合并到 object1 上 | useData.mergeData(object1, object2): object1 |


## 2. `useApi` 方法

> 用于业务调用，包含接口调用、其它异步调用，整合代码块，提高易读性

```typescript
// vue3 ts 例子 ————————
import { ref, reactive } from 'vue'
import { useData, useApi } from 'simple-tools'
const [query, mergeQuery] = useData(() => reactive({
    id: '',
    name: ''
}))
const [data, mergeData] = useData(() => reactive({
    name: '',
    mobile: ''
}))
```
```typescript
// 场景一，普通调用
const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
    loading: ref(false),
    params: () => query,
    outputModel: (q) => ({ ...q, name: 'new_name' }),   // 修改一个参数，或者新增参数
    // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
    inputModel: (res: any) => res?.data,  
    success: (data, loadingKey, res) => {
        mergeData(data)
    }
})
getData()   // 调用
loadingData.value   // loading状态
```
```typescript
// 场景二，阻止调用
const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
    loading: ref(false),
    params: () => query,
    before: () => {
        // to do...
        return Promise.reject() // 阻止调用，或者false也可以阻止
    },
    // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
    inputModel: (res: any) => res?.data,  
    success: (data, loadingKey, res) => {
        mergeData(data)
    }
})
getData()   // 调用
loadingData.value   // loading状态
```
```typescript
// 场景三，一个调用多用途
const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
    loading: reactive({ data: false, load: false, refresh: false }),
    params: () => query,
    // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
    inputModel: (res: any) => res?.data,  
    success: (data, loadingKey, res) => {
        // 初次请求
        if (loadingKey === 'data') {
            mergeData(data)   
        } 
        // 下拉加载更多
        else if (loadingKey === 'load') {
            // to do
        } 
        // 刷新
        else if (loadingKey === 'refresh') {
            // to do
        }
    }
})
getData({}, 'data') // 默认加载数据
loadingData.data

getData({}, 'load') // 加载更多
loadingData.load

getData({}, 'refresh') // 刷新
loadingData.refresh
```
```typescript
// 场景四，防止表单重复提交
const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
    isRepeat: false,    // 关闭重复调用，只有上一个调用结束后，才能发起新的调用
    loading: ref(false),
    params: () => query,
    outputModel: (q) => ({ ...q, name: 'new_name' }),   // 修改一个参数，或者新增参数
    // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
    inputModel: (res: any) => res?.data,  
    success: (data, loadingKey, res) => {
        mergeData(data)
    }
})
getData()   // 调用，上一次请求未结束前，再次调用无效
loadingData.value   // loading状态
```
```typescript
// 场景五，单例模式调用
const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
    // 开启单例模式，第一次调用成功后(调用结果为err不算)，后续的调用都取第一次调用的结果
    isSingle: true,
    loading: ref(false),
    params: () => query,
    outputModel: (q) => ({ ...q, name: 'new_name' }),   // 修改一个参数，或者新增参数
    // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
    inputModel: (res: any) => res?.data,  
    success: (data, loadingKey, res) => {
        mergeData(data)
    }
})
getData()   // 调用，上一次请求未结束前，再次调用无效
loadingData.value   // loading状态
```
```typescript
// 场景六，提供关闭调用得 cancel 方法（提供了此方法，isCancel参数才能生效）
const [getData, loadingData] = useApi(() => {
    let t = 0
    const pm = new Promise(r => t = setTimeout(r, 1000))
    pm['cancel'] = () => clearTimeout(t) // 关闭请求的方法
    return pm
}, {
    loading: ref(false),
    params: () => query,
    // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
    inputModel: (res: any) => res?.data,  
    success: (data, loadingKey, res) => {
        mergeData(data)
    }
})
getData()   // 调用
loadingData.value   // loading状态
```

### useApi 参数
| 参数 | 返回值 |
| - | :-: |
| useApi(() => Promise, options: object) | Array[apiFunc:Function, loading: object, apiObjStatus: object] |

### useApi options
| 参数 | 说明 | 类型 | 可选值 | 默认值 |
| - | - | :-: | :-: | :-: |
| isCancel | 自动关闭历史异步请求，用于重复调用保留最新一次调用 | boolean | - | true |
| isRepeat | 重复调用开关 | boolean | - | true |
| isSignle | 单例模式，使用第一次调用的结果 | boolean | - | false |
| loading | 调用状态，用于按钮等组件的loading效果 | object | - | - |
| params | 调用参数数据声明 | () => params: object | - | - |
| before | 返回`false`或Promise状态为`rejeced`会阻止调用 | (params) => boolean \| void \| Promise | - | - |
| outputModel | 输出参数调整 | (params) => object \| void | - | - |
| inputModel | 获得数据后，输入数据调整 | (res) => data: object | - | - |
| success | 调用成功 | (data, loadingKey, res) => void | - | - |
| error | 调用失败 | (err) => void | - | - |
| loadingStart | 调用过程状态: 开始 | (params, loadingKey) => LS \| void | - | - |
| loadingEnd | 调用过程状态: 结束 | (LS) => void | - | - |

### useApi apiFunc
| 参数 | 返回值 |
| - | :-: |
| apiFunc(params \| void, loadingKey) | { data: object, loadingKey: object, res: object } |

### useApi apiObjStatus
| 参数 | 类型 | 说明 |
| - | :-: | - |
| status | number | 调用状态: 0 待调用, 1 调用中, 2 成功, 3 失败 |
| sendNum | number | 调用次数记录 |
| params | object | 调用参数数据 |
| output | object | 调整后的输出参数数据 |
| pm | Promise | 最新一次调用 |
| err | Error \| string | 调用错误 |
| cancelApi | Function | 关闭正在调用的请求，关闭方法由`pm<Promise['cancel']>`提供，详见demo |
| result | { data, loadingKey, res } | 调用结果 |