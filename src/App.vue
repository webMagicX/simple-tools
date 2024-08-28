<script setup lang="ts">
import { reactive, ref } from 'vue';
// import { useApi, useData } from '@magic_npm/simple-tools';
import { useApi, useData } from '@/utils';

// // ----------- useData --------------
// // data 为声明的数据，merge 为合并数据的方法
// const [data, merge] = useData(() => ({
//   name: '',
//   mobile: ''
// }))
// merge({ name: 'name_tst' })    // 等同于 data.name = 'name_tst'
// merge({}, true)    // data 数据重置，回到声明数据时的状态

// // vue 动态数据
// const [dv, mergeDV] = useData(() => reactive({
//   name: '',
//   mobile: ''
// }))
// setTimeout(() => {
//   mergeDV({ name: 'name_dv' })
// }, 1000)
// dv.name  // 动态数据，页面会自动更新

// // 内置方法
// useData.getDataType(data.name)    // 获取数据类型
// // useData.mergeData(object1, object2)    // 把object2 合并到 object1 上，此方法用于一些没有使用 useData 声明数据的场景


// -------------- useApi ---------------
const [query, mergeQuery] = useData(() => reactive({
  id: '',
  name: ''
}))
const [data, mergeData] = useData(() => reactive({
  name: '',
  mobile: ''
}))

mergeQuery()

// ----- 场景一，普通调用
const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 3000)), {
  loading: ref(false),
  params: () => query,
  outputModel: (q) => ({ ...q, name: 'new_name' }),   // 修改一个参数，或者新增参数
  // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
  inputModel: (res: any) => ({ name: '调用成功' }),
  success: (data, loadingKey, res) => {
    data && mergeData(data)
  }
})
getData()   // 调用
loadingData.value   // loading状态

// ------ 场景二，阻止调用
// const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
//   loading: ref(false),
//   params: () => query,
//   before: () => {
//     // to do...
//     return Promise.reject() // 阻止调用，或者false也可以阻止
//   },
//   // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
//   inputModel: (res: any) => res?.data,
//   success: (data, loadingKey, res) => {
//     mergeData(data)
//   }
// })
// getData()   // 调用
// loadingData.value   // loading状态

// ------- 场景三，一个调用多用途
// const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
//   loading: reactive({ data: false, load: false, refresh: false }),
//   params: () => query,
//   // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
//   inputModel: (res: any) => res?.data,
//   success: (data, loadingKey, res) => {
//     // 初次请求
//     if (loadingKey === 'data') {
//       mergeData(data)
//     }
//     // 下拉加载更多
//     else if (loadingKey === 'load') {
//       // to do
//     }
//     // 刷新
//     else if (loadingKey === 'refresh') {
//       // to do
//     }
//   }
// })
// getData({}, 'data') // 默认加载数据
// loadingData.data

// getData({}, 'load') // 加载更多
// loadingData.load

// getData({}, 'refresh') // 刷新
// loadingData.refresh

// ------ 场景四，防止表单重复提交
// const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
//   isRepeat: false,    // 关闭重复调用，只有上一个调用结束后，才能发起新的调用
//   loading: ref(false),
//   params: () => query,
//   outputModel: (q) => ({ ...q, name: 'new_name' }),   // 修改一个参数，或者新增参数
//   // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
//   inputModel: (res: any) => res?.data,
//   success: (data, loadingKey, res) => {
//     mergeData(data)
//   }
// })
// getData()   // 调用，上一次请求未结束前，再次调用无效
// loadingData.value   // loading状态

// ----- 场景五，单例模式调用
// const [getData, loadingData] = useApi(() => new Promise(r => setTimeout(r, 1000)), {
//   // 开启单例模式，第一次调用成功后(调用结果为err不算)，后续的调用都取第一次调用的结果
//   isSingle: true,
//   loading: ref(false),
//   params: () => query,
//   outputModel: (q) => ({ ...q, name: 'new_name' }),   // 修改一个参数，或者新增参数
//   // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
//   inputModel: (res: any) => res?.data,
//   success: (data, loadingKey, res) => {
//     mergeData(data)
//   }
// })
// getData()   // 调用，上一次请求未结束前，再次调用无效
// loadingData.value   // loading状态

// ----- 场景六，提供关闭调用得 cancel 方法（提供了此方法，isCancel参数才能生效）
// const [getData, loadingData] = useApi(() => {
//   let t = 0
//   const pm = new Promise(r => t = setTimeout(r, 1000))
//   pm['cancel'] = () => clearTimeout(t) // 关闭请求的方法
//   return pm
// }, {
//   loading: ref(false),
//   params: () => query,
//   // 取到请求结果的data属性，也可以处理别的需求，保障返回的data就是直接可用的数据
//   inputModel: (res: any) => res?.data,
//   success: (data, loadingKey, res) => {
//     mergeData(data)
//   }
// })
// getData()   // 调用
// loadingData.value   // loading状态
</script>
<template>
  {{ data }}{{ loadingData }}
</template>