<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.driverName" placeholder="请输入司机姓名"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.driverPhone" placeholder="请输入司机手机号"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:driverList:add']" icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-fit-columns :data="tableList" border stripe>
      <el-table-column prop="driverName" label="姓名"/>
      <el-table-column prop="driverPhone" label="手机号"/>
      <el-table-column prop="driverGender" label="性别">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.driverGender === 1" type="blue" size="small">男</el-tag>
          <el-tag v-if="scope.row.driverGender === 2" type="danger" size="small">女</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="邮政编码"/>
      <el-table-column prop="driverBirthday" label="出生日期"/>
      <el-table-column prop="driverNation" label="民族"/>
      <el-table-column prop="driverContactAddress" label="联系地址"/>
      <el-table-column prop="licenseId" label="机动车驾驶证号"/>
      <el-table-column prop="getDriverLicenseDate" label="初次领取驾驶证日期"/>
      <el-table-column prop="driverLicenseOn" label="驾驶证有效期起"/>
      <el-table-column prop="driverLicenseOff" label="驾驶证有效期止"/>
      <el-table-column prop="taxiDriver" label="巡游出租车">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.taxiDriver === 1" type="blue" size="small">是</el-tag>
          <el-tag v-if="scope.row.taxiDriver === 0" type="danger" size="small">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="certificateNo" label="网络预约出租汽车驾驶员资格证号"/>
      <el-table-column prop="networkCarIssueOrganization" label="网络预约出租汽车驾驶员发证机构"/>
      <el-table-column prop="networkCarIssueDate" label="资格证发证日期"/>
      <el-table-column prop="getNetworkCarProofDate" label="初次领取资格证日期"/>
      <el-table-column prop="networkCarProofOn" label="资格证有效起始日期"/>
      <el-table-column prop="networkCarProofOff" label="资格证有效截止日期"/>
      <el-table-column prop="registerDate" label="报备日期"/>
      <el-table-column prop="commercialType" label="服务类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.commercialType === 1" type="blue" size="small">网络预约出租汽车</el-tag>
          <el-tag v-if="scope.row.commercialType === 2" type="danger" size="small">巡游出租汽车</el-tag>
          <el-tag v-if="scope.row.commercialType === 3" type="danger" size="small">私人小客车合乘</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="contractCompany" label="驾驶员合同签署公司"/>
      <el-table-column prop="contractOn" label="合同有效期起"/>
      <el-table-column prop="contractOff" label="合同有效期止"/>
      <el-table-column prop="state" label="司机状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0" type="blue" size="small">有效</el-tag>
          <el-tag v-if="scope.row.state === 1" type="danger" size="small">失效</el-tag>
        </template>
      </el-table-column>
      <el-table-column v-if="$checkPermission(['sys:driverList:edit','sys:driverList:delete'])" label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['sys:driverList:edit']" type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:driverList:delete']" type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)">删除</el-button>
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
              <el-form-item prop="driverName" :rules="Rules.isNull" label="姓名">
                <el-input v-model="addModel.driverName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="driverPhone" :rules="Rules.phone" label="手机号">
                <el-input v-model="addModel.driverPhone"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="driverGender" :rules="Rules.sex" label="性别">
                <el-radio-group v-model="addModel.driverGender">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="address" label="邮政编码">
                <el-input v-model="addModel.address"/>
              </el-form-item>
            </el-col>
<!--            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" :rules="Rules.select" label="角色">
                <el-select
                  v-model="addModel.roleId"
                  placeholder=""
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  />
                </el-select>
              </el-form-item>
            </el-col>-->
          </el-row>
          <!-- 第三行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="driverBirthday" :rules="Rules.time" label="出生日期">
                <el-date-picker
                  v-model="addModel.driverBirthday"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="请选择出生日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="driverNation" label="民族">
                <el-input v-model="addModel.driverNation"/>
              </el-form-item>
            </el-col>
            <!--            <el-col :span="12" :offset="0">
              <el-form-item prop="roleId" :rules="Rules.select" label="角色">
                <el-select
                  v-model="addModel.roleId"
                  placeholder=""
                >
                  <el-option
                    v-for="item in roleList"
                    :key="item.roleId"
                    :label="item.roleName"
                    :value="item.roleId"
                  />
                </el-select>
              </el-form-item>
            </el-col>-->
          </el-row>
          <!-- 第四行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="driverContactAddress" :rules="Rules.isNull" label="联系地址">
                <el-input v-model="addModel.driverContactAddress"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="licenseId" :rules="Rules.interNum" label="机动车驾驶证号">
                <el-input v-model="addModel.licenseId"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第五行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="getDriverLicenseDate" :rules="Rules.time" label="初次领取驾驶证日期">
                <el-date-picker
                  v-model="addModel.getDriverLicenseDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="初次领取驾驶证日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="driverLicenseOn" :rules="Rules.time" label="驾驶证有效期起">
                <el-date-picker
                  v-model="addModel.driverLicenseOn"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="驾驶证有效期起"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第六行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="driverLicenseOff" :rules="Rules.time" label="驾驶证有效期止">
                <el-date-picker
                  v-model="addModel.driverLicenseOff"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="驾驶证有效期止"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="taxiDriver" :rules="Rules.radio" label="巡游出租车">
                <el-radio-group v-model="addModel.taxiDriver">
                  <el-radio :label="1">是</el-radio>
                  <el-radio :label="0">否</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第七行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="certificateNo" :rules="Rules.interNum" label="网约车驾驶员资格证号">
                <el-input v-model="addModel.certificateNo"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="networkCarIssueOrganization" :rules="Rules.isNull" label="网约车驾驶员发证机构">
                <el-input v-model="addModel.networkCarIssueOrganization"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第八行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="networkCarIssueDate" :rules="Rules.time" label="资格证发证日期">
                <el-date-picker
                  v-model="addModel.networkCarIssueDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="资格证发证日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="getNetworkCarProofDate" :rules="Rules.time" label="初次领取资格证日期">
                <el-date-picker
                  v-model="addModel.getNetworkCarProofDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="初次领取资格证日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第九行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="networkCarProofOn" :rules="Rules.time" label="资格证有效起始日期">
                <el-date-picker
                  v-model="addModel.networkCarProofOn"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="资格证有效起始日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="networkCarProofOff" :rules="Rules.time" label="资格证有效截止日期">
                <el-date-picker
                  v-model="addModel.networkCarProofOff"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="资格证有效截止日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="registerDate" :rules="Rules.time" label="报备日期">
                <el-date-picker
                  v-model="addModel.registerDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="报备日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="commercialType" :rules="Rules.radio" label="服务类型">
                <el-radio-group v-model="addModel.commercialType">
                  <el-radio :label="1">网约车</el-radio>
                  <el-radio :label="2">巡游出租汽车</el-radio>
                  <el-radio :label="3">私人小客车合乘</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十一行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="contractCompany" :rules="Rules.isNull" label="驾驶员合同签署公司">
                <el-input v-model="addModel.contractCompany"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="contractOn" :rules="Rules.time" label="合同有效期起">
                <el-date-picker
                  v-model="addModel.contractOn"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="合同有效期起"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十二行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="contractOff" :rules="Rules.time" label="合同有效期止">
                <el-date-picker
                  v-model="addModel.contractOff"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="合同有效期止"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="state" :rules="Rules.radio" label="司机状态">
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
import { addApi, listApi, editApi, deleteApi } from '@/api/driver'
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
        address: '',
        driverName: '',
        driverPhone: '',
        driverGender: '',
        driverBirthday: '',
        driverNation: '',
        driverContactAddress: '',
        licenseId: '',
        getDriverLicenseDate: '',
        driverLicenseOn: '',
        driverLicenseOff: '',
        taxiDriver: 0,
        certificateNo: '',
        networkCarIssueOrganization: '',
        networkCarIssueDate: '',
        getNetworkCarProofDate: '',
        networkCarProofOn: '',
        networkCarProofOff: '',
        registerDate: '',
        commercialType: 1,
        contractCompany: '',
        contractOn: '',
        contractOff: '',
        state: 0
      },
      // 弹框属性
      addDialog: {
        title: '',
        height: 610,
        width: 1120,
        visible: false
      },
      searchModel: {
        // currentPage: 1,
        // pageSize: 10,
        driverName: '',
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
          driverId: row.id
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
      // 获取角色列表
      // const res = await getRoleApi()
      // if (res && res.code === 200) {
      //   this.roleList = res.data
      // }
      // 角色数据回显
      // const role = await getRoleByIdApi({ teacherId: row.teacherId })
      // if (role && role.code === 200) {
      //   this.addModel.roleId = role.data.roleId
      // }
      this.addModel.id = row.id
      // 设置弹框属性
      this.addDialog.title = '编辑司机信息'
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
      // 获取角色列表
      // const res = await getRoleApi()
      // if (res && res.code === 200) {
      //   this.roleList = res.data
      // }
      // 设置弹框属性
      this.addDialog.title = '新增司机'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.driverName = ''
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

#el-form >>> .el-form-item__label {
  text-align: right;
  min-width: 170px;
}
#el-form >>> .el-input {
  width: 360px;
}

</style>
