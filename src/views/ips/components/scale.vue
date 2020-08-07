<template>
  <div style="margin-top: 50px">
    <el-form  ref="productInfoForm" label-width="120px" >
     
      <el-form-item style="text-align: center" v-for="(item,index) of scaleNoList" :key="index">
           <div class="ips-input" >{{item.name}}</div>
           <el-button type="primary" @click="startQuestion(item.number)" v-if="!item.completed">
             开始测试</el-button>
             <el-button v-else type="success" @click="startQuestion(item.number)">
             重新测评</el-button>
        
        
       </el-form-item>
     
      <el-form-item style="text-align: center">
        <!-- <el-button size="medium" @click="handlePrev">上一步，{{prevTitle}}</el-button> -->
        <el-button type="primary" size="medium" @click="handleNext">下一步，{{nextTitle}}</el-button> </el-form-item>
    </el-form>
    <el-dialog
      title="答题卡"
      :visible.sync="dialogVisible"
       :close-on-click-modal="false"
      width="60%">
      <question-scale :scale-id="scaleId"  :medical-record-id="medicalRecordId"
        :patient-id="patientId" @closeDialog="closeDialog" ref="scale" :key="scaleId"></question-scale>

    </el-dialog>
    <el-dialog
      title="追加问题"
      :visible.sync="dialogVisible2"
      width="50%">
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
   getScaleSelectedData,
   } from '@/api/question'
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
        dialogVisible:false,
        dialogVisible2:false,
        scaleId:"",
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
        getScaleSelectedData(this.medicalRecordId).then(res=>{
         if(res.code==200){
            this.scaleNoList=res.dataList;
         }
       })
      
      },
      handleRecord(questionnaire,data){
          if(data.completed){
           this.$router.push({path:'/ips/questionResult',
            query: {
              medicalRecordId: this.medicalRecordId,
              questionnaire:questionnaire,
              questionnaireId:data.number
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
  
           let list=[];
          for(let item of this.problemData){
            let param={
                medicalRecordId: this.medicalRecordId,
                questionNumber: item.num,
                returnValue: [],
                optionOrder: item.answer,
                optionValue: item.answers[this.problemData.answer]
            };
            list.push(param)
            
          }
          submitAdditionalQuestions(list).then(res=>{
              if(res.code==200){
                this.$emit('nextStep');
                this.dialogVisible2=false;
              }
          })
      },
      checkUpData(){
        for(let item of this.scaleNoList){
          if(!item.completed){
            return false;
          }
        }
        return true;
      },
      handleNext() {
      if(this.checkUpData()){
        if(this.type=="A"){
          additionalScreeningA(this.medicalRecordId).then(res=>{
           if(res.code==200){
             this.$emit('nextStep');
           }
         })
        }else{
          additionalQuestions(this.medicalRecordId).then(res=>{
           if(res.code==200){
             this.problemData=res.dataList;
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
    font-size: 18px
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
