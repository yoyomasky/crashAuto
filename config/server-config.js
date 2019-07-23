const appRoot = require('app-root-path');
const moment = require('moment');

const JsSignatureProvider = require('eosjs/dist/eosjs-jssig').default;
const { Api, JsonRpc, RpcError } = require('eosjs');

// node下 eos RPC 所需模组
const fetch = require('node-fetch');
// 只有在node.js / IE11 /IE Edge 浏览器环境下，需要以下模组；
const { TextDecoder, TextEncoder } = require('text-encoding');

// 这里是私钥
const privateKey = "5KXsPiYWw7BagEzct9xTGwsV9fUWETsuk1yf4impPsP5Wba3BgB";
const signatureProvider = new JsSignatureProvider([privateKey]);



// rpc 对象可以运行 eos的rpc命令
// const kylinGetInfoLink = 'http://kylin.fn.eosbixin.com';
// const kylinGetInfoLink = 'https://api.kylin.alohaeos.com';
// const kylinGetInfoLink = 'https://kylin.eoscanada.com';
const kylinGetInfoLink = 'http://kylin.meet.one:8888';
// const kylinGetInfoLink = 'https://api-kylin.eosasia.one';

const rpc = new JsonRpc(kylinGetInfoLink, { fetch });


// api 对象可以运行eos的合约，比如转账，创建账号等等(需要费用的操作)
const eosApi = new Api({ rpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() });


const gameContractAccount='chen11111112';//合约拥有者
//声明
module.exports = {
    CrashGameContractAccount:gameContractAccount,
    AppPath:appRoot,
    EosApi:eosApi,
    KylinGetInfoLink:kylinGetInfoLink,
    JsonRpc:rpc,
    Moment:moment,
};
