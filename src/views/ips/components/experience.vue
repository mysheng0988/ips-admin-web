<template>
    <div >
      <el-form ref="expObj"
               :model="expObj"
               :rules="expRules"
               label-width="100px">
        <el-form-item label="就诊日期:"  prop="visitDate"  >
          <el-date-picker
            v-model="expObj.visitDate"
            class="input-width"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="请选择时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="症状:"  prop="symptomsSet" >
          <el-select
             clearable class="input-width"
             filterable 
             allow-create
             multiple
            v-model="expObj.symptomsSet"
            placeholder="请选择"
            >
            <el-option
              v-for="item in symptomOption"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="医院:"  prop="hospitalId" >
          <!-- <el-select  placeholder="请选择" v-model="expObj.hospitalId">
            <el-option v-for="(item,index) in hostList"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select> -->
           <el-select
            style="width: 100%"
            v-model="expObj.hospitalId"
            filterable
            remote
            placeholder="请输入关键词检索"
            :remote-method="queryHospitalData"
            :loading="loadingOption">
            <el-option
              v-for="item in hostList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="检查:"  prop="checkup" >
          <el-select
            style="width: 100%"
            v-model="expObj.checkupIdList"
            multiple
            filterable
            remote
            placeholder="请输入关键词检索"
            :remote-method="querySearchCheck"
            :loading="loadingOption">
            <el-option
              v-for="item in optionCheck"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="诊断:"  prop="diagnosisIdList" >
          <el-select
            style="width: 100%"
            v-model="expObj.diagnosisIdList"
            multiple
            filterable
            remote
            placeholder="请输入关键词检索"
            :remote-method="querySearchICD"
            :loading="loadingOption">
            <el-option
              v-for="item in optionICD"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="治疗方案:" prop="treatmentPrograms">
          <el-input
            class="textarea"
            placeholder="请输入详细内容"
            type="textarea"
            v-model="expObj.treatmentPrograms"
            :autosize="{minRows: 2, maxRows: 2}"
            maxlength="100"
            show-word-limit
            clearable></el-input>
        </el-form-item>
         <el-form-item label="效果:"  prop="treatmentEffect" >
          <el-select  placeholder="请选择" v-model="expObj.treatmentEffect" clearable class="input-width">
            <el-option label="有效" value="有效"></el-option>
            <el-option label="部分有效" value="部分有效"></el-option>
            <el-option label="未见改善" value="未见改善"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="btn-box">
        <el-button @click="handleCloseDialog">取消</el-button>
        <el-button type="primary" @click="saveExpData('expObj')">保存</el-button>
      </div>
    </div>
</template>

<script>
  import {querySymptoms,
    saveExperience,
    updateExperience,
    queryCheckUp,
    savaPursue,
    getPursue,
    updatePursue} from '@/api/ips';
  import {getICD11} from '@/api/icd'
  const defaultExp={
    symptomsSet:[],
    checkupIdList:[],
    diagnosisIdList:[],
    hospital: "",
    hospitalId: "",
    patientId: "",
    symptoms: "",
    treatmentEffect: "",
    treatmentPrograms: "",
    visitDate:"",
  }
  import {mapGetters} from 'vuex'
  import {queryHospital} from "@/api/ips"
    export default {
      name: "experience",
      props: {
        data:{
          type:Object,
         
        },
        medicalRecordId: {
          type: String,
          value:""
        },
        patientId: {
          type: String,
          value:""
        },
      },
       watch: {
        data: {
            handler(newValue, oldValue) {
               this.expObj=newValue;
               this.optionICD=this.expObj.diagnosisList;
               this.optionCheck=this.expObj.checkupList;
               
            }
        }
      },
      data() {
        return {
          optionICD:[],
          optionCheck:[],
          symptomOption:[],
          expObj:this.data,
          loadingOption:false,
          hostList:[],
          expRules: {
            visitDate: [
              {required: true, message: '请选择时间', trigger: 'blur'},
            ],
            diagnosisIdList: [{required: true, message: '请输入关键词检索诊断', trigger: 'blur' }],
            checkupIdList:[{required: true, message: '请输入关键词检索', trigger: 'blur' }],
            symptomsSet: [{required: true, message: '请选择症状', trigger: 'blur' }],
            hospitalId: [{required: true, message: '请选择医院', trigger: 'blur'}],
            treatmentEffect:[{required: true, message: '请选择治疗方案', trigger: 'blur'}],
            treatmentPrograms: [{required: true, message: '请选择治疗方案', trigger: 'blur'}],
          }
        }
      },
      computed:{
      ...mapGetters([             //步骤二，对象扩展运算符方式
        "info"
      ])
     },
      created(){
        //this.getHospital();
        this.querySymptomsData();
        this.expObj=this.data;
        this.optionICD=this.expObj.diagnosisList;
        this.optionCheck=this.expObj.checkupList;
        
      },
      methods:{
        queryHospitalData(queryString){
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.loadingOption=true;
             queryHospital(queryString).then(res=> {
               this.loadingOption=false;
              if (res.code == 200) {
                this.hostList = res.dataList.slice(0,50);
              }else{
                 this.hostList=[];
              }
             })
            // getICD11(queryString).then(res=>{
            //   this.loadingOption=false;
            //   if(res.code==200){
            //     this.optionICD=res.dataList.slice(0,50)
            //   }else{
            //     this.optionICD=[];
            //   }
            // })

          }, 300);
         
        },
        handleCloseDialog(){
          this.$emit('closeDialog');
        },
        saveExpData(formName){
          this.expObj.patientId=this.patientId;
          this.$refs[formName].validate((valid) => {
            if (valid) {
              if(this.expObj.id){
                updateExperience(this.expObj).then(res=>{
                   if(res.code){
                  this.$emit('closeDialog');
                  this.$refs[formName].resetFields();
                  this.expObj=Object.assign({},defaultExp);
                  this.$message.success("修改成功");
                }
                })
              }else{
                saveExperience(this.expObj).then(res => {
                if(res.code){
                  this.$emit('closeDialog');
                  this.$refs[formName].resetFields();
                  this.expObj=Object.assign({},defaultExp);
                  this.$message.success("保存成功");
                }
               })
              }
              
            } else {
              this.$message({
                message: '验证失败',
                type: 'error',
                duration: 1000
              });
              return false;
            }
          })
        },
        querySearchICD(queryString) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.loadingOption=true;
            getICD11(queryString).then(res=>{
              this.loadingOption=false;
              if(res.code==200){
                this.optionICD=res.dataList.slice(0,50)
              }else{
                this.optionICD=[];
              }
            })

          }, 300);
        },
        querySymptomsData(queryString){
            querySymptoms({departmentCategoryId:this.info.deptCategoryId,queryParam:queryString,type:1}).then(res=>{
                if(res.code==200){
                  this.symptomOption=res.dataList;
                }else{
                  this.symptomOption=[];
                }
                
              })
        },
        querySearchCheck(queryString) {
          clearTimeout(this.timeout);
          this.timeout = setTimeout(() => {
            this.loadingOption=true;
            queryCheckUp(queryString).then(res=>{
              this.loadingOption=false;
              if(res.code==200){
                this.optionCheck=res.dataList.slice(0,50)
              }else{
                this.optionCheck=[];
              }
            })

          }, 300);
        },
      }
    }
</script>

<style scoped>
  .input-width{
    width: 100%;
  }
  .btn-box{
    text-align: right;
  }
</style>
