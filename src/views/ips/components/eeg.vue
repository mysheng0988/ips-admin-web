<template>
  <div style="margin-top: 50px">
    <el-form  :rules="rules" ref="productInfoForm" label-width="120px" >
        <el-form-item style="text-align: center" >
          <div class="ips-input">植物神经功能检测--》检测科室:{{info.departmentName}}</div>
          <el-button type="primary" @click="verificationCode" >获取验证码</el-button>
          <el-button type="primary" ><a href="HRV://">开始检测</a></el-button>
          <el-button type="primary" @click="handleResult">记录结果</el-button>

        </el-form-item>
        <el-form-item style="text-align: center" >
           <div class="ips-input">脑电功能检测--》检测科室:{{info.departmentName}}</div>
          <el-button type="primary" @click="verificationCode" >获取验证码</el-button>
          <el-button type="primary" ><a href="EEG://">开始检测</a></el-button>
           <el-button type="primary" @click="getEEGData">记录结果</el-button>
        </el-form-item>

      <el-form-item style="text-align: center">
        <!-- <el-button @click="test">读取MI卡</el-button> -->
         <!-- <el-button @click="cardTest">读取MI卡数据</el-button> -->
        <el-button size="medium" @click="handlePrev">上一步，{{prevTitle}}</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，{{nextTitle}}</el-button>
      </el-form-item>

    </el-form>
    <el-dialog
        title="HRV检测结果"
        :visible.sync="dialogVisible"
        width="700px">
        <el-image :src="hrvPath"></el-image>
      </el-dialog>
    <el-dialog
        title="EEG检测结果"
        :visible.sync="dialogVisible2"
        top="5vh"
        width="700px">
        <el-image :src="eegPath"></el-image>
    </el-dialog>
  </div>
</template>

<script>
  import {getRecordPatient} from "@/api/patient";
  import {getEEG,getHRV,getVerificationCode} from '@/api/HRV'
  import {updateMedicalRecord} from '@/api/medicalRecord'
  export default {
    name: "ProductInfoDetail",
    props: {
      isEdit: {
        type: Boolean,
        default: false
      },
      medicalRecordId:{
        type:String,
        value:""
      },
      prevTitle:{
        type:String,
        value:"",
      },
      nextTitle:{
        type:String,
        value:"",
      },
    },
    data() {
      return {
        dialogVisible:false,
        dialogVisible2:false,
        eegPath:"",
         hrvPath:"",
        rules: {
          goodsName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ],
          goodsTitle: [{required: true, message: '请输入商品副标题', trigger: 'blur'}],
          shopId:[{required: true, message: '请选择店铺', trigger: 'blur'}],
          oneCode: [{required: true, message: '请选择商品分类', trigger: 'blur'}],
        }
      };
    },
    computed:{
      info () {
        return this.$store.state.user.info
      },
    },
    created() {


    },
    methods: {
      handleResult(){
           getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.dialogVisible=true;
              this.hrvPath=res.dataList[0].resultImageUrl;
          }else{
            this.$message.warning("暂时没有数据")
          }
        })
      },
      getHRVData(){
        getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.dialogVisible=true;
              this.hrvPath=res.dataList[0].resultImageUrl;
          }
        })
      },
      getEEGData(){
        getEEG(this.medicalRecordId).then(res=>{
          if(res.code==200){
            this.dialogVisible2=true;
            this.eegPath=res.dataList[0].resultImageUrl;
          }else{
            this.$message.warning("没有查到数据")
          }
        })
      },
      verificationCode(){
        getVerificationCode().then(res=>{
          if(res.code==200){
            this.$copyText(res.dataList[0]);
            this.$message.success("验证码:"+res.dataList[0]+",已复制到剪切板！")
          }
        })
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNext() {
         getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
            let param={
              id:this.medicalRecordId,
              examinationStatus:20,
            }
            updateMedicalRecord(param).then(res=>{
               if(res.code==200){
                  this.$emit('nextStep');
               }
            })
            
           }else{
              this.$message.warning("请先完成设备检查")
           }
        })
      },
      handleUpdataState(){

      },
    }
  }
</script>

<style scoped >
  .ips-input{
    margin:  10px;
    width: 400px;
    display: inline-block;
    border: 1px solid #eeee;
    border-radius: 10px;
    color: #999;
  }
</style>
