const config={
    port: 3001,
    expireTime: 60*60*1000,

    getDbConnection: function(){
        return ''
    },
secrets:{
    jwt: process.env.JWT || 'secret',
}
}
module.exports= config