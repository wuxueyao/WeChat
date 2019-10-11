const titbit = require('titbit');
const wxmsg = require('./msghandle');
const xmlparse = require('xml2js').parseString;

var app = new titbit();

//公众号开发者配置验证并启用后，会通过POST请求转发用户信息
app.router.post('/wx/msg',async c => {
    try{
        let data = await new Promise((rv,rj) =>{
            xmlparse(c.body,{explicitArray:false},
                (err,result)=>{
                    if(err){
                        rj(err);
                    }else{
                        rv(result.xml);
                    }
                });
        });

        let retmsg = {
            touser : data.FromUserName,
            fromuser : data.ToUserName,
            msgtype : '',//为空，在处理时动态设置类型
            msgtime : parseInt(Date.now()/1000),
            msg : ''
        };
        //交给消息派发函数进行处理
        //要把解析后
        c.res.body = wxmsg.msgDispatch(data,retmsg);
    }catch(err){
        console.log(err);
    }
});
app.run(8003,'localhost');
