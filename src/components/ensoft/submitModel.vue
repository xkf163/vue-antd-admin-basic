<template>
<div >
  <a-modal :visible="visible" title="流程信息" ok-text="确认" cancel-text="取消" @cancel="close" :confirm-loading="confirmLoading" @ok="onSubmit" :height="150" :width="700">
    <div class="wBody">
        <a-icon type="question-circle" />
        <span v-show="businessName=='月报'"><span>是否{{submitType}}月报到</span><span>{{message}}</span>?</span>
        <span v-show="businessName=='季报'" > 是否{{submitType}}月报到<span  class="stargeSize">{{message}}</span>?</span>
        <span v-show="businessName=='日报'" > 是否{{submitType}}日报到<span  class="stargeSize">{{message}}</span>?</span>
        <span v-show="businessName=='异常报送'" > 是否{{submitType}}异常报送到<span  class="stargeSize">{{message}}</span>?</span>
        <span v-show="businessName=='问题整改'" > 是否{{submitType}}年报到<span  class="stargeSize">{{message}}</span>?</span>
        <span v-show="businessName=='监管机构'" > 是否将问题整改提交到<span  class="stargeSize">监管机构</span>?</span>
        <span v-show="businessName=='现场检查'" > 是否将问题整改{{submitType}}到<span  class="stargeSize">{{message}}</span>?</span>
        <span class="wText" v-show="businessName=='年报'" >{{submitType}}年报到{{message}}，是否继续？</span>
    </div>

      <a-divider orientation="right">
          您的意见：
      </a-divider>
     <a-form-model  ref="ruleForm" :model="formData" >
            <a-col v-show="submitType=='提交'||submitType=='退回'">
              <a-form-model-item prop="opinions" >
                <a-textarea placeholder="请在此输入您的意见"  v-model="formData.opinions" />
              </a-form-model-item>
            </a-col>
     </a-form-model>

  </a-modal>

  </div>
</template>
<script>

export default {
  name: 'submitModel',
  data() {
    return {
      formData:{
        opinions:"",
      },
      confirmLoading: false,
      visible:false,
      userId:"",
      // 流程id，
      processInstanceId:"",
      message:"",
      submitType:"",
      businessName:""
    }
  },
  created() {
      this.userId=JSON.parse(window.localStorage.getItem('admin.user')).id
  },
  methods: {




   onSubmit(){
     this.confirmLoading = true;
    if(this.submitType=='退回' && this.formData.opinions==''){
      this.$message.error('意见不能为空')
      return
    }else{
      let obj={type:this.submitType,item:this.formData.opinions}
      this.$emit('onSubmit',obj)
    }
    this.formData.opinions=''
   },



    // 关闭弹窗
    close() {
      this.visible = false
      // this.$eventBus.$emit('treeAmdale',true)
      if(this.type=='提交'){
        // this.$eventBus.$emit('treeAmdale',true)

      }else{
        this.$emit('onSubmitTwo',true)
      }
      this.formData.opinions=''
    },

  },

}
</script>
<style  scoped lang="less">

/deep/ .ant-modal-body{
  height: 200px;
}
.colTwo{
  margin-top: -10px;
}
.button{
  margin-right: 1vw;
}

.wText{
    display: block;
    overflow: hidden;
    color: rgba(0,0,0,.85);
    font-weight: 500;
    font-size: 16px;
    line-height: 1.4;
}

    .anticon{
        color: #faad14;
        float: left;
        margin-right: 16px;
        font-size: 22px;
    }

    .wBody{
        padding: 0px;
        font-size: 14px;
        line-height: 1.5;
        word-wrap: break-word;
    }

</style>
