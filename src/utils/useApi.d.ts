// useApi
export interface useApiModel<
  Q extends object,  // param 基础参数
  OQ extends object | void,  // outputModel 方法处理后参数
  R extends object | unknown | void, // 接口返回值
  RD extends object | void, // inputModel 返回值处理后结果
  L extends object, // loading 对象
  LK extends keyof L & string, // loading 对象所有的k
  LS  // loadingStart 方法返回值
> {
  (
    api: (arg?: OQ, opt?: any) => Promise<R>,
    options?: useApiOptionsModel<R, RD, Q, OQ, L, LK, LS>
  ): [
      useApiFuncModel<R, RD, Q, LK>,
      useApiOptionsModel<R, RD, Q, OQ, L, LK, LS>['loading'],
      useApiObjStatusModel<R, RD, LK, Q, OQ>
    ]
}

// useApi(useApiFuncModel, useApiOptionsModel)
export interface useApiFuncModel<R, RD, Q, LK> {
  (query?: { [T in keyof Q]?: Q[T] }, loadingKey?: LK): Promise<useApiResDataModel<R, RD, LK>>
}

// useApi(useApiFuncModel, useApiOptionsModel)
export interface useApiOptionsModel<R, RD, Q, OQ, L, LK, LS> {
  readonly isCancel?: boolean // 重复调用，关闭历史接口调用，只采用最新结果
  readonly isRepeat?: boolean // 重复调用开关
  readonly isSingle?: boolean // 单例模式开关，取第一次调用结果
  readonly loading?: L  // loading 状态
  readonly params?: () => Q
  // true & void 继续请求；false & Promise<reject> 阻止请求；
  readonly before?: (params?: Q) => boolean | void | Promise<void>
  readonly outputModel?: (params?: Q) => OQ
  readonly inputModel?: (params?: R) => RD
  readonly loadingStart?: (params?: Q, loadingKey?: LK) => LS
  readonly loadingEnd?: (params?: LS) => void
  readonly success?: (data?: RD, loadingKey?: LK, res?: R) => void
  readonly error?: (err: string | Error | undefined) => void
}

export interface useApiObjStatusModel<R, RD, LK, Q, OQ> {
  status: 0 | 1 | 2 | 3
  sendNum: number
  pm?: Promise<R>
  err?: string | Error
  params?: Q
  output?: OQ
  result: useApiResDataModel<R, RD, LK>
  cancelApi: () => void
}

// 调用结果
export interface useApiResDataModel<R, RD, LK> {
  res?: R
  data?: RD
  loadingKey?: LK
}
