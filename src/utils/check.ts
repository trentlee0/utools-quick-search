import { promisify } from './common'
import { createRegExp } from './common'

export type Rules = {
  [prop: string]: {
    check: (value?: any) => boolean
    verify: {
      msg: string
      show?: boolean
      disabled?: boolean | (() => boolean)
    }
  }
}

function getVerifyDisabled(verify: Rules[string]['verify']) {
  return typeof verify.disabled === 'function'
    ? verify.disabled()
    : verify.disabled
}

export function checkProp(rules: Rules, prop: string, value: any) {
  const rule = rules[prop]
  if (getVerifyDisabled(rule.verify)) return
  rule.verify.show = !rule.check(value)
}

export function checkForm(rules: Rules, formData: object) {
  for (const [prop, { check, verify }] of Object.entries(rules)) {
    const value = Reflect.get(formData, prop)
    if (getVerifyDisabled(verify)) continue
    if ((verify.show = !check(value))) throw new Error(verify.msg)
  }
}

export function checkFormAsync(rules: Rules, formData: object): Promise<void> {
  return promisify<void>(checkForm)(rules, formData)
}

export function isValidRegex(str: string) {
  try {
    return createRegExp(str) !== null
  } catch (e) {
    return false
  }
}
