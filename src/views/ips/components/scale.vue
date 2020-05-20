<template>
  <div style="margin-top: 50px">
    <el-form  ref="productInfoForm" label-width="120px" >
     
      <el-form-item style="text-align: center" v-for="(item,index) of scaleNoList" :key="index">
        <div v-if="item!=2201">
            <div class="ips-input" >{{arrTitle[item-1]}}</div>
            <el-button type="primary" @click="startQuestion(item)">
            {{completeScaleNoList.includes(item)?"重新测评":"开始测试"}}</el-button>
            <el-button type="primary" :class="completeScaleNoList.includes(item)?'':'disable'" @click="handleRecord(false,item)">记录结果</el-button>
        </div>
        <div v-else>
          <div class="ips-input" >家庭教养方式量表EMBU</div>
           <el-button type="primary" @click="startQuestion(item)">
            {{completeScaleNoList.includes(2201)?"重新测评":"开始测试"}}</el-button>
            <el-button type="primary" :class="completeScaleNoList.includes(2201)?'':'disable'" @click="handleRecord(false,2201)">记录结果</el-button>
        </div>
        
        
       </el-form-item>
     
      <el-form-item style="text-align: center">
        <!-- <el-button size="medium" @click="handlePrev">上一步，{{prevTitle}}</el-button> -->
        <el-button type="primary" size="medium" @click="handleNext">下一步，{{nextTitle}}</el-button> </el-form-item>
    </el-form>
    <el-dialog
      title="答题卡"
      :visible.sync="dialogVisible"
     destroy-on-close
      width="700px">
      <question-scale :scale-id="scaleId"  :medical-record-id="medicalRecordId"
        :number="siblingsNumber"
        :patient-id="patientId" @closeDialog="closeDialog" ref="scale"></question-scale>

    </el-dialog>
    <el-dialog
      title="追加问题"
      :visible.sync="dialogVisible2"
      width="40%">
      <div class="answer-box" v-if="problemData.length>0 ">
        <div class="question">{{problemNum+1}}、{{problemData[problemNum].question}}</div>
        <el-radio-group v-model="problemData[problemNum].answer"  @change="handleChange()">
          <div class="question">
            <el-radio   v-for="(itemData,indexData) in problemData[problemNum].answers" :key="indexData" :label="indexData" >{{itemData}}</el-radio>
          </div>
        </el-radio-group>
      </div>
      <div class="btn-box">
        <el-button type="primary" plain @click="prevQuestion">上一题</el-button>
        <el-button type="primary" plain @click="nextQuestion" v-if="unfinish">下一题</el-button>
        <el-button type="primary" plain @click="handleAddQusetion" v-else>提交</el-button>
      </div>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleAddQusetion">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script>
 
  import questionScale from './questionScale';
   import {getMedicalRecord,
   additionalQuestions,
   additionalScreeningA,
   submitAdditionalQuestions,
   } from '@/api/question'
  const defaultProductParam = {
    
  };
  export default {
    name: "scale",
    props: {
      type: {
        type: String,
        default: "C"
      },
       patientId:{
        type:String,
        value:""
      },
      medicalRecordId:{
        type:String,
        value:""
      },
      prevTitle:{
        type:String,
        value:"",
      },
      nextTitle:{
        type:String,
        value:"",
      },
    },
     components: {questionScale},
    data() {
      return {
        arrTitle:["GAD-7筛查量表","汉密尔顿焦虑量表（HAMA）","惊恐障碍严重度量表（PDSS）","PHQ-9筛查量表","汉密尔顿抑郁量表(HAMD)","斯坦福急性应激反应问卷（SASRQ）","简易自评量表SCL - 12","阿森斯失眠量表（AIS）","营养不良通用筛查表（MUST）","社会适应能力量表"
         ,"生活满意度量表（SWLS）","压力自评量表（SSQ-53）","YALE-BROWN强迫量表","防御方式问卷DSQ","A型行为问卷","应付方式问卷","青少年生活事件量表（ASLEC）","抑郁性质问卷","焦虑性质问卷","家庭亲密度与适应性量表","领悟社会支持量表(PSSS)",
         "父母教养方式评价量表（EMBU）","特质应对方式问卷（TCSQ）","营养初次问诊表","创伤后应激障碍自评量表（PCL-C）","躯体化症状自评量表","生活事件量表（ＬＥＳ）","抑郁自评量表SDS","焦虑自评量表SAS","贝克抑郁自评量表","焦虑抑郁筛查量表（HADS）"],
        dialogVisible:false,
        dialogVisible2:false,
        scaleId:"",
        siblingsNumber:"",
        problemNum:0,
        problemData:[],
        unfinish:true,
        scaleState:false,
        answerData:{},
        scaleNoList:[],
        completeScaleNoList:[],
      };
    },
    created() {
       this.initData();
    },
    methods: {
      initData(){
        getMedicalRecord(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.scaleNoList=res.dataList[0].scaleNoList;
              this.completeScaleNoList=res.dataList[0].completeScaleNoList;
              this.scaleState=res.dataList[0].scaleNoList.length===res.dataList[0].completeScaleNoList.length;
              this.siblingsNumber=res.dataList[0].patientVO.siblingsNumber;
          }
            
        });
      },
      handleRecord(questionnaire,questionnaireId){
          if(this.completeScaleNoList.includes(questionnaireId)){
           this.$router.push({path:'/ips/questionResult',
            query: {
              medicalRecordId: this.medicalRecordId,
              questionnaire:questionnaire,
              questionnaireId,questionnaireId
            }
            });
          }else{
            this.$message.warning("您还没有答题呢！")
          }
         
      },
      customQuestion(){
        if(this.scaleId>0&&this.scaleId<28){
          this.dialogVisible=true;
        }else{
          this.$message.warning("请输入量表id")
        }
        
      },
       startQuestion(num){
         this.scaleId=num;
         this.dialogVisible=true;
         //this.$refs.scale.handleChangeJSON(num)
      },
      closeDialog(){
        this.dialogVisible=false;
        this.initData()
      },
      handlePrev() {
        this.$emit('prevStep')
      },
       prevQuestion(){
          if(this.problemNum<=0){
            this.$message.warning("当前是第一题")
          }else{
            this.unfinish=true;
           this.problemNum--;
          }

        },
         nextQuestion(){
          if(this.problemNum<this.problemData.length-1){
            if(this.problemData[this.problemNum].answer!==""){
               this.problemNum++;
            }else{
              this.$message.warning("请选择答案")
            }
          }else{
            this.unfinish=false;
            this.$message.warning("已是最后一题");
          }
         },
      handleChange(){
        if(this.problemData[this.problemNum].num==='1'&&this.problemData[this.problemNum].answer===1){
            this.problemData[1].answer=0;
            this.problemData[2].answer=0;
            this.problemData[3].answer=0;
            if(this.problemData.length>4){
              this.problemNum=4;
            }else{
               this.unfinish=false;
            }
        }else{
          setTimeout(()=>{
              this.nextQuestion();
          },500)
         
        }
       
      },
      handleAddQusetion(){
  
            let param={
              answers:[]
            }
          
          for(let item of this.problemData){
            let param1={};
              param1[item.num]=item.answer;
              param.answers.push(param1);
          }
          // console.log(param)
          submitAdditionalQuestions(param,this.medicalRecordId).then(res=>{
              if(res.code==200){
                this.$emit('nextStep');
                this.dialogVisible2=false;
              }
          })
      },
      handleNext() {
      if(this.scaleState){
        if(this.type=="A"){
          additionalScreeningA(this.medicalRecordId).then(res=>{
           if(res.code==200){
             this.$emit('nextStep');
           }
         })
        }else{
          additionalQuestions(this.medicalRecordId).then(res=>{
           if(res.code==200){
             this.problemData=res.dataList[0];
              this.problemNum=0;
             this.dialogVisible2=true;
           }else{
            this.$emit('nextStep');
           }
         })
        }
         
        
      }else{
        this.$message.warning("您的量表还没有做完")
       }
       
      }

    }
  }
</script>

<style scoped>
  .disable{
    background: #ccc;
    border: 1px solid #ccc;
  }
 .ips-input{
    margin: 0 10px;
    width: 400px;
    display: inline-block;
    border: 1px solid #eeee;
    border-radius: 10px;
    color: #999;
  }
  .answer-box{
    width: 100%;
  }
  .answer-box span{
    margin: 0 20px;
  }
  .title{
    width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }
  .explain{
    font-size: 14px;
    color: #666;
    line-height: 35px;
    text-indent: 2em;
  }
  .question{
    line-height: 45px;
  }
  .question label{
    line-height: 40px;
    max-width: 100%;text-overflow: ellipsis;white-space: normal;
  }
  .remark{width: 60%}
  .btn-box{
    width: 100%;
    text-align: center;
    margin: 20px 0;
  }
  .symptom{
    margin-left: 20px;
    line-height: 45px;
  }
  .el-checkbox{
    margin-right: 5px;
  }
</style>
