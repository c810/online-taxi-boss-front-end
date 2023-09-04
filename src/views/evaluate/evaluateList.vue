<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.orderId" placeholder="请输入订单号"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.rating" placeholder="请输入评分"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.passengerPhone" placeholder="请输入乘客手机号"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.driverPhone" placeholder="请输入司机手机号"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="tableList" border stripe>
      <el-table-column prop="orderId" label="评价订单号"/>
      <el-table-column prop="passengerPhone" label="乘客手机号"/>
      <el-table-column prop="driverPhone" label="司机手机号"/>
<!--   TODO: 星星组件   -->
      <el-table-column prop="rating" label="评分"/>
      <el-table-column prop="evaluation" label="评价"/>
    </el-table>
  </el-main>
</template>

<script>
import { listApi } from '@/api/evaluate'

export default {
  data() {
    return {
      searchModel: {
        // currentPage: 1,
        // pageSize: 10,
        orderId: '',
        rating: '',
        passengerPhone: '',
        driverPhone: ''
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
    // 获取列表
    async getList() {
      const res = await listApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        this.tableList = res.data
      }
    },
    resetBtn() {
      this.searchModel.orderId = ''
      this.searchModel.rating = ''
      this.searchModel.passengerPhone = ''
      this.searchModel.driverPhone = ''
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

</style>
