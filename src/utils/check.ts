import {promisify} from './common'

export type Rules = {
  [prop: string]: {
    check: (value?: any) => boolean
    verify: {msg: string; show: boolean}
  }
}

export function checkProp(rules: Rules, prop: string, value: any) {
  const rule = rules[prop]
  rule.verify.show = !rule.check(value)
}

export function checkForm(rules: Rules, formData: object) {
  for (const [prop, {check, verify}] of Object.entries(rules)) {
    const value = Reflect.get(formData, prop)
    if ((verify.show = !check(value))) throw new Error(verify.msg)
  }
}

export function checkFormAsync(rules: Rules, formData: object): Promise<void> {
  return promisify<void>(checkForm)(rules, formData)
}
