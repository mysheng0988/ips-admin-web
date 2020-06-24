<template>
  <div v-loading.fullscreen.lock="loading">
    <div class="answer-box" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
      <el-progress v-if="percentage" :percentage="percentage" :format="formatPercentage"></el-progress>
      <div class="question">题目:{{problemData.question}}</div>
      <div v-if="problemData.type=='1'" class="symptom">
        <el-checkbox-group v-model="problemData.data" >
          <el-checkbox v-for="(item,index) in problemData.symptom" :label="item" :key="index">{{item.question}}</el-checkbox>
        </el-checkbox-group>
        <div class="symptom" v-for="(item,index) in problemData.data" :key="index">
         ({{index+1}}) {{item.question}}
          <el-radio-group v-model="item.answer">
              <el-radio v-for="(itemData,indexData) in item.answers" :label="indexData" :key="indexData">{{itemData}}</el-radio>
          </el-radio-group>
        </div>
      </div>
       <div v-if="problemData.type=='2'" class="symptom">
          <el-checkbox-group   v-model="problemData.data" v-if="gender">
            <el-checkbox v-for="(item1,index1) in problemData.symptom[1].data" :label="item1" :key="index1">{{item1}}</el-checkbox>
          </el-checkbox-group>
          <el-checkbox-group   v-model="problemData.data" v-else>
            <el-checkbox v-for="(item1,index1) in problemData.symptom[0].data" :label="item1" :key="index1">{{item1}}</el-checkbox>
          </el-checkbox-group>
      </div>
     <div v-else>
       <el-radio-group v-model="problemData.answer" @change="handleChange">
         <div class="question" v-for="(item,index) in problemData.answers" :key="index">
           <el-radio :label="index" >{{item}}</el-radio>
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
  import {getQuestionJson} from '@/api/getJson'
  import {submitQuestion} from '@/api/question'
    export default {
      name: "question",
      props: {
        scaleId: {
            type: Number,
          },
        medicalRecordId:{
          type:String,
          value:""
        },
        gender:{
          type:Boolean,
          value:true,
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
            getQuestionJson(this.scaleId).then(res=>{
            this.data=res.data;
            this.problemData=this.data.problem[this.questionNum];
            this.questionLength=this.data.problem.length;
          })

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
            if(this.problemData.prevNum!=0){
              this.questionNum=this.problemData.prevNum;
               this.problemData=this.data.problem[this.questionNum]
            }else{
               this.questionNum--;
              this.problemData=this.data.problem[this.questionNum];
            }

          }

        },
         nextQuestion(){
          if(this.questionNum<this.questionLength-1){
            if(this.problemData.data&&this.problemData.data.length>0&&this.problemData.type=="1"){
              for(let item of this.problemData.data){
                if(item.answer===""){
                  this.$message.warning("请选择答案");
                  return
                }
              }
            }
            if(this.problemData.type!="2"&&this.problemData.answer===""){
               this.$message.warning("请选择答案")
            }else{
              if(this.problemData.nextNum!=0&&this.problemData.answer==4){
                  for(let x=this.questionNum+1;x<this.problemData.nextNum;x++){
                       this.data.problem[x].answer=4;
                  }
                 this.questionNum=this.problemData.nextNum;
                 this.problemData=this.data.problem[this.questionNum];

              }else{
                 this.questionNum++
                this.problemData=this.data.problem[this.questionNum];
              }
            }

          }else{
            this.$message.warning("最后一题了")
          }
        },
        submitData(){
          if(this.problemData.answer===""){
            this.$message.warning("请选择答案!")
            return;
          }
          let param={
            questionnaireNo:this.data.id,
            medicalRecordId:this.medicalRecordId,
            patientId:this.patientId,
            questionResultList:[],
            resultContent:JSON.stringify(this.data),
          }
          for(let item of this.data.problem){
             let qr={}
            if(item.type=='0'){
              qr.optionOrder=item.answer;
              qr.optionValue=item.answers[item.answer];
              qr.order=item.questionNum;
            }else if(item.type=='1'){
               let arr=[];
               let score=0;
              for(let itemData of item.data){
                 arr.push(itemData.question)
                 score=+itemData.answer;
              }
              qr.order=item.questionNum;
              qr.returnValue=arr.join(",");
              if(item.data.length>0){
                  qr.optionOrder=Math.round(score/item.data.length);
              }else{
                 qr.optionOrder=0;
              }
            }else if(item.type=="2"){
               qr.optionOrder=item.data.length;
               qr.optionValue=item.data.join(",");
               qr.returnValue=item.data.join(",");
               qr.order=item.questionNum;
            }
            param.questionResultList.push(qr);
          }
          this.loading=true;
          submitQuestion(param).then(res=>{
             this.loading=false;
            if(res.code==200){
                this.$emit('closeDialog');
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
  }
  .el-checkbox{
    margin-right: 5px;
  }
</style>
