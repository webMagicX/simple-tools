/* 
  @name useApi 用于接口请求，规范代码结构

  @param api [function]  接口方法，必须
  @param options [object]
    isCancel [boolean]  默认开启，连续请求，是否只响应最后一个请求结果
    isRepeat [boolean]  默认开启，是否可重复请求/提交
    isSingle [boolean]  默认关闭，是否开启单例模式，接口请求一次成功后，后续请求都使用第一次请求的结果
    loading [object]  // 定义 loading，可用 reactive | ref 之类
    params [function]  预设接口参数
    before [function]   请求接口之前的函数, 返回 Promise|object 返回object类型将取代请求参数; 不返回参数｜true 则使用原请求参数; 返回 false 为阻止接口请求;
      params 方法返回的参数数据
    outputModel [function] // 输出数据处理
    inputModel [function] // 输入数据处理
    success [function]  请求接口成功
      data  inputModel 处理后的数据
      loadingKey
      res 未处理前的数据
    error [function]    请求接口失败
      err  错误信息
    loadingStart [function] // loading开始回调，接收参数 (query, loadingKey); 未设置loading也可使用
    loadingEnd [function]   // loading结束回调，接收参数 loadingStart 函数的返回结果; 未设置loading也可使用
  @return [apiFunc, loading, apiObj]
    apiFunc [function]
      @param query  接口请求参数
      @param loadingKey  指定响应对应的loading，如无则不传
    loading [object]
    apiObj [object]  各类参数和方法
      status [number]    获取api请求的状态， 0 待请求, 1 请求中, 2 成功, 3 失败
      sendNum [number]   总请求次数
      params 请求参数记录
      output 输出参数数据记录
      pm [promise]       最新一次请求结果，会默认关闭之前还在请求中的接口，请求完毕后，销毁
      err [Error|string]  请求错误结果记录
      cancelApi [function]  关闭正在请求的Api
      result 结果
        data  经过 inputModel 处理后的结果
        loadingKey
        res 请求结果
*/
import useData from './useData'
import type { useApiFuncModel, useApiOptionsModel, useApiObjStatusModel } from './useApi.d'
export default function useApi<
  Q extends object,  // param 基础参数
  OQ extends object,  // outputModel 方法处理后参数
  R extends object | unknown | void, // 接口返回值
  RD extends object | void, // inputModel 返回值处理后结果
  L extends object | undefined, // loading 对象
  LK extends keyof L & string, // loading 对象所有的k
  LS  // loadingStart 方法返回值
>(
  api: (arg?: OQ, opt?: any) => Promise<R>,
  options?: useApiOptionsModel<R, RD, Q, OQ, L, LK, LS>
): [useApiFuncModel<R, RD, Q, LK>, L, useApiObjStatusModel<R, RD, LK, Q, OQ>] {
  const {
    isCancel, isRepeat, isSingle, loading, params, loadingStart, loadingEnd, before, success, error, inputModel, outputModel
  } = { isCancel: true, isRepeat: true, isSingle: false, ...options }

  const apiObj: useApiObjStatusModel<R, RD, LK, Q, OQ> = {
    status: 0,
    sendNum: 0,
    pm: undefined,
    err: '',
    params: undefined,
    output: undefined,
    result: {
      res: undefined,
      data: undefined,
      loadingKey: undefined
    },
    cancelApi: () => {
      const cancel: () => void | undefined = apiObj.pm?.['cancel']
      if (cancel) {
        cancel?.()
        apiObj.status = 0
        console.log('[cancel successful]')
      } else {
        console.log('[cancel error] find not cancel function.')
      }
    }
  }

  const apiFunc: useApiFuncModel<R, RD, Q, LK> = async (query, loadingKey) => {
    // 用来建立连接 loadingStart loadingEnd
    let loadingState: LS | undefined = undefined
    try {
      apiObj.params = params?.()
      apiObj.params && useData.mergeData(apiObj.params, query)

      // before 处理
      if (typeof before === 'function') {
        let bPm = before(apiObj.params && JSON.parse(JSON.stringify(apiObj.params)))
        if (bPm === false) {
          throw 'close send api.'
        }
        if (bPm instanceof Promise) {
          await bPm
        }
      }

      // 禁止重复请求处理
      if (!isRepeat && apiObj.status === 1) {
        return Promise.reject('操作频繁，请稍后再试')
      }

      // 是否单例模式
      if (isSingle && apiObj.status === 2) {
        success?.(apiObj.result.data, apiObj.result.loadingKey, apiObj.result.res)
        return Promise.resolve(apiObj.result)
      }

      // 输出给外部的参数数据
      apiObj.output = typeof outputModel === 'function'
        ? outputModel(apiObj.params && JSON.parse(JSON.stringify(apiObj.params)))
        : JSON.parse(JSON.stringify(apiObj.params))

      // 连续请求模式， 关闭上一次正在请求的此接口
      if (isCancel && isRepeat && apiObj.status === 1) {
        apiObj.cancelApi()
      }

      // loading 处理
      if (loading && loadingKey && loadingKey in (loading as object)) {
        loading[loadingKey as string] = true
      }
      // loadingStart
      loadingState = loadingStart?.(apiObj.params && JSON.parse(JSON.stringify(apiObj.params)), loadingKey)
      // 调用 api
      apiObj.sendNum = apiObj.sendNum + 1
      apiObj.status = 1
      apiObj.pm = api(apiObj.output)
      const res = await apiObj.pm
      apiObj.status = 2
      apiObj.result.loadingKey = loadingKey
      apiObj.result.data = inputModel?.(res)

      // 成功回调处理
      success?.(apiObj.result.data, loadingKey)
    } catch (err: any) {
      // 失败处理
      apiObj.status = 3
      apiObj.err = err
      error?.(apiObj.err)
    }

    // loading 处理
    if (loading && loadingKey && loadingKey in (loading as object)) {
      loading[loadingKey as string] = false
    }
    // loadingEnd 处理
    loadingEnd?.(loadingState)

    // 返回处理
    return new Promise((r, j) => {
      if (apiObj.status === 2) {
        r(apiObj.result)
      } else if (apiObj.status === 3) {
        j(apiObj.err)
      } else {
        j(new Error('useApi 异常'))
      }
    })
  }

  return [apiFunc, loading as L, { ...apiObj }]
}
