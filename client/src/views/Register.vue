<template>
    <div class="register">
        <section class="form_container">
            <div class="manage_tip">
                <span class="title"> Create your account</span>
                <el-form :model="registerUser" :rules="rules" ref="registerForm" label-width="80px" class="registerForm">
                    
                    <el-form-item label="username" prop="name">
                        <el-input  v-model="registerUser.name" placeholder="Please enter a user name"></el-input>
                    </el-form-item>
                    <el-form-item label="email" prop="email">
                        <el-input  v-model="registerUser.email" placeholder="Please enter email address"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="password" prop="password">
                        <el-input type="password" v-model="registerUser.password" placeholder="Please enter password "></el-input>
                    </el-form-item>
                    <el-form-item label="confirm" prop="checkPass">
                        <el-input type="password" v-model="registerUser.checkPass" placeholder="Please confirm your password"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="选择身份" prop="identity">
                        <el-select v-model="registerUser.identity" placeholder="请选择">
                            <el-option label="管理员" value="manager"> </el-option>
                            <el-option label="用户" value="employee"> </el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" class="submit_btn" @click="submitForm('registerForm')">Create account</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: 'register',
    components: {},
    data(){
        var validatePass2 = (rule, value, callback) => {
            if (value !== this.registerUser.password) {
            callback(new Error('Two passwords are inconsistent!'));
            } else {
            callback();
            }
        };
        return {
            registerUser: {
                name: "",
                email: "",
                password: "",
                checkPass: "",
                identity: "user",
            },
            rules:{
                name: [
                    {
                        required: true,
                        message: "Username can not be empty",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 10,
                        message: "Username length is between 2 and 10",
                        trigger: "blur"
                    }
                ],
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
                        message: "Password can not be empty",
                        trigger: "blur"
                    },
                    {
                        min: 2,
                        max: 20,
                        message: "Password length is between 2 and 10",
                        trigger: "blur"
                    }
                ],
                checkPass: [{
                        required: true,
                        message: "confirm password can not be blank",
                        trigger: "blur"
                    },{
                        min: 2,
                        max: 20,
                        message: "Password length is between 2 and 10",
                        trigger: "blur"
                    },{
                       validator: validatePass2,
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
                this.$http.post('/api/users/register', this.registerUser)
                .then(res => {
                    this.$message({
                        message: "Account created successfully",
                        type: "success"
                    })
                })
                this.$router.push('/login')
            } else {
                console.log('error submit!!');
                return false;
            }
            }); 
            
        }
    }
}
</script>

<style scoped>
.register {
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
.registerForm {
  margin-top: 20px;
  background-color: #fff;
  padding: 20px 40px 20px 20px;
  border-radius: 5px;
  box-shadow: 0px 5px 10px #cccc;
}
.submit_btn {
  width: 100%;
}
</style>


