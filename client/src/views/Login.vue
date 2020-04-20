<template>
    <div class="login">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title"> Sign in </span>
                <el-form :model="loginUser" :rules="rules" ref="loginForm" label-width="80px" class="loginForm">
                    <el-form-item label="email" prop="email">
                        <el-input  v-model="loginUser.email" placeholder="Please enter email"></el-input>
                    </el-form-item>
                    <el-form-item label="password" prop="password">
                        <el-input type="password" v-model="loginUser.password" placeholder="Please enter password"></el-input>
                    </el-form-item>
                    
                    <el-form-item>
                        <el-button type="primary" class="submit_btn" @click="submitForm('loginForm')">Sign in</el-button>
                    </el-form-item>
                    <div class="tiparea">
                        <p>No account yet?<router-link to='/register'>Create an account.</router-link> </p>
                    </div>
                </el-form>
            </div>
        </section>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode';
export default {
    name: 'login',
    components: {},
    data(){
        return {
            loginUser: {
                email: "",
                password: "",
            },
            rules:{
                email: [
                    {
                        type: "email",
                        required: true,
                        message: "E-mail format is incorrect",
                        trigger: "blur"
                    }
                ],
                password: [
                    {
                        required: true,
                        message: "Username can not be empty",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 20,
                        message: "Password length is between 2 and 10",
                        trigger: "blur"
                    }
                ],

            }
        }
    },
    methods:{
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$http.post('/api/users/login', this.loginUser)
                .then(res => {
                    // token 存储到 localstorage
                    const { token } = res.data;
                    localStorage.setItem('eleToken', token);
                    // 解析token 
                    const decode = jwt_decode(token)

                    // 将token存储到vuex中
                    this.$store.dispatch('setAuthenticated', !this.isEmpty(decode))
                    this.$store.dispatch('setUser', decode)

                    this.$router.push('/index');
                    this.$store.dispatch('setIndex', 'index');
                })
                
            } else {
                console.log('error submit!!');
                return false;
            }
            }); 
            
        },
        isEmpty(value){
            return (
                value === undefined ||
                value === null ||
                (typeof value === 'object' && Object.keys(value).length===0) ||
                (typeof value === 'string' && value.trim().length===0)
            );
        },
    }
}
</script>

<style scoped>
.login {
  position: relative;
  width: 100%;
  height: 100%;
  background: url(../assets/bg2.jpg) no-repeat center center;
  background-size: 100% 100%;
}
.form_container {
  width: 370px;
  height: 210px;
  position: absolute;
  top: 10%;
  left: 40%;
  padding: 25px;
  border-radius: 5px;
  text-align: center;
}
.form_container .manage_tip .title {
  font-family: "Microsoft YaHei";
  font-weight: bold;
  font-size: 26px;
  color: #fff;
}
.loginForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.submit_btn {
  width: 100%;
}
.tiparea {
  text-align: right;
  font-size: 12px;
  color: #333;
}
.tiparea p a {
  color: #409eff;
}
</style>


