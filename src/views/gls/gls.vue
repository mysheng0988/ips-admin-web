<template>
  <div class="app-container" id="pdfCentent" v-loading.fullscreen.lock="listLoading" >
    
    <el-form :model="glsObj" ref="pursueInfoForm" label-width="100px"  style="width:1200px;margin:0 auto">
       <el-form-item><p>输入参数</p></el-form-item>
      <el-form-item label="临床诊断:">
        <el-select
          placeholder="请选择诊断"
          filterable
          multiple
          allow-create
          v-model="glsObj.csdiagnosis"
          clearable
          class="input-width"
        >
          <el-option
            v-for="item in csdiagnosisOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="诊断:">
        <el-input
          placeholder="请输入内容"
          v-model="glsObj.diagnosis"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 10}"
          clearable></el-input>
      </el-form-item>
      <el-form-item label="身份:">
        <el-select
          placeholder="请选择诊断"
          filterable
          multiple
          allow-create
          v-model="glsObj.identities"
          clearable
          class="input-width"
        >
          <el-option
            v-for="item in identitiesOption"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="年龄:" prop="onsetInterval">
        <el-input v-model.number="glsObj.age" placeholder="如:一周一次" type="text" clearable></el-input>
      </el-form-item>
      <el-form-item label="禁忌疾病:">
        <el-select
          placeholder="请选择诊断"
          filterable
          multiple
          allow-create
          v-model="glsObj.tabooDiseases"
          clearable
          class="input-width"
        >
          <el-option
            v-for="item in tabooDiseasesOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="避免相互作用药品:">
        <el-select
          placeholder="请选择诊断"
          filterable
          multiple
          allow-create
          v-model="glsObj.avoidInteractionDrugs"
          clearable
          class="input-width"
        >
          <el-option
            v-for="item in avoidInteractionDrugsOptions"
            :key="item"
            :label="item"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="medium" @click="getInitData()">确认</el-button>
      </el-form-item>
      <el-form-item><p>输出参数</p></el-form-item>
       <el-form-item label="年龄过滤药物:"  prop="mainComplaint">
         <p class="bottom" v-for="(item,index) in outPut.ageFilterDrugs" :key="index">{{item.diagnosis}}:{{item.condition}}>>{{item.drugs}}</p>
        <!-- <el-input
          placeholder="请输入内容"
          v-model="outPut.ageFilterDrugs"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 10}"
          clearable></el-input> -->
      </el-form-item>
       <el-form-item label="身份药物:"  prop="mainComplaint">
         <p class="bottom" v-for="(item,index) in outPut.identityFilterDrugs" :key="index">{{item.diagnosis}}:{{item.condition}}>>{{item.drugs}}</p>
        <!-- <el-input
          placeholder="请输入内容"
          v-model="outPut.identityFilterDrugs"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 10}"
          clearable></el-input> -->
      </el-form-item>
       <el-form-item label="禁忌药物:"  prop="mainComplaint">
         <p class="bottom" v-for="(item,index) in outPut.tabooDiseases" :key="index">{{item.tabooDisease}}:{{item.diagnosis}}>>{{item.drugs}}</p>
        <!-- <el-input
          placeholder="请输入内容"
          v-model="outPut.tabooDiseases"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 10}"
          clearable></el-input> -->
      </el-form-item>
       <el-form-item label="避免药物:"  prop="mainComplaint">
          <p class="bottom" v-for="(item,index) in outPut.avoidInteractionDrugs" :key="index">{{item.avoidInteractionDrug}}:{{item.diagnosis}}>>{{item.drugs}}</p>
        <!-- <el-input
          placeholder="请输入内容"
          v-model="outPut.avoidInteractionDrugs"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 10}"
          clearable></el-input> -->
      </el-form-item>
       <el-form-item label="建议药物:"  prop="mainComplaint">
           <div class="bottom" v-for="(item,index) in outPut.suggestedDrugs" :key="index">{{index+1}}.{{item.diagnosis}}|<span style="color:blue">{{item.drugName}}</span>|{{item.dosage}}是否优选{{item.whetherPreferred}}<span><span style="color:red">建议</span>{{item.medicationAdvice}}</span></div>
        <!-- <el-input
          placeholder="请输入内容"
          v-model="outPut.suggestedDrugs"
          type="textarea"
          :autosize="{minRows: 2, maxRows: 10}"
          clearable></el-input> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { testData } from "@/api/gls";
const defaultGls = {
  csdiagnosis: [],
  diagnosis:'{"惊恐发作":"中度","焦虑状态":"重度"}',
  identities: [],
  age: 15,
  tabooDiseases: [],
  avoidInteractionDrugs: []
};
export default {
  name: "gls",
  data() {
    return {
      listLoading:false,
      glsObj: Object.assign({}, defaultGls),
      outPut: [],
      csdiagnosisOptions: [
        "冠状动脉痉挛",
        "冠状动脉粥样硬化性心脏病",
        "室性心动过速"
      ],
      identitiesOption:["无","驾驶员","机器操纵者","高空作业者","从事危险工作者","精细工作者","哺乳","妊娠期妇女","育龄期妇女","产妇","孕妇","妊娠期妇女（前三个月）"],
      tabooDiseasesOptions:["冠状动脉缺血","严重肾功能损害","肝功能不全","QT间期延长","躁狂","癫痫大发作","不稳定性抽搐"],
      avoidInteractionDrugsOptions:["奎尼丁","硝酸甘油"],
    };
  },
  mounted() {},
  methods: {
    getInitData() {
      let diagnosis=JSON.parse(this.glsObj.diagnosis);
      this.listLoading=true;
      console.log(diagnosis)
      let prarm={
          csdiagnosis: this.glsObj.csdiagnosis,
          diagnosis:diagnosis,
          identities: this.glsObj.identities,
          age: this.glsObj.age,
          tabooDiseases:this.glsObj.tabooDiseases,
          avoidInteractionDrugs:this.glsObj.avoidInteractionDrugs
      }
      testData(prarm).then(res=>{
        this.listLoading=false;
          if(res.code==200){
            let outPut=res.dataList;
            this.outPut=outPut;
            console.log(outPut)
          }
      }).catch(res=>{
        this.listLoading=false;
      })
    }
  }
};
</script>
<style scoped >
.bottom{
border-bottom: 1px solid #ddd;
}
.add-btn {
  width: 100px;
  height: 34px;
  margin-right: 10px;
  text-align: center;
  line-height: 34px;
  border-radius: 8px;
  border: 1px solid #1197d6;
  color: #1197d6;
  cursor: pointer;
}
.flex {
  display: flex;
  display: -webkit-flex;
  align-items: center;
  flex-wrap: wrap;
}

.input-width {
  width: 100%;
}
.close {
  color: #f56c6c;
  position: absolute;
  right: -5px;
  top: -5px;
}
.familyTitle {
  margin: 10px 0;
}
</style>
