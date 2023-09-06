<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.cityCode" placeholder="请输入城市代码"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.vehicleType" placeholder="请输入车辆类型"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:priceRuleList:add']" icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableList" border stripe>
      <el-table-column prop="cityCode" label="城市代码"/>
      <el-table-column prop="vehicleType" label="车辆类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.vehicleType === '1'" type="success" size="small">经济型</el-tag>
          <el-tag v-if="scope.row.vehicleType === '2'" type="blue" size="small">商务型</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="startFare" label="起步价"/>
      <el-table-column prop="startMile" label="起步距离"/>
      <el-table-column prop="unitPricePerMile" label="每公里单价"/>
      <el-table-column prop="unitPricePerMinute" label="每分钟单价"/>
      <el-table-column prop="fareVersion" label="计价规则版本"/>
      <el-table-column prop="fareType" label="计价规则"/>
      <el-table-column v-if="$checkPermission(['sys:priceRuleList:edit','sys:priceRuleList:delete'])" label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['sys:priceRuleList:edit']" type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:priceRuleList:delete']" type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)">删除</el-button>
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
              <el-form-item prop="cityCode" :rules="Rules.interNum" label="城市代码">
                <el-input v-model="addModel.cityCode"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="vehicleType" :rules="Rules.sex" label="车辆类型">
                <el-radio-group v-model="addModel.vehicleType">
                  <el-radio :label="'1'">经济型</el-radio>
                  <el-radio :label="'2'">商务型</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="startFare" :rules="Rules.money" label="起步价">
                <el-input v-model="addModel.startFare"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="startMile" :rules="Rules.interNum" label="起步距离">
                <el-input v-model="addModel.startMile"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第三行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="unitPricePerMile" :rules="Rules.money" label="每公里单价">
                <el-input v-model="addModel.unitPricePerMile"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="unitPricePerMinute" :rules="Rules.money" label="每分钟单价">
                <el-input v-model="addModel.unitPricePerMinute"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </sys-dialog>
  </el-main>
</template>

<script>
import { addApi, listApi, editApi, deleteApi } from '@/api/price'
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
        cityCode: '',
        vehicleType: '',
        startFare: 10.00,
        startMile: 3,
        unitPricePerMile: 2.00,
        unitPricePerMinute: 2.00
      },
      // 弹框属性
      addDialog: {
        title: '',
        height: 210,
        width: 840,
        visible: false
      },
      searchModel: {
        // currentPage: 1,
        // pageSize: 10,
        cityCode: '',
        vehicleType: ''
        // total: 0
      },
      tableList: []
    }
  },
  created() {
    this.getList()
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
          fareType: row.fareType,
          fareVersion: row.fareVersion
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
      // 设置弹框属性
      this.addDialog.title = '编辑计价规则'
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
      this.addDialog.title = '新增计价规则'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.cityCode = ''
      this.searchModel.vehicleType = ''
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

#el-form >>> .el-form-item__label {
  text-align: right;
  min-width: 100px;
}
#el-form >>> .el-input {
  width: 280px;
}

</style>
