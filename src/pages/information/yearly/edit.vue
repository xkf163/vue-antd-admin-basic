<template>
    <div style="background:#fff;height: calc(100vh - 135px);margin-top: 8px;">
        <a-spin size="large" :spinning="spinning">
            <div class="boxed">
                <h2>年报</h2>
                <div style="display:flex" class="buttonGroup">
                    <a-button type="primary" class="buttonList" @click="close()" icon="close-circle">关闭</a-button>
                    <a-button type="primary" class="buttonList" @click="save()" icon="save"
                              v-show="isNewDoc || operation.includes(0)">
                        保存
                    </a-button>
                    <a-button type="primary" @click="submit('提交')" class="buttonList" icon="swap"
                              v-show="operation.includes(1)">
                        提交
                    </a-button>
                    <a-button type="primary" class="buttonList" @click="submit('退回')" v-show="operation.includes(2)">
                        退回
                    </a-button>
                </div>
            </div>
            <div style="margin:0 0 0 32px">
                <a-tabs default-active-key="1" type="card" @change="WFChangeTab" >
                    <a-tab-pane key="1" tab="信息概况">
                        <a-form-model :label-col="{ span: 11 }" :wrapper-col="{ span: 10 }" ref="ruleForm" :model="form"
                                      :rules="rules">
                            <a-col :span="12" :pull="4">
                                <a-form-model-item label="流水号" prop="infoNumber">
                                    <a-input v-model="form.infoNumber" :disabled="true" placeholder="系统自动计算" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12" :pull="6">
                                <a-form-model-item label="报送日期" prop="submittedTime">
                                    <a-input v-model="form.submittedTime" :disabled="true" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12" :pull="4">
                                <a-form-model-item label="填报人" prop="filledBy">
                                    <a-input v-model="form.filledBy" :disabled="true" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12" :pull="6">
                                <a-form-model-item prop="createTime" label="填录日期">
                                    <a-date-picker show-time format="YYYY-MM-DD HH:mm" value-format="YYYY-MM-DD HH:mm"
                                                   v-model="form.updateTime" style="width:17.4vw" :disabled="true" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12" :pull="4">
                                <a-form-model-item label="填报单位" prop="reportingUnit">
                                    <a-input v-model="form.reportUnit" :disabled="true" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12" :pull="6">
                                <a-form-model-item label="报告年度" prop="year" :required="true">
                                    <a-select v-model="form.year" :disabled="!canEdit">
                                        <a-select-option v-for="(item, index) in yearList" :key="index"
                                                         :value="item.title">
                                            {{ item.title }}</a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="12" :pull="4">
                                <a-form-model-item label="报告类别" :required="true" prop="reportCategory">
                                    <a-select placeholder="请选择类别" v-model="form.reportCategory" style="width:17.4vw"
                                              :disabled="!canEdit">
                                        <a-select-option v-for="(item, index) in dictCode" :key="index"
                                                         v-model="item.value">{{ item.title }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="23" :pull="9">
                                <a-form-model-item label="内容" prop="content" :required="true">
                                    <a-textarea placeholder="请输入内容" allow-clear v-model="form.content"
                                                style="width:51.8vw" :disabled="!canEdit" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="23" :pull="9">
                                <a-form-model-item label="备注" prop="remarks">
                                    <a-textarea placeholder="请输入备注" allow-clear v-model="form.remarks"
                                                style="width:51.8vw" :disabled="!canEdit" />
                                </a-form-model-item>
                            </a-col>
                            <a-col :span="23" :pull="9" style="margin-left:5px">

                                <a-form-item label="附件管理" extra="请上传符合格式的文件">
                                    <a-upload
                                            v-decorator="[
                                              'upload',
                                              {
                                                valuePropName: 'fileList',
                                                getValueFromEvent: normFile,
                                              },
                                            ]"
                                            name="attachments"
                                            action="/upload.do"
                                            list-type="picture"
                                    >
                                        <a-button> <a-icon type="upload" /> 上传 </a-button>
                                    </a-upload>
                                </a-form-item>

                            </a-col>

                            <!--隐藏字段-->
                            <a-col span="0">
                                <a-form-model-item label="环节名称" prop="wfStateNameList">
                                    <a-input v-model="form.wfStateNameList" />
                                </a-form-model-item>
                                <!--                                <a-form-model-item label="流程名称及版本号" prop="wfProcessName">-->
                                <!--                                    <a-input v-model="form.wfProcessName" />-->
                                <!--                                </a-form-model-item>-->
                                <!--                                <a-form-model-item label="流程ID" prop="wfProcessId">-->
                                <!--                                    <a-input v-model="form.wfProcessId" />-->
                                <!--                                </a-form-model-item>-->
                                <a-form-model-item label="流程实例ID" prop="processInstanceId">
                                    <a-input v-model="form.processInstanceId" />
                                </a-form-model-item>
                                <a-form-model-item label="业务数据UNID" prop="id">
                                    <a-input v-model="form.id" />
                                </a-form-model-item>
                                <!--                                <a-form-model-item label="删除标记" prop="trashFlag">-->
                                <!--                                    <a-input v-model="form.trashFlag" />-->
                                <!--                                </a-form-model-item>-->
                            </a-col>

                        </a-form-model>
                    </a-tab-pane>
                    <a-tab-pane key="2" tab="所有意见" >
                        <div style="height:calc(100% - 30px);margin-bottom:30px" slot="label">
                            <div v-show="isNewDoc && opinionList.length>0" style="width:58vw">
                                <a-row :pull="2" style="margin-left:1vw;" v-for="(item,index) in opinionList"
                                       :key="index">
                                    <div>
                                        <a-col :span="5" style="color:#000000">{{item.taskName}}：</a-col>
                                        <a-col :span="19">
                                            <div style="margin-top:20px;margin-left: -2vw;">
                                                <p><span
                                                        style="color:black">{{item.assignee}}</span>({{item.departmentList.slice(1).join("/")}}){{item.updateTime}}
                                                </p>
                                                <P>{{item.opinions}}</P>
                                            </div>
                                        </a-col>
                                    </div>
                                </a-row>
                            </div>
                        </div>
                    </a-tab-pane>
                    <a-tab-pane key="3" tab="流程跟踪">
                        <div class="historyMessage">
                            <a-table :columns="columnsWFRecord" :data-source="transferList" bordered style="width:58vw"
                                     :pagination="false" v-show="isNewDoc && transferList.length>0">
                                <template v-for="col in ['序号', '流水号', '起草人']" :slot="col" slot-scope="text">
                                    <div :key="col">
                                        <template>
                                            {{ text }}
                                        </template>
                                    </div>
                                </template>
                                <template slot="departmentList" slot-scope="index, record">
                                    <div class="editable-row-operations">
                                        <div v-for="item in record.departmentList.slice(1)" :key="item">
                                            <div>{{item}}</div>
                                        </div>
                                    </div>
                                </template>
                                <template slot="nextSend" slot-scope="index, record">
                                    <div class="editable-row-operations">
                                        <div style="color:black">{{record.deleteReason}}: </div>
                                        <div v-for="(item,index) in record.nextUsers" :key="item">
                                            <div>{{item}}({{record.nextDepts[index][index]}})</div>
                                        </div>
                                    </div>
                                </template>
                            </a-table>
                        </div>
                    </a-tab-pane>
                </a-tabs>
                <submitModel ref="submitModel" @onSubmit="SendSubmitRequest" @onSubmitTwo="colseSumbit"></submitModel>
            </div>
        </a-spin>
    </div>
</template>
<script>
    import { myFormMixin } from '@/pages/common/form'
    import { myWFlowMixin } from '@/pages/common/workflow'

    export default {
        mixins: [myFormMixin,myWFlowMixin],
        components: {
            submitModel: () => import('@/components/ensoft/submitModel.vue'),
        },
        data() {
            return {
                spinning: true,
                operation: [], //操作按钮显示用
                isNewDoc:"", //是否新文档
                isEditor: false, //是否有编辑者身份
                canEdit: false, //元素是否开源编辑
                form: {},
                opinionList:[],
                transferList:[],
                rules: {
                    reportCategory: [{ required: true, message: '请选择报告类别', trigger: 'change' }],
                    year: [{ required: true, message: '请选择报告年度', trigger: 'change' }],
                },
                //visible: false,
                //文件列表
                fileList: [],
                yearList: [],
                dictCode: [],
                businessName: "年报",
                url:{
                    add: "/jeecg-demo/reportYear/reportYear/add",
                    edit: "/jeecg-demo/reportYear/reportYear/edit",
                    get: "/jeecg-demo/reportYear/reportYear/list",
                    unique: "/jeecg-demo/reportYear/reportYear/unique"
                }
            }
        },
        methods: {
            save(){
                //必填校验
                this.WFSave()
            },
            submit(action){
                //必填校验
                this.WFSubmit(action)
            },
            // 执行退回
            // goBackedQuery(infoNumber, processInstanceId, opinions, reportType, flowName) {
            //     goBack(infoNumber, processInstanceId, opinions, reportType, flowName).then(res => {
            //         if (res.data.code == "200") {
            //             //this.editQuarterlyReported(0, "退回")
            //             this.form.releaseStatus = 0
            //             this.save()
            //             this.$emit('closeTab', "/childenPages/addYear")
            //         } else {
            //             this.$message.error(res.data.message)
            //         }
            //     })
            // },
            //校验
            validate(){
            },
        },
        created() {
            console.log("in created")
            //业务逻辑1
            this.getDictItem("yearlyType","dictCode")
            this.yearList = this.yearsListed
            this.onLoad()
        },
        mounted() {
            console.log("in mounted")
        },
        activated() {
            console.log("in activated")
        }

    }
</script>
<style  scoped>
    /deep/ .ant-alert.ant-alert-closable {
        background: #d9edf7 !important;
        padding: 15px 30px;
        font-size: 16px;
        color: #eee;
        font-weight: 600;
    }

    h2 {
        margin-left: 32px;
        margin-bottom: 20px;
        padding-top: 40px;
        font-weight: 600;
        font-size: 20px;
        margin-top: -15px;
    }
    .buttonGroup{
        padding-top: 24px;
        margin-right: 24px;
    }
    .buttonList {
        margin: 8px;
    }

    .boxed {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
</style>
