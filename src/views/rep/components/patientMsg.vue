<template>
  <div class="form-pdf patient-msg">
    <div class="msg-box">
      <div class="title">基本信息</div>
      <div class="msg">
        <el-form ref="form" label-width="80px" size="mini">
          <el-row :gutter="20">
            <el-col :span="8">
              <el-form-item class="flex-item" label="姓名:">
                <p>{{patientVo.realName}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="性别:">
                <p>{{patientVo.gender?"男":"女"}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="年龄:">
                <p>{{patientVo.birthday | formatAge}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="patientVo.maritaStatus">
              <el-form-item class="flex-item" label="婚姻:">
                <p>{{patientVo.maritaStatus}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="patientVo.nation">
              <el-form-item class="flex-item" label="民族:">
                <p>{{patientVo.nation}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="patientVo.education">
              <el-form-item class="flex-item" label="文化程度:">
                <p>{{patientVo.education}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8" v-if="patientVo.profession">
              <el-form-item class="flex-item" label="职业:">
                <p>{{patientVo.profession}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="科室:">
                <p>{{patientData.fromDeptName}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item class="flex-item" label="病历号:">
                <p>{{patientData.beHospitalizedNumber}}</p>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item class="flex-width" label="临床诊断:">
                <p>{{clinicalSpecialistDiagnosisName}}</p>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
    <div class="symptom-box">
      <div class="symptom-title">症状描述</div>
      <div class="symptom-content flex-center">
        <img class="img" src="@/views/rep/img/main-symptom.png" />
        <div class="content">
          <div class="title">主要症状</div>
          <div class="lable">{{mainSymptomsName}}</div>
          <div class="lable">发作频率：{{mainPursue.onsetInterval}}</div>
          <div class="lable">首次发作时间：{{mainPursue.firstOnsetTime}}</div>
          <div class="lable">最近发作时间：{{mainPursue.recentOnsetTime}}</div>
          <div class="lable">严重程度：{{mainPursue.illnessDegree}}</div>
        </div>
      </div>
      <div class="symptom-content flex-center">
        <img class="img" src="@/views/rep/img/icon-symptom.png" />
        <div class="content">
          <div class="title">伴随症状</div>
          <div class="lable max-width">{{accompanyingSymptomsName}}</div>
        </div>
      </div>
      <div class="symptom-content flex-center">
        <img class="img" src="@/views/rep/img/motion-symptom.png" />
        <div class="content">
          <div class="title">运动症状</div>
          <div class="lable max-width">
            <span>{{motorSymptomsName}}</span>
          </div>
        </div>
      </div>
    </div>
    <img class="footer-img" src="@/views/rep/img/icon-foot.png" />
    <div class="pageNum">-{{pageNum}}-</div>
  </div>
</template>
<script>
export default {
  name: "patientMsg",
  props: {
    patientData: {
      type: Object
    },
    pageNum: {
      type: Number,
      value: 0
    },
    patientVo: {
      type: Object
    },
    mainPursue: {
      type: Object
    }
  },
  filters: {
    formatAge(birthday) {
      if (birthday && birthday != "") {
        let age = birthday.substring(0, 4);
        let year = new Date().getFullYear();
        return year - age - 1;
      }
      return "";
    }
  },
  computed: {
    accompanyingSymptomsName: function() {
      if (
        this.mainPursue.accompanyingSymptomsSet &&
        this.mainPursue.accompanyingSymptomsSet.length > 0
      ) {
        return this.mainPursue.accompanyingSymptomsSet.join("、");
      }
      return "暂无伴随症状";
    },
    mainSymptomsName: function() {
      if (
        this.mainPursue.mainSymptomsSet &&
        this.mainPursue.mainSymptomsSet.length > 0
      ) {
        return this.mainPursue.mainSymptomsSet.join("、");
      }
      return "";
    },
    clinicalSpecialistDiagnosisName: function() {
      return this.arrayMergeData(
        this.mainPursue.clinicalSpecialistDiagnosisList,
        this.mainPursue.clinicalSpecialistDiagnosisSupplementList
      );
    },
    motorSymptomsName: function() {
      if (
        this.mainPursue.motorSymptomsSet &&
        this.mainPursue.motorSymptomsSet.length > 0
      ) {
        return this.mainPursue.motorSymptomsSet.join("、");
      }

      return "暂无运动症状";
    }
  },
  methods: {
    arrayMergeData(arr, strArr) {
      let titleName = [];
      if (!arr) {
        return;
      }
      if (!strArr) {
        return;
      }
      for (let item of arr) {
        if (item.name != "") titleName.push(item.name);
      }
      for (let item of strArr) {
        if (item != "") titleName.push(item);
      }
      return titleName.join("、");
    }
  }
};
</script>
<style  scoped>
.form-pdf.patient-msg {
  padding: 70px;
  background: url("../img/patient-msg.png") no-repeat;
  background-size: 100% 100%;
}
.msg-box {
  margin-top: 70px;
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
  width: 205px;
  height: 53px;
  text-align: center;
  line-height: 53px;
  font-size: 30px;
  background: url("../img/pdf-label.png") no-repeat;
  background-size: 100% 100%;
  color: #fff;
}
.symptom-content {
  margin-top: 30px;
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
  color: #000;
  font-weight: 700;
}
.symptom-content .content .lable {
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
  color: #fff;
}
</style>


