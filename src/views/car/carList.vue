<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.vehicleNo" placeholder="请输入车辆号牌"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="searchModel.ownerName" placeholder="请输入车辆所有人"/>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-search" @click="searchBtn">搜索</el-button>
        <el-button style="color:#FF7670;border-color: #FF7670;" icon="el-icon-close" @click="resetBtn">重置</el-button>
        <el-button v-permission="['sys:carList:add']" icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table v-fit-columns :data="tableList" border stripe>
      <el-table-column prop="address" label="车辆所在城市"/>
      <el-table-column prop="vehicleNo" label="车辆号牌"/>
      <el-table-column prop="plateColor" label="车牌颜色">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.plateColor === '1'" type="blue" size="small">蓝色</el-tag>
          <el-tag v-if="scope.row.plateColor === '2'" type="yellow" size="small">黄色</el-tag>
          <el-tag v-if="scope.row.plateColor === '3'" type="black" size="small">黑色</el-tag>
          <el-tag v-if="scope.row.plateColor === '4'" type="white" size="small">白色</el-tag>
          <el-tag v-if="scope.row.plateColor === '5'" type="green" size="small">绿色</el-tag>
          <el-tag v-if="scope.row.plateColor === '9'" type="danger" size="small">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="seats" label="核定载客位"/>
      <el-table-column prop="brand" label="车辆厂牌"/>
      <el-table-column prop="model" label="车辆型号"/>
      <el-table-column prop="vehicleType" label="车辆类型"/>

      <el-table-column prop="ownerName" label="车辆所有人"/>
      <el-table-column prop="vehicleColor" label="车身颜色">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.vehicleColor === '1'" type="blue" size="small">白色</el-tag>
          <el-tag v-if="scope.row.vehicleColor === '2'" type="danger" size="small">黑色</el-tag>
          <el-tag v-if="scope.row.vehicleColor === '3'" type="danger" size="small">红色</el-tag>
          <el-tag v-if="scope.row.vehicleColor === '4'" type="danger" size="small">蓝色</el-tag>
          <el-tag v-if="scope.row.vehicleColor === '5'" type="danger" size="small">黄色</el-tag>
          <el-tag v-if="scope.row.vehicleColor === '6'" type="danger" size="small">绿色</el-tag>
          <el-tag v-if="scope.row.vehicleColor === '7'" type="danger" size="small">黑色</el-tag>
          <el-tag v-if="scope.row.vehicleColor === '9'" type="danger" size="small">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="engineId" label="发动机号"/>
      <el-table-column prop="vin" label="车辆VIN码"/>
      <el-table-column prop="certifyDateA" label="车辆注册日期"/>
      <el-table-column prop="fuelType" label="车辆燃料类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fuelType === '1'" type="blue" size="small">汽油</el-tag>
          <el-tag v-if="scope.row.fuelType === '2'" type="blue" size="small">柴油</el-tag>
          <el-tag v-if="scope.row.fuelType === '3'" type="blue" size="small">天然气</el-tag>
          <el-tag v-if="scope.row.fuelType === '4'" type="blue" size="small">液化气</el-tag>
          <el-tag v-if="scope.row.fuelType === '5'" type="blue" size="small">电动</el-tag>
          <el-tag v-if="scope.row.fuelType === '9'" type="blue" size="small">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="engineDisplace" label="发动机排量（毫升）"/>
      <el-table-column prop="transAgency" label="车辆运输证发证机构"/>
      <el-table-column prop="transArea" label="车辆经营区域"/>
      <el-table-column prop="transDateStart" label="车辆运输证有效期起"/>
      <el-table-column prop="transDateEnd" label="车辆运输证有效期止"/>
      <el-table-column prop="certifyDateB" label="车辆初次登记日期"/>

      <el-table-column prop="fixState" label="车辆检修状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.fixState === '0'" type="blue" size="small">未检修</el-tag>
          <el-tag v-if="scope.row.fixState === '1'" type="blue" size="small">已检修</el-tag>
          <el-tag v-if="scope.row.fixState === '2'" type="danger" size="small">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="nextFixDate" label="车辆下次年检时间"/>
      <el-table-column prop="checkState" label="车辆年度审验状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.checkState === '0'" type="blue" size="small">未年审</el-tag>
          <el-tag v-if="scope.row.checkState === '1'" type="danger" size="small">年审合格</el-tag>
          <el-tag v-if="scope.row.checkState === '2'" type="danger" size="small">年审不合格</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="feePrintId" label="发票打印设备序列号"/>
      <el-table-column prop="gpsBrand" label="卫星定位装置品牌"/>
      <el-table-column prop="gpsModel" label="卫星定位装置型号"/>
      <el-table-column prop="gpsInstallDate" label="卫星定位装置安装日期"/>
      <el-table-column prop="registerDate" label="报备日期"/>

      <el-table-column prop="commercialType" label="服务类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.commercialType === 1" type="blue" size="small">网络预约出租车</el-tag>
          <el-tag v-if="scope.row.commercialType === 2" type="danger" size="small">巡游出租车</el-tag>
          <el-tag v-if="scope.row.commercialType === 3" type="danger" size="small">私人小客车合乘</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="fareType" label="运价类型编码"/>
      <el-table-column prop="tid" label="终端id"/>
      <el-table-column prop="trid" label="轨迹id"/>

      <el-table-column prop="state" label="车辆状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.state === 0" type="blue" size="small">有效</el-tag>
          <el-tag v-if="scope.row.state === 1" type="danger" size="small">失效</el-tag>
        </template>
      </el-table-column>

      <el-table-column v-if="$checkPermission(['sys:carList:edit','sys:carList:delete'])" label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['sys:carList:edit']" type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:carList:delete']" type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)">删除</el-button>
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
              <el-form-item prop="address" label="车辆所在城市">
                <el-input v-model="addModel.address"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="vehicleNo" label="车辆号牌">
                <el-input v-model="addModel.vehicleNo"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第三行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="seats" :rules="Rules.interNum" label="核定载客位">
                <el-input v-model="addModel.seats"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="brand" :rules="Rules.isNull" label="车辆厂牌">
                <el-input v-model="addModel.brand"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第四行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="model" :rules="Rules.isNull" label="车辆型号">
                <el-input v-model="addModel.model"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="vehicleType" :rules="Rules.interNum" label="车辆类型">
                <el-input v-model="addModel.vehicleType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第五行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="ownerName" :rules="Rules.isNull" label="车辆所有人">
                <el-input v-model="addModel.ownerName"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="engineId" :rules="Rules.interNum" label="发动机号">
                <el-input v-model="addModel.engineId"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第七行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="vin" :rules="Rules.interNum" label="车辆VIN码">
                <el-input v-model="addModel.vin"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="certifyDateA" :rules="Rules.time" label="车辆注册日期">
                <el-date-picker
                  v-model="addModel.certifyDateA"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="车辆注册日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第九行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="engineDisplace" :rules="Rules.interNum" label="发动机排量（毫升）">
                <el-input v-model="addModel.engineDisplace"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="transAgency" :rules="Rules.isNull" label="车辆运输证发证机构">
                <el-input v-model="addModel.transAgency"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="transArea" :rules="Rules.isNull" label="车辆经营区域">
                <el-input v-model="addModel.transArea"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="transDateStart" :rules="Rules.time" label="车辆运输证有效期起">
                <el-date-picker
                  v-model="addModel.transDateStart"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="车辆运输证有效期起"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十一行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="transDateEnd" :rules="Rules.time" label="车辆运输证有效期止">
                <el-date-picker
                  v-model="addModel.transDateEnd"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="车辆运输证有效期止"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="certifyDateB" :rules="Rules.time" label="车辆初次登记日期">
                <el-date-picker
                  v-model="addModel.certifyDateB"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="车辆初次登记日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十二行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="fixState" :rules="Rules.radio" label="车辆检修状态">
                <el-radio-group v-model="addModel.fixState">
                  <el-radio :label="0">未检修</el-radio>
                  <el-radio :label="1">已检修</el-radio>
                  <el-radio :label="2">未知</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="nextFixDate" :rules="Rules.time" label="车辆下次年检时间">
                <el-date-picker
                  v-model="addModel.nextFixDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="车辆下次年检时间"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十三行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="checkState" :rules="Rules.radio" label="车辆年度审验状态">
                <el-radio-group v-model="addModel.checkState">
                  <el-radio :label="0">未年审</el-radio>
                  <el-radio :label="1">年审合格</el-radio>
                  <el-radio :label="2">年审不合格</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="feePrintId" :rules="Rules.interNum" label="发票打印设备序列号">
                <el-input v-model="addModel.feePrintId"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十四行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="gpsBrand" :rules="Rules.isNull" label="卫星定位装置品牌">
                <el-input v-model="addModel.gpsBrand"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="gpsModel" :rules="Rules.isNull" label="卫星定位装置型号">
                <el-input v-model="addModel.gpsModel"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十五行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="gpsInstallDate" :rules="Rules.time" label="卫星定位装置安装日期">
                <el-date-picker
                  v-model="addModel.gpsInstallDate"
                  type="date"
                  value-format="yyyy-MM-dd"
                  placeholder="卫星定位装置安装日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
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
          </el-row>
          <!-- 第十六行 -->
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="commercialType" :rules="Rules.radio" label="服务类型">
                <el-radio-group v-model="addModel.commercialType">
                  <el-radio :label="1">网约车</el-radio>
                  <el-radio :label="2">巡游出租车</el-radio>
                  <el-radio :label="3">私人小客车合乘</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="fareType" :rules="Rules.isNull" label="运价类型编码">
                <el-input v-model="addModel.fareType"/>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第十七行 -->
<!--          <el-row>-->
<!--            <el-col :span="12" :offset="0">-->
<!--              <el-form-item prop="tid" :rules="Rules.interNum" label="终端id">-->
<!--                <el-input v-model="addModel.tid"/>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--            <el-col :span="12" :offset="0">-->
<!--              <el-form-item prop="trid" :rules="Rules.interNum" label="轨迹id">-->
<!--                <el-input v-model="addModel.trid"/>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
<!--          </el-row>-->
          <!-- 第十八行 -->
          <el-row>
<!--            <el-col :span="12" :offset="0">-->
<!--              <el-form-item prop="trname" :rules="Rules.isNull" label="轨迹名称">-->
<!--                <el-input v-model="addModel.trname"/>-->
<!--              </el-form-item>-->
<!--            </el-col>-->
            <el-col :span="12" :offset="0">
              <el-form-item prop="state" :rules="Rules.radio" label="车辆状态">
                <el-radio-group v-model="addModel.state">
                  <el-radio :label="0">有效</el-radio>
                  <el-radio :label="1">失效</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第二行 -->
          <el-row>
            <el-col :span="24" :offset="0">
              <el-form-item prop="plateColor" :rules="Rules.radio" label="车牌颜色">
                <el-radio-group v-model="addModel.plateColor">
                  <el-radio :label="1">蓝色</el-radio>
                  <el-radio :label="2">黄色</el-radio>
                  <el-radio :label="3">黑色</el-radio>
                  <el-radio :label="4">白色</el-radio>
                  <el-radio :label="5">绿色</el-radio>
                  <el-radio :label="9">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第六行 -->
          <el-row>
            <el-col :span="24" :offset="0">
              <el-form-item prop="vehicleColor" :rules="Rules.radio" label="车身颜色">
                <el-radio-group v-model="addModel.vehicleColor">
                  <el-radio :label="1">白色</el-radio>
                  <el-radio :label="2">黑色</el-radio>
                  <el-radio :label="3">红色</el-radio>
                  <el-radio :label="4">蓝色</el-radio>
                  <el-radio :label="5">黄色</el-radio>
                  <el-radio :label="6">绿色</el-radio>
                  <el-radio :label="7">黑色</el-radio>
                  <el-radio :label="9">其他</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 第八行 -->
          <el-row>
            <el-col :span="24" :offset="0">
              <el-form-item prop="fuelType" :rules="Rules.radio" label="车辆燃料类型">
                <el-radio-group v-model="addModel.fuelType">
                  <el-radio :label="1">汽油</el-radio>
                  <el-radio :label="2">柴油</el-radio>
                  <el-radio :label="3">天然气</el-radio>
                  <el-radio :label="4">液化气</el-radio>
                  <el-radio :label="5">电动</el-radio>
                  <el-radio :label="9">其他</el-radio>
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
import { addApi, listApi, editApi, deleteApi } from '@/api/car'
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
        vehicleNo: '',
        plateColor: '',
        seats: 0,
        brand: '',
        model: '',
        vehicleType: '',
        ownerName: '',
        vehicleColor: '',
        engineId: '',
        vin: '',
        certifyDateA: '',
        fuelType: '',
        engineDisplace: '',
        transAgency: '',
        transArea: '',
        transDateStart: '',
        transDateEnd: '',
        certifyDateB: '',
        fixState: '',
        nextFixDate: '',
        checkState: '',
        feePrintId: '',
        gpsBrand: '',
        gpsModel: '',
        gpsInstallDate: '',
        registerDate: '',
        commercialType: 1,
        fareType: '',
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
        vehicleNo: '',
        ownerName: ''
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
          carId: row.id
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
      this.addDialog.title = '编辑车辆信息'
      this.addDialog.visible = true
      this.addModel.type = '1'
    },
    // 获取列表
    async getList() {
      const res = await listApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        this.tableList = res.data
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
      this.addDialog.title = '新增车辆'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },
    resetBtn() {
      this.searchModel.vehicleNo = ''
      this.searchModel.ownerName = ''
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
