import { AccountType } from "../types"

export const parseAccountType = (maybeAccountType: string): AccountType => {
  switch (maybeAccountType) {
    case "Счёт рублевый ООО": return 'OOO'
    case 'Счёт рублевый ИП': return 'IP'
    case 'Счет 3': return 'Third'
    case 'Счет 4': return 'Fourth'
    default: return ''
  }
}