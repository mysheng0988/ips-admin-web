<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" size="small">
      <div>
        <el-form-item>
          <el-input placeholder="患者编号" v-model.number="listQuery.pid" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="患者姓名" v-model="listQuery.realName" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-input placeholder="身份证号" v-model="listQuery.cardNo" clearable></el-input>
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="createDate"
            type="daterange"
            range-separator="至"
            start-placeholder="起始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            @change="handleTimeChange"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn" @click="clearData">
            <svg-icon icon-class="reset-icon" class-name="search-icon"></svg-icon>重置
          </el-button>
          <el-button icon="el-icon-search" type="success" class="search-btn" @click="queryData()">查询</el-button>
          <el-button type="success" class="search-btn" @click="addPatient">
            <svg-icon icon-class="patient" class-name="search-icon"></svg-icon>患者登记
          </el-button>
          <!-- <el-button type="info" round class="search-btn" @click="M1WriteBlockData">写卡</el-button> -->
        </el-form-item>
      </div>
    </el-form>
    <div class="table-container">
      <el-table
        ref="productCateTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        stripe
        border
      >
        <!-- <el-table-column label="序号" width="60" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>-->
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">{{scope.row.id}}</template>
        </el-table-column>
        <el-table-column label="患者姓名" align="center">
          <template slot-scope="scope">{{scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="年龄" width="100" align="center">
          <template slot-scope="scope">{{scope.row.birthday|formatAge}}</template>
        </el-table-column>
        <el-table-column label="性别" width="100" align="center">
          <template slot-scope="scope">{{scope.row.gender |formatGender}}</template>
        </el-table-column>
        <el-table-column label="出生日期" align="center">
          <template slot-scope="scope">{{scope.row.birthday }}</template>
        </el-table-column>
        <el-table-column label="手机号码" align="center">
          <template slot-scope="scope">{{scope.row.mobileNumber }}</template>
        </el-table-column>
        <el-table-column label="身份证号" align="center">
          <template slot-scope="scope">{{scope.row.cardNo }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column width="350" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              plain
              icon="el-icon-edit-outline"
              @click="handleCreateRecord(scope.row)"
            >新建病例</el-button>
            <el-button
              size="mini"
              type="success"
              plain
              icon="el-icon-edit-outline"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              icon="el-icon-time"
              type="warning"
              plain
              @click="historyRecord(scope.row)"
            >历史记录</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog title="患者登记" :visible.sync="dialogVisible" width="60%">
      <div class="cardContent">
        <!-- <el-image class="img" :src="require('@/views/pat/imgs/cardID.png')"></el-image>
        <p class="flag">请将磁卡置于机器上方</p>
        <p>刷卡成功后进行后续操作</p>
        <el-form ref="cardForm"
                 :model="cardForm"
                 :rules="rules">
          <el-form-item   prop="cardID" >
             <el-input v-model="cardForm.cardID" placeholder="请输入身份证号"></el-input>
          </el-form-item>
        </el-form>-->
        <el-form ref="patForm" label-width="100px" :rules="rules" :model="patObj">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="真实姓名:" prop="realName">
                <el-input
                  v-model="patObj.realName"
                  placeholder="请输入姓名"
                  maxlength="20"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="性别" prop="gender">
                <el-select v-model="patObj.gender" placeholder="性别" class="input-width">
                  <el-option :value="true" label="男"></el-option>
                  <el-option :value="false" label="女"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="身份证号:" prop="cardNo">
                <el-input
                  v-model="patObj.cardNo"
                  placeholder="请输入身份证号"
                  maxlength="18"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
             <el-col :span="12">
            <el-form-item label="出生日期：" prop="birthday">
                <el-date-picker
                  v-model="patObj.birthday"
                  class="input-width"
                  value-format="yyyy-MM-dd"
                  type="date"
                  placeholder="请选择时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
             <el-col :span="12">
              <el-form-item label="联系电话:" prop="mobileNumber">
                <el-input
                  v-model="patObj.mobileNumber"
                  placeholder="请输入联系电话"
                  maxlength="11"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
           <el-col :span="12">
              <el-form-item label="民族" prop="nation">
                <el-select v-model="patObj.nation" placeholder="请选择民族" class="input-width">
                  <el-option
                    v-for="(item,index) in nation"
                    :key="index"
                    :value="item"
                    :label="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
           
            <el-col :span="24">
              <el-form-item label="联系地址:">
                <el-input
                  class="textarea"
                  placeholder="请输入内容"
                  type="textarea"
                  v-model="patObj.address"
                  :autosize="true"
                  maxlength="100"
                  show-word-limit
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="readCardData">刷 卡</el-button>
        <el-button type="success" @click="savePatient('patForm')">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="新建病例"  :visible.sync="dialogVisible2" width="60%">
      <div class="cardContent">
        <el-form :model="medObj" :rules="medrules" ref="medObjFrom" label-width="120px">
          <el-row :gutter="10">
            <el-col :span="12">
              <el-form-item label="患者来源：" prop="outpatient">
                <el-select
                  placeholder="请选择"
                  v-model="medObj.outpatient"
                  clearable
                  class="input-width"
                >
                  <el-option label="门诊" :value="true"></el-option>
                  <el-option label="住院" :value="false"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="科 室：" prop="fromDeptId">
                <el-select
                  placeholder="请选择"
                  v-model="medObj.fromDeptId"
                  clearable
                  class="input-width"
                >
                  <el-option
                    v-for="item in deptList"
                    :key="item.deptId"
                    :label="item.deptName"
                    :value="item.deptId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="medObj.outpatient?'门诊号:':'住院号:'" prop="beHospitalizedNumber">
                <el-input
                  v-model="medObj.beHospitalizedNumber"
                  clearable
                  maxlength="15"
                  show-word-limit
                  placeholder="请输入"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="检测项目：" prop="examinationId">
                <el-select
                  placeholder="请选择"
                  v-model="medObj.examinationId"
                  clearable
                  class="input-width"
                >
                  <el-option
                    v-for="item in examinationList"
                    :key="item.id"
                    :label="item.examinationName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="医 生：" prop="fromUid">
                <el-select placeholder="请选择" v-model="medObj.fromUid" clearable class="input-width">
                  <el-option
                    v-for="item in doctorList"
                    :key="item.id"
                    :label="item.realName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="床号：" prop="bedNo">
                <el-input
                  v-model="medObj.bedNo"
                  placeholder="请输入床号"
                  clearable
                  maxlength="10"
                  show-word-limit
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2=false">关闭</el-button>
        <el-button type="success" @click="payByCard('medObjFrom')">刷卡</el-button>
      </span>
    </el-dialog>
     <el-dialog title="请您刷卡" :visible.sync="dialogVisible3" width="50%">
      <div class="card-box">
        <el-image class="img" :src="require('@/views/pat/imgs/cardID.png')"></el-image>
        <p class="flag">请将磁卡置于机器上方</p>
        <p v-if="medObj.cardNo==''&&!cardState">请您刷卡</p>
        <p class="success" v-else-if="medObj.cardNo&&cardState">
          <i class="el-icon-success"></i>刷卡成功
        </p>
        <p class="error" v-else>
          <i class="el-icon-error"></i>刷卡失败
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible3=false">取消</el-button>
        <el-button type="success" @click="M1AuthenKeyData">M1卡认证</el-button>
        <el-button type="primary" @click="readCardMsg" :loading="loadingbut">确认刷卡</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import { getDeptList,  queryExamination, getDoctorList, saveMedicalRecord} from "@/api/patient";
import { medicalRecordListData } from "@/api/medicalRecord";
import {patientList,updatePatint,insertPatint} from "@/api/pat"
import {readCard, readCardReset, readCardWriteData, M1AuthenKey } from "@/api/cardRead";
import { mapGetters } from "vuex";
import { Message, MessageBox } from "element-ui";
import { validateNum } from "@/utils/validate";
import { Loading } from "element-ui";
let defaultPat={
  address:"",
  birthday:"",
  cardNo:"",
  gender:true,
  mobileNumber:"",
  nation:"",
  realName:""
}
let defaultMedical = {
  patientId: "",
  outpatient: true,
  bedNo: "",
  fromDeptId: "",
  beHospitalizedNumber: "",
  examinationId: "",
  fromUid: "",
  remark: "",
  cardNo: "",
  sid: 0
};
export default {
  name: "list",
  data() {
     const validateNumber = (rule, value, callback) => {
      if (value != "" && !validateNum(value)) {
        callback(new Error("必须是数字"));
      } else {
        callback();
      }
    };
    return {
      loadingbut: false,
      createDate: [],
      nation: [
        "汉族",
        "蒙古族",
        "回族",
        "藏族",
        "维吾尔族",
        "苗族",
        "彝族",
        "壮族",
        "布依族",
        "朝鲜族",
        "满族",
        "侗族",
        "瑶族",
        "白族",
        "土家族",
        "哈尼族",
        "哈萨克族",
        "傣族",
        "黎族",
        "傈僳族",
        "佤族",
        "畲族",
        "高山族",
        "拉祜族",
        "水族",
        "东乡族",
        "纳西族",
        "景颇族",
        "柯尔克孜族",
        "土族",
        "达斡尔族",
        "仫佬族",
        "羌族",
        "布朗族",
        "撒拉族",
        "毛南族",
        "仡佬族",
        "锡伯族",
        "阿昌族",
        "普米族",
        "塔吉克族",
        "怒族",
        "乌孜别克族",
        "俄罗斯族",
        "鄂温克族",
        "德昂族",
        "保安族",
        "裕固族",
        "京族",
        "塔塔尔族",
        "独龙族",
        "鄂伦春族",
        "赫哲族",
        "门巴族",
        "珞巴族",
        "基诺族"
      ],
      medObj: Object.assign({}, defaultMedical),
      deptList: [],
      doctorList:[],
      cureList: [],
      examinationList: [],
      patObj:Object.assign({},defaultPat),
      list: [],
      taskList: [],
      dialogVisible2: false,
      listLoading: false,
      dialogVisible: false,
      dialogVisible3:false,
      cardState: false,
      total: 0,
      listQuery: {
        cardNo: "",
        createTimeStart: "",
        createTimeEnd: "",
        examinationId: null,
        examinationStatus: null,
        pid: "",
        realName: "",
        pageNum: 1,
        pageSize: 10
      },
       medrules: {
        fromDeptId: [
          { required: true, message: "必填字段", trigger: "change" }
        ],
        beHospitalizedNumber: [
          {
            required: true,
            message: "不能为空且必须是数字",
            trigger: "blur",
            validator: validateNumber
          }
        ],
        bedNo: [
          { required: false, trigger: "blur", validator: validateNumber }
        ],
        fromUid: [{ required: true, message: "必填字段", trigger: "change" }],
        examinationId: [
          { required: true, message: "必填字段", trigger: "change" }
        ]
      },
      rules: {
        birthday:[
            {required: true, message: "请选择出生日期", trigger: "blur" }
        ],
        realName:[
          {required: true, message: "请输入真实姓名", trigger: "blur" }
        ],
        gender:[
          {required: true, message: "请选择性别", trigger: "change" }
        ],
        nation:[
          {required: true, message: "请选择名族", trigger: "change" }
        ],
        mobileNumber:[
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
        cardNo: [
          { required: true, message: "请输入身份证号码", trigger: "blur" },
          {
            pattern: /^[0-9]{18}$/,
            message: "身份证格式不正确",
            trigger: "blur"
          }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      //步骤二，对象扩展运算符方式
      "info"
    ])
  },
  created() {
    this.medObj.deptId=this.info.departmentId;
    this.medObj.fromUid=this.info.id;
    this.getList();
    this.getDept();
    this.getExaminationBtn();
    this.getDoctor();
  },
  filters: {
    formatGender(gender) {
      return gender ? "男" : "女";
    },
    formatAge(birthday) {
      if (birthday && birthday != "") {
        let age = birthday.substring(0, 4);
        let year = new Date().getFullYear();
        return year - age;
      }
      return "";
    },
    formatState(val) {
      if (val == 1) {
        return "未测评";
      } else if (val == 2) {
        return "测评中";
      } else {
        return "已完成";
      }
      return "";
    }
  },
  methods: {
    addPatient(){
      this.patObj=Object.assign({},defaultPat);
      this.dialogVisible=true;
       this.$nextTick(function() {
        this.$refs.patForm.clearValidate();
      });
    },
     payByCard(formName) {
      this.cardState = false;
      this.medObj.cardNo = "";
      this.$refs[formName].validate(valid => {
          if (valid) {
            this.dialogVisible3 = true;
          } else {
            this.$message({
              message: "验证失败",
              type: "error",
              duration: 1000
            });
            return false;
          }
      });
    },
     M1AuthenKeyData() {
      M1AuthenKey().then(res => {
        if (res.retcode == 200) {
          this.$message.success("认证成功");
        } else if (res.code == 200) {
          this.$message.success("认证成功");
        }
      });
    },
    readCardMsg() {
      this.loadingbut = true;
      readCardWriteData()
        .then(res => {
          this.loadingbut = false;
          this.cardState = true;
          this.medObj.cardNo = "";
          if (res.retcode == "0") {
            let cardMsg = res.data;
            this.medObj.cardNo = cardMsg;
            this.onSubmit();
          } else if (res.code == 200) {
            let cardMsg = res.data.data;
            this.medObj.cardNo = cardMsg;
            this.onSubmit();
          } else {
            this.$message.error("刷卡失败");
          }
        })
        .catch(res => {
          this.loadingbut = false;
        });
    },
     onSubmit() {

        const loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      saveMedicalRecord(this.medObj)
        .then(res => {
          loading.close();
          if (res.code == 200) {
            this.dialogVisible2=false;
            this.dialogVisible3=false;
            this.$store.commit("delete_tabs", this.$route.path);
            this.$router.push("/ips/index");
            Message.success("保存成功");
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    cardNoChange(){
       let birthday=this.patObj.cardNo.substring(6,10)+"-"+this.patObj.cardNo.substring(10,12)+"-"+this.patObj.cardNo.substring(12,14);
       this.patObj.birthday=birthday;
    },
     getDoctor() {
      let param = {
        deptId: this.info.departmentId,
        sid: ""
      };
      getDoctorList(param).then(res => {
        if (res.code == 200) {
          this.doctorList = res.dataList;
        }
      });
    },
    getDept() {
      getDeptList(this.info.organizationId).then(res => {
        if (res.code == 200) {
          this.deptList = res.dataList;
        }
      });
    },
    getExaminationBtn() {
      queryExamination(this.info.organizationId).then(res => {
        if (res.code == 200) {
          this.examinationList = res.dataList;
        }
      });
    },
    handleCreateRecord(val){
      this.medObj.patientId=val.id;
     this.dialogVisible2=true;
    },
    M1WriteBlockData() {
      M1WriteBlock().then(res => {
        console.log(res);
      });
    },
    clearData() {
      let listQuery = {
        cardNo: "",
        createTimeStart: "",
        createTimeEnd: "",
        examinationId: null,
        examinationStatus: null,
        pid: "",
        realName: "",
        pageNum: 1,
        pageSize: 10
      };
      this.createDate = [];
      this.listQuery = listQuery;
    },
    historyRecord(data) {
      this.$router.push({
        path: "/pat/assessRecord",
        query: {
          id: data.id,
          name: data.realName
        }
      });
    },
    handleTask(val) {
      this.patientMsg = val;
      this.listLoading = true;
      let param = {
        queryParamMedicalRecord: {
          patientId: this.patientId
        },
        pageNum: 1,
        pageSize: 20
      };
      medicalRecordListData(param)
        .then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            this.taskList = res.dataList;
            this.dialogVisible2 = true;
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    handleEdit(val) {
     this.dialogVisible=true;
     this.patObj=val;
    },
    handleTimeChange(val) {
      this.listQuery.createTimeStart = this.createDate[0];
      this.listQuery.createTimeEnd = this.createDate[1];
    },
    readCardData() {
      readCard().then(res => {
        if (res.cardno) {
        
          this.patObj.realName = res.name;
           this.patObj.gender = res.sex == "男" ? true : false;
           this.patObj.nation = res.nation;
           this.patObj.cardNo = res.cardno;
           this.patObj.address = res.address;
           this.cardNoChange();
        } else if (res.code == 200) {
          this.patObj.realName = res.data.name;
          this.patObj.gender = res.data.sex == "男" ? true : false;
          this.patObj.nation = res.data.nation;
          this.patObj.cardNo = res.data.cardno;
           this.patObj.address = res.data.address;
           this.cardNoChange();
        } else {
          this.$message.warning("刷卡失败");
        }
      });
    },
    savePatient(formName) {
      let patObj=this.patObj;
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(!this.patientId){
              insertPatint(patObj).then(res=>{
                  if(res.code==200){
                    this.dialogVisible=false;
                    this.patObj=Object.assign({},defaultPat)
                    this.getList();
                  }
              })
          }else{
            updatePatint(patObj).then(res=>{
                 if(res.code==200){
                    this.dialogVisible=false;
                    this.patObj=Object.assign({},defaultPat)
                  }
            })
          }
        }else{
          this.$message.warning("验证失败")
        }
      });
    },
    queryData() {
      this.listQuery.pageNum = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageNum = 1;
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val;
      this.getList();
    },
    getList() {
      // let reg = /^[0-9]*$/;
      // if (this.listQuery.pid != "" && !reg.test(this.listQuery.pid)) {
      //   this.$message.warning("患者编号必须是数字");
      //   return;
      // }
      this.listLoading = true;
      patientList(this.listQuery)
        .then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            this.list = res.dataList;
            this.total = res.pageInfo.total;
          } else {
            this.$message.warning("没有查到数据");
            this.list = [];
            this.total = 0;
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    }
  }
};
</script>

<style scoped >
.card-box {
  text-align: center;
  margin-bottom: 30px;
}
.cardContent {
  width: 100%;
  text-align: center;
}
.cardContent .img {
  width: 160px;
  height: 120px;
  margin: 10px auto;
}
.cardContent p {
  line-height: 35px;
}
.flag {
  font-size: 16px;
  font-weight: bold;
  color: #222;
}
.flag-type {
  font-size: 14px;
  font-weight: bold;
  color: #222;
}
.flag-type .text {
  padding: 0 10px;
  color: #a6ce39;
}
.flag-type .num {
  padding: 0 10px;
  color: #1197d6;
}
.cardContent .card-input {
  text-align: center;
}
.search-btn {
  width: 100px;
}
.active {
  border: 1px solid #1197d6;
  color: #1197d6;
}
.active-btn {
  background: #1197d6 !important;
  color: #fff !important;
}
.input-width {
  width: 100%;
}
.card-box .success {
  color: #67c23a;
}
.card-box i {
  margin: 0 10px;
}
.card-box .error {
  color: #f56c6c;
}
</style>
