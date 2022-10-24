<template>
    <div>
        <a-row class="topSearch">
            <div class="table-operator">
                <a-button @click="handleAddTWO" type="primary" icon="plus" v-show="length=='3'">新增</a-button>
                <a-button type="primary" icon="delete" @click="delect" class="left-12" :style="{marginLeft:length=='3'?'12px':'2px'}">删除</a-button>
                <a-button type="primary" icon="redo" @click="shua" class="left-12">刷新</a-button>
                <a-input class="inputvAaule left-12" placeholder="请输入查询条件" v-model="getDataParmas.title" />
                <a-button type="primary" icon="search" class="left-12" @click="fileSearch">查询</a-button>
            </div>
        </a-row>
        <a-row class="topSearch topSearched">
            <a-table :columns="columns" :data-source="dataSource" bordered :pagination="pagination" :loading="loading"
                     @change="handleTableChange" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }" :customRow="rowClick">
                <template v-for="col in ['rowIndex', 'reportYear', 'reportQuarter', 'infoNumber']" :slot="col" slot-scope="text">
                    <div :key="col">
                        {{ text }}
                    </div>
                </template>
                <template slot="releaseStatus" slot-scope="item,record">
                    <div class="editable-row-operations">
                        <div><span>{{record.filledBy}}</span>【{{record.releaseStatus=='0'?'新建':''}}】</div>
                    </div>
                </template>

            </a-table>
        </a-row>

    </div>
</template>

<script>
    import { myViewMixin } from '@/pages/common/view'
    export default {
        mixins: [myViewMixin],
        name: 'ArticleListYear',
        data() {
            return {
                description: '新建年报',
                // 表头
                columns: [
                    {
                        title: '序号',
                        dataIndex: '',
                        key: 'rowIndex',
                        customRender: function (t, r, index) {
                            return parseInt(index) + 1;
                        }
                    },
                    {
                        title: '年度',
                        dataIndex: 'year',
                    },
                    {
                        title: '填报单位',
                        width: "30%",
                        dataIndex: 'reportUnit',
                    },
                    {
                        title: '报告类别',
                        dataIndex: 'reportCategory',
                        customRender: function (t) {
                            let ret  = t
                            switch (t){
                                case "1":
                                    ret = "企业本年度的安全生产责任制"  // 当表达式的结果等于 value1 时，则执行该代码
                                    break;
                                case "2":
                                    ret = "上一年度安全生产工作总结"
                                    break;
                                case "3":
                                    ret = "安全风险管控年度报告"
                                    break;
                                case "4":
                                    ret = "隐患排查治理年度总结"
                                    break;
                                case "5":
                                    ret = "电力安全生产标准化企业自查报告"
                                    break;
                                case "6":
                                    ret = "技术监督年报"
                                    break;
                            }
                            console.log(ret)
                            return ret;
                        }
                    },
                    {
                        title: '起草时间',
                        dataIndex: 'updateTime',
                    },
                    {
                        title: '状态',
                        scopedSlots: { customRender: 'releaseStatus' },
                        dataIndex: 'releaseStatus'
                    },
                    {
                        title: '编号',
                        dataIndex: 'infoNumber'
                    },

                ],
                // 表格所选的数据

                // 表格数据
                dataSource: [],
                selectRowsList: [],
                selectedRowKeys: [],
                number: "100",
                pagination: {
                    showSizeChanger: true,
                    hideOnSinglePage: true, // 只有一页时是否隐藏分页器
                    showTotal: (total, range) => `共${total}条数据，此页数据为${range[0]}-${range[1]}`, // 分页中显示总的数据
                },
                titleTop: "新增年报",
                form: {},
                // typeDisabled: false,
                // 检查列表
                dictCode: [],
                // typeName: "0",
                getDataParmas: {
                    pageNo: "1",
                    pageSize: "10",
                    title: "",
                    wfStateNameList: "新建",
                },
                loading:true,
                url:{
                    list: '/reportYear/reportYear/list'
                }
            }
        },
        created() {
            this.length=this.userType
        },
        computed: {

        },
        methods: {
            rowClick: function (record) {
                return {
                    on: {
                        dblclick: async () => {
                            this.edit(record)
                        }
                    }
                }
            },
            onSelectChange(selectedRowKeys, selectedRows) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectRowsList = selectedRows
            },
            // 新增
            handleAddTWO() {

                this.$router.push({
                    path: "/childenPages/addYear",
                    query:{
                        id:"-1",
                    }

                })
            },
            // 条件筛选
            fileSearch() {
                this.getDataParmas.pageNo = "1"
                this.getDataParmas.pageSize = "10"
                this.initData(this.getDataParmas)
            },
            // 删除
            delect() {
                //   if (this.selectRowsList.length>0) {
                //     let objList=[]
                //    this.selectRowsList.map(item=>{
                //     objList.push(item)
                //    })
                //     informationEditTwo(objList).then(res => {
                //         if (res.code == '200') {
                //         this.$message.success('操作成功');
                //          this.initData(this.getDataParmas)
                //          this.selectedRowKeys = [];
                //          this. selectRowsList= []

                //         } else {
                //           this.$message.warning('操作失败');
                //         }
                //     })
                //   } else {
                //     this.$message.warning('请选择要一条数据');
                //   }
            },
            // 分页查询
            handleTableChange(pagination) {
                this.getDataParmas.pageNo = pagination.current
                this.getDataParmas.pageSize = pagination.pageSize
                this.initData(this.getDataParmas)
            },
            // 查询
            async initData(data) {

                    let res = await this.listData(data)
                    this.loading=false
                    const pagination = { ...this.pagination };
                    pagination.total = res.data.result.total
                    this.dataSource = res.data.result.records;
                    this.pagination = pagination;

            },
            // 刷新
            shua() {
                this.getDataParmas = {
                    pageNo: "1",
                    pageSize: "10",
                    title: "",
                    releaseStatus: 0,
                }
                this.pagination.current = 1,
                    this.pagination.pageSize = 10
                this.handleTableChange(this.pagination)
            },
            // 编辑
            async edit(record) {
                this.$router.push({
                    path: "/childenPages/addYear",
                    query: {
                        id: record.id,
                    },
                })
            }
        },
        mounted() {
            this.initData(this.getDataParmas)
        },
        activated(){
            this.initData(this.getDataParmas)
        }
    }
</script>
<style scoped  lang="less">
    // @import '~@assets/less/common.less';
    .table-operator {
        display: flex
    }

    /deep/ .ant-table-tbody {
        background: #fff;
    }

    .inputvAaule {
        width: 15vw;
    }

    .topSearch {
        margin-left: 1vw;
    }

    .topSearched {
        margin-top: 20px;
        margin-right: 20px;
    }

    .editable-row-operations {
        display: flex;
        justify-content: space-evenly;
    }

    /deep/ .tabs-view-content {
        margin-top: -47px;

    }

    /deep/ .left-12 {
        margin-left: 12px
    }

</style>
