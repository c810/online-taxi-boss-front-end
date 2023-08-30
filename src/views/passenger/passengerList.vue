<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.passengerName" placeholder="请输入乘客姓名"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.passengerPhone" placeholder="请输入乘客手机号"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:passengerList:add']" icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableList" border stripe>
      <el-table-column prop="passengerName" label="姓名"/>
      <el-table-column prop="passengerPhone" label="手机号"/>
      <el-table-column prop="passengerGender" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.passengerGender === 1" type="blue" size="small">男</el-tag>
          <el-tag v-if="scope.row.passengerGender === 2" type="danger" size="small">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="乘客状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0" type="blue" size="small">有效</el-tag>
          <el-tag v-if="scope.row.state === 1" type="danger" size="small">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="$checkPermission(['sys:passengerList:edit','sys:passengerList:delete'])" label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['sys:passengerList:edit']" type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:passengerList:delete']" type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <!--    <el-pagination
          :current-page.sync="searchModel.currentPage"
          :page-sizes="[10, 20, 40, 80, 100]"
          :page-size="searchModel.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="searchModel.total"
          background
          @size-change="sizeChange"
          @current-change="currentChange"
        />-->
    <!-- 弹框 -->
    <sys-dialog
      :title="addDialog.title"
      :height="addDialog.height"
      :width="addDialog.width"
      :visible="addDialog.visible"
      @onClose="onClose"
      @onConfirm="onConfirm"
    >
      <div slot="content">
        <el-form
          id="el-form"
          ref="addForm"
          :model="addModel"
          label-width="80px"
          :inline="false"
          size="small"
        >
          <!-- 第一行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="passengerName" :rules="Rules.isNull" label="姓名">
                <el-input v-model="addModel.passengerName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="passengerPhone" :rules="Rules.phone" label="手机号">
                <el-input v-model="addModel.passengerPhone"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="passengerGender" :rules="Rules.sex" label="性别">
                <el-radio-group v-model="addModel.passengerGender">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="state" :rules="Rules.radio" label="乘客状态">
                <el-radio-group v-model="addModel.state">
                  <el-radio :label="0">有效</el-radio>
                  <el-radio :label="1">失效</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { addApi, listApi, editApi, deleteApi } from '@/api/passenger'
import SysDialog from '@/components/Dialog/SysDialog.vue'
import Rules from '@/utils/rules'

export default {
  components: {
    SysDialog
  },
  data() {
    return {
      // tableHeight: 0,
      Rules,
      addModel: {
        id: '',
        passengerName: '',
        passengerPhone: '',
        passengerGender: '',
        state: 0
      },
      // 弹框属性
      addDialog: {
        title: '',
        height: 210,
        width: 640,
        visible: false
      },
      searchModel: {
        // currentPage: 1,
        // pageSize: 10,
        passengerName: '',
        passengerPhone: ''
        // total: 0
      },
      tableList: []
    }
  },
  created() {
    this.getList()
  },
  mounted() {
    this.getList()
    window.addEventListener('resize', this.getList)
  },
  methods: {
    /* currentChange(val) {
      this.searchModel.currentPage = val
      this.getList()
    },
    sizeChange(val) {
      this.searchModel.pageSize = val
      this.getList()
    },*/
    async deleteBtn(row) {
      const confirm = await this.$myConfirm('确定删除该数据吗?')
      if (confirm) {
        const res = await deleteApi({
          passengerId: row.id
        })
        if (res && res.code === 200) {
          // 信息提示
          this.$message.success(res.msg)
          this.getList()
        }
      }
    },
    async editBtn(row) {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      this.$objCopy(row, this.addModel)
      this.addModel.id = row.id
      // 设置弹框属性
      this.addDialog.title = '编辑乘客信息'
      this.addDialog.visible = true
      this.addModel.type = '1'
    },
    // 获取列表
    async getList() {
      const res = await listApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        this.tableList = res.data
        // this.searchModel.total = res.data.total
      }
    },
    onConfirm() {
      this.$refs.addForm.validate(async valid => {
        if (valid) {
          let res = null
          if (this.addModel.type === '0') {
            res = await addApi(this.addModel)
          } else {
            res = await editApi(this.addModel)
          }
          if (res && res.code === 200) {
            // 信息提示
            this.$message.success(res.msg)
            this.getList()
            this.addDialog.visible = false
          }
        }
      })
    },
    onClose() {
      this.addDialog.visible = false
    },
    async addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 设置弹框属性
      this.addDialog.title = '新增乘客'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.passengerName = ''
      this.searchModel.passengerPhone = ''
      this.getList()
    },
    searchBtn() {
      this.getList()
    }
  }
}
</script>

<style scoped>
.el-main >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #9b0d14;
  color: #fff;
}

/*#el-form >>> .el-form-item__label {*/
/*  text-align: right;*/
/*  min-width: 170px;*/
/*}*/
/*#el-form >>> .el-input {*/
/*  width: 360px;*/
/*}*/

</style>
