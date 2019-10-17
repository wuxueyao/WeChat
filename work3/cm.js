const gohttp = require('gohttp');
const wxkey = require('./gzhkey');

var token_api = `https://api.weixin.qq.com/cgi-bin/token`
                +`?grant_type=client_credential`
                +`&appid=${wxkey.appid}&secret=${wxkey.secret}`;

var menu_data = {
    button :[
        {
            name : "Pictures",
            type : "pic_weixin",
            key : "my-pictures"
        },
        {
            name : "Send",
            type : "click",
            key : "this is a simple window"
        },
        {
            name : "more",
            sub_button : [
                {
                    name : "my-location",
                    type : "location_select",
                    key : "send-location",

                },
                {
                    name : "take-photos",
                    type : "pic_sysphoto",
                    key : "send-photos"
                }
            ]
            
        }
    ]
}; 
//这个分号要加，可以在这里加，也可以在下一个下一个注释的开头加，不然像立即执行函数的传参，
//会引起编译器的误解析


// (async () => {

// })();

async function createMenu(){
    let ret = await gohttp.get(token_api);
    let t = JSON.parse(ret);
    //如果没有成功获取access_token则输出错误信息并退出

    if(t.access_token === undefined){
        console.log(ret);
        process.exit(-1);
    }

    var create_menu_api=
        `https://api.weixin.qq.com/cgi-bin/menu/create`
        +`?access_token=${t.access_token}`;

    ret = await gohttp.post(create_menu_api,{
        body : menu_data,
        headers : {
            //此消息头的key值都应该小写
            'content-type':'text/plain'
        }
    });
    //输出处理结果
    console.log(ret);
}

createMenu();