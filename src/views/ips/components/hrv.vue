<template>
  <div style="margin-top: 50px">
    <el-form  :rules="rules" ref="productInfoForm" label-width="120px" >
        <el-form-item style="text-align: center" >
          <!--<el-input class="ips-input" placeholder="植物神经功能检测&#45;&#45;》检测科室：心理科" ></el-input>-->
          <div class="ips-input">植物神经功能检测--》检测科室:{{info.deptName}}</div>
          <el-button type="primary" @click="verificationCode" >获取验证码</el-button>
          <el-button type="primary" ><a href="HRV://">开始检测</a></el-button>
          <el-button type="primary" @click="handleResult">记录结果</el-button>
        </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，{{prevTitle}}</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，{{nextTitle}}</el-button>
      </el-form-item>

    </el-form>
    <el-dialog
        title="HRV检测结果"
        :visible.sync="dialogVisible"
        width="700px">
        <el-image :src="hrvPath"></el-image>
        <!-- <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span> -->
      </el-dialog>
  </div>
</template>

<script>
  import {getHRV,getVerificationCode} from '@/api/HRV'
  import {getRecordPatient} from "@/api/patient";
  export default {
    name: "HRV",
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
        hrvPath:"",
        dialogVisible:false,
        rules: {
          goodsName: [
            {required: true, message: '请输入商品名称', trigger: 'blur'},
            {min: 2, max: 140, message: '长度在 2 到 140 个字符', trigger: 'blur'}
          ]
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
      this.getHRVData()
      },
      getHRVData(){

        getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.dialogVisible=true;
              this.hrvPath=res.dataList[0].resultImageUrl;
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
         getRecordPatient(this.medicalRecordId).then(res=>{
           if(res.code==200){
             if(res.dataList[0].examinationStatus>10){
                 this.$emit('nextStep');
             }else{
               this.$message.warning("请先完成HRV检查")
             }

           }
        })
      }
    }
  }
</script>

<style scoped >
  .ips-input{
    margin: 0 10px;
    width: 400px;
    display: inline-block;
    border: 1px solid #eeee;
    border-radius: 10px;
    color: #999;
  }
</style>
