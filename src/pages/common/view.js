import { request } from '@/utils/request'
export const myViewMixin = {
    data() {
        return {
            userId: '',
        }
    },
    methods: {
        listData(data){
            return request(this.url.list, "post", data)
        },
        //  判断用户是几级部门
        userType() {
            let arry = JSON.parse(window.localStorage.getItem("admin.user"))
            let code = arry.orgCode
            let str = code.length
            let length = str / 3
            return length
        }

    }
}
