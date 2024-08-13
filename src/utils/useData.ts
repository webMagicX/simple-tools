import type { useDataModel } from './useData.d'

/* 
  @name useData [function] 数据声明
  @param funData [function]
  @return [function] @return object
*/

const useData: useDataModel = function (func) {
  const model = func()
  return [
    model,
    /*
      @name 合并数据，数据初始化的合并
      @param coverData [object]
      @param isReset [boolean]  // 重置性合并
      @return object
    */
    (coverData, isReset) => {
      // 待合并的数据
      let cover = isReset ? useData.mergeData(func(), coverData) : coverData
      // 合并到数据模型上
      return useData.mergeData(model, cover)
    }
  ]
}

/*
  @name 获取数据类型
  @params value [any]
  @return 'null' | 'undefined' | 'object' | 'array' | 'number' | 'string' | 'set'
*/
useData.getDataType = function (data) {
  return Object.prototype.toString.call(data).slice(8, -1).toLowerCase()
}

/*
  @name 合并数据，只有类型相同的数据才会被合并
  @param data [object]
  @param cover [object]
  @return [object]
*/
useData.mergeData = function (data, cover) {
  if (useData.getDataType(data) === 'object' && ['object', 'undefined'].includes(useData.getDataType(cover))) {
    cover && Object.keys(data).forEach((k) => {
      if (k in cover) {
        data[k] = cover[k]
      }
    })
  }
  return data
}

export default useData