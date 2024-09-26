export interface DialogInfo<Type extends string = string, Param = unknown, ReturnValue = unknown> {
  type: Type
  param: Param
  returnValue: ReturnValue | null
}
