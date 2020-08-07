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
                <p>{{patientData.fromDeptName}}</p>
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
      <div class="symptom-title">自述躯体症状</div>
      <div class="symptom-content flex-center">
        <div class="content">
          <!-- <div v-if="patientData.somatization.length==0" class="lable">无</div> -->
          <div  class="lable" v-for="(item,index) in patientData.somatization" :key="index">{{item}}</div>
        </div>
      </div>
      <div class="symptom-title">筛查结果概况</div>
      <div class="item-box flex-center">
        <div class="chart">
          <ve-radar
            :data="chartData"
            :settings="chartSettings"
            :extend="extend"
            width="100%"
            height="100%"
          ></ve-radar>
        </div>
        <div class="content">
          <div v-for="(item,index) in explanation" :key="index" class="flex-wrap">
            <span>{{item}}</span>
          </div>
        </div>
      </div>
      <div class="conclusion">{{conclusion}}</div>
    </div>
     <div class="pageNum">-{{pageNum}}-</div>   
  </div>
</template>
<script>
import { getReportAssess } from "@/api/report";
export default {
  name: "patMsg",
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
      extend: {
        legend: {
          show: false
        },
        radar: {
          radius: 60,
          indicator: [
            { name: "抑郁", max: 27 },
            { name: "躯体症状", max: 30 },
            { name: "焦虑", max: 21 },
            { name: "惊恐", max: 10 },
            { name: "社会功能", max: 3 },
          ]
        },
        series: {
          label: {
            normal: {
              show: true
            }
          }
        }
      },
      explanation: [],
      conclusion:"",
      chartSettings: {
        label: {
          positon: "top"
        }
      },
      chartData: {
        columns: ["日期"],
        rows: [{ "日期": "1", "抑郁": 0, "躯体症状": 0, "焦虑": 0, "惊恐": 0 ,"社会功能":0}]
      }
    };
  },
  filters: {
    formatAge(birthday) {
      if (birthday && birthday != "") {
        let age = birthday.substring(0, 4);
        let year = new Date().getFullYear();
        return year - age;
      }
      return "";
    }
  },
  computed: {},
  mounted() {
    getReportAssess(this.medicalRecordId).then(res => {
      if (res.code == 200) {
        let data = res.dataList[0];
        this.conclusion=data.conclusion;
        this.explanation = data.explanation;
        let chartData = JSON.parse(data.chartData);
        for (let item of chartData) {
          this.chartData.columns.push(item.name);
          this.chartData.rows[0][item.name] = item.score;
        }
      }
    });
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
  margin: 20px 0;
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


