<template>
  <div style="margin-top: 50px">
    <el-form  :rules="rules" ref="productInfoForm" label-width="100px" >
      <el-form-item label="心身综合测评结果:" >
        <div class="text-box" >
          <!-- <div class="flex-wrap" v-for="(item,index) in data.focusProblem" :key="index" >
           <el-button @click="addText('focusProblem')" class="text-boder blue" icon="el-icon-edit">
             {{index+1}}、</el-button>
              <el-input placeholder="请输入详细内容"
              v-model="data.focusProblem[index]"
              class="text-boder"
              type="textarea"
              autosize>
            </el-input>
            <el-button  @click="deleteText(data.focusProblem,index)" class="text-boder red" icon="el-icon-delete"></el-button>
          </div> -->
           <div v-for="(item1,index1) in data.comprehensiveEvaluation" :key="index1">
            <div class="box-title">{{item1.title}}</div>
            <div class="flex-wrap" v-for="(item2,index2) in item1.data" :key="index2">
              <el-button
                @click="addText2('comprehensiveEvaluation',index1,index2)"
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
                @click="deleteText2('comprehensiveEvaluation',index1,index2)"
                class="text-boder red"
                icon="el-icon-delete"
              ></el-button>
            </div>
          </div>
        </div>
      </el-form-item>
      <!-- <el-form-item label="心身因素:"  prop="name" >
        <div class="text-box" >
          <div class="flex-wrap" v-for="(item,index) in data.psychosomaticFactors" :key="index" >
           <el-button @click="addText('psychosomaticFactors')" class="text-boder blue" icon="el-icon-edit">
             {{index+1}}、</el-button>
              <el-input placeholder="请输入详细内容"
              v-model="data.psychosomaticFactors[index]"
              class="text-boder"
              type="textarea"
              autosize>
            </el-input>
            <el-button  @click="deleteText(data.psychosomaticFactors,index)" class="text-boder red" icon="el-icon-delete"></el-button>
          </div>
        </div>
      </el-form-item>
      <el-form-item label="社会功能:" >
        <div class="text-box" >
          <div class="flex-wrap" v-for="(item,index) in data.socialFunction" :key="index" >
           <el-button @click="addText('socialFunction')" class="text-boder blue" icon="el-icon-edit">
             {{index+1}}、</el-button>
              <el-input placeholder="请输入详细内容"
                v-model="data.socialFunction[index]"
                class="text-boder"
                type="textarea"
                autosize>
              </el-input>
            <el-button  @click="deleteText(data.socialFunction,index)" class="text-boder red" icon="el-icon-delete"></el-button>
          </div>
        </div>
      </el-form-item> -->
      <el-form-item label="辅助诊断建议:" v-if="type!='A'">
       <div class="text-box" >
          <div class="flex-wrap" v-for="(item,index) in data.initialDiagnosisVO" :key="index" >
            <div >
                  {{item}}
            </div>
          </div>
        </div>
      </el-form-item>
      <!-- <el-form-item label="综合分析:" v-if="type!='A'">
        <div class="text-box" >
          <div class="flex-wrap" v-for="(item,index) in data.comprehensiveAnalysis" :key="index" >
           <el-button @click="addText('comprehensiveAnalysis')" class="text-boder blue" icon="el-icon-edit">
             {{index+1}}、</el-button>
              <el-input placeholder="请输入详细内容"
              v-model="data.comprehensiveAnalysis[index]"
              class="text-boder"
              type="textarea"
              autosize>
            </el-input>
            <el-button  @click="deleteText('comprehensiveAnalysis',index)" class="text-boder red" icon="el-icon-delete"></el-button>
          </div>
        </div>
      </el-form-item> -->
      <el-form-item style="text-align: center">
        <!-- <el-button size="medium" @click="handlePrev">上一步，{{prevTitle}}</el-button> -->
        <el-button type="primary" size="medium" @click="handleNext" v-if="nextTitle!=''">下一步，{{nextTitle}}</el-button>
        <el-button type="primary" size="medium" @click="handleFinishCommit" v-else>完成</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="40%">
      <div class="dialog-box">
        <p>问题:患者是否精神痛苦显著、或共病药物滥用、既往有发作史等？</p>
        <el-radio-group v-model="checkList" >
          <el-radio :label="false" >存在一项或多项</el-radio>
          <el-radio :label="true" >不存在任意一项</el-radio>
        </el-radio-group>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="updataDataAnalysis">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {analysisData,updataData} from '@/api/analysis'
  import { Loading } from 'element-ui';
   import editText from './editText';
  export default {
    name: "analysis",
     components: {editText},
    props: {
      type: {
        type: String,
        default: "C"
      },
      patientId:{
        type:String,
        value:"",
      },
      medicalRecordId:{
        type:String,
        value:"",
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
        data:"",
        dialogVisible:false,
        checkList:true,
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
    created() {
      const loading =Loading.service({
          lock: true,
          text: 'Loading',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)'
        });
      let param={};
      param.medicalRecordId=this.medicalRecordId;
      param.source=2;
      param.patientId=this.patientId;
      analysisData(param).then(res=>{
         loading.close();
        let data={};
        if(res.code==200){
          data=res.dataList[0];
        }
        data.comprehensiveEvaluation=JSON.parse(data.comprehensiveEvaluation);
        if(!data.focusProblem||data.focusProblem.length==0){
            data.focusProblem=[],
            data.focusProblem.push("无");
        }
        if(!data.psychosomaticFactors||data.psychosomaticFactors.length==0){
           data.psychosomaticFactors=[],
          data.psychosomaticFactors.push("无");
        }
        if(!data.socialFunction||data.socialFunction.length==0){
            data.socialFunction=[],
            data.socialFunction.push("无");
        }
        // if(!data.initialDiagnosis||data.initialDiagnosis.length==0){
        //    data.initialDiagnosis=[],
        //    data.initialDiagnosis.push("");
        // }
          this.data=data;
      }).catch(err=>{
        loading.close();
      })

    },
    methods: {
      addText(val){
       this.data[val].push("");
      },
      deleteText(arr,index){
        if(arr.length>1){
          arr.splice(index,1); 
        }else{
          this.$message.warning("最后一行不可以删除！")
        }
        
      },
    addText2(key, index) {
      this.data[key][index].data.push("");
    },
    deleteText2(key, index, index2) {
      let arr = this.data[key][index].data;
      if (arr.length > 1) {
        arr.splice(index2, 1);
      } else {
        this.$message.warning("最后一行不可以删除！");
      }
    },
      handlePrev() {
        this.$emit('prevStep')
      },
      updataDataAnalysis(){
           let loading= Loading.service({
           lock: true,
           text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)'
        });
         //this.$emit('nextStep')
        this.data["complete"]=false;
        this.data["isRecommendedMedicationTips"]=this.checkList;
        let data=this.data;
        data.comprehensiveEvaluation=JSON.stringify(data.comprehensiveEvaluation);
        // console.log(data.comprehensiveEvaluation)
        // return;
        updataData(data).then(res=>{
           loading.close();
            if(res.code==200){
                this.$emit('nextStep');
            }
        }).catch(err=>{
           loading.close();
        });
      },
      handleNext() {
        if(this.data.initialDiagnosisVO.includes("轻度焦虑症状")||this.data.initialDiagnosisVO.includes("轻度抑郁症状")){
            this.dialogVisible=true;
        }else{
          this.updataDataAnalysis();
        }
      },
      handleFinishCommit(){
        let loading= Loading.service({
           lock: true,
           text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.8)'
        });
         this.data["complete"]=true;
        updataData(this.data).then(res=>{
            loading.close();
            if(res.code==200){
                this.$store.commit('delete_tabs', this.$route.path)
                this.$router.push({path:"/rep/siftPdf",query:{id:this.medicalRecordId}})
            }
        }).catch(err=>{
            loading.close();
        });
      }
    }
  }
</script>

<style >
  .text-box{
    width: 100%;
    border:1px solid #ccc;
    min-height: 40px;
    padding: 10px;
    border-radius: 10px;
  }
  .text-boder{
    border: none;
    margin: 0;
  }
  .text-boder textarea{outline: none; border: none}
  .text-boder.blue{
    padding: 0;
    color:#409EFF;
  }
  .text-boder.red{
    color:#F56C6C;
  }
  .text-boder .el-textarea .el-textarea__inner{
    border: none!important;
    outline: none!important;
    -webkit-appearance: none;
  }
  .ips-input{
    margin: 0 10px;
    width: 400px;
  }
  .dialog-box{
    font-size: 18px;
    line-height: 40px;
  }
</style>
