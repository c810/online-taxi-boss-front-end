<template>
  <el-main>
    <!-- 搜索栏 -->
    <el-form :model="searchModel" :inline="true" size="small">
      <el-form-item>
        <el-input v-model="searchModel.id" placeholder="请输入订单号"/>
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
<!--        <el-button v-permission="['sys:orderList:add']" icon="el-icon-plus" type="primary" @click="addBtn">新增</el-button>-->
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :height="tableHeight" v-fit-columns :data="tableList" border stripe>
      <el-table-column prop="id" label="订单号"/>
      <el-table-column prop="passengerId" label="乘客ID"/>
      <el-table-column prop="passengerPhone" label="乘客手机号"/>
      <el-table-column prop="driverId" label="司机ID"/>
      <el-table-column prop="driverPhone" label="司机手机号"/>
      <el-table-column prop="carId" label="车辆Id"/>
      <el-table-column prop="address" label="发起地行政区划代码"/>
      <el-table-column prop="vehicleType" label="车辆类型">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.vehicleType === '1'" type="success" size="small">经济型</el-tag>
          <el-tag v-if="scope.row.vehicleType === '2'" type="blue" size="small">商务型</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="orderTime" label="订单发起时间"/>
      <el-table-column prop="departTime" label="预计用车时间"/>
      <el-table-column prop="departure" label="预计出发地点详细地址"/>
      <el-table-column prop="depLongitude" label="预计出发地点经度"/>
      <el-table-column prop="depLatitude" label="预计出发地点纬度"/>
      <el-table-column prop="destination" label="预计目的地"/>
      <el-table-column prop="destLongitude" label="预计目的地经度"/>
      <el-table-column prop="destLatitude" label="预计目的地纬度"/>
      <el-table-column prop="encrypt" label="坐标加密标识">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.encrypt === 1" type="success" size="small">GCJ-02测绘局标准</el-tag>
          <el-tag v-if="scope.row.encrypt === 2" type="success" size="small">WGS84 GPS标准</el-tag>
          <el-tag v-if="scope.row.encrypt === 3" type="success" size="small">BD-09 百度标准</el-tag>
          <el-tag v-if="scope.row.encrypt === 4" type="success" size="small">CGCS2000 北斗标准</el-tag>
          <el-tag v-if="scope.row.encrypt === 0" type="success" size="small">其他</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="fareType" label="运价类型编码"/>
      <el-table-column prop="fareVersion" label="运价版本"/>
      <el-table-column prop="receiveOrderCarLongitude" label="接单时车辆经度"/>
      <el-table-column prop="receiveOrderCarLatitude" label="接单时车辆纬度"/>
      <el-table-column prop="receiveOrderTime" label="接单时间"/>
      <el-table-column prop="licenseId" label="机动车驾驶证号"/>
      <el-table-column prop="vehicleNo" label="车辆号牌"/>
      <el-table-column prop="toPickUpPassengerTime" label="司机去接乘客出发时间"/>
      <el-table-column prop="toPickUpPassengerLongitude" label="去接乘客时，司机的经度"/>
      <el-table-column prop="toPickUpPassengerLatitude" label="去接乘客时，司机的纬度"/>
      <el-table-column prop="toPickUpPassengerAddress" label="去接乘客时，司机的地点"/>
      <el-table-column prop="driverArrivedDepartureTime" label="司机到达上车点时间"/>
      <el-table-column prop="pickUpPassengerTime" label="接到乘客，乘客上车时间"/>
      <el-table-column prop="pickUpPassengerLongitude" label="接到乘客，乘客上车经度"/>
      <el-table-column prop="pickUpPassengerLatitude" label="接到乘客，乘客上车纬度"/>
      <el-table-column prop="passengerGetoffTime" label="乘客下车时间"/>
      <el-table-column prop="passengerGetoffLongitude" label="乘客下车经度"/>
      <el-table-column prop="passengerGetoffLatitude" label="乘客下车纬度"/>
      <el-table-column prop="cancelTime" label="订单撤销时间"/>
      <el-table-column prop="cancelOperator" label="撤销发起者">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cancelOperator === '1'" type="success" size="small">乘客</el-tag>
          <el-tag v-if="scope.row.cancelOperator === '2'" type="success" size="small">驾驶员</el-tag>
          <el-tag v-if="scope.row.cancelOperator === '3'" type="success" size="small">平台公司</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="cancelTypeCode" label="撤销类型代码">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.cancelTypeCode === '1'" type="success" size="small">乘客提前撤销</el-tag>
          <el-tag v-if="scope.row.cancelTypeCode === '2'" type="success" size="small">驾驶员提前撤销</el-tag>
          <el-tag v-if="scope.row.cancelTypeCode === '3'" type="success" size="small">平台公司撤销</el-tag>
          <el-tag v-if="scope.row.cancelTypeCode === '4'" type="success" size="small">乘客违约撤销</el-tag>
          <el-tag v-if="scope.row.cancelTypeCode === '5'" type="success" size="small">驾驶员违约撤销</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="driveMile" label="载客里程（米）"/>
      <el-table-column prop="driveTime" label="载客时间(分)"/>
      <el-table-column prop="orderStatus" label="订单状态">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.orderStatus === 1" type="blue" size="small">订单开始</el-tag>
          <el-tag v-if="scope.row.orderStatus === 2" type="blue" size="small">司机接单</el-tag>
          <el-tag v-if="scope.row.orderStatus === 3" type="blue" size="small">去接乘客</el-tag>
          <el-tag v-if="scope.row.orderStatus === 4" type="blue" size="small">司机到达乘客起点</el-tag>
          <el-tag v-if="scope.row.orderStatus === 5" type="blue" size="small">乘客上车</el-tag>
          <el-tag v-if="scope.row.orderStatus === 6" type="blue" size="small">到达目的地</el-tag>
          <el-tag v-if="scope.row.orderStatus === 7" type="blue" size="small">发起收款</el-tag>
          <el-tag v-if="scope.row.orderStatus === 8" type="success" size="small">支付完成</el-tag>
          <el-tag v-if="scope.row.orderStatus === 9" type="danger" size="small">订单取消</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="price" label="价格"/>

<!--      <el-table-column v-if="$checkPermission(['sys:carList:edit','sys:carList:delete'])" label="操作" align="center" width="200" fixed="right">
        <template slot-scope="scope">
          <el-button v-permission="['sys:carList:edit']" type="primary" icon="el-icon-edit" size="small" @click="editBtn(scope.row)">编辑</el-button>
          <el-button v-permission="['sys:carList:delete']" type="danger" icon="el-icon-delete" size="small" @click="deleteBtn(scope.row)">删除</el-button>
        </template>
      </el-table-column>-->
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
<!--    <sys-dialog
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
          &lt;!&ndash; 第一行 &ndash;&gt;
          <el-row>
            <el-col :span="12" :offset="0">
              <el-form-item prop="passengerId" label="乘客ID">
                <el-input v-model="addModel.passengerId"/>
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item prop="passengerPhone" label="乘客手机号">
                <el-input v-model="addModel.passengerPhone"/>
              </el-form-item>
            </el-col>
          </el-row>
          &lt;!&ndash; 第三行 &ndash;&gt;
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
          &lt;!&ndash; 第四行 &ndash;&gt;
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
          &lt;!&ndash; 第五行 &ndash;&gt;
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
          &lt;!&ndash; 第七行 &ndash;&gt;
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
          &lt;!&ndash; 第九行 &ndash;&gt;
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
          &lt;!&ndash; 第十行 &ndash;&gt;
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
          &lt;!&ndash; 第十一行 &ndash;&gt;
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
          &lt;!&ndash; 第十二行 &ndash;&gt;
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
          &lt;!&ndash; 第十三行 &ndash;&gt;
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
          &lt;!&ndash; 第十四行 &ndash;&gt;
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
          &lt;!&ndash; 第十五行 &ndash;&gt;
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
          &lt;!&ndash; 第十六行 &ndash;&gt;
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
          &lt;!&ndash; 第十七行 &ndash;&gt;
          &lt;!&ndash;          <el-row>&ndash;&gt;
          &lt;!&ndash;            <el-col :span="12" :offset="0">&ndash;&gt;
          &lt;!&ndash;              <el-form-item prop="tid" :rules="Rules.interNum" label="终端id">&ndash;&gt;
          &lt;!&ndash;                <el-input v-model="addModel.tid"/>&ndash;&gt;
          &lt;!&ndash;              </el-form-item>&ndash;&gt;
          &lt;!&ndash;            </el-col>&ndash;&gt;
          &lt;!&ndash;            <el-col :span="12" :offset="0">&ndash;&gt;
          &lt;!&ndash;              <el-form-item prop="trid" :rules="Rules.interNum" label="轨迹id">&ndash;&gt;
          &lt;!&ndash;                <el-input v-model="addModel.trid"/>&ndash;&gt;
          &lt;!&ndash;              </el-form-item>&ndash;&gt;
          &lt;!&ndash;            </el-col>&ndash;&gt;
          &lt;!&ndash;          </el-row>&ndash;&gt;
          &lt;!&ndash; 第十八行 &ndash;&gt;
          <el-row>
            &lt;!&ndash;            <el-col :span="12" :offset="0">&ndash;&gt;
            &lt;!&ndash;              <el-form-item prop="trname" :rules="Rules.isNull" label="轨迹名称">&ndash;&gt;
            &lt;!&ndash;                <el-input v-model="addModel.trname"/>&ndash;&gt;
            &lt;!&ndash;              </el-form-item>&ndash;&gt;
            &lt;!&ndash;            </el-col>&ndash;&gt;
            <el-col :span="12" :offset="0">
              <el-form-item prop="state" :rules="Rules.radio" label="车辆状态">
                <el-radio-group v-model="addModel.state">
                  <el-radio :label="0">有效</el-radio>
                  <el-radio :label="1">失效</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
          &lt;!&ndash; 第二行 &ndash;&gt;
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
          &lt;!&ndash; 第六行 &ndash;&gt;
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
          &lt;!&ndash; 第八行 &ndash;&gt;
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
    </sys-dialog>-->
  </el-main>
</template>

<script>
import { listApi } from '@/api/order'
// import SysDialog from '@/components/Dialog/SysDialog.vue'
// import Rules from '@/utils/rules'

export default {
  // components: {
  //   SysDialog
  // },
  data() {
    return {
      tableHeight: 0,
      // Rules,
      /*addModel: {
        id: '',
        passengerId: '',
        passengerPhone: '',
        driverId: '',
        driverPhone: '',
        carId: '',
        address: '',
        vehicleType: '',
        orderTime: '',
        departTime: '',
        departure: '',
        depLongitude: '',
        depLatitude: '',
        destination: '',
        destLongitude: '',
        destLatitude: '',
        encrypt: '',
        fareType: '',
        fareVersion: '',
        receiveOrderCarLongitude: '',
        receiveOrderCarLatitude: '',
        receiveOrderTime: '',
        licenseId: '',
        vehicleNo: '',
        toPickUpPassengerTime: '',
        toPickUpPassengerLongitude: '',
        toPickUpPassengerLatitude: '',
        toPickUpPassengerAddress: '',
        driverArrivedDepartureTime: '',
        pickUpPassengerTime: '',
        pickUpPassengerLongitude: '',
        pickUpPassengerLatitude: '',
        passengerGetoffTime: '',
        passengerGetoffLongitude: '',
        passengerGetoffLatitude: '',
        cancelTime: '',
        cancelOperator: '',
        cancelTypeCode: '',
        driveMile: '',
        driveTime: '',
        orderStatus: '',
        price: ''
      },*/
      // 弹框属性
      /*addDialog: {
        title: '',
        height: 610,
        width: 1120,
        visible: false
      },*/
      searchModel: {
        // currentPage: 1,
        // pageSize: 10,
        id: '',
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
    // 计算表格的高度(目前不能随窗口大小调整)
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 180
    })
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
    /*async deleteBtn(row) {
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
    },*/
    /*async editBtn(row) {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      this.$objCopy(row, this.addModel)
      this.addModel.id = row.id
      // 设置弹框属性
      this.addDialog.title = '编辑车辆信息'
      this.addDialog.visible = true
      this.addModel.type = '1'
    },*/
    // 获取列表
    async getList() {
      const res = await listApi(this.searchModel)
      if (res && res.code === 200) {
        console.log(res)
        this.tableList = res.data
      }
    },
    /*onConfirm() {
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
    },*/
    /*onClose() {
      this.addDialog.visible = false
    },*/
    /*async addBtn() {
      // 清空表单
      this.$resetForm('addForm', this.addModel)
      // 设置弹框属性
      this.addDialog.title = '新增车辆'
      this.addDialog.visible = true
      this.addModel.type = '0'
    },*/
    resetBtn() {
      this.searchModel.id = ''
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

#el-form >>> .el-form-item__label {
  text-align: right;
  min-width: 170px;
}
#el-form >>> .el-input {
  width: 360px;
}

</style>
