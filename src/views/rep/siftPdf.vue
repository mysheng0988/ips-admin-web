<template>
  <div class="app-container" >
    <div class="pdf-container" id="pdfCentent" ref="content">
        <pat-msg :medical-record-id="medicalRecordId+''" :patient-data="patientData" :chat-data="chatData" ></pat-msg>
         <nerve-examine  :medical-record-id="medicalRecordId+''"  v-if="isHRV"></nerve-examine>
        <div v-for="(item,index) in scaleData" :key="'scale'+index">
           <scale-assess :data="item"  ></scale-assess>
        </div>
    </div>
   <el-button type="danger" @click="handleWindowPrint('pdfCentent',patientVo.realName)">导出PDF</el-button>
   <!-- <el-button type="danger" @click="outPut">导出PDF</el-button> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getRecordPatient} from "@/api/patient"
import {getPursue,queryExperience} from "@/api/ips"
import {analysisData} from "@/api/analysis"
import {getHRV} from "@/api/HRV"
 import{scaleResult,getReportMsg,scaleResultNum,getReportAssess} from "@/api/report"
      import patMsg from './components/patMsg'
      import nerveExamine from './components/nerveExamine'
      import scaleAssess from './components/scaleAssess'
    export default {
      name: "siftPdf",
      components: { 
          patMsg,
          nerveExamine,
          scaleAssess,
      },
      computed: {
        ...mapGetters([
          'sidebar',
        ]),
      },
      data() {
        return{
          medicalRecordId:"",
          pressureData:"",
          pressureData2:"",
          patientData:{},
          patientVo:{},
          isHRV:false,
          scaleData:[],
          chatData:{},
    
        }
      },
       watch: {
        $route(to) {
          this.medicalRecordId=this.$route.query.id;
          this.initData();
        }
      },
      created(){
        this.medicalRecordId=this.$route.query.id;
         this.$store.commit("CLOSE_TBA")
          this.initData()
      },
      mounted(){
         getHRV(this.medicalRecordId).then(res=>{
          if(res.code==200){
              this.isHRV=true;
          }else{
             this.isHRV=false;
          }
        })
      },
      methods: {
         handleWindowPrint(ele, fileName){

              this.$router.push({
                 path:"/siftPdf2",
                query: {
                  id: this.medicalRecordId,
                  name:fileName,
                  createTime:this.createTime
                }
              })
          },
         async initData(){
            // await this.getPursueData();
          let patient=await this.getPatientData();
          this.getScaleResult();
        },
        getReportAssessData(){
          getReportAssess(this.medicalRecordId).then(res=>{
            if(res.code==200){
              this.chatData=res.dataList[0];
            }
          })
        },
        getScaleResult(){
         return scaleResult(this.medicalRecordId).then(res=>{
            let data=res.dataList;
            let scaleData=[];
            let pageNum=0;
            let rowNum=0;
            let maxRowNum=26;
            let currentNum=0;
            scaleData[pageNum]=[]
            for(let item of data){
              let copyItem={
                type:"text",
                explanation:[]
              }
              if(item.questionnaireNumber!=12){
                   currentNum=6;
                  if(item.type=="dial"){
                     item.chartData=JSON.parse(item.chartData);
                    rowNum+=currentNum
                  }else if(item.type=="Radar"){
                    currentNum=6;
                    item.chartData=JSON.parse(item.chartData);
                    rowNum+=currentNum
                  }else if(item.type=="table"){
                     currentNum=3;
                    item.chartData=JSON.parse(item.chartData);
                    currentNum+=item.chartData.length+currentNum;
                      let index=0;
                    for(let item1 of item.explanation){
                      currentNum+=this.computeRowNum(item1)
                      if(currentNum<maxRowNum){
                        index++;
                      }
                    }
                    let explanation=item.explanation;
                    item.explanation=explanation.slice(0,index);
                    copyItem.explanation=explanation.slice(index);
                    rowNum+=currentNum;
                  }else if(item.type=="Histogram"){
                     currentNum=9;
                     item.chartData=JSON.parse(item.chartData);
                     let index=0;
                    for(let item1 of item.explanation){
                      currentNum+=this.computeRowNum(item1)
                      if(currentNum<maxRowNum){
                        index++;
                      }
                    }
                    let explanation=item.explanation;
                    item.explanation=explanation.slice(0,index);
                    copyItem.explanation=explanation.slice(index);
                    rowNum+=currentNum;
                  }else if(item.type=="text"){
                     currentNum=5;
                    for(let item1 of item.explanation){
                      currentNum+=this.computeRowNum(item1)
                    }
                    rowNum+=currentNum;
                  }
                  if(rowNum>maxRowNum){
                    rowNum=currentNum
                    pageNum++;
                    scaleData[pageNum]=[]
                  }
                  scaleData[pageNum].push(item)
                  if(copyItem.explanation.length>0){
                    for(let item1 of copyItem.explanation){
                      rowNum=this.computeRowNum(item1)
                    }
                    pageNum++;
                    scaleData[pageNum]=[]
                    scaleData[pageNum].push(copyItem)
                  }
                 
               }
            }
            this.scaleData=scaleData;
          })
        },
        getPatientData(){
         return getRecordPatient(this.medicalRecordId).then(res=>{
            if(res.code==200){
              this.patientData=res.dataList[0];
            }
            return  this.patientData;
          })
        },
      }
    }
</script>

<style scoped  >
    .app-container{
      text-align: center
    }
    .pdf-container{
      width: 768px;
      margin: 0 auto;
    }
   .form-pdf{
     position: relative;
      width: 768px;
      height: 1091px;
      border:1px solid #eeeeee;
   }
   
  
</style>
