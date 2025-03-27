import CryptoJS from 'crypto-js'
import { SECRET } from '../constants/app'

export const encrypt = (clear: any) => {
  var cipher: any = CryptoJS.AES.encrypt(clear, SECRET)
  cipher = cipher.toString()
  return cipher
}

export const decrypt = (cipher: any) => {
  var decipher: any = CryptoJS.AES.decrypt(cipher, SECRET)
  decipher = decipher.toString().toString(CryptoJS.enc.Utf8)

  return hex2a(decipher)
}

const hex2a = (hex: any) => {
  var str: string = ''
  for (var i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}
