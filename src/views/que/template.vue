<template>
  <div class="app-container">
    <el-card class="form-container" shadow="never">
      <el-form :model="templeteObj" :rules="rules" ref="quesFrom" label-width="140px">
        <el-form-item label="模板编号:">
          <el-input v-model="templeteObj.number" placeholder="请输入模板编号"></el-input>
        </el-form-item>
        <el-form-item label="模板标题:">
          <el-input v-model="templeteObj.name" placeholder="请输入模板标题"></el-input>
        </el-form-item>
        <el-form-item label="模板指导语:">
          <el-input v-model="templeteObj.instruction" placeholder="请输入指导语"></el-input>
        </el-form-item>
        <el-form-item label="限制条件">
          <el-input v-model="templeteObj.condition" placeholder="请输入限制条件"></el-input>
        </el-form-item>
        <el-form-item label="模板类型:">
          <el-select v-model="templeteObj.type" placeholder="模板类型">
            <el-option label="正常" :value="0"></el-option>
            <el-option label="单选" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指导语:">
          <el-input class="input-explain" v-model="instruction" placeholder="请输入指导语"></el-input>
          <el-button @click="addQusetionExplain">添加指导语</el-button>
          <div v-for="(item,index) in templeteObj.questionList" :key="index">
            <p>指导语:{{item.instruction}}</p>
            <div>
              题号:
              <el-input class="input-width" v-model="item.questionNum" placeholder="请输入题号"></el-input>上一题:
              <el-input class="input-width" v-model="item.preQuestionNum" placeholder="请输入上一题题号"></el-input>下一题:
              <el-input class="input-width" v-model="item.nextQuestionNum" placeholder="请输入下一题题号"></el-input>
              <el-button @click="addQusetionNum(index)">添加题号</el-button>
              <p>
                <el-tag
                  class="tab"
                  v-for="(item1,index1) in item.questionnaireQuestionList"
                  :key="index1"
                  closable
                  @close="handleClose(index,index1)"
                >{{item1.questionNum}}</el-tag>
              </p>
            </div>
          </div>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="saveTempData('tempFrom')">保存模板</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { insertQuestionnaire,getTempInfo ,updateQuestionnaire } from "@/api/questionnaireBank";
const defaultTemplete = {
  number: "",
  name: "",
  type: 0,
  instruction: "",
  condition:"",
  questionList: []
};
export default {
  name: "temp",
  data() {
    return {
      questionNum: "",
      instruction: "",
      nextQuestionNum: 0,
      preQuestionNum: 0,
      templeteObj: Object.assign({}, defaultTemplete),
      rules: {}
    };
  },
  created() {
      let id=this.$route.query.id;
      if(id){
         getTempInfo(id).then(res=>{
          if(res.code==200){
              this.templeteObj=res.dataList[0];
          }else{
              this.$message.warning(res.message)
          }
          
      })
      }
     
  },
  methods: {
    saveTempData() {
      let arrList = this.templeteObj.questionList;

      let questionnaireQuestions = [];
      for (let item of arrList) {
          questionnaireQuestions=[...questionnaireQuestions,...item.questionnaireQuestionList]
      }
      let param = {
        id:this.templeteObj.id,
        number: this.templeteObj.number,
        name:this.templeteObj.name,
        type: this.templeteObj.type,
        instruction: this.templeteObj.instruction,
        condition:this.templeteObj.condition,
        questionnaireQuestions:questionnaireQuestions
      };
      if(this.templeteObj.id){
        updateQuestionnaire(param).then(res => {
        if (res.code == 200) {
          this.templeteObj = Object.assign({}, defaultTemplete);
          this.templeteObj.questionnaireQuestions=[];
           this.$store.commit("delete_tabs", this.$route.path);
            this.$router.push("/que/tIndex");
        }})  
      }else{
          insertQuestionnaire(param).then(res => {
        if (res.code == 200) {
          this.templeteObj = Object.assign({}, defaultTemplete);
          this.templeteObj.questionnaireQuestions=[];
          this.$store.commit("delete_tabs", this.$route.path);
          this.$router.push("/que/tIndex");
        }
      });
      }
      
    },
    addQusetionExplain() {
      if (this.instruction) {
        let param = {
          instruction: this.instruction,
          questionNum: 0,
          nextQuestionNum: 0,
          preQuestionNum:0,
          questionnaireQuestionList: []
        };
        this.templeteObj.questionList.push(param);
        this.instruction = "";
      } else {
        this.$message.warning("请输入题号");
      }
    },
    handleClose(index, index1) {
      this.templeteObj.questionList[index].questionnaireQuestionList.splice(index1, 1);
    },
    addQusetionNum(index) {
      if (this.templeteObj.questionList[index].questionNum) {
        let param = {
          instruction: this.templeteObj.questionList[index].instruction,
          questionNum: this.templeteObj.questionList[index]
            .questionNum,
          nextQuestionNum: this.templeteObj.questionList[index].nextQuestionNum,
          preQuestionNum: this.templeteObj.questionList[index].preQuestionNum
        };
        this.templeteObj.questionList[index].questionnaireQuestionList.push(param);
        this.templeteObj.questionList[index].questionNum++;
        this.templeteObj.questionList[index].nextQuestionNum = 0;
        this.templeteObj.questionList[index].preQuestionNum = 0;
      } else {
        this.$message.warning("请输入题号");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.form-container {
  width: 1200px;
  margin: 0 auto;
  .tab {
    margin: 10px;
  }
}
.input-explain {
  width: 700px;
}
.input-width {
  width: 200px;
}
</style>