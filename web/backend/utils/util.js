const qs = require('querystring')

const parseCookies = (cookie = '') =>
    cookie
        .split(';')
        .map(v => v.split('='))
        .map(([k, ...vs]) => [k, vs.join('=')])
        .reduce((acc, [k, v]) => {
            acc[k.trim()] = decodeURIComponent(v);
            return acc;
        }, {});


function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        try {
            const chunks = []
        
            req.on('data', chunk => chunks.push(chunk))
        
            req.on('end', () => {
                const buffer = Buffer.concat(chunks).toString()
                if (buffer.length === 0) {resolve(null); return}
                resolve(JSON.parse(buffer))
            })
    
        } catch(err) {
            reject(err)
        }
    })
}

const TOKEN_LENGTH = 32;
const ALPHA_UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ALPHA_LOWER = 'abcdefghijklmnopqrstuvwxyz';
const ALPHA = ALPHA_UPPER + ALPHA_LOWER;
const DIGIT = '0123456789';
const ALPHA_DIGIT = ALPHA + DIGIT;

const generateToken = () => {
  const base = ALPHA_DIGIT.length;
  let key = '';
  for (let i = 0; i < TOKEN_LENGTH; i++) {
    const index = Math.floor(Math.random() * base)
    key += ALPHA_DIGIT[index]
  }
  return key
};

module.exports = { parseCookies, getRequestBody, generateToken }