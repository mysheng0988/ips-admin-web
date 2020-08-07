<template>
  <div v-loading.fullscreen.lock="loading">
    <div class="answer-box" v-if="data.type==1" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
      <el-progress v-if="percentage" :percentage="percentage" :format="formatPercentage"></el-progress>
      <div class="question" v-if="problemData.label!=''">{{problemData.label}}</div>
      <div class="question">问题：{{problemData.question}}</div>
      <el-radio-group v-model="problemData.answer" >
        <div class="question" v-for="(item,index) in problemData.answers" :key="index" >
          <el-radio :label="index" @change="handleChange" >{{item}}</el-radio>
        </div>
      </el-radio-group>
    </div>
    <div class="answer-box" v-else-if="data.type==2" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
      <el-progress v-if="percentage" :percentage="percentage" :format="formatPercentage"></el-progress>
      <div v-if="problemData.label!=''">{{problemData.label}}</div>
      <div class="question">问题：{{problemData.question}}</div>
      <div class="question" v-for="(item,index) in problemData.data" :key="index">
        <div class="question flex" v-if="item.type==='0'">
          <span>({{index+1}})、{{item.label}}</span>
          <el-radio-group v-model="item.answer" class="flex">
            <el-radio v-model="item.answer" v-for="(itemData,itemIndex) in item.answers" :label="itemIndex" :key="itemIndex" :disabled="problemData.data[0].answer===0">{{itemData}}</el-radio>
          </el-radio-group>
        </div>
        <div class="question" v-else-if="item.type==='1'">
          <span>({{index+1}})、{{item.label}}</span><el-input-number v-model="item.answer" :min="minValue" size="small" label="描述文字"></el-input-number>
        </div>
        <div class="question" v-else-if="item.type==='2'">
          <span>({{index+1}})、{{item.label}}</span><el-input class="remark" v-model="item.answer"  label="描述文字"></el-input>
        </div>
      </div>
    </div>
    <div class="answer-box" v-else-if="data.type==3" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
      <el-progress v-if="percentage" :percentage="percentage" :format="formatPercentage"></el-progress>
      <div class="question">{{questionNum+1}}、{{problemData.question}}</div>
      <div v-if="problemData.symptom" class="symptom">
        <el-checkbox-group v-model="problemData.data" >
          <el-checkbox v-for="(item,index) in problemData.symptom" :label="item" :key="index">{{item.question}}</el-checkbox>
        </el-checkbox-group>
        <div class="symptom" v-for="(item,index) in problemData.data" :key="index">
           <div class="question">({{index+1}})、{{item.question}}</div>
          <el-radio-group v-model="item.answer">
             <div class="question" >
              <el-radio   v-for="(itemData,indexData) in item.answers" :key="indexData" :label="indexData" >{{itemData}}</el-radio>
             </div>
          </el-radio-group>
        </div>
      </div>
     <div v-else>
       <el-radio-group v-model="problemData.answer">
         <div class="question" v-for="(item,index) in problemData.answers" :key="index"  >
           <el-radio @change="handleChange" :label="index" >{{item}}</el-radio>
         </div>
       </el-radio-group>
     </div>

    </div>
     <div class="answer-box" v-else-if="data.type==4" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
      <el-progress v-if="percentage" :percentage="percentage" :format="formatPercentage"></el-progress>
      <div class="question" v-if="problemData.label!=''">{{problemData.label}}</div>
       <div v-if="questionNum==0" class="roleType">
        <el-radio-group v-model="roleType" @change="roleTypeChange">
          <el-radio :label="0">父母</el-radio>
          <el-radio :label="1">父亲</el-radio>
          <el-radio :label="2">母亲</el-radio>
        </el-radio-group>
      </div>
      <div class="question">问题：{{problemData.question}}</div>
      <div class="flex-wrap">
        <div class="flex-item">
          <div>父亲</div>
          <el-radio-group v-model="problemData.answer[0]">
            <div class="question" v-for="(item,index) in problemData.answers" :key="index">
              <el-radio :label="index" :disabled="roleType==2" >{{item}}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div  class="flex-item">
          <div>母亲</div>
          <el-radio-group v-model="problemData.answer[1]">
            <div class="question" v-for="(item,index) in problemData.answers" :key="index">
              <el-radio :label="index"  :disabled="roleType==1">{{item}}</el-radio>
            </div>
          </el-radio-group>
        </div>
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
  import {getScaleJson} from '@/api/getJson'
  import {submitSacleQuestion} from '@/api/question'
    export default {
      name: "question",
      props: {
        scaleId: {
            type: Number,
            value:""
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
          data:[],
          roleType:0,
          minValue:0,
          problemData:[],
          loading:false,
          questionNum:0,
          questionLength:0,
        }
      },
      watch:{
         scaleId(newName, oldName) {
           if(newName!=""&&newName>0)

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
        roleTypeChange(){
          this.problemData.answer=[500,500]
        },
        handleChangeJSON(){
           let scaleId=this.scaleId;
          getScaleJson(scaleId).then(res=>{
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
               this.questionNum--;
              this.problemData=this.data.problem[this.questionNum];
          }

        },
         nextQuestion(){
          if(this.questionNum<this.questionLength-1){
            if(this.problemData.data&&this.problemData.data.length>0){
              for(let item of this.problemData.data){
                if(item.answer===""&&!item.type){
                  this.$message.warning("请选择答案");
                  return
                }else{
                  if(this.problemData.data[0].answer<0){
                    this.$message.warning("请选择发生次数,没有选0");
                    return
                  }else if(item.answer===""&&item.type&&item.type!=2&&this.problemData.data[0].answer>0){
                    this.$message.warning("请选择答案");
                    return
                  }
                }
              }
            }
            if(this.data.type==4&&this.roleType==0){
               if(this.problemData.answer.includes(500)){
                  this.$message.warning("请选择答案");
                    return
               }
            }else if(this.data.type==4&&this.roleType==1){
               if(this.problemData.answer[0]==500){
                  this.$message.warning("请选择答案");
                    return
               }
            }else if(this.data.type==4&&this.roleType==2){
               if(this.problemData.answer[1]==500){
                  this.$message.warning("请选择答案");
                    return
               }
            }
            if(this.problemData.answer===""&&this.data.type==1){
               this.$message.warning("请选择答案")
            }else{
              if(this.problemData.nextNum!=0&&this.problemData.answer==0){

                  for(let x=this.questionNum+1;x<this.problemData.nextNum;x++){
                       this.data.problem[x].answer=0;
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
          if(this.data.type==1&&this.problemData.answer===""){
            this.$message.warning("请选择答案!")
            return;
          }
          let param={
            scaleId:this.data.id,
            scaleNo:this.data.id,
            medicalRecordId:this.medicalRecordId,
            patientId:this.patientId,
            questionResultList:[],
            resultContent:JSON.stringify(this.data),
          }
          for(let item of this.data.problem){
              let qr={
               optionOrderList:[],
               optionValue:[],
               returnValue:[],
               remark:"",
               displayOrder:"",
             }
            if(this.data.type==1){
              qr.optionOrderList.push(item.answer);
              qr.optionValue.push(item.answers[item.answer]);
              qr.returnValue.push(item.question);
              qr.displayOrder=item.questionNum;
            } else if(this.data.type==3){
              if(item.data.length!=0){
                for(let itemData of item.data){
                  qr.optionOrderList.push(itemData.answer);
                  qr.optionValue.push(itemData.answers[item.answer]);
                  qr.returnValue.push(itemData.question);
                  qr.displayOrder=item.questionNum;
                }
              }else{
                qr.optionOrderList.push(0);
                qr.optionValue.push("无");
                qr.returnValue.push("");
                qr.displayOrder=item.questionNum;
              }

            } else if(this.data.type==4){
              qr.optionOrderList.push(item.answer[0]);
               qr.optionOrderList.push(item.answer[1]);
              qr.optionValue.push(item.answers[item.answer[0]]);
              qr.optionValue.push(item.answers[item.answer[1]]);
              qr.returnValue.push(item.question);
              qr.displayOrder=item.questionNum;

            }else{
              for(let itemData of item.data){
                  if(itemData.type!="2"){
                    let answer=itemData.answer==""?0:itemData.answer;
                     qr.optionOrderList.push(answer);
                  }else{
                    qr.remark=itemData.answer;
                  }
                  qr.returnValue.push(item.question);
                  qr.displayOrder=item.questionNum;
              }
            }
            param.questionResultList.push(qr);
          }
          this.loading=true,
          submitSacleQuestion(param).then(res=>{
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
  .roleType{
    width: 100%;
     margin: 10px 0;
    text-align: center;
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
    color: #000;
    font-size: 18px;
    font-weight: bold;
  }
  .explain{
    font-size: 16px;
    color: #333;
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
      font-size: 18px;
  }
  .el-checkbox{
    margin-right: 5px;
  }
  .flex-item{

    flex: 1;
  }
</style>
