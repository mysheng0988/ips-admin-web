<template>
  <div class="app-container">
    <div class="container">
    <div class="answer-box" v-if="data.type==1" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
      <div class="questionBox" v-for="(item,index) in data.problem" :key="index">
        <div class="question">{{index+1}}、{{item.question}}</div>
        <el-radio-group v-model="item.answer" disabled >
          <div class="question" v-for="(itemData,indexData) in item.answers" :key="indexData">
            <el-radio :label="indexData" >{{itemData}}</el-radio>
          </div>
        </el-radio-group>
      </div>
    </div>

    <div class="answer-box" v-else-if="data.type==2" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
       <div class="questionBox" v-for="(item,index) in data.problem" :key="index">
          <div class="question">{{index+1}}、{{item.question}}</div>
          <div class="question" v-for="(itemData,indexData) in item.data" :key="indexData">
            <div class="question flex" v-if="itemData.type==='0'">
              <span>({{indexData+1}})、{{itemData.label}}{{itemData.type}}</span>
              <el-radio-group v-model="itemData.answer" class="flex" disabled>
                <el-radio v-model="itemData.answers" v-for="(itemData2,itemIndex2) in itemData.answers" :label="itemIndex2+1" :key="itemIndex2">{{itemData2}}</el-radio>
              </el-radio-group>
            </div>
            <div class="question" v-else-if="itemData.type==='1'">
              <span>({{indexData+1}})、{{itemData.label}}</span><el-input-number v-model="item.answer" size="small"  disabled></el-input-number>
            </div>
            <div class="question" v-else-if="itemData.type==='2'">
              <span>({{indexData+1}})、{{itemData.label}}</span><el-input class="remark" v-model="item.answer"   disabled></el-input>
            </div>
          </div>
       </div>
    </div>
    <div class="answer-box" v-else-if="data.type==3" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
     <div class="questionBox" v-for="(item,index) in data.problem" :key="index">
        <div class="question">{{index+1}}、{{item.question}}</div>
        <div v-if="item.type=='1'" class="symptom">
          <el-checkbox-group v-model="item.data" disabled>
            <el-checkbox v-for="(itemData,indexData) in item.symptom" :label="itemData" :key="indexData">{{itemData.question}}</el-checkbox>
          </el-checkbox-group>
          <div class="symptom" v-for="(itemData,indexData) in item.data" :key="indexData">
          ({{indexData+1}})、{{itemData.question}}
            <el-radio-group v-model="itemData.answer" disabled >
                <el-radio  v-for="(itemData2,indexData2) in itemData.answers" :label="indexData2" :key="indexData2">{{itemData2}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div v-else-if="item.type=='0'">
          <el-radio-group v-model="item.answer" disabled>
            <div class="question" v-for="(itemData,indexData) in item.answers" :key="indexData">
              <el-radio :label="indexData" >{{itemData}}</el-radio>
            </div>
          </el-radio-group>
        </div>
         <div v-else-if="item.type=='2'">
          <el-checkbox-group v-model="item.data" disabled v-if="gender">
            <div class="question" v-for="(itemData,indexData) in item.symptom[1].data" :key="indexData">
              <el-checkbox :label="indexData"  :checked="item.data.includes(itemData)">{{itemData}}</el-checkbox>
            </div>
          </el-checkbox-group>
          <el-checkbox-group v-model="item.data" disabled v-else>
            <div class="question" v-for="(itemData,indexData) in item.symptom[1].data" :key="indexData">
              <el-checkbox :label="indexData"  :checked="item.data.includes(itemData)">{{itemData}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </div>
     </div>
    </div>
    <div class="answer-box" v-else-if="data.type==4" >
      <div class="title">{{data.scaleTitle}}</div>
      <div class="explain">指导语:{{data.explain}}</div>
      <div class="questionBox" v-for="(item,index) in data.problem" :key="index">
      <div class="question" v-if="item.label!=''">{{item.label}}</div>
       <!-- <div v-if="questionNum==0" class="roleType">
        <el-radio-group  @change="roleTypeChange" disabled>
          <el-radio :label="0" disabled>父母</el-radio>
          <el-radio :label="1" disabled>父亲</el-radio>
          <el-radio :label="2" disabled>母亲</el-radio>
        </el-radio-group>
      </div> -->
      <div class="question">问题：{{item.question}}</div>
      <div class="flex-wrap">
        <div class="flex-item">
          <div>父亲</div>
          <el-radio-group v-model="item.answer[0]">
            <div class="question" v-for="(item1,index1) in item.answers" :key="index1">
              <el-radio :label="index1" disabled>{{item1}}</el-radio>
            </div>
          </el-radio-group>
        </div>
        <div  class="flex-item">
          <div>母亲</div>
          <el-radio-group v-model="item.answer[1]">
            <div class="question" v-for="(item1,index1) in item.answers" :key="index1">
              <el-radio :label="index1"  disabled>{{item1}}</el-radio>
            </div>
          </el-radio-group>
        </div>
      </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
  import {getQuestionnaire} from '@/api/question'
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: "questionResult",
    data() {
      return {
        data:[],
        gender:true,
      }
    },
    created() {
      let param={
          medicalRecordId:this.$route.query.medicalRecordId,
          questionnaire:this.$route.query.questionnaire,
          questionnaireId:this.$route.query.questionnaireId,
        }
        this.gender=this.$route.query.gender;
      this.getQuestionData(param);
    },
    methods: {
      getQuestionData(param){
        getQuestionnaire(param).then(res=>{
           this.data=JSON.parse(res.dataList[0]);
         })
      }
    }

  }
</script>

<style scoped>
  .container{
    width: 750px;
    padding: 30px 50px;
    margin: 0 auto;
    border: 1px solid #eee;
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
    color: #000;
    font-weight: bold;
  }
  .explain{
    font-size: 16px;
    font-weight: bold;
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
    line-height: 45px;
  }
  .el-checkbox{
    margin-right: 5px;
  }
  .flex-item{
    flex:1
  }
   .roleType{
    width: 100%;
     margin: 10px 0;
    text-align: center;
  }
</style>
