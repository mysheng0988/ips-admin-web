<template>
  <div style="margin-top: 50px">
    <el-form ref="productInfoForm" label-width="160px">
      <el-form-item label="神经递质调节药物方案:" v-if="drugPlan.length==0">
        <p class="add-btn" @click="drugProgram">
          <i class="el-icon-plus"></i>药物筛选
        </p>
      </el-form-item>
      <el-form-item label="神经递质调节药物方案:" v-if="drugPlan.length!=0">
        <div class="text-box">
          <div v-for="(item,index) in drugPlan" :key="index">
            <div v-if="item.title">
              <p>{{index+1}}、{{item.title}}:</p>
              <p v-for="(item1,index2) in item.data" :key="index2">{{item1}}</p>
            </div>
            <p v-else>{{item}}</p>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="躯体化症状药物方案:" v-if="initData.somatizationSymptomsDrugRegimen.data&&initData.somatizationSymptomsDrugRegimen.data.length>0">
        <div class="text-box">
          <div v-for="(item1,index1) in initData.somatizationSymptomsDrugRegimen.data" :key="index1">
            <div class="box-title">{{item1.title}}</div>
            <div v-for="(item2,index2) in item1.data" :key="index2" style="padding-left:20px">
              <div class="box-title">{{item2.title}}</div>
              <div class="flex-wrap" v-for="(item3,index3) in item2.data" :key="index3">
                <div v-if="item3.title">
                  {{index3+1}}、{{item3.title}}:
                  <span
                    v-for="(item,index) in item3.data"
                    :key="index"
                  >{{item}}</span>
                </div>
                <div v-else>{{index3+1}}、{{item3}}</div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="心身治疗方案:">
        <div class="text-box">
          <div v-for="(item1,index1) in initData.psychosomaticTherapy.data" :key="index1">
            <div class="box-title" v-if="item1.data.length!=0">{{item1.title}}</div>
            <div class="flex-wrap" v-for="(item2,index2) in item1.data" :key="index2">
              <el-button
                @click="addText2('psychosomaticTherapy',index1,index2)"
                class="text-boder blue"
                icon="el-icon-edit"
              >{{index2+1}}、</el-button>
              <el-input
                placeholder="请输入详细内容"
                v-model="item1.data[index2]"
                class="text-boder"
                type="textarea"
                autosize
              ></el-input>
              <el-button
                @click="deleteText2('psychosomaticTherapy',index1,index2)"
                class="text-boder red"
                icon="el-icon-delete"
              ></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="营养处方:">

        <div class="text-box">
          <div v-for="(item1,index1) in initData.nutritionPrescription.data" :key="index1">
            <div class="box-title" v-if="item1.data.length>0">{{item1.title}}</div>
            <div class="flex-wrap" v-for="(item2,index2) in item1.data" :key="index2">
              <el-button
                @click="addText2('nutritionPrescription',index1,index2)"
                class="text-boder blue"
                icon="el-icon-edit"
              >{{index2+1}}、</el-button>
              <el-input
                placeholder="请输入详细内容"
                v-model="item1.data[index2]"
                class="text-boder"
                type="textarea"
                autosize
              ></el-input>
              <el-button
                @click="deleteText2('nutritionPrescription',index1,index2)"
                class="text-boder red"
                icon="el-icon-delete"
              ></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="运动处方:">
        <div class="text-box" >
          <div v-for="(item1,index1) in initData.exercisePrescription.data" :key="index1">
            <div class="box-title">{{item1.title}}</div>
            <div class="flex-wrap" v-for="(item2,index2) in item1.data" :key="index2">
              <el-button
                @click="addText2('exercisePrescription',index1,index2)"
                class="text-boder blue"
                icon="el-icon-edit"
              >{{index2+1}}、</el-button>
              <el-input
                placeholder="请输入详细内容"
                v-model="item1.data[index2]"
                class="text-boder"
                type="textarea"
                autosize
              ></el-input>
              <el-button
                @click="deleteText2('exercisePrescription',index1,index2)"
                class="text-boder red"
                icon="el-icon-delete"
              ></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="功能医学建议:">
        <div class="text-box" >
          <div
            class="flex-wrap"
            v-for="(item,index) in initData.functionalMedicineAdvice.data"
            :key="index"
          >
            <el-button
              @click="addText1('functionalMedicineAdvice',index)"
              class="text-boder blue"
              icon="el-icon-edit"
            >{{index+1}}、</el-button>
            <el-input
              placeholder="请输入详细内容"
              v-model="initData.functionalMedicineAdvice.data[index]"
              class="text-boder"
              type="textarea"
              autosize
            ></el-input>
            <el-button
              @click="deleteText1('functionalMedicineAdvice',index)"
              class="text-boder red"
              icon="el-icon-delete"
            ></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="其他建议:">
        <div class="text-box" v-if="initData.otherSuggestion.data&&!initData.otherSuggestion.data[0].title">
          <div class="flex-wrap" v-for="(item,index) in initData.otherSuggestion.data" :key="index">
            <el-button
              @click="addText1('otherSuggestion',1)"
              class="text-boder blue"
              icon="el-icon-edit"
            >{{index+1}}、</el-button>
            <el-input
              placeholder="请输入详细内容"
              v-model="initData.otherSuggestion.data[index]"
              class="text-boder"
              type="textarea"
              autosize
            ></el-input>
            <el-button
              @click="deleteText1('otherSuggestion',index)"
              class="text-boder red"
              icon="el-icon-delete"
            ></el-button>
          </div>
        </div>
        <div class="text-box" v-else>
          <div v-for="(item1,index1) in initData.otherSuggestion.data" :key="index1">
            <div class="box-title">{{item1.title}}</div>
            <div class="flex-wrap" v-for="(item2,index2) in item1.data" :key="index2">
              <el-button
                @click="addText2('otherSuggestion',index1,index2)"
                class="text-boder blue"
                icon="el-icon-edit"
              >{{index2+1}}、</el-button>
              <el-input
                placeholder="请输入详细内容"
                v-model="item1.data[index2]"
                class="text-boder"
                type="textarea"
                autosize
              ></el-input>
              <el-button
                @click="deleteText2('otherSuggestion',index1,index2)"
                class="text-boder red"
                icon="el-icon-delete"
              ></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="随访建议:">
        <div class="text-box">
          <div
            class="flex-wrap"
            v-for="(item,index) in initData.followUpRecommendations.data"
            :key="index"
          >
            <el-button
              @click="addText1('followUpRecommendations',index)"
              class="text-boder blue"
              icon="el-icon-edit"
            >{{index+1}}、</el-button>
            <el-input
              placeholder="请输入详细内容"
              v-model="initData.followUpRecommendations.data[index]"
              class="text-boder"
              type="textarea"
              autosize
            ></el-input>
            <el-button
              @click="deleteText1('followUpRecommendations',index)"
              class="text-boder red"
              icon="el-icon-delete"
            ></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，{{prevTitle}}</el-button>
        <el-button type="primary" size="medium" @click="submitReportData">确认签名</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="禁忌症筛选" :visible.sync="dialogVisible" width="50%">
      <div class="screen-box flex">
        <div class="item-box-cure">
          <div class="title">待选择</div>
          <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
          <el-tree
            :data="data"
            show-checkbox
            class="tree"
            node-key="id"
            :filter-node-method="filterNode"
            :props="defaultProps"
            highlight-current
            @node-click="handleNodeClick"
            @check="handleNodeChecked"
            ref="tree"
          ></el-tree>
        </div>
        <div class="item-box-cure">
          <div class="title">已选择</div>
          <p v-for="(item,index) in selectedData" class="label" :key="index">
            {{index+1}}、{{item.name}}
            <i class="close el-icon-error" @click="handleRemove(index)"></i>
          </p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveContraindicationsData()">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="药物相互作用筛选" :visible.sync="dialogVisible2" width="600px">
      <el-transfer
        filterable
        :filter-method="filterMethod"
        filter-placeholder="请输入关键字检索"
        v-model="selectedDurg"
        :titles="titles"
        :data="data2"
        @change="transferChange"
        @left-check-change="leftDrugChange"
      ></el-transfer>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="saveFilterData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  analysisFirstData,
  saveContraindications,
  saveFilter,
  updataData,
  updataReportData
} from "@/api/analysis";
const defaultPlan = {
  id: "",
  medicalRecordId: "",
  psychosomaticTherapy: "", //心身治疗建议
  exercisePrescription: "", //"运动处方"
  nutritionPrescription: "", //营养处方
  functionalMedicineAdvice: "", //功能医学建议
  otherSuggestion: "", //其他建议
  somatizationSymptomsDrugRegimen: "",
  complete: true,
  followUpRecommendations: {
    data: [
      "第1周随访，观察疗效、药物反应，根据随访情况可能需调整用药方案和心理治疗内容。",
      "第2周随访，观察疗效、药物反应，根据随访情况可能需调整用药方案和心理治疗内容。",
      "第1个月随访，观察疗效、药物反应，根据随访情况可能需调整用药方案和心理治疗内容。",
      "第2个月随访，观察疗效、药物反应，根据随访情况可能需调整用药方案和心理治疗内容。",
      "第3个月随访，观察疗效、药物反应，根据随访情况可能需调整用药方案和心理治疗内容。"
    ]
  } //随访建议
};
import { Loading } from "element-ui";
export default {
  name: "curePlan",
  props: {
    isEdit: {
      type: Boolean,
      default: false
    },
    prevTitle: {
      type: String,
      value: ""
    },
    patientId: {
      type: String,
      value: ""
    },
    medicalRecordId: {
      type: String,
      value: ""
    },
    nextTitle: {
      type: String,
      value: ""
    }
  },
  data() {
    return {
      data2: [],
      titles: ["可选药物", "已选药物"],
      selectedDurg: [],
      selectedDurgLeft: [],
      filterMethod(query, item) {
        return item.label.indexOf(query) > -1;
      },
      drugPlan: [],
      dialogVisible: false,
      dialogVisible2: false,
      filterText: "",
      selectedData: [],
      data: [],
      defaultProps: {
        children: "subList",
        label: "name"
      },
      initData: Object.assign({}, defaultPlan)
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.initDataList();
  },
  methods: {
     cheakedNum(val){
        return val>9?val:"0"+val
      },
    submitReportData() {
      if(this.drugPlan.length==0){
       this.$message.warning("请选择药物")
       return;
      }
      let param = {
        id: this.initData.id,
        medicalRecordId: this.initData.medicalRecordId,
        psychosomaticTherapy: JSON.stringify(
          this.initData.psychosomaticTherapy
        ), //心身治疗建议
        exercisePrescription: JSON.stringify(
          this.initData.exercisePrescription
        ), //"运动处方"
        nutritionPrescription: JSON.stringify(
          this.initData.nutritionPrescription
        ), //营养处方
        functionalMedicineAdvice: JSON.stringify(
          this.initData.functionalMedicineAdvice
        ), //功能医学建议
        otherSuggestion: JSON.stringify(this.initData.otherSuggestion), //其他建议
        followUpRecommendations: JSON.stringify(
          this.initData.followUpRecommendations
        ),
        complete: true
      };
     
      updataReportData(param).then(res => {
        if (res.code == 200) {
          let createTime=new Date().getFullYear() +
                "-" +
                this.cheakedNum(new Date().getMonth() + 1) +
                "-" +
                 this.cheakedNum(new Date().getDate()) +
                " " +
                 this.cheakedNum(new Date().getHours()) +
                ":" +
                this.cheakedNum(new Date().getMinutes())  +
                ":" +
                 this.cheakedNum(new Date().getSeconds());
          this.$store.commit("delete_tabs", this.$route.path);
          this.$router.push({
            path: "/rep/pdf",
            query: { 
              id: this.medicalRecordId,
              createTime:createTime
            }
          });
        }
      });
    },
    transferChange(val) {
      this.selectedDurgLeft = [];
    },
    leftDrugChange(val) {
      this.selectedDurgLeft.push(val);
    },
    drugProgram() {
      if (this.data.length == 0) {
        saveContraindications([], this.medicalRecordId).then(res => {
          if (res.code == 200) {
            this.data2 = [];
            for (let item of res.dataList) {
              let param = {};
              param.key = item;
              param.label = item;
              this.data2.push(param);
            }
            this.dialogVisible = false;
            this.dialogVisible2 = true;
          }
        });
      } else {
        this.dialogVisible = true;
      }
    },
    saveFilterData() {
      this.selectedDurg;
      if (this.selectedDurgLeft.length != 0) {
        this.$message.warning("选择药物！");
        return;
      }
      let param = this.selectedDurg;
      saveFilter(param, this.medicalRecordId).then(res => {
        this.drugPlan = [];
        if (res.code == 200) {
          this.drugPlan = res.dataList;
          this.dialogVisible2 = false;
        } else {
          this.drugPlan.push(res.message);
          this.dialogVisible2 = false;
          // this.$message.warning(res.message)
        }
      });
    },
    saveContraindicationsData() {
      let param = this.$refs.tree.getCheckedNodes(true);
      saveContraindications(param, this.medicalRecordId).then(res => {
        if (res.code == 200) {
          this.data2 = [];
          for (let item of res.dataList) {
            let param = {};
            param.key = item;
            param.label = item;
            this.data2.push(param);
          }
          this.dialogVisible = false;
          this.dialogVisible2 = true;
        } else {
          this.dialogVisible = false;
          this.dialogVisible2 = false;
          this.drugPlan[0] = res.message;
          //this.$message.warning(res.message)
        }
      });
    },
    addText1(key) {
      this.initData[key].data.push("");
    },
    deleteItem3(key, index1, index2) {
      let arr = this.initData[key].data[index1].data;
      if (arr.length > 1) {
        arr.splice(index2, 1);
      } else {
        this.$message.warning("最后一行不可以删除！");
      }
    },
    deleteText1(key, index) {
      let arr = this.initData[key].data;
      if (arr.length > 1) {
        arr.splice(index, 1);
      } else {
        this.$message.warning("最后一行不可以删除！");
      }
    },
    addText2(key, index) {
      this.initData[key].data[index].data.push("");
    },
    deleteText2(key, index, index2) {
      let arr = this.initData[key].data[index].data;
      if (arr.length > 1) {
        arr.splice(index2, 1);
      } else {
        this.$message.warning("最后一行不可以删除！");
      }
    },
    addText3(key, index1, index2) {
      this.initData[key].data[index1].data[index2].data.push("");
    },
    deleteText3(key, index1, index2, index3) {
      let arr = this.initData[key].data[index1].data[index2].data;
      if (arr.length > 1) {
        arr.splice(index3, 1);
      } else {
        this.$message.warning("最后一行不可以删除！");
      }
    },
    initDataList() {
      const loading = Loading.service({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      let param = {};
      param.medicalRecordId = this.medicalRecordId;
      param.source = 1;
      param.patientId = this.patientId;
      analysisFirstData(param)
        .then(res => {
          loading.close();
          let data = {};
          if (res.code == 200) {
            data = res.dataList[0];
            this.data = data.contraindicationsList;
            this.initData.id = data.id;
            this.initData.medicalRecordId = data.medicalRecordId;
            this.initData.psychosomaticTherapy = this.cheakedEmpty(
              data.psychosomaticTherapy
            );
            this.initData.exercisePrescription = this.cheakedEmpty(
              data.exercisePrescription
            );
            this.initData.nutritionPrescription = this.cheakedEmpty(
              data.nutritionPrescription
            );
            this.initData.functionalMedicineAdvice = this.cheakedEmpty(
              data.functionalMedicineAdvice
            );
            this.initData.otherSuggestion = this.cheakedEmpty(
              data.otherSuggestion
            );
            this.initData.somatizationSymptomsDrugRegimen=JSON.parse(data.somatizationSymptomsDrugRegimen)
            // this.initData.somatizationSymptomsDrugRegimen = this.cheakedEmpty(
            //   data.somatizationSymptomsDrugRegimen
            // ); //躯体化治疗方案
            if (data.noneMedicationPlanPrompt) {
              this.drugPlan[0] = data.noneMedicationPlanPrompt;
            }
          }
        })
        .catch(err => {
          loading.close();
        });
    },
    cheakedEmpty(objData) {
      if(objData=="null"||objData==""){
        objData={}
         objData.data=[];
        objData.data.push("无");
      }else{
          objData = JSON.parse(objData);
          if (objData.data.length == 0) {
            objData.data.push("无");
          }else{
            for(let item of objData.data){
              if(item.data&&item.data.length==0){
                item.data.push("无")
              }
            }
          }
      }
      return objData;
    },
    handleNodeClick(val) {
      this.$refs.tree.setChecked(val.id, true, false);
      this.selectedData = this.$refs.tree.getCheckedNodes(true);
    },
    handleNodeChecked() {
      this.selectedData = this.$refs.tree.getCheckedNodes(true);
    },
    handleRemove(index) {
      this.selectedData.splice(index, 1);
      let keys = [];
      for (let item of this.selectedData) {
        if (item.parentId == 2) {
          keys.push(item.id);
        }
      }
      this.$refs.tree.setCheckedKeys(keys);
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handlePrev() {
      this.$emit("prevStep");
    },
    handleFinishCommit() {
      // this.$emit('finishCommit',"");
      let loading = Loading.service({
        lock: true,
        text: "加载中",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.8)"
      });
      //this.$emit('nextStep');
      updataData(this.data)
        .then(res => {
          loading.close();
          if (res.code == 200) {
            this.$message.success("保存成功");
          }
        })
        .catch(err => {
          loading.close();
        });
    }
  }
};
</script>
<style >

.screen-box {
  border: 1px solid #eee;
}
.item-box-cure {
  padding: 10px;
  flex: 1;
  align-items: flex-start;
  border: 1px solid #eee;
}
.item-box-cure .el-input {
  margin: 10px 0;
}
.item-box-cure .title {
  line-height: 30px;
  font-size: 16px;
  font-weight: bold;
}
.item-box-cure .label {
  padding: 0 10px;
  line-height: 35px;
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  margin: 10px;
  position: relative;
}
.item-box-cure .label .close {
  color: #f56c6c;
  position: absolute;
  right: -5px;
  top: -5px;
}
.tree {
  height: 400px;
  overflow: auto;
}
.add-btn {
  width: 100px;
  height: 30px;
  margin-right: 10px;
  text-align: center;
  line-height: 30px;
  border-radius: 8px;
  border: 1px solid #1197d6;
  color: #1197d6;
  cursor: pointer;
}

.ips-input {
  margin: 0 10px;
  width: 400px;
}
.text-box {
  width: 100%;
  border: 1px solid #ccc;
  min-height: 40px;
  padding: 10px;
  border-radius: 10px;
}
.text-box .box-title {
  font-size: 14px;
}
.text-box .item-box-cure {
  border: 1px solid #409eff;
  margin-bottom: 10px;
  border-radius: 10px;
  position: relative;
}
.text-box .item-box-cure .close {
  color: #f56c6c;
  position: absolute;
  right: -5px;
  top: -5px;
}
.text-box .text-boder {
  border: none;
  margin: 0;
}
.text-box .text-boder textarea {
  outline: none;
  border: none;
}
.text-box .text-boder.blue {
  padding: 0;
  color: #409eff;
}
.text-box .text-boder.red {
  color: #f56c6c;
}
.text-box .text-boder .el-textarea .el-textarea__inner {
  border: none !important;
  outline: none !important;
  -webkit-appearance: none;
}
</style>
