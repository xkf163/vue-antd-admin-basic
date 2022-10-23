
import { request } from '@/utils/request'
import Vue from "vue";
export const myWFlowMixin = {
    data(){
        return {
            url: {
                opinion : "/jeecg-demo/Process/getOpinion",
                processStart : "/jeecg-demo/Process/start",
                getNextUserList : "/jeecg-cloud-flowable/sys/work/nextAllCandidate/",
                submit: "/jeecg-cloud-flowable/sys/work/beforeAllCandidate/",
                finalSubmit : "/jeecg-demo/Process/addOpinionsAndAgent"
            },
            columnsWFRecord: [
                {
                    title: '序号',
                    dataIndex: 'rowIndex',
                    customRender: function (t, r, index) {
                        return parseInt(index) + 1;
                    }
                },

                {
                    title: '接收时间',
                    dataIndex: 'createTime',
                    width: "10%",

                },
                {
                    title: '接收部门',
                    dataIndex: 'departmentList',
                    scopedSlots: { customRender: 'departmentList' },
                },
                {
                    title: '办理人',
                    dataIndex: 'assignee',
                },
                {
                    title: '流程环节',
                    dataIndex: 'taskName',
                },
                {
                    title: '提交时间',
                    dataIndex: 'updateTime',
                    width: "10%"
                },
                {
                    title: '下一步处理',
                    dataIndex: 'nextSend',
                    scopedSlots: { customRender: 'nextSend' },
                },
            ],
        }
    },
    methods: {
        //获取下一处理人，返回用户，用户填写意见
        SendTransitionRequest(userAction){
            //alert(userAction == "submit")
            // 提交
            if (userAction == "提交") {
                request(this.url.getNextUserList+this.form.processInstanceId, "get").then(res => {
                    this.$refs.submitModel.visible = true
                    this.$refs.submitModel.message = res.data.result.join("，")
                    this.$refs.submitModel.submitType = userAction
                    this.$refs.submitModel.businessName=this.businessName
                })
            }
            if (userAction == "退回") {
                request(this.url.submit+this.form.processInstanceId, "get").then(res => {
                    if (res.data.code == '200') {
                        this.$refs.submitModel.visible = true
                        this.$refs.submitModel.message = res.data.result
                        this.$refs.submitModel.submitType = userAction
                        this.$refs.submitModel.businessName=this.businessName
                    } else {
                        Vue.prototype.$Jnotification.error({ message: '系统提示', description: '获取下一步处理人失败，请联系管理员' })
                    }
                })
            }
        },

        //提交/退回:业务页面调用入口
        WFSubmit(userAction){
            //1）校验必填项
            //2) 提交流程引擎请求
            //userAction
            //action: submit 提交:goback 退回
            this.SendTransitionRequest(userAction)
        },



        // 判断提交的类型：对话框确认操作调用
        SendSubmitRequest(res) {
            if (res.type == '提交') {
                this.onSubmited(res.item) //res.item=用户写的意见
            } else if (res.type == '退回') {
                this.goBackedQuery(this.form.infoNumber, this.form.processInstanceId, res.item, this.form.reportType, this.businessName)
            }
        },
        // 执行提交
        async onSubmited(item) {
            let data = {
                opinions: item ? item : '',
                flowName: this.businessName,
                infoNumber: this.form.infoNumber,
                userId: this.userId,
                processInstanceId: this.form.processInstanceId ? this.form.processInstanceId : "",
                operationType: 0,
            }
            let res = await request(this.url.finalSubmit, "post", data)
            if (res.data.code == '200') {

                this.DocSave(this.url.edit)
                this.$refs.submitModel.visible = false
                this.$emit('closeTab', this.$route.path)
            } else {
                this.$message.error(res.data.message)
            }
        },



        //启动流程
        async WFProcessStart(){
            let flowData = {
                userId: this.userId,
                flowName: this.businessName, //流程名称，用于后端查找流程配置
            }
            let res = await request(this.url.processStart, "post", flowData)
            if (res.data.code == '200') {
                this.form.processInstanceId = res.data.result.processInstanceId
                return true
            }else {
                this.spinning=false
                this.$message.error('流程启动失败,请联系管理员!')
                return false
            }
        },

        //保存/更新
        async WFSave(){
            this.spinning=true
            if (this.isNewDoc) {
                //1)启动流程,返回流程id
                let ret = await this.WFProcessStart()
                if (ret) {
                    //2)保存
                    ret = await this.DocSave(this.url.add)
                    //3)url更新
                    if (ret){
                        await this.$router.push({
                            path: this.$route.path,
                            query: {
                                id: this.form.id,
                            },
                        })
                        this.spinning=true
                        await this.onLoad()
                    }
                }
            }else{
                //1)保存
                if (await this.DocSave(this.url.edit)){
                    this.$message.success('保存成功')
                }
            }
        },

        // 关闭弹窗
        colseSumbit() {
            this.$refs.submitModel.visible = false
        },

        //切换标签页
        WFChangeTab(key){
            console.log(key);
            if (this.isNewDoc ==  false){
                if (key==2){
                   //this.getOpinion(this.form.processInstanceId)
                    request(this.url.opinion, "get", this.form.processInstanceId).then(res=>{
                        this.opinionList = res.data.result.list
                    })
                }
                if (key==3){
                    //this.getOpinion(this.form.processInstanceId)
                }
            }
        },




    }
}
