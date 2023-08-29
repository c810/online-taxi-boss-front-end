<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="avatar+'?imageView2/1/w/80/h/80'" class="user-avatar">
          <span class="welcomeUser">{{ userName }}</span>
          <!-- 头像右侧小箭头 -->
          <i style="color: white" class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="resetPassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
<!--          <router-link to="/">
            <el-dropdown-item>
              Home
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/PanJiaChen/vue-admin-template/">
            <el-dropdown-item>Github</el-dropdown-item>
          </a>
          <a target="_blank" href="https://panjiachen.github.io/vue-element-admin-site/#/">
            <el-dropdown-item>Docs</el-dropdown-item>
          </a>-->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <!-- 新增或编辑弹框组件 -->
    <sys-dialog
      :title="dialog.title"
      :visible="dialog.visible"
      :width="dialog.width"
      :height="dialog.height"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          ref="addForm"
          :model="addModel"
          :rules="rules"
          label-width="80px"
          size="small"
          style="margin-right: 40px"
        >
          <el-form-item prop="oldPassword" label="原密码">
            <el-input v-model="addModel.oldPassword" type="password" />
          </el-form-item>
          <el-form-item prop="newPassword" label="新密码">
            <el-input v-model="addModel.newPassword" type="password" />
          </el-form-item>
          <el-form-item prop="checkNewPassword" label="验证密码">
            <el-input v-model="addModel.checkNewPassword" type="password" />
          </el-form-item>
        </el-form>
      </div>
    </sys-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import SysDialog from '@/components/Dialog/SysDialog'
import { getUserId, getUserType } from '@/utils/auth'
import { updatePasswordApi, getUserByIdApi } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    SysDialog
  },
  data() {
    return {
      tableList: [],
      searchModel: {
        teacherId: getUserId(),
        currentPage: 1,
        pageSize: 10
        // total: 0
      },
      // 表单验证规则
      rules: {
        oldPassword: [{
          trigger: 'blur',
          required: true,
          message: '请输入原密码'
        }],
        newPassword: [{
          trigger: 'blur',
          required: true,
          message: '请输入新密码'
        }],
        checkNewPassword: [{
          trigger: 'blur',
          required: true,
          message: '请再次输入新密码'
        }]
      },
      addModel: {
        userId: getUserId(),
        userType: getUserType(),
        oldPassword: '',
        newPassword: '',
        checkNewPassword: ''
      },
      dialog: {
        title: '修改密码',
        visible: false,
        width: 650,
        height: 150
      },
      user: {},
      userName: {},
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  created() {
    const type = getUserType()
    if (type === '2') {
      this.getUser()
    }
  },
  methods: {
    // 获取管理员用户
    async getUser() {
      const res = await getUserByIdApi({ userId: this.addModel.userId })
      if (res && res.code === 200) {
        this.userName = res.data.username
      }
    },
    // 弹框确定
    async onConfirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          if (this.addModel.newPassword === this.addModel.checkNewPassword) {
            const res = await updatePasswordApi(this.addModel)
            if (res && res.code === 200) {
              this.$message.success(res.msg)
              this.dialog.visible = false
            }
            this.dialog.visible = false
          } else {
            this.$message.warning('新密码与验证密码不同!')
          }
        }
      })
    },
    // 弹框关闭
    onClose() {
      this.dialog.visible = false
    },
    // 修改密码
    resetPassword() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      this.addModel.userId = getUserId()
      this.addModel.userType = getUserType()
      this.dialog.visible = true
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #9b0d14; // 顶部导航栏颜色
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .welcomeUser {
          position: relative;
          cursor: pointer;
          top: -15px;
          right: -4px;
          display: inline-block;
          height: 30px;
          margin-top: -20px;
          line-height: 30px;
          color: white;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }

        .user-dropdown {
          z-index: 3005 !important;
          width: 100px;
          position: fixed !important;
          top: 45px !important;
          //right: 1444px !important;

          .el-dropdown-menu__item:hover {
            color: #9b0d14;
            background-color: rgba(234, 207, 208, 0.56);
          }
        }

      }
    }
  }
}
</style>
