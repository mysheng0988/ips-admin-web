<template>
  <div v-loading.lock="loading">
    <div class="answer-box" >
      <div class="title">{{data.name}}</div>
      <div class="explain">{{data.instruction}}</div>
      <el-progress v-if="percentage" :percentage="percentage" :format="formatPercentage"></el-progress>
      <div class="explain">{{problemData.instruction}}</div>
      <div class="question" v-if="problemData.question">题目:{{problemData.question.question}}</div>
     <div>
       <el-radio-group v-if="problemData.question" v-model="problemData.question.answer" >
         <div class="question" v-for="(item,index) in problemData.question.answers" :key="index"  >
           <el-radio @change="handleChange" :label="index" >{{item}}</el-radio>
         </div>
       </el-radio-group>
     </div>
    </div>
    <div class="btn-box">
      <el-button type="primary" plain @click="prevQuestion">上一题</el-button>
      <el-button type="primary" plain @click="nextQuestion" v-if="questionLength!=questionNum+1">下一题</el-button>
      <el-button type="primary" plain @click="submitData" v-else>提交</el-button>
    </div>
  </div>

</template>

<script>
  import { getTempDetail } from "@/api/questionnaireBank";
  import {getQuestionJson} from '@/api/getJson'
  import {submitQuestion,screeningQuestionSubmit,getQuestionnaireDetail} from '@/api/question'
    export default {
      name: "question",
      props: {
        scaleId: {
            type: String,
          },
        medicalRecordId:{
          type:String,
          value:""
        },
        patientId:{
          type:String,
          value:"",
        },
       },
      data() {
        return {
          loading:false,
          data:[],
          problemData:[],
          questionNum:0,
          questionLength:0,
        }
      },
       watch:{
         scaleId(newName, oldName) {
           this.handleChangeJSON();
         }
      },
      mounted(){
         this.handleChangeJSON();
      },
      computed:{
        percentage(){
          let percent=Math.ceil((this.questionNum+1)/this.questionLength*100);
          if(percent>100){
            percent=100;
          }
          return percent;
        },

      },
      methods:{
         handleChangeJSON(){
            this.loading=true;
            getQuestionnaireDetail( {medicalRecordId:this.medicalRecordId,questionnaireId: this.scaleId}).then(res => {
               this.loading=false
              if (res.code == 200) {
                let data = res.dataList[0];
                for (let item of data.questionList) {
                  item.question = JSON.parse(item.question);
                }
                this.data = data;
                this.problemData=this.data.questionList[this.questionNum];
                this.questionLength=this.data.questionList.length;
              }
            });

        },
        handleChange(){
          setTimeout(()=>{
              this.nextQuestion();
          },500)
        },
         checkAddShow(arr){
          if(this.problemData.hidden){
            this.questionNum++
            this.problemData=arr.problem[this.questionNum];
            this.checkAddShow(arr);
          }
        },
         checkReduceShow(arr){
          if(this.problemData.hidden){
            this.questionNum--
            this.problemData=arr.problem[this.questionNum];
            this.checkReduceShow(arr);
          }
        },
        formatPercentage(){
          return ((this.questionNum+1)/this.questionLength*100).toFixed()+"%"
        },
        prevQuestion(){
          if(this.questionNum<=0){
            this.$message.warning("当前是第一题")
          }else{
            if(this.problemData.preQuestionNum!=0){
               for(let x=0;x<this.data.questionList.length;x++){
                  if(this.problemData.preQuestionNum==this.data.questionList[x].preQuestionNum){
                    this.questionNum=x;
                    break;
                  }
              }
              this.questionNum=this.problemData.preQuestionNum;
               this.problemData=this.data.questionList[this.questionNum]
            }else{
               this.questionNum--;
              this.problemData=this.data.questionList[this.questionNum];
            }

          }

        },
         nextQuestion(){
          if(this.questionNum<this.questionLength-1){
            if(this.problemData.question.answer===""){
               this.$message.warning("请选择答案")
            }else{
              if(this.problemData.nextQuestionNum!=0&&this.problemData.question.answer==0){
                for(let x=this.questionNum;x<this.data.questionList.length;x++){
                this.data.questionList[x].question.answer=0;
                
                  if(this.problemData.nextQuestionNum==this.data.questionList[x].questionNum){
                    this.questionNum=x;
                    break;
                  }
                }
                this.problemData=this.data.questionList[this.questionNum];

              }else{
                 this.questionNum++
                this.problemData=this.data.questionList[this.questionNum];
              }
            }

          }else{
            this.$message.warning("最后一题了")
          }
        },
        submitData(){
          if(this.problemData.question.answer===""){
            this.$message.warning("请选择答案!")
            return;
          }
          let param={
            questionnaireId:this.data.id,
            questionnaireNumber:this.data.number,
            medicalRecordId:this.medicalRecordId,
            patientId:this.patientId,
            questionResultList:[],
            questionnaireAnswer:{
              condition:this.data.condition,
              instruction:this.data.instruction,
              medicalRecordId:this.medicalRecordId,
              name:this.data.name,
              number:this.data.number,
              questionnaireId:this.data.id,
              type:this.data.type,
              userId:this.patientId,
              questions:[]
            }
          }
          for(let item of this.data.questionList){
             let qr={}
             let qas={}
            if(item.type=='0'){
              qr.displayOrder=item.displayOrder;
              qr.optionOrderList=[item.question.answer];
              qr.optionValue=[item.question.answers[item.question.answer]];
              qr.questionNum=item.questionNum;
              qr.remark="",
              qr.returnValue=[""];
              qas.answer=JSON.stringify(item.question);
              qas.medicalRecordId=this.medicalRecordId;
              qas.questionNum=item.questionNum;
              qas.questionnaireId=this.data.id;
              qas.userId=this.patientId;
            }
            param.questionResultList.push(qr);
            param.questionnaireAnswer.questions.push(qas)
          }
          this.loading=true;
          screeningQuestionSubmit(param).then(res=>{
             this.loading=false;
            if(res.code==200){
                this.$emit('closeDialog',res.dataList);
               this.$message.success(res.message)
            }else{
              this.$message.warning(res.message)
            }

          }).catch(error=>{
             this.loading=false;
          })
        },

      }
    }
</script>

<style scoped>
  .answer-box{
    width: 100%;
  }
  .answer-box span{
    margin: 0 20px;
  }
  .title{
    width: 100%;
    text-align: center;
    color: #000;
    font-size: 20px;
    font-weight: bold;
  }
  .explain{
    font-size: 16px;
    color: #333;
    padding: 10px 0;
    line-height: 35px;
    font-weight: bold;
    text-indent: 2em;
  }
  .question{
    line-height: 45px;
    font-size: 18px;
  }
  .question label{
    line-height: 40px;
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: normal;
  }
  .remark{width: 60%}
  .btn-box{
    width: 100%;
    text-align: center;
    margin: 20px 0;
  }
  .symptom{
    line-height: 45px;
      font-size: 18px;
  }
  .el-checkbox{
    margin-right: 5px;
    font-size: 18px;
  }
</style>
