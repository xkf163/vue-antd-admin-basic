<template>
  <common-layout>
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" src="@/assets/img/logo.png" />
        <span class="title">{{systemName}}</span>
      </div>
      <div class="desc">Ant Design 是西湖区最具影响力的 Web 设计规范</div>
    </div>
    <div class="login">
      <a-form @submit="onSubmit" :form="form">
        <a-tabs size="large" :tabBarStyle="{textAlign: 'center'}" style="padding: 0 2px;">
          <a-tab-pane tab="账户密码登录" key="1">
            <a-alert type="error" :closable="true" v-if="error" :message="error" @close='onClose' showIcon style="margin-bottom: 24px;" />
            <a-form-item>
              <a-input
                autocomplete="autocomplete"
                size="large"
                placeholder="admin"
                v-decorator="['name', {rules: [{ required: true, message: '请输入账户名', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="user" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-input
                size="large"
                placeholder="888888"
                autocomplete="autocomplete"
                type="password"
                v-decorator="['password', {rules: [{ required: true, message: '请输入密码', whitespace: true}]}]"
              >
                <a-icon slot="prefix" type="lock" />
              </a-input>
            </a-form-item>

            <a-row :gutter="0">
              <a-col :span="16">
                <a-form-item>
                  <a-input
                          placeholder="请输入验证码"
                          type="text"
                          size="large"
                          autocomplete="off"
                          v-decorator="['inputCode', {rules: [{ required: true, message: '请输入验证码!', whitespace: true}]}]"
                  >
                    <a-icon slot="prefix" type="smile" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                  </a-input>
                </a-form-item>
              </a-col>
              <a-col :span="8" style="text-align: right">
                <img v-if="requestCodeSuccess" style="margin-top: 2px;" :src="randCodeImage" @click="handleChangeCheckCode"/>
                <img v-else style="margin-top: 2px;" src="../../assets/checkcode.png" @click="handleChangeCheckCode"/>
              </a-col>
            </a-row>


          </a-tab-pane>
          <a-tab-pane tab="手机号登录" key="2">
            <a-form-item>
              <a-input size="large" placeholder="mobile number" >
                <a-icon slot="prefix" type="mobile" />
              </a-input>
            </a-form-item>
            <a-form-item>
              <a-row :gutter="8" style="margin: 0 -4px">
                <a-col :span="16">
                  <a-input size="large" placeholder="captcha">
                    <a-icon slot="prefix" type="mail" />
                  </a-input>
                </a-col>
                <a-col :span="8" style="padding-left: 4px">
                  <a-button style="width: 100%" class="captcha-button" size="large">获取验证码</a-button>
                </a-col>
              </a-row>
            </a-form-item>
          </a-tab-pane>
        </a-tabs>
        <div>
          <a-checkbox :checked="true"  @change="handleRememberMeChange" >自动登录</a-checkbox>
          <a style="float: right">忘记密码</a>
        </div>
        <a-form-item>
          <a-button :loading="logging" style="width: 100%;margin-top: 24px" size="large" htmlType="submit" type="primary">登录</a-button>
        </a-form-item>
        <div>
          其他登录方式
          <a-icon class="icon" type="alipay-circle" />
          <a-icon class="icon" type="taobao-circle" />
          <a-icon class="icon" type="weibo-circle" />
          <router-link style="float: right" to="/dashboard/workplace" >注册账户</router-link>
        </div>
      </a-form>
    </div>
  </common-layout>
</template>

<script>
import CommonLayout from '@/layouts/CommonLayout'
import {getCodeImage} from '@/services/user' //getRoutesConfig ,
import {setAuthorization} from '@/utils/request'
import {loadRoutes} from '@/utils/routerUtil'
import {mapMutations,mapActions} from 'vuex'
import { timeFix } from '@/utils/util'

export default {
  name: 'Login',
  components: {CommonLayout},
  data () {
    return {
      requestCodeSuccess: false,
      randCodeImage: '',
      currdatetime: '',
      rememberMe: true,
      logging: false,
      error: '',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  created() {
    this.handleChangeCheckCode();
  },
  methods: {
    ...mapActions(['Login','GetPermissionList']),
    ...mapMutations('account', ['setUser', 'setPermissions', 'setRoles','setDeparts','setDictionaries']),
    handleRememberMeChange(e){
      this.rememberMe = e.target.checked
    },
    /**刷新验证码*/
    handleChangeCheckCode(){
      this.currdatetime = new Date().getTime();
      this.form.inputCode = ''
      getCodeImage(`${this.currdatetime}`).then(res=>{
        res = res.data
        if(res.success){
          this.randCodeImage = res.result
          this.requestCodeSuccess=true
        }else{
          this.$message.error(res.message)
          this.requestCodeSuccess=false
        }
      }).catch(()=>{
        this.requestCodeSuccess=false
      })
    },
    onSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err) => {
        if (!err) {
          this.logging = true

          let loginParams = {
            username: this.form.getFieldValue('name'),
            password: this.form.getFieldValue('password'),
            captcha: this.form.getFieldValue('inputCode'),
            checkKey: this.currdatetime,
            remember_me: this.rememberMe,
          }

          this.Login(loginParams).then((res) => {
            this.afterLogin(res)
          }).catch((err) => {
            console.log(err)
            //update-begin-author: taoyan date:20220425 for: 登录页面，当输入验证码错误时，验证码图片要刷新一下，而不是保持旧的验证码图片不变 #41
            if(err && err.code===412){
              this.handleChangeCheckCode();
            }
            //update-end-author: taoyan date:20220425 for: 登录页面，当输入验证码错误时，验证码图片要刷新一下，而不是保持旧的验证码图片不变 #41
            this.requestFailed(err)
          });
        }
      })
    },
    afterLogin(res) {
      console.log("afterLogin",res)
      this.logging = false
      const loginRes = res
      if (loginRes.code >= 0) {
        const {userInfo,departs,sysAllDictItems} = loginRes.result
        this.setUser(userInfo)
        this.setDeparts(departs)
        this.setDictionaries(sysAllDictItems)
        //this.setPermissions(permissions) -, permissions, roles
        //this.setRoles(roles)
        setAuthorization({token: loginRes.result.token, expireAt: new Date(loginRes.result.expireAt)})



        //获取路由配置
        this.GetPermissionList().then(result => {
          result = result.result
          console.log(result)
          const routesConfig = result.menu
          loadRoutes(routesConfig)

          this.$router.push({ path: "/demo" }).catch(()=>{
            console.log('登录跳转首页出错,这个错误从哪里来的')
          })
          this.$notification.success({
            message: '欢迎',
            description: `${timeFix()}，欢迎回来`,
          });

        })
      } else {
        this.error = loginRes.message
      }
    },

    //登录后台失败
    requestFailed (err) {
      let description = ((err.response || {}).data || {}).message || err.message || "请求出现错误，请稍后再试"
      this.$notification[ 'error' ]({
        message: '登录失败',
        description: description,
        duration: 4,
      });
      //账户密码登录错误后更新验证码
      if(this.customActiveKey === 'tab1' && description.indexOf('密码错误')>0){
        this.handleChangeCheckCode()
      }
      this.logging = false;
    },

    onClose() {
      this.error = false
    }
  }
}
</script>

<style lang="less" scoped>
  .common-layout{
    .top {
      text-align: center;
      .header {
        height: 44px;
        line-height: 44px;
        a {
          text-decoration: none;
        }
        .logo {
          height: 44px;
          vertical-align: top;
          margin-right: 16px;
        }
        .title {
          font-size: 33px;
          color: @title-color;
          font-family: 'Myriad Pro', 'Helvetica Neue', Arial, Helvetica, sans-serif;
          font-weight: 600;
          position: relative;
          top: 2px;
        }
      }
      .desc {
        font-size: 14px;
        color: @text-color-second;
        margin-top: 12px;
        margin-bottom: 40px;
      }
    }
    .login{
      width: 368px;
      margin: 0 auto;
      @media screen and (max-width: 576px) {
        width: 95%;
      }
      @media screen and (max-width: 320px) {
        .captcha-button{
          font-size: 14px;
        }
      }
      .icon {
        font-size: 24px;
        color: @text-color-second;
        margin-left: 16px;
        vertical-align: middle;
        cursor: pointer;
        transition: color 0.3s;

        &:hover {
          color: @primary-color;
        }
      }
    }
  }
</style>
