export interface useDataModel extends useDataAttrsModel {
  <R extends object>(func: () => R): [R, (coverData: { [K in keyof R]?: R[K] }, isReset?: boolean) => R]
  getDataType(data): string
  mergeData<T extends object, C extends object>(data: T, cover?: C): T
}