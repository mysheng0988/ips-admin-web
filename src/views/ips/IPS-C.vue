<template>
  <div class="app-container" >
    <el-card class="operate-container" shadow="never">
      <el-row :gutter="10">
        <el-col :span="24">
          <div>编号：<span>{{patient.patientId}}</span></div>
        </el-col>
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <div>姓名：<span>{{patient.realName}}</span></div>
        </el-col>
        <el-col :span="8">
          <div>年龄：<span>{{patient.age}}</span>岁</div>
        </el-col>
        <el-col :span="8">
          <div>性别：<span>{{patient.gender?"男":"女"}}</span></div>
        </el-col> 
      </el-row>
      <el-row :gutter="10">
        <el-col :span="8">
          <div>来源医生：<span>{{patient.fromRealName}}</span></div>
        </el-col>
        <el-col :span="8">
          <div>来源科室：<span>{{patient.fromDeptName}}</span></div>
        </el-col>
        <el-col :span="8">
          <div>测评项目：<span>{{patient.examinationTypeCode|examinationFormat}}</span></div>
        </el-col>
      </el-row>
    </el-card>
    <el-card class="operate-container" shadow="never">
      <el-steps :active="active" finish-status="success" align-center>
        <el-step title="主诉" @click.native="changeTab(0)"></el-step>
        <el-step title="设备检查"  @click.native="changeTab(1)"></el-step>
        <el-step title="问卷"></el-step>
        <el-step title="量表"></el-step>
        <el-step title="评估与分析"  @click.native="changeTab(4)"></el-step>
        <el-step title="生成评估报告" @click.native="changeTab(5)"></el-step>
      </el-steps>
      <main-pursue
        v-if="showStatus[0]"
        :is-edit="isEdit"
        :patient-id="patientId+''"
        :key="patientId"
        type="C"
        :gender="patient.gender"
        :medical-record-id="medicalRecordId+''"
        next-title="设备检查"
        @nextStep="nextStep">
      </main-pursue>
      <eeg
        v-if="showStatus[1]"
        :is-edit="isEdit"
         :key="patientId"
        :patient-id="patientId+''"
         :medical-record-id="medicalRecordId+''"
        @nextStep="nextStep"
        prev-title="主诉"
        next-title="问卷"
        @prevStep="prevStep">
      </eeg>
      <easy-question
      v-if="showStatus[2]"
        type="C"
       :key="patientId"
      :patient-id="patientId+''"
      :medical-record-id="medicalRecordId+''"
      prev-title="设备检查"
      next-title="量表"
      @nextStep="nextStep"
      @prevStep="prevStep">
    </easy-question>
      <scale
        v-if="showStatus[3]"
         type="C"
         :key="patientId"
        :patient-id="patientId+''"
        :medical-record-id="medicalRecordId+''"
        prev-title="问卷"
        next-title="评估与分析"
        @nextStep="nextStep"
        @prevStep="prevStep">
      </scale>
      <analysis
        v-if="showStatus[4]"
         type="C"
         :key="patientId"
        :patient-id="patientId+''"
        :medical-record-id="medicalRecordId+''"
        prev-title="量表"
        next-title="治疗方案"
        @nextStep="nextStep"
        @prevStep="prevStep">
      </analysis>
      <cure-plan
        v-if="showStatus[5]"
        :is-edit="isEdit"
         :key="patientId"
        :patient-id="patientId+''"
        :medical-record-id="medicalRecordId+''"
        prev-title="综合分析"
        @prevStep="prevStep"
        @finishCommit="finishCommit">
      </cure-plan>
    </el-card>
  </div>
</template>

<script>
  import {getPatient} from "@/api/patient";
  import {getRecordPatient} from "@/api/patient"
  import mainPursue from './components/mainPursue';
  import hrv from './components/hrv';
  import eeg from './components/eeg';
  import easyQuestion from './components/easyQuestion';
  import scale from './components/scale';
  import analysis from './components/analysis';
  import curePlan from './components/curePlan';
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: "IPS-C",
    components: {mainPursue, hrv, eeg,easyQuestion,scale,analysis,curePlan},
    data() {
      return {
        active:0,
        showStatus: [true, false, false,false,false,false,false],
        listLoading: false,
        patientId:"",
        medicalRecordId:"",
        patientVO:"",
        total:0,
        patient:"",
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
    computed:{
      age:function () {
        if(this.patientVO.birthday!=""&&this.patientVO.birthday){
          let age=this.patientVO.birthday.substring(0,4);
          let year=new Date().getFullYear()
          return year-age-1;
        }
        return "";
      }
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
    methods: {
      changeTab(index){
        // this.active=index;
        // this.hideAll();
        // this.showStatus[index] = true;
      },
      //病例信息接口
      getPatientData(){
        getRecordPatient(this.medicalRecordId).then(res=>{
          if(res.code==200){
            this.patient=res.dataList[0];
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
</style>
