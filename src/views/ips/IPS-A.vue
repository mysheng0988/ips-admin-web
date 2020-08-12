<template>
  <div class="app-container">
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
    <el-card class="operate-container ips-bg" shadow="never">
        <el-form  ref="productInfoForm"  >
        <el-form-item style="text-align: center"  >
          <p class="title"> 心身疾病筛查项目</p>
        </el-form-item>
        <el-form-item style="text-align: center" >
          <div class="ips-input">植物神经功能检测--》检测科室:{{info.departmentName}}</div>
          <el-button class="handle-box" type="primary" @click="verificationCode" >获取验证码</el-button>
          <el-button  class="handle-box" type="primary" ><a href="HRV://">开始检测</a></el-button>
          <el-button  class="handle-box" type="primary" @click="handleResult">测试记录</el-button>
        </el-form-item>
         <el-form-item  style="text-align: center">
        <div class="ips-input">初筛首访问卷</div>
        <el-button  class="handle-box"  type="primary" @click="startQuestion" v-if="!completeQuestionnaire">开始问卷</el-button>
        <el-button  class="handle-box" type="success" @click="startQuestion" v-else>重新问卷</el-button>
        <el-button  class="handle-box" type="primary"  @click="qrcodeData">扫码答题</el-button>
         <el-button  type="primary" class="handle-box" @click="handleRecord(true,patient.questionnaireNumber)">测试记录</el-button>
      </el-form-item>
      <el-form-item style="text-align: center" > 
        <el-button type="primary" @click="finishCommit" >提交并查看报告</el-button>
      </el-form-item>
    </el-form>
    </el-card>
    <el-dialog
      title="问卷"
      :visible.sync="dialogVisible"
      width="700px">
      <question :scale-id="scaleId+''" :key="scaleId" :medical-record-id="medicalRecordId+''"
        :patient-id="patientId" @closeDialog="closeDialog" ></question>

    </el-dialog>
     <el-dialog
        title="HRV检测结果"
        :visible.sync="hrvVisible"
        width="700px">
        <el-image :src="hrvPath"></el-image>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span> -->
      </el-dialog>
     <el-dialog :visible.sync="qrcodeDialog" width="240px">
      <!-- <qrcode :q-text="qText" :q-size="qSize" ></qrcode> -->
        <el-image class="qrcode" :src="qrcodePath"></el-image>
        <p class="qrcode-text">扫码关注公众号答题</p>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogTips"
      width="40%">
      <div class="tips-box" v-if="tipsData.question">
        <div class="title">问题:{{tipsData.question.question}}</div>
        <el-radio-group v-model="tipsData.question.answer">
            <el-radio class="radio" v-for="(itemData,indexData) in tipsData.question.answers" :label="indexData" :key="indexData">{{itemData}}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTips = false">取 消</el-button>
        <el-button type="primary" @click="appendQuestionSubmitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
 import {getHRV,getVerificationCode} from '@/api/HRV'
 import{getUserInfo} from '@/api/pat'
  import {getRecordPatient} from "@/api/patient";
  import {updateMedicalRecord} from "@/api/medicalRecord"
  import {appendScreeningQuestion} from "@/api/question"
  import { Message, MessageBox } from 'element-ui'
  import question from './components/question';
   import qrcode from '@/components/qrcode/qrcode'
   import qrcodePath from "../../assets/images/qrcode-gzh.jpg"
  export default {
    name: "IPS-A",
     components: {question,qrcode},
    data() {
      return {
        active:0,
        qrcodePath:qrcodePath,
        showStatus: [true, false, false,false,false],
        listLoading: false,
        patientId:"",
        hrvComplete:false,
        qrcodeDialog:false,
        qText:"",
        hrvPath:"",
        scaleId:"",
        tipsData:{},
        qSize:200,
        dialogTips:false,
        completeQuestionnaire:false,
        dialogVisible:false,
        hrvVisible:false,
        medicalRecordId:"",
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
       getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.hrvComplete=true;
          }else{
            this.hrvComplete=false;
          }
        })
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
        return this.$store.state.user.info
      },
      age:function () {
        if(this.patientVO.birthday!=""&&this.patientVO.birthday){
          let age=this.patientVO.birthday.substring(0,4);
          let year=new Date().getFullYear()
          return year-age;
        }
        return "";
      }
    },
    methods: {
       closeDialog(dataList){
        this.dialogVisible=false;
        if(dataList.length!=0){
            this.dialogTips=true;
            let tipsData=dataList[0];
            tipsData.question=JSON.parse(tipsData.question);
             this.tipsData=tipsData;
        }else{
          this.getPatientData()
        }
      },
      appendQuestionSubmitData(){
          let param={
            questionAnswer:{
              answer:JSON.stringify(this.tipsData.question),
              medicalRecordId:this.medicalRecordId,
              questionNum:this.tipsData.questionNum,
             // questionnaireId: this.patient.questionnaireNumber,
              userId:this.patientId,
            },
            scaleQuestionResult:{
              displayOrder:this.tipsData.displayOrder,
              optionOrderList:[this.tipsData.question.answer],
              optionValue:[this.tipsData.question.answers[this.tipsData.question.answer]],
              questionNum:this.tipsData.questionNum,
              returnValue:[""],
            }
          }
          appendScreeningQuestion(param).then(res=>{
            if(res.code==200){
               this.dialogTips=false;
              this.$message.success("提交成功")
              this.getPatientData();
            }
          })
      },
       handleRecord(questionnaire,questionnaireId){
       if(this.completeQuestionnaire){
           this.$router.push({path:'/ips/questionResult',
            query: {
              medicalRecordId: this.medicalRecordId,
              questionnaire:questionnaire,
              questionnaireId:questionnaireId,
            }
          });
        }else{
          this.$message.warning("暂时没有数据！")
        }
         
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
              this.hrvVisible=true;
                this.hrvComplete=true;
              this.hrvPath=res.dataList[0].resultImageUrl;
          }else{
              this.hrvComplete=false;
            this.$message.warning("暂时没有数据")
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
            this.completeQuestionnaire=res.dataList[0].completeQuestionnaire;
            this.patient=res.dataList[0];  
            this.scaleId=res.dataList[0].questionnaireNumber
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
      finishCommit() {
        if(!this.completeQuestionnaire){
            this.$message.warning("筛查问卷还没有做完")
            return
        } 
        let strHRV=this.hrvComplete?"是否提交":"HRV未完成是否提交？"
        this.$confirm(strHRV, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param={
            id:this.medicalRecordId,
            examinationStatus:100,
          }
          updateMedicalRecord(param).then(res=>{
            if(res.code==200){
               this.$store.commit('delete_tabs', this.$route.path)
                this.$router.push({path:"/rep/siftPdf",query:{id:this.medicalRecordId}})
            }

          })

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
    color: #666;
    font-size: 16px;
  }
  .ips-bg{
    padding-top:80px;
    height: 580px;
    margin-bottom: 15px;
    /* background: url("../../assets/images/ips-a-bg.png") no-repeat;
    background-size: cover; */
  }
  .active{
    border:1px solid #1197D6;
    color: #1197D6;
  }
  .operate-container .title{
    margin: 20px 0;
    font-size: 25px;
    color: #1092D4;
    font-weight: bold;
   
  }
  .handle-box{
    border-radius: 10px;
    width: 120px;
  }
   .ips-input{
    margin: 0 10px;
    width: 400px;
    display: inline-block;
    border: 1px solid #595757;
    border-radius: 10px;
    color: #333;
  }
  .input2 {
  width: 45%;
}
  .disable{
    background: #ccc;
    border: 1px solid #ccc;
  }
  .tips-box{
    line-height: 35px;
    font-size: 18px;
    padding: 0 18px;
  }
  .tips-box .title{
    color: #000;
  }
  .tips-box .radio{
    line-height: 35px;
  }
  .qrcode{
    width: 200px;
    height: 200px;
    margin: 0 auto;
  }
  .qrcode-text{
    margin-bottom:  20px;
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #666;
    font-weight: bold;
  }
</style>
