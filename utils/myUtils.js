let exec = require("child_process").exec;
const EnvPeople = require("../config/server-config");
const Log = require('../config/log-config');
//日志
var errlog = Log.getLogger('err');
var runlog = Log.getLogger();
var othlog = Log.getLogger('oth');
var consoleLog = Log.getLogger('consolelog');

module.exports = {
    executeCMD: async function (cmdStr) {
        let promise = new Promise((resolve, reject) => {
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    reject(-1)
                    consoleLog.info("执行错误:", cmdStr, "\n", err, stderr);
                } else {
                    resolve(stdout)
                    consoleLog.info("执行完成:", stdout);
                }
            });
        })

        let result;
        await promise.then(function (data) {
            result = data
        }, function (error) {
            result = error
        })
        return result
    },
    crashClearServer : async function (){
        let tableinfo = await EnvPeople.JsonRpc.get_table_rows({
        "code": EnvPeople.CrashGameContractAccount,
        "index_position": 1,
        "json": true,
        "key_type": "i64",
        "limit": 1000,
        "lower_bound": '',
        "scope": EnvPeople.CrashGameContractAccount,
        "table": "history",
        "table_key": "",
        "upper_bound": '-1' 
        }).catch(async err=>{
            errlog.error('查询游戏历史表失败:'+err);
            setTimeout(async ()=>{
                this.crashClearServer();
            },5000);
        });
        if (tableinfo.rows.length > 0) {
            //console.log(tableinfo.rows);
            //consoleLog.info(tableinfo.rows);
            let crash_id_arr=[];
            tableinfo.rows.forEach(async element => {
                if(element.answer_number !== 0 ){
                    crash_id_arr.push(element.crash_id);
                    //console.log(element.answer_number);
                }

            });
            //console.log(crash_id_arr);
           await this.eosTransact('gameremoves',{crash_ids:crash_id_arr});

        }
    },
    eosTransact : async function (actionName,datas){
        await EnvPeople.EosApi.transact({
        actions: [{
            account: EnvPeople.CrashGameContractAccount,
            name: actionName,
            authorization: [{
                actor: EnvPeople.CrashGameContractAccount,
                permission: 'active',
            }],
            data: datas,
        }]} , {
            blocksBehind: 3,
            expireSeconds: 30,
        }).then(res=>{
            consoleLog.info('历史清理执行完毕 : '+res.transaction_id);
            return res.transaction_id;
        }).catch(err=>{
            consoleLog.info("历史清理执行错误 : "+err);
        });
    },
    getHexRandNum : async function (){
        let randNum=await this.executeCMD('openssl rand -hex 32');
        return randNum;
    }
};