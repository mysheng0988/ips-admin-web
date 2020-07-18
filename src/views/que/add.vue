<template>
  <div class="app-container">
    <el-card class="form-container" shadow="never">
      <el-form :model="questionObj" :rules="rules" ref="quesFrom" label-width="140px">
        <el-form-item label="题号:">
          <el-input v-model="questionObj.questionNum" placeholder="请输入题号"></el-input>
        </el-form-item>
        <el-form-item label="题目标题:">
          <el-input v-model="questionObj.question" placeholder="请输入题目标题"></el-input>
        </el-form-item>
        <el-form-item label="副标题:">
          <el-input v-model="questionObj.label" placeholder="请输入副标题"></el-input>
        </el-form-item>
        <el-form-item label="题目类型:">
          <el-select v-model="questionObj.type" placeholder="选择题目类型">
            <el-option label="单选" :value="0"></el-option>
            <el-option label="题目多选+单选" :value="1"></el-option>
            <el-option label="答案多选" :value="2"></el-option>
             <el-option label="题目单选+单选" :value="3"></el-option>
            <el-option label="分类四" :value="4"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="题目可选项" v-if="questionObj.type==1">
          <el-input
            class="answer"
            v-model="symptom"
            placeholder="请输入选项内容"
            @keyup.enter.native="addSymptom"
          ></el-input>
          <el-button type="primary" plain @click="addSymptom">添加</el-button>
          <div v-for="(item,index) in questionObj.symptom" :key="index">
           
            <el-tag class="tab" closable @close="handleSymptomClose(index)"> <span>题目:</span>{{item.question}}</el-tag>
            <el-input
              class="answer"
              v-model="questionObj.symptom[index].answer"
              placeholder="请输入选项内容"
              @keyup.enter.native="addSymptomAnswer(index)"
            ></el-input>
            <el-button type="primary" plain @click="addSymptomAnswer">添加</el-button>
            <p>
              
              <el-tag
                class="tab"
                v-for="(item1,index1) in questionObj.symptom[index].answers"
                :key="index1"
                closable
                @close="handleSymptomAnswerClose(index1)"
              ><el-radio :label="item1"></el-radio></el-tag>
            </p>
          </div>
        </el-form-item>
        <el-form-item label="答案内容" v-if="questionObj.type==0||questionObj.type==2">
          <el-input
            class="answer"
            v-model="answer"
            placeholder="请输入选项内容"
            @keyup.enter.native="addAnswer"
          ></el-input>
          <el-button type="primary" plain @click="addAnswer">添加</el-button>
          <div>
            <el-tag
              class="tab"
              v-for="(item,index) in questionObj.answers"
              :key="index"
              closable
              @close="handleAnswerClose"
            >
            <el-radio v-if="questionObj.type==0" :label="item"></el-radio>
            <el-checkbox v-if="questionObj.type==2" :label="item"></el-checkbox>
            </el-tag>
          </div>
        </el-form-item>
        <el-form-item label="限制条件">
          <el-input v-model="questionObj.limit" placeholder="请输入限制条件"></el-input>
        </el-form-item>
        <!-- <el-form-item label="上一题题号">
          <el-input v-model="questionObj.prevNum" placeholder="请输入上一题题号"></el-input>
        </el-form-item>
        <el-form-item label="下一题题号">
          <el-input v-model="questionObj.nextNum" placeholder="请输入下一题题号"></el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="saveQuestion('quesFrom')">保存题目</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { insertQusetion ,getQusetionNumInfo,updataQusetion } from "@/api/questionnaireBank";
let defaultQuestion = {
  questionNum: "",
  type: 0,
  label: "",
  question: "",
  symptom: [],
  limit: "",
  answers: [],
  answer: "",
  data: [],
};
export default {
  name: "que-add",
  data() {
    return {
      sign:"insert",
      answer: "",
      symptom: "",
      symptomAnswer: "",
      questionObj: Object.assign({}, defaultQuestion),
      rules: {}
    };
  },
  created() {
      let num=this.$route.query.id;
      if(num){
          this.sign="update"
          this.getQusetionNumInfoData(num);
      }else{
         this.sign="insert"
      }
      
  },
  methods: {
    getQusetionNumInfoData(num){
        getQusetionNumInfo(num).then(res=>{
            if(res.code==200){
              let question =res.dataList[0].question;
              this.questionObj=JSON.parse(question)
            }
        })
    },
    saveQuestion(formName) {
      let param = {
        questionNum: this.questionObj.questionNum,
        type:this.questionObj.type,
        condition:this.questionObj.limit,
        question: JSON.stringify(this.questionObj)
      };
      if(this.sign=="insert"){
          insertQusetion(param).then(res => {
            if (res.code == 200) {
            this.$message.success("保存成功");
            this.questionObj.questionNum++;
            this.questionObj.question="";
            //   this.questionObj.answers = [];
            //   this.$refs[formName].resetFields();
            }
        });
      }else{
          updateQusetion(param).then(res => {
            if (res.code == 200) {
            this.$message.success("修改成功");
            // this.questionObj.questionNum++;
            // this.questionObj.question="";
              this.questionObj.answers = [];
              this.$refs[formName].resetFields();
            }
        });
      }
      
    },
    handleSymptomAnswerClose(index) {
      this.questionObj.symptom.splice(index, 1);
    },
    addSymptomAnswer(index) {
      if (this.questionObj.symptom[index].answer) {
        this.questionObj.symptom[index].answers.push(
          this.questionObj.symptom[index].answer
        );
        this.questionObj.symptom[index].answer = "";
      } else {
        this.$message.warning("请输入可选项答案");
      }
    },
    handleSymptomClose(index) {
      this.questionObj.symptom.splice(index, 1);
    },
    addSymptom() {
      if (this.symptom) {
        let param = {
          question: this.symptom,
          answers: [],
          answer: ""
        };
        this.questionObj.symptom.push(param);
        this.symptom = "";
      } else {
        this.$message.warning("请输入选项内容");
      }
    },
    handleAnswerClose(tag) {

      this.questionObj.answers.splice(this.questionObj.answers.indexOf(tag), 1);
    },
    addAnswer() {
      if (this.answer) {
        this.questionObj.answers.push(this.answer);
        this.answer = "";
      } else {
        this.$message.warning("请输入选项内容");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form-container {
  width: 800px;
  margin: 0 auto;
  .answer {
    width: 300px;
  }
  .tab {
    margin: 10px;
  }
}
</style>