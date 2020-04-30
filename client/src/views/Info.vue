<template>
    <div class="personInfo">
        <el-row class="row" type="flex" justify="center">
            <el-col  :span=24>
                    <div class="user-item">
                        <div class="title">name </div>
                        <div class="action" v-if="isNameClicked">
                          <div class="info">{{user.name}}</div> &#12288;
                          <div class="edit"  @click="editFunc('isNameClicked')">edit</div>
                        </div>
                        <div v-else>
                            <el-row>
                                <el-col :span=12><el-input v-model="user.name" placeholder="name" @input="change($event)"></el-input></el-col>
                                <el-col :span=12><button class="saveBtn" @click="saveFunc('name', 'isNameClicked')">save</button> <button class="cancelBtn" @click="cancelFunc('isNameClicked')">cancel</button></el-col>
                            </el-row>
                        </div>
                    </div>
            </el-col>
        </el-row>
        <el-row class="row" type="flex" justify="center">
              <el-col :span=24>
                    <div class="user-item">
                        <div class="title">email </div>
                        <div class="action" v-if="isEmailClicked">
                          <div class="info">{{user.email}}</div> &#12288;
                        </div>
                        <div v-else>
                          <el-input v-model="user.email" placeholder="email"></el-input>
                          <button class="saveBtn" @click="saveFunc('email', 'isEmailClicked')" >save</button> <button class="cancelBtn" @click="cancelFunc('isEmailClicked')">cancel</button>
                        </div>
                    </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "info",
    data() {
      return {
        user: {
            name: this.$store.getters.user.name,
            email: this.$store.getters.user.email,
        },
        isNameClicked: true,
        isEmailClicked: true,
        isPasswordClicked: true,
      }
    },
    methods: {
        editFunc: function(clicked){
            this[clicked] = !this[clicked];
        },
        saveFunc: function(propery, clicked){
            const id = this.$store.getters.user.id;
            const that = this;
            this.$api.user.editUserInfo(id, {
                name: propery,
                value: this.user[propery],
            }).then(res => {
                const data = res.data[propery];
                let user = this.$store.getters.user;
                user[propery] = data;
                this.$store.dispatch('setUser', user);
                that[clicked] = !that[clicked];
            })
        },
        cancelFunc: function(clicked) {
            this[clicked] = !this[clicked];
        },
        change: function(e) {
            this.$forceUpdate();
        }
    }
}
</script>

<style scoped>
.row {
	font-size: 14px;
    padding-left: 12px;
    padding-right: 12px;
	border-bottom: 1px solid #eeeeee;
}
.info {
    width: 100%;
    height: 100%;
    font-size: 14px;
    box-sizing: border-box;
}
.row-bg {
    width: 100%;
    height: 100%;
}
.user {
    text-align: center;
    position: relative;
    top: 30%;
}
.userinfo {
    height: 100%;
    background-color: #eee;
}
.user-item {
    display: flex;
    position: relative;
    top: 30%;
    padding: 26px;
    font-size: 28px;
    color: #333;
}
.action {
	display: flex;
}
.title {
    width: 200px;
    padding-right: 20px;
    font-size: 14px;
}
.edit {
    font-size: 14px;
    cursor: pointer;
    margin-right: 20%;
    color: #0088cc;
}
.saveBtn {
    padding: 5px 10px;
    border: none;
    color: white;
    background: #64b9f9;
    margin-left: 10px;
    margin-right: 10px; 
}
.cancelBtn {
    padding: 5px 10px;
    border: none;
    color: black;
    background: #ecf0f1;
}
</style>
