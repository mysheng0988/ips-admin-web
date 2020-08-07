<template>
  <div class="form-pdf patient-msg">
    <div class="msg-box">
      <div class="title">基本信息</div>
      <div class="msg">
        <el-form ref="form" label-width="80px" size="mini">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item class="flex-item" label="姓名:">
                <p>{{patientData.realName}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="性别:">
                <p>{{patientData.gender?"男":"女"}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="年龄:">
                <p>{{patientData.age}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="民族:">
                <p>{{patientData.nation}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="科室:">
                <p>{{patientData.currentDeptName}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" :label="patientData.outpatient?'门诊号:':'住院号:'">
                <p>{{patientData.beHospitalizedNumber}}</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="symptom-box">
      <div class="symptom-title">患者自述</div>
      <div class="symptom-content flex-center">
        <!-- <img class="img" src="@/views/rep/img/main-symptom.png" /> -->
        <div class="content">
          <div class="title">当前诊断</div>
          <div class="lable" v-for="(item,index) in patientData.clinicalDiagnosis" :key="index">{{item}}</div>
        </div>
      </div>
      <div class="symptom-content flex-center">
        <!-- <img class="img" src="@/views/rep/img/main-symptom.png" /> -->
        <div class="content">
          <div class="title">主要症状</div>
          <div class="lable" v-for="(item,index) in patientData.mainSymptoms" :key="index">{{item}}</div>
        </div>
      </div>
      <div class="symptom-content flex-center">
        <!-- <img class="img" src="@/views/rep/img/main-symptom.png" /> -->
        <div class="content">
          <div class="title">躯体症状</div>
            <div class="lable" v-if="patientData.somatization&&patientData.somatization.length==0">无</div>
          <div class="lable" v-else v-for="(item,index) in patientData.somatization" :key="index">{{item}}</div>
        </div>
      </div>
       <div class="symptom-content flex-center">
        <!-- <img class="img" src="@/views/rep/img/main-symptom.png" /> -->
        <div class="content">
          <div class="title">自述免疫力</div>
          <div class="lable" v-if="patientData.immunityStatus&&patientData.immunityStatus.length==0">无</div>
          <div v-else class="lable" v-for="(item,index) in patientData.immunityStatus" :key="index">{{item}}</div>
        </div>
      </div>
       <div class="symptom-content flex-center">
        <!-- <img class="img" src="@/views/rep/img/main-symptom.png" /> -->
        <div class="content">
          <div class="title">自述内分泌</div>
          <div class="lable" v-if="patientData.endocrineStatus&&patientData.endocrineStatus.length==0">无</div>
          <div class="lable" v-else v-for="(item,index) in patientData.endocrineStatus" :key="index">{{item}}</div>
        </div>
      </div>
       <div class="symptom-content flex-center">
        <!-- <img class="img" src="@/views/rep/img/main-symptom.png" /> -->
        <div class="content">
          <div class="title">过敏体质</div>
          <div class="lable" v-if="patientData.allergies&&patientData.allergies.length==0">无</div>
          <div class="lable" v-else v-for="(item,index) in patientData.allergies" :key="index">{{item}}</div>
        </div>
      </div>
    </div>
     <div class="pageNum">-{{pageNum}}-</div>   
  </div>
</template>
<script>
import { getReportAssess } from "@/api/report";
export default {
  name: "patientMsg",
  props: {
    patientData: {
      type: Object
    },
    pageNum:{
      type:Number
    },
    medicalRecordId: {
      type: String
    }
  },
  data() {
    return {
      
    };
  },
  mounted() {
    
      console.log(this.patientData)
  },
  methods: {}
};
</script>
<style  scoped>

.form-pdf.patient-msg {
  padding: 70px;
  background: url("../img/patient-msg.png") no-repeat;
  background-size: 100% 100%;
}
.msg-box {
  margin-top: 30px;
  text-align: left;
}
.msg-box .title {
  font-size: 30px;
  color: #2b8fb8;
}
.msg {
  margin: 20px 0;
  padding: 0 20px;
  border-left: 4px solid #2b8fb8;
}
.msg-box .flex-item {
  flex: 1;
  margin-bottom: 5px;
}
.flex-width {
  flex: 2;
}
.symptom-title {
  padding-left: 20px;
  width: 255px;
  height: 53px;
  line-height: 53px;
  font-size: 28px;
  background: url("../img/pdf-label.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.symptom-content {
  margin: 10px 0;
}
.symptom-content .img {
  margin: 0 10px;
  width: 77px;
  height: 77px;
}
.symptom-content .content {
  margin: 0 20px;
  text-align: left;
  flex: 1;
  line-height: 35px;
}
.symptom-content .content .title {
  font-size: 16px;
   color: #1C99C7;
  font-weight: 700;
}
.symptom-content .content .lable {
  font-size: 14px;
}
.conclusion{
  color: #000;
  font-size: 14px;
}
.max-width {
  max-width: 300px;
}
.footer-img {
  position: absolute;
  right: 10px;
  bottom: 10px;
}
.form-pdf .pageNum {
  color: #000;
}
.item-box {
  margin-top: 20px;
  padding: 10px 0;
  width: 626px;
}
.item-box .content {
  flex: 1;
  color: #666;
  margin: 5px 0;
  font-size: 15px;
  text-align: justify;
  line-height: 30px;
}
.item-box .content span {
  margin: 0 10px;
}
.item-box .chart {
  width: 240px;
  height: 180px;
  margin-right: 20px;
}
.content-box .content {
  font-size: 20px;
  color: #666;
  margin: 5px 0;
  font-size: 15px;
  text-align: justify;
  line-height: 30px;
}
.content.indent {
  text-indent: 2em;
}
</style>


