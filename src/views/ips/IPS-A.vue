<template>
  <div class="app-container">
    <el-card class="operate-container" shadow="never">
      <el-row :gutter="10">
        <el-col :span="24">
          <div>编号：<span>{{patient.patientId}}</span></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <div>姓名：<span></span></div>
        </el-col>
        <el-col :span="6">
          <div>年龄：<span>{{age}}</span></div>
        </el-col>
        <el-col :span="6">
          <div>性别：<span>{{patientVO.gender?"男":"女"}}</span></div>
        </el-col>
        <el-col :span="6">
          <div>身高：<span>{{patientVO.height}}cm</span></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="6">
          <div>体重：<span>{{patientVO.weight}}kg</span></div>
        </el-col>
        <el-col :span="6">
          <div>来源医生：<span>{{patient.fromRealName}}</span></div>
        </el-col>
        <el-col :span="6">
          <div>来源科室：<span>{{patient.fromDeptName}}</span></div>
        </el-col>
        <el-col :span="6">
          <div>测评项目：<span>{{patient.examinationTypeCode|examinationFormat}}</span></div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="operate-container" shadow="never">
        <el-form  ref="productInfoForm" label-width="120px" >
        <el-form-item style="text-align: center" >
          <div class="ips-input">植物神经功能检测--》检测科室:{{info.deptName}}</div>
          <el-button type="primary" @click="verificationCode" >获取验证码</el-button>
          <el-button type="primary" ><a href="HRV://">开始检测</a></el-button>
          <el-button type="primary" @click="handleResult">记录结果</el-button>
        </el-form-item>
         <el-form-item  style="text-align: center">
        <div class="ips-input">初筛首访问卷</div>
        <el-button type="primary" @click="startQuestion">开始问卷</el-button>
        <el-button type="primary" class="disable" @click="handleRecord(true,questionNo)">测试记录</el-button>
        <el-button type="primary"  @click="qrcodeData">扫码答题</el-button>
      </el-form-item>
      <el-form-item style="text-align: center" > 
        <el-button type="primary">完成并提交</el-button>
      </el-form-item>
    </el-form>
    </el-card>
    <el-dialog
      title="问卷"
      :visible.sync="dialogVisible"
      width="700px">
      <question :scale-id="scaleId"  :medical-record-id="medicalRecordId"
        :patient-id="patientId" @closeDialog="closeDialog" ></question>

    </el-dialog>
     <el-dialog :visible.sync="qrcodeDialog" width="420px">
      <qrcode :q-text="qText" :q-size="qSize" ></qrcode>
    </el-dialog>
  </div>
</template>

<script>
 import {getHRV,getVerificationCode} from '@/api/HRV'
 import{getUserInfo} from '@/api/pat'
  import {getRecordPatient} from "@/api/patient";
  import { Message, MessageBox } from 'element-ui'
  import question from './components/question';
   import qrcode from '@/components/qrcode/qrcode'
  export default {
    name: "IPS-A",
     components: {question,qrcode},
    data() {
      return {
        active:0,
        showStatus: [true, false, false,false,false],
        listLoading: false,
        patientId:"",
        qrcodeDialog:false,
        qText:"",
        scaleId:"",
        qSize:200,
        dialogVisible:false,
        medicalRecordId:"",
        total:0,
        patient:"",
        patientVO:"",
        isEdit:false,
        listQuery: {
          shopId:null,
          currentPage: 1,
          pageSize: 10
        },
      }
    },
     watch: {
      $route(to) {
          this.patientId=this.$route.query.id;
          this.medicalRecordId=this.$route.query.medicalRecordId;
          this.getPatientData();
      }
    },
    created() {
      this.patientId=this.$route.query.id;
      this.medicalRecordId=this.$route.query.medicalRecordId;
      this.getPatientData();
    },
    filters: {      
      examinationFormat (val) { 
        let str="综合测评"
        if(val=="20001"){
          str="筛查测评"
        }else if(val=="20002"){
          str="专科测评"
        }
        return str;
      } 
    },   
    computed:{
      info () {
        console.log(this.$store.state.user)
        return this.$store.state.user.info
      },
      age:function () {
        if(this.patientVO.birthday!=""&&this.patientVO.birthday){
          let age=this.patientVO.birthday.substring(0,4);
          let year=new Date().getFullYear()
          return year-age-1;
        }
        return "";
      }
    },
    methods: {
       closeDialog(){
        //this.initData();
        this.dialogVisible=false;
      },
      qrcodeData(){
        let medicalRecordId=this.medicalRecordId;
        let patientId=this.patientId;
        this.qText="https://ips.xsyxsy.com/patient/"+patientId+"/"+medicalRecordId;
        this.qrcodeDialog=true;
      },
       handleResult(){
          this.getHRVData()
      },
      startQuestion(){
        this.dialogVisible=true;
      },
      changeTab(index){
        // this.active=index;
        // this.hideAll();
        // this.showStatus[index] = true;
      },
       getHRVData(){

        getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.dialogVisible=true;
              this.hrvPath="data:image/png;base64,"+res.dataList[0].resultImageUrl;
          }
        })
      },
      verificationCode(){
        getVerificationCode().then(res=>{
          if(res.code==200){
            this.$copyText(res.dataList[0]);
            this.$message.success("验证码:"+res.dataList[0]+",已复制到剪切板！")
          }
        })
      },
     getPatientData(){
        getRecordPatient(this.medicalRecordId).then(res=>{
          if(res.code==200){
            this.patient=res.dataList[0];
            this.patientVO=res.dataList[0].patientVO;
            let active=res.dataList[0].examinationStatus  
            if(active>9){
              this.active=res.dataList[0].examinationStatus/10;
            }else{
              this.active=0;
            }
            this.hideAll()
            this.showStatus[this.active] = true;
          }
          
        })
      },
      getPatientMsg(){

        getPatient(this.$route.query.id).then(res=>{
          this.patient=res.dataList[0];
        })
      },
      hideAll() {
        for (let i = 0; i < this.showStatus.length; i++) {
          this.showStatus[i] = false;
        }
      },
      prevStep() {
        if (this.active > 0 && this.active < this.showStatus.length) {
          this.active--;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      nextStep() {
        if (this.active < this.showStatus.length - 1) {
          this.active++;
          this.hideAll();
          this.showStatus[this.active] = true;
        }
      },
      finishCommit(param) {
        this.productParam.goodsImg=param;
        this.$confirm('是否要提交该产品', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // saveGoods(this.productParam).then((res)=>{
          //   this.$message({
          //     type: 'success',
          //     message: '提交成功',
          //     duration:1000
          //   });
          //   this.$router.back();
          // })

        })
      }
    }
  }
</script>

<style scoped>
  .el-row {
    margin-bottom: 20px;
  }
  .operate-container{
    margin-bottom: 15px;
  }
  .active{
    border:1px solid #1197D6;
    color: #1197D6;
  }
   .ips-input{
    margin: 0 10px;
    width: 400px;
    display: inline-block;
    border: 1px solid #eeee;
    border-radius: 10px;
    color: #999;
  }
</style>
