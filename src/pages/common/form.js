import { request } from '@/utils/request'

export const myFormMixin = {
    data() {
        return {
            url: {
                dict: "/jeecg-system/sys/dict/getDictItemByDictCode/"
            },
            userId: '',
        }
    },
    methods: {

        // 生成年份列别
        yearsListed() {
            let nowDate = new Date()
            let year = nowDate.getFullYear()
            let yearList = []
            for (var i = 0; i < 10; i++) {
                let object = {
                    value: i,
                    title: year--
                }
                yearList.push(object)
            }
            return yearList
        },

        normFile(e) {
            console.log('Upload event:', e);
            if (Array.isArray(e)) {
                return e;
            }
            return e && e.fileList;
        },

        //页面初始化
        async onLoad(){
            console.log("onLoad mixin start: "+this.isNewDoc)
            // this.isNewDoc = this.$route.query.id == "-1" ? true : false
            // this.form.id = this.$route.query.id == "-1" ? "" : this.$route.query.id
            console.log("this.$route.params")
            console.log(this.$route.params)
            this.isNewDoc = this.$route.params.id == "-1" ? true : false
            this.form.id = this.$route.params.id == "-1" ? "" : this.$route.params.id
            // this.form.infoNumber = this.$route.params.infoNumber

            this.userId = JSON.parse(window.localStorage.getItem('neastationmanagesystem.user')).realname
            if (this.isNewDoc){
                this.operation = []
                this.form.wfStateNameList = "新建"
                this.isEditor = true
                this.form.reportUnit = JSON.parse(window.localStorage.getItem("pro__Login_Userinfo"))[0].departName
                this.form.filledBy = JSON.parse(window.localStorage.getItem("admin.user")).realname
            }else{
                let res = await request(this.url.get, "get", {"id":this.form.id})
                //let res = await request(this.url.get+"?infoNumber="+this.form.infoNumber, "get")
                if (res.data.code == '200') {
                    this.form = res.data.result.records[0]
                    this.operation = res.data.result.records[0].operation
                    this.isEditor = res.data.result.records[0].authorize
                    //this.getOpinion(this.form.processInstanceId)
                } else {
                    this.$message.error(res.data.message)
                }
            }

            //业务逻辑1
            //isEditor:是否是编辑者
            if (this.isEditor && this.form.wfStateNameList == "新建"){
                this.canEdit = true
            }

            this.spinning = false
            //console.log(this.$data)
            console.log("onLoad mixin finish: "+this.isNewDoc)
        },


        //调用保存接口
        async DocSave(url){
            let res =  await request(url, "post", this.form)
            if (res.data.code == '200') {
                this.spinning=false
                this.form.id = res.data.result //业务数据unid
                this.isNewDoc = false
                return true
            } else {
                this.spinning=false
                this.$message.error(res.data.message)
                return false
            }
        },



        //关闭
        close(){
            this.$emit('closeTab', this.$route.path)
        },

        async getDictItem(dictType,fieldName){
            let res =  await request(this.url.dict+dictType, "get" )
            this[fieldName] = res.data
        }



    }
}
