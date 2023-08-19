
export const getNumberFromString = (string) => {
   let number = string.match(/\d+/)[0]
   let money = string.includes('đồng/tháng') ? number / Math.pow(10, 3) : number
   return money
}