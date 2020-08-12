<template>
  <div style="margin-top: 50px">
    <el-form  ref="easyQuestion" label-width="120px" >
      <el-form-item  style="text-align: center">
        <div class="ips-input">{{questionNo==1?"初筛首访问卷":"首访问卷"}}</div>
        <el-button type="primary" @click="startQuestion">{{completeQuestionnaire?'重测问卷':'开始问卷'}}</el-button>
         <!-- <el-button type="primary" :class="completeQuestionnaire?'':'disable'" @click="handleRecord(true,questionNo)">测试记录</el-button> -->
         <el-button type="primary"  @click="qrcodeData">扫码答题</el-button>
      </el-form-item>
      <el-form-item style="text-align: center">
        <el-button size="medium" @click="handlePrev">上一步，{{prevTitle}}</el-button>
        <el-button type="primary" size="medium" @click="handleNext">下一步，{{nextTitle}}</el-button>
      </el-form-item>
    </el-form>
    <el-dialog
      title="问卷"
      :visible.sync="dialogVisible"
      width="60%">
      <question2 :scale-id="scaleId+''"  :medical-record-id="medicalRecordId"
        :gender="gender"
        :patient-id="patientId" @closeDialog="closeDialog" @openDialog="openDialog"></question2>

    </el-dialog>
    <el-dialog
      title="量表选择"
      :visible.sync="dialogVisible2"
      width="60%">
        <div class="screen-title">您已完成首访问卷的所有内容，系统自动为您推荐以下量表内容，请根据患者实际情况选择测试内容，点击【继续测试量表】进入测试量表步骤。</div>
        <div class="screen-box flex">
          <div class="item-box">
            <div class="title">待选择</div>
            <el-input
              placeholder="输入关键字进行过滤"
              v-model="filterText" size="small">
            </el-input>
            <el-tree
                :data="data"
                show-checkbox
                node-key="id"
                class="tree-box"
                :filter-node-method="filterNode"
                highlight-current
                @node-click="handleNodeClick"
                @check="handleNodeChecked"
                ref="tree">
             </el-tree>
          </div>
          <div class="item-box">
            <div  class="title">已选择</div>
            <div class="selected-box">
              <p v-for="(item,index) in selectedData" class="label" :key="index"   >
                {{item.label}}
              <i class="close el-icon-error" @click="handleRemove(index)"></i>
              </p>
            </div>
            
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
        <el-button @click="againMeasure">重新测试问卷</el-button>
        <el-button type="primary" @click="handleNextItem()">继续测试量表</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="qrcodeDialog" width="240px">
      <!-- <qrcode :q-text="qText" :q-size="qSize" ></qrcode> -->
        <el-image class="qrcode" :src="qrcodePath"></el-image>
        <p class="qrcode-text">扫码关注公众号答题</p>
    </el-dialog>
    <el-dialog
      title="提示"
      :visible.sync="dialogTips"
      width="40%">
      <div class="tips-box">
        <div class="title">问题:{{tipsData.title}}</div>
        <div v-for="(item,index) in tipsData.label1" :key="index">{{(index+1)+'、'+item}}</div>
        <div>{{tipsData.label2}}</div>
        <el-radio-group v-model="tipsData.selected">
            <el-radio class="radio" v-for="(itemData,indexData) in tipsData.answer" :label="indexData" :key="indexData">{{itemData}}</el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogTips = false">取 消</el-button>
        <el-button type="primary" @click="appendQuestionSubmitData">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {getMedicalRecord,scaleConfirm,getScaleSelectData,appendQuestionSubmit,appendQuestion} from '@/api/question'
import {getScaleTypeJson} from '@/api/getJson'
  import qrcode from '@/components/qrcode/qrcode'
  import question2 from './question2';
   import qrcodePath from "../../../assets/images/qrcode-gzh.jpg"
  export default {
    name: "easyQuestion",
    components: {question2,qrcode},
    props: {
      type: {
        type: String,
        default: "C"
      },
      patientId:{
        type:String,
        value:""
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
        filterText:"",
        selectedData:[],
        scaleNoList:[],
        qrcodePath:qrcodePath,
        data: [],
        siblingsNumber:"",
        tipsData:{},
        dialogTips:false,
        gender:true,
        qText:"",
        qSize:200,
        qrcodeDialog:false,
        dialogVisible:false,
        dialogVisible2:false,
        completeQuestionnaire:false,
        scaleId:"2",
        questionNo:""
      };
    },
     watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    created() {
       this.initData();
      
    },
    methods: {
      qrcodeData(){
        let medicalRecordId=this.medicalRecordId;
        let patientId=this.patientId;
        this.qText="https://ips.xsyxsy.com/patient/"+patientId+"/"+medicalRecordId;
        this.qrcodeDialog=true;
      },
      againMeasure(){
        this.dialogVisible2 = false
        this.startQuestion();
      },
      initData(){
        getMedicalRecord(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.questionNo=res.dataList[0].questionnaireNo;
               this.scaleNoList=res.dataList[0].scaleNoList;
               this.gender=res.dataList[0].gender;
              this.completeQuestionnaire=res.dataList[0].completeQuestionnaire;
          }
        });
      },
      startQuestion(){
        //this.scaleId=this.questionNo;
       // console.log( this.scaleId)
        this.dialogVisible=true;
      },
      openDialog(data){
        this.initData();
        this.dialogVisible=false;
        this.dialogTips=true;
        data.selected="";
        this.tipsData=data;
      },
      openScaleSelectData(){
        getScaleSelectData(this.medicalRecordId).then(res=>{
           if(res.code==200){
               let dataList=res.dataList;
            let data=[];
            for(let item of dataList){
              let param={
                  id: item.id,
                  parentId:0,
                  disabled: true,
                  label: item.name,
                  children:[]
              }
              for(let item1 of item.questionnaireList){
                  let param1={
                    id: item1.number,
                    parentId:item1.categoryId,
                    checked: true,
                    label: item1.name,
                    focusIdList:item1.focusIdList
                  }
                  param.children.push(param1)
              }
              data.push(param)
            }
            this.data=data;
            this.dialogVisible2=true;
            this.$nextTick(function() {
                  this.$refs.tree.setCheckedKeys(this.scaleNoList);
                  this.selectedData=this.$refs.tree.getCheckedNodes(true);
             }) 

           }
           
       })
      },
      appendQuestionSubmitData(){
        if(this.tipsData.selected==''){
            this.$message.warning("请选择答案！")
            return;
        }
        let data={
           medicalRecordId: this.medicalRecordId,
           questionNumber: this.tipsData.appendQuestionNumber,
           returnValue: this.tipsData.label1,
           optionOrder: this.tipsData.selected,
           optionValue: this.tipsData.answer[this.tipsData.selected]
        }
        appendQuestionSubmit(data).then(res=>{
          if(res.code==200){
            this.dialogTips=false;
            this.$message.success("提交成功")
            this.openScaleSelectData()
          }
        })
      },
      closeDialog(){
        this.initData();
        this.dialogVisible=false;
      },
      handleRecord(questionnaire,questionnaireId){
        if(this.completeQuestionnaire){
           this.$router.push({path:'/ips/questionResult',
            query: {
              medicalRecordId: this.medicalRecordId,
              questionnaire:questionnaire,
              questionnaireId,questionnaireId,
              gender:this.gender
            }
          });
        }else{
          this.$message.warning("您得问卷还没做！")
        }
         
      },
      checkIncludesData(selectedFocusList,focusList){

        if(focusList){
          for(let item of focusList){
            if(selectedFocusList.includes(item)){
              return true;
            }
          }
        }
        return false;
      },
       handleNodeClick(data){
         let selectedData=this.$refs.tree.getCheckedNodes(true);
          let focusIdList=[];
         for(let item of selectedData){
           if(item.focusIdList){
            focusIdList=[...focusIdList,...item.focusIdList]
           }
           
         }
         let keys=this.$refs.tree.getCheckedKeys(true);
         if(keys.includes(data.id)){
            this.$refs.tree.setChecked(data.id,false,false)
         }else {
            // for(let item of this.data){
            //   if(item.id==data.categoryId){
            //     for(let itemData of item.questionnaireList){
            //       this.$refs.tree.setChecked(itemData.id,false,false)
            //     }
            //   }
            // }
            if(this.checkIncludesData(focusIdList,data.focusIdList)){
               this.$message.warning("您已经选择了同类型量表") 
            }else{
               this.$refs.tree.setChecked(data.id,true,false)
            }
           
         }
         this.selectedData=this.$refs.tree.getCheckedNodes(true);
      },
      handleNodeChecked(data){
        this.handleNodeClick(data)
      },
      handleRemove(index){
          this.selectedData.splice(index,1);
          let keys=[];
          for(let item  of this.selectedData){
                keys.push(item.id);
          }
          this.$refs.tree.setCheckedKeys(keys);
        },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      handlePrev() {
        this.$emit('prevStep')
      },
      handleNextItem(){
        let param=this.$refs.tree.getCheckedKeys(true);
        if(param.length==0){
          this.$message.warning("请选择量表")
          return;
        }
        scaleConfirm(param,this.medicalRecordId).then(res=>{
          if(res.code==200){
            this.$emit('nextStep');
             this.dialogVisible2=false;
          }
        })
       
      },
      handleNext() {
        if(this.completeQuestionnaire){
          if(this.type==="A"){
             this.$emit('nextStep');
             return;
          }

          appendQuestion(this.medicalRecordId).then(res=>{
             if(res.code==200){
               this.dialogVisible=false;
              this.dialogTips=true;
             
              let data=res.dataList[0];
              data.selected="";
              this.tipsData=data;
             }
          })
         

        
         
        }else{
          this.$message.warning("您还没有做问卷！")
        }
        
      }
    }
  }
</script>

<style scoped>

  .ips-input{
    margin: 0 10px;
    width: 400px;
    display: inline-block;
    border: 1px solid #eeee;
    border-radius: 10px;
    color: #999;
  }
  .disable{
    background: #ccc;
    border: 1px solid #ccc;
  }
  .screen-title{
    line-height: 35px;
    font-size: 16px;
    color: #222;
    text-indent: 2em;
  }
  .screen-box{
    border: 1px solid #eee;
    border-radius: 10px;
  }
  .tree-box{
    height: 320px;
    overflow: auto;
  }
  .selected-box{
    height: 370px;
    overflow: auto;
  }
  .item-box{
     padding: 10px;
     flex:1;
     align-items: flex-start;
  }
  .item-box .el-input{
    margin: 10px 0;
  }
  .item-box .title{
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
  }
  .item-box .label{
    padding: 0 10px;
    line-height: 35px;
    border: 1px solid #e1e1e1;
    border-radius: 8px;
    margin: 10px;
    position: relative;
  }
  .item-box .label .close{
    color: #F56C6C;
    position: absolute;
    right: -5px;
    top: -5px;
  }
  .tips-box{
    line-height: 35px;
    font-size: 18px;
    padding: 0 18px;
  }
  .tips-box .title{
    color: #000;
  }
  .tips-box .radio{
    line-height: 35px;
  }
   .qrcode-text{
    margin-bottom:  20px;
    width: 100%;
    text-align: center;
    font-size: 18px;
    color: #666;
    font-weight: bold;
  }
</style>
