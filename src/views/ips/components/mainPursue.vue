<template>
  <div style="margin-top: 50px" v-loading.lock="listLoading" id="pdfCentent">
    <el-form :model="pursueObj" :rules="rules" ref="pursueInfoForm" label-width="180px">
      <el-row :gutter="10">
        <el-col :span="24">
          <el-form-item label="主要症状:" prop="mainSymptoms">
            <el-select
              placeholder="请选择主要症状"
              filterable
              multiple
              allow-create
              v-model="pursueObj.mainSymptoms"
              clearable
              class="input-width"
            >
              <el-option
                v-for="item in optionSymptomsList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="当前诊断:" prop="clinicalDiagnosis">
            <el-select
              style="width: 100%"
              v-model="pursueObj.clinicalDiagnosis"
              multiple
              filterable
              remote
              allow-create
              placeholder="请输入关键词检索"
              :remote-method="remoteDiagnosis"
              :loading="loadingOption"
            >
              <el-option
                v-for="item in pursueObj.clinicalSpecialistDiagnosisList"
                :key="item.id"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="首次发作时间:" prop="firstOnsetTime">
            <el-date-picker
              v-model="pursueObj.firstOnsetTime"
              class="input-width"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择时间"
            ></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="身  高：" prop="height">
            <el-input v-model="pursueObj.height" placeholder="请输入内容">
              <template slot="append">cm</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="体  重：" prop="weight">
            <el-input v-model="pursueObj.weight" placeholder="请输入内容">
              <template slot="append">kg</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="婚姻状况：" >
            <el-select
              placeholder="请选择"
              v-model="pursueObj.maritaStatus"
              clearable
              class="input-width">
              <el-option label="未婚" value="未婚"></el-option>
              <el-option label="已婚" value="已婚"></el-option>
              <el-option label="离婚" value="离婚"></el-option>
              <el-option label="再婚" value="再婚"></el-option>
              <el-option label="丧偶" value="丧偶"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="排行/兄妹人数：" prop="siblingsNumber">
            <el-input v-model="pursueObj.familyRanking" class="input2"></el-input>/
            <el-input v-model="pursueObj.siblingsNumber" class="input2"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="子女人数：">
            <el-input v-model.number="pursueObj.childrenNumber"></el-input>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="主要抚养人：">
            <el-select
              v-model="pursueObj.caregiver"
              filterable
              allow-create
              default-first-option
              placeholder="请选择主要抚养人"
              clearable
              class="input-width"
            >
              <el-option v-for="(item,index) in options" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="16">
          <el-form-item label="人群分类：" prop="occupationalClassification">
            <el-select
              placeholder="请选择"
              multiple
              v-model="pursueObj.occupationalClassification"
              @change="crowdRoleChange"
              clearable
              class="input-width"
            >
              <el-option v-for="(item,index) in optionRow" :key="index" :label="item" :value="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="子女情况：">
            <el-input
              v-model="pursueObj.childrenSituation"
              type="textarea"
              placeholder="请输入内容"
              :autosize="{minRows: 2, maxRows: 4}"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="父母情况：">
            <el-input
              v-model="pursueObj.parentSituation"
              type="textarea"
              placeholder="请输入内容"
              :autosize="{minRows: 2, maxRows: 4}"
              maxlength="50"
              show-word-limit
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item style="text-align: center">
        <el-button
          type="primary"
          size="medium"
          @click="handleNext('pursueInfoForm')"
        >下一步，{{nextTitle}}</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  querySymptoms,
  queryExperience,
  familyHistory,
  saveFamily,
  updateFamliy,
  getStress,
  saveExperience,
  queryCheckUp,
  savaPursue,
  getPursue,
  updatePursue,
  getStressPatient,
  lastMainPursue,
  deleteExperience
} from "@/api/ips";
import { savePatientComplaint } from "@/api/medicalRecord";
import { getRecordPatient } from "@/api/patient";
import { validateNum } from "@/utils/validate";
import { queryHospital } from "@/api/manage";
import { getICD11 } from "@/api/icd";
import { mapGetters } from "vuex";
import stress from "./stress";
import experience from "./experience";
import FamilyHistory from "./familyHistory";
const defaultPursue = {
  caregiver: "", //主要抚养人
  childrenNumber: "", //子女人数
  childrenSituation: "", //子女情况
  clinicalDiagnosis: [], //临床专科诊断
  familyRanking: 1, //家庭排行
  firstOnsetTime:"",
  height: "", //身高
  weight: "", //体重
  mainSymptoms: [], //主要症状
  maritaStatus: null, //婚姻状态
  occupationalClassification: ["无"], //职业类别
  parentSituation: "", //父母情况
  siblingsNumber: 1 //兄妹人数
};

export default {
  name: "mainPursue",
  props: {
    type: {
      type: String,
      default: "C"
    },
    gender: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    prevTitle: {
      type: String,
      value: ""
    },
    nextTitle: {
      type: String,
      value: ""
    },
    patientId: {
      type: String,
      default: ""
    },
    medicalRecordId: {
      type: String,
      default: ""
    }
  },
  data() {
    const validateNumberSort = (rule, value, callback) => {
      if (!validateNum(value)) {
        callback(new Error("必须为数字"));
      } else {
        if (value > 10) {
          callback(new Error("必须小于10的数字"));
        } else if (this.pursueObj.familyRanking - value > 0) {
          callback(new Error("排行数不能大于兄妹总数"));
        } else {
          callback();
        }
      }
    };
    const validateNumberTen = (rule, value, callback) => {
      if (!validateNum(value)) {
        callback(new Error("必须小于10的数字"));
      } else {
        if (value > 10) {
          callback(new Error("必须小于10的数字"));
        } else {
          callback();
        }
      }
    };
    const validateNumber = (rule, value, callback) => {
      if (value != "" && !validateNum(value)) {
        callback(new Error("必须是数字"));
      } else {
        callback();
      }
    };
    return {
      listLoading: false,
      optionRow: [
        "无",
        "驾驶员",
        "机器操纵者",
        "高空作业者",
        "从事危险工作者",
        "精细工作者"
      ],
      options: ["父母", "父亲", "母亲", "祖父母", "外祖父母"],
      clinicalSpecialist: "",
      optionSymptomsList: [],
      optionAccompanyingSymptoms: [],
      optionMotorSymptoms: [],
      pursueObj: Object.assign({}, defaultPursue),
      loadingOption: false,
      rules: {
        mainSymptoms: [
          { required: true, message: "请选择主要症状", trigger: "change" }
        ],
        clinicalDiagnosis: [
          { required: true, message: "请选择当前诊断", trigger: "change" }
        ],
        maritaStatus: [
          { required: true, message: "必填字段", trigger: "change" }
        ],
        firstOnsetTime:[
           { required: true, message: "必填字段", trigger: "blur" },
        ],
        height: [
          { required: true, message: "必填字段", trigger: "blur" }
        ],
        weight: [
          { required: true, message: "必填字段", trigger: "blur" }
        ],
        maritaStatus: [
          { required: true, message: "必填字段", trigger: "change" }
        ],
        caregiver: [{ required: true, message: "必填字段", trigger: "blur" }],
        crowdRole: [{ required: true, message: "必填字段", trigger: "change" }],
        siblingsNumber: [
          { required: true, trigger: "blur", validator: validateNumberSort }
        ],
        childrenNumber: [
          { required: false, trigger: "blur", validator: validateNumberTen }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      //步骤二，对象扩展运算符方式
      "info"
    ])
  },
  mounted() {
    if (this.gender) {
      this.optionRow = [
        "无",
        "驾驶员",
        "机器操纵者",
        "高空作业者",
        "从事危险工作者",
        "精细工作者"
      ];
    } else {
      this.optionRow = [
        "无",
        "哺乳",
        "妊娠期妇女",
        "育龄期妇女",
        "产妇",
        "孕妇",
        "妊娠期妇女（前三个月）",
        "驾驶员",
        "机器操纵者",
        "高空作业者",
        "从事危险工作者",
        "精细工作者"
      ];
    }
    this.pursueObj.occupationalClassification = ["无"];
    this.getSymptoms("3");
    this.getPatientData();
  },
  methods: {
    crowdRoleChange() {
      if (
        this.pursueObj.occupationalClassification.length > 1 &&
        this.pursueObj.occupationalClassification.includes("无")
      ) {
        let index = 0;
        for (let item of this.pursueObj.occupationalClassification) {
          if (item == "无") {
            this.pursueObj.occupationalClassification.splice(index, 1);
          }
          index++;
        }
      }
    },
    getPatientData() {
      getRecordPatient(this.medicalRecordId).then(res => {
        if (res.code == 200) {
          // this.completeQuestionnaire=res.dataList[0].completeQuestionnaire;
          this.pursueObj = res.dataList[0];
          if(this.pursueObj.occupationalClassification){
            this.pursueObj.occupationalClassification = ["无"];
          }
          // this.scaleId=res.dataList[0].questionnaireNo
        }
      });
    },
    getLastMainPursue() {
      lastMainPursue(this.patientId).then(res => {
        if (res.code == 200) {
          this.pursueObj = res.dataList[0];
          this.pursueObj.id = null;
          // this.clinicalSpecialist=this.pursueObj.clinicalSpecialistDiagnosisSupplementList.join(",")
        }
      });
    },
    getPursueData() {
      return getPursue(this.medicalRecordId).then(res => {
        if (res.code == 200) {
          this.pursueObj = res.dataList[0];
          this.clinicalSpecialist = this.pursueObj.clinicalSpecialistDiagnosisSupplementList.join(
            ","
          );
        }
        return res.dataList;
      });
    },
    queryFamily() {
      familyHistory(this.patientId)
        .then(res => {
          if (res.code == 200) {
            this.familyObj = res.dataList[0];
            for (let item of this.familyObj.familyMemberDiseaseHistoryList) {
              item.diseaseName = item.diseaseSupplementList.join(",");
            }
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    getSymptoms(val) {
      querySymptoms({
        departmentCategoryId: this.info.deptCategoryId,
        queryParam: "",
        type: val
      }).then(res => {
        this.listLoading = false;
        this.optionSymptomsList = res.dataList;
      });
    },
    remoteDiagnosis(queryString) {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.loadingOption = true;
        if (queryString != "") {
          getICD11(queryString).then(res => {
            this.loadingOption = false;
            this.pursueObj.clinicalSpecialistDiagnosisList = res.dataList.slice(
              0,
              50
            );
          });
        } else {
          this.pursueObj.clinicalSpecialistDiagnosisList = [];
        }
      }, 500);
    },
    handleUpdataExperience(val) {
      this.experienceData = val;
      this.dialogVisible2 = true;
    },
    handleDeleteExperience(expId) {
      this.$confirm("确认删除此项就诊经历?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deleteExperience(expId).then(res => {
          if (res.code == 200) {
            this.list = [];
            this.getExperienceList();
          }
        });
      });
    },
    addFamily() {
      this.experienceData = {};
      this.dialogVisible3 = true;
    },
    getStressList() {
      getStressPatient(this.medicalRecordId).then(res => {
        if (res.code == 200) {
          this.eventList = res.dataList;
        }
      });
    },
    addStress() {
      getStress()
        .then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            this.treeData = res.dataList;
            this.dialogVisible = true;
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    addExperience() {
      this.dialogVisible2 = true;
      this.experienceData = {};
    },
    getExperienceList() {
      queryExperience(this.patientId)
        .then(res => {
          if (res.code == 200) {
            this.list = res.dataList;
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogVisible2 = false;
      this.dialogVisible3 = false;
      this.getExperienceList();
      this.queryFamily();
      this.getStressList();
    },
    handleNext(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.listLoading = true;
          this.pursueObj.id = this.medicalRecordId;
          savePatientComplaint(this.pursueObj)
            .then(res => {
              this.listLoading = false;
              if (res.code == 200) {
                this.$message.success("更新成功");
                this.$emit("nextStep");
              }
            })
            .catch(error => {
              this.listLoading = false;
            });
        } else {
          this.$message({
            message: "验证失败",
            type: "error",
            duration: 1000
          });
          return false;
        }
      });
    }
  }
};
</script>
<style scoped >
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
.input2 {
  width: 45%;
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
