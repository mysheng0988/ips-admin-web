<template>
  <div class="app-container" >
    <div class="pdf-container" id="pdfCentent" ref="content">
        <rep-index :patient-data="patientData" :patient-vo="patientVo"></rep-index>
        <contents :data="contentsData"></contents>
        <patient-msg :page-num="contentsData[0].pageNum" :patient-data="patientData" :patient-vo="patientVo" :main-pursue="mainPursue"></patient-msg>
        <div v-for="(item2,index2) in experienceData" :key="'exe-'+index2">
          <experience :experience-data="item2" :page-num="contentsData[1].pageNum-0+index2" ></experience>
        </div>
        <div v-for="(item,index) in page" :key="index">
          <rep-analysis  :page-num="contentsData[2].pageNum-0+index" :analysis-data="item"></rep-analysis>
        </div>
        <nerve-examine  :medical-record-id="medicalRecordId+''" :page-num="contentsData[3].pageNum" ></nerve-examine>
        <div v-for="(item,index) in scaleData" :key="'scale'+index">
           <scale-assess :data="item" :page-num="contentsData[4].pageNum-0+index" ></scale-assess>
        </div>
        <rep-end></rep-end>
    </div>
   <el-button type="danger" @click="getPdf('pdfCentent',patientVo.realName)">导出PDF</el-button>
   <!-- <el-button type="danger" @click="outPut">导出PDF</el-button> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getRecordPatient} from "@/api/patient"
import {getPursue,queryExperience} from "@/api/ips"
import {analysisData} from "@/api/analysis"
 import{scaleResult,getReportMsg,scaleResultNum} from "@/api/report"
      import repIndex from './components/rep-index'
      import contents from './components/contents'
      import patientMsg from './components/patientMsg'
      import experience from './components/experience'
      import repAnalysis from './components/rep-analysis'
      import suggestDrug from './components/suggestDrug'
      import followSuggest from './components/followSuggest'
      import patientNi from './components/patientNi'
      import nerveExamine from './components/nerveExamine'
      import scaleAssess from './components/scaleAssess'
       import repEnd from './components/repEnd'
    export default {
      name: "siftPdf",
      components: { 
          repIndex,
          contents,
          patientMsg,
          experience,
          repAnalysis,
          suggestDrug,
          followSuggest,
          patientNi,
          nerveExamine,
          scaleAssess,
          repEnd
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
          mainPursue:{},
          analysisData:{},
          experienceData:[],
          scaleData:[],
          drugData:[],
          suggestData:[],
          contentsData:[
            {
              pageName:"基本信息",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"就诊经历",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"报告分析总结",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"附录1:自主神经检查",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"附录2:量表评估",
              pageNum:0,
              hidden:false,
            }
          ],
          page:[],
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
        
        this.contentsData[0].pageNum=1;//患者信息
      },
      mounted(){
         this.$store.commit("CLOSE_TBA")
          this.initData()
      },
      methods: {
         async initData(){
            await this.getPursueData();
          let patient=await this.getPatientData();
          await this.getExperienceList(patient.patientId)
         
           await this.getScaleResult();
          await this.getReportMsgData();
           await this.getScaleNumResult();
        },
        getScaleNumResult(){
            scaleResultNum(this.medicalRecordId,{questionnaireNumbers:12}).then(res=>{
              let rowNum=0;
              let maxRow=15;
              if(res.code==200){
                let pressureData=res.dataList[0];
                pressureData.conclusion=JSON.parse(pressureData.conclusion);
                pressureData.chartData=JSON.parse(pressureData.chartData);
                let explanation=JSON.parse(pressureData.explanation);
                let index=0;
                for(let item of explanation){
                   rowNum+=this.computeRowNum(item);
                  if(rowNum<=maxRow){
                      index++;
                  }  
                }
                if(rowNum>maxRow){
                    rowNum=0;
                    pressureData.explanation=explanation.slice(0,index);
                    let pressureData2=explanation.slice(index,6);
                    this.pressureData2=pressureData2;
                }else{
                     pressureData.explanation=explanation;
                }
                this.pressureData=pressureData;
              }
            })
        },
        getReportMsgData(){
         return  getReportMsg(this.medicalRecordId).then(res=>{
              if(res.code==200){
                  let pageNum=0;
                  let rowNum=0;
                  let maxRowNum=24;
                  let data=res.dataList[0];
                  this.getAnalysisData(data);//报告分析总结模块
               
                this.contentsData[3].pageNum=this.contentsData[2].pageNum+1;//附录2:自主神经检查
                this.contentsData[4].pageNum=this.contentsData[3].pageNum+1;//附录4:量表评估
                //this.contentsData[9].pageNum=this.contentsData[8].pageNum+this.scaleData.length;//附录4:压力量表评估
        
              }
              
               
            })
        },
        //医生药物治疗方案
        doctorDrugPlan(data){
           let pageNum=0;
           let rowNum=1;
           let maxRowNum=24;
           let drugData=[];
           let totalData=[];
           let doctorMedicationPlan={};
           doctorMedicationPlan.title="用药辅助建议";
           doctorMedicationPlan.data=[];
           let dataPlan=data.doctorMedicationPlan;
           if(dataPlan.length==0){
             data.noneMedicationPlanPrompt=data.noneMedicationPlanPrompt?data.noneMedicationPlanPrompt:"无"
             dataPlan.push(data.noneMedicationPlanPrompt)
           }
            let param={
              title:"神经递质调节药物",
              data:dataPlan
            }
            //躯体化药物方案
            let somatizationSymptomsDrugRegimen=JSON.parse(data.somatizationSymptomsDrugRegimen);
            doctorMedicationPlan.data.push(param)
            if(somatizationSymptomsDrugRegimen){
              doctorMedicationPlan.data.push(somatizationSymptomsDrugRegimen);
            }
            totalData=this.pageThenData(totalData,doctorMedicationPlan,0);
            //心身治疗建议
            let psychosomaticTherapy=JSON.parse(data.psychosomaticTherapy);
            if(psychosomaticTherapy){
                totalData=this.pageThenData(totalData,psychosomaticTherapy,0);
            }
            //随访建议
            let followUpRecommendations=JSON.parse(data.followUpRecommendations);
            if(followUpRecommendations){
                followUpRecommendations["title"]="随访建议";
                totalData=this.pageThenData(totalData,followUpRecommendations,0);
            }
            
            drugData[pageNum]=[];
            for(let item of totalData){
                rowNum+=this.computeRowNum(item.content);
                if(rowNum>maxRowNum){
                  rowNum=this.computeRowNum(item.content)+1;
                  pageNum++;
                  drugData[pageNum]=[];
                }
                drugData[pageNum].push(item)
            }
           this.drugData=drugData;
            this.contentsData[5].pageNum=this.contentsData[4].pageNum+this.drugData.length;//附录1:患者教育
         
        },
        pageThenData(data,obj,index){
          if(!obj){
            return;
          }
          let str="";
          // if(index!=0){
          //   str=index+"、"
          // }
          if(typeof obj==="object"){
             let param={
                content:str+obj.title,
                type:index
              }
              data.push(param)
              let index2=0;
             for(let item of obj.data){
               index2++;
              this.pageThenData(data,item,index2)
             }
          }else{
            let param={
              content:index+"、"+obj,
              type:1
              } 
             data.push(param)
          }
          return data;
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
                  }else if(item.type=="table"){
                     currentNum=6;
                    item.chartData=JSON.parse(item.chartData);
                    rowNum+=item.chartData.length+currentNum;
                  }else if(item.type=="Histogram"){
                     currentNum=6;
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
             this.contentsData[4].pageNum=this.contentsData[3].pageNum-0+this.scaleData.length;//附录4:压力量表评估
          })
        },
        // getScaleResult(){
        //   scaleResult(this.medicalRecordId).then(res=>{
        //     let data=res.dataList;
        //     let scaleData=[];
        //     let pageNum=0;
        //     let itemNum=0;
        //     let pageMax=3;
        //     scaleData[pageNum]=[]
        //     for(let item of data){
        //       if(item.questionnaireNumber!=12){
        //         itemNum++;
        //         if(itemNum>pageMax){
        //           itemNum=1
        //           pageNum++;
        //           scaleData[pageNum]=[]
        //         }
        //         if(item.chartData!=""){
        //             item.chartData=JSON.parse(item.chartData);
        //             if(item.chartData.length>4){
        //               itemNum++;
        //             }
        //           }
        //           scaleData[pageNum].push(item)
        //       }
        //     }
        //     this.scaleData=scaleData;
        //   })
        // },
        getPatientData(){
         return getRecordPatient(this.medicalRecordId).then(res=>{
            if(res.code==200){
              this.patientData=res.dataList[0];
              this.patientVo=res.dataList[0].patientVO;
            }
            return  this.patientData;
          })
        },
        getPursueData(){
         return getPursue(this.medicalRecordId).then(res=>{
           if(res.code==200){
            this.mainPursue=res.dataList[0];
           }
          })
        }, 
        getExperienceList(){
          return queryExperience(this.medicalRecordId).then(res=>{
            if(res.code==200){
             // this.experienceData=res.dataList;
             
              let exeList=[];
              let pageNum=0;
              let itemNum=0
              let pageMaxItem=2;
              if(res.dataList.length>0){
                 exeList[pageNum]={};
              }
              for(let item of res.dataList){
                let year=item.visitDate.substring(0,4);
                  let symptom=[];
                  for(let item1 of item.symptomList){
                      symptom.push(item1.name)
                  }
                  let checkupList=[];
                  for(let item1 of item.checkupList){
                      checkupList.push(item1.name)
                  }
                  let diagnosisList=[]
                  for(let item1 of item.diagnosisList){
                      diagnosisList.push(item1.name)
                  }
                if(itemNum<=pageMaxItem){
          
                  itemNum++;
                  if(exeList[pageNum][year]){
                   let param={
                      month:item.visitDate.substring(5,10),
                      symptom:symptom.join(","),
                      diagnosis:checkupList.join(",")+"诊断为:"+diagnosisList.join(","),
                      cureItem:item.treatmentPrograms+","+item.treatmentEffect,
                    }
                    exeList[pageNum][year].push(param);
                  }else{
                    exeList[pageNum][year]=[];
                    let param={
                      month:item.visitDate.substring(5,10),
                      symptom:symptom.join(","),
                      diagnosis:checkupList.join(",")+"诊断为:"+diagnosisList.join(","),
                      cureItem:item.treatmentPrograms+","+item.treatmentEffect,
                    }
                    exeList[pageNum][year].push(param);
                  }
                 
                }else{
                  itemNum=0;
                  pageNum++;
                  exeList[pageNum]={};
                   exeList[pageNum][year]=[];
                    let param={
                      month:item.visitDate.substring(5,10),
                      symptom:symptom.join(","),
                      diagnosis:checkupList.join(",")+"诊断为:"+diagnosisList.join(","),
                      cureItem:item.treatmentPrograms+","+item.treatmentEffect,
                    }
                    exeList[pageNum][year].push(param);
                }
                

              }
              this.experienceData=exeList;
               console.log(this.experienceData)
             
            }
             let length=this.experienceData.length;
             this.contentsData[1].pageNum=2;//就诊经历
             this.contentsData[1].hidden=this.experienceData.length==0?true:false;
             this.contentsData[2].pageNum=2-0+this.experienceData.length;//三维评估
             this.contentsData[3].pageNum=this.contentsData[2].pageNum+1;//报告分析总结
          }).catch(error => {
          })
        },
        computeRowNum(text){
            return Math.ceil(text.length/45)
        },
        copyAnalysis(toatalData,imagePath,label,data){
          if(!data||data.length==0){
            data.push("无");
          }
          let param={
            imgPath:imagePath,
            content:label
          }
          toatalData.push(param);
          let index=0;
          for(let item of data){
            index++;
            let dataObj={
              imgPath:"",
              content:index+"、"+item
            }
            toatalData.push(dataObj)
          }
          return toatalData;
        },
        spreadJson2arr(data,obj,index){
              if(typeof obj==="object"){
              let dataObj={
                  imgPath:"",
                  content:obj.title
                }
                data.push(dataObj)
                let index2=0;
                for(let item of obj.data){
                  index2++;
                  this.spreadJson2arr(data,item,index2)
                }
              }else{
                let dataObj={
                  imgPath:"",
                  content:index+"、"+obj
                }
                data.push(dataObj)
              }
          return data;
        },
        getAnalysisData(data){
             let page=[];//数组长度为页面页数
             let rowNum=0;//页面行数
             let pageNum=0;//第多少页
             let maxRowNum=22;//一页最大行数
             page[pageNum]=[];
             let toatalData=[];
              let dataObj={
                imgPath:require("@/views/rep/img/icon-problem.png"),
                content:"生理心理社会综合评估"
              }
               toatalData.push(dataObj)
               let comprehensiveEvaluation=JSON.parse(data.comprehensiveEvaluation);
               for(let item of comprehensiveEvaluation){
                  toatalData=this.spreadJson2arr(toatalData,item,0)
               }
              // toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-analysis.png"),"综合分析",data.comprehensiveAnalysis)
              // toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-diagnose.png"),"辅助诊断建议",data.initialDiagnosisVO)
             for(let item of toatalData){
               let surplus=maxRowNum-rowNum;
               let contentNum=this.computeRowNum(item.content);
                if(contentNum-surplus==1){
                   rowNum=1;
                   pageNum++;
                   page[pageNum]=[];
                    page[pageNum].push(item)
                }else if(contentNum-surplus>1){
                  let content1=item.content.substring(0,surplus*40);
                  let dataObj1={
                    imgPath:"",
                    content:content1
                  }
                   page[pageNum].push(dataObj1)
                   rowNum=contentNum-surplus;
                   let content2=item.content.substring(surplus*40);
                  let dataObj2={
                    imgPath:"",
                    content:content2
                  }
                   pageNum++;
                   page[pageNum]=[];
                  
                    page[pageNum].push(dataObj2)
                    
                }else{
                     rowNum+=contentNum;
                    page[pageNum].push(item)
                }
              
             }
            this.page=page;
        },
        // getAnalysisData(data){
        //      let page=[];//数组长度为页面页数
        //      let rowNum=0;//页面行数
        //      let pageNum=0;//第多少页
        //      let maxRowNum=15;//一页最大行数
        //      page[pageNum]=[];
        //      let toatalData=[]
        //     // if(data.typeId=="4"){
        //       toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-problem.png"),"焦点问题",data.focusProblem)
        //       toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-nutrition.png"),"心身因素",data.psychosomaticFactors)
        //       toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-society.png"),"社会功能",data.socialFunction)
        //     //   toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-analysis.png"),"疾病成因分析",data.causes)
        //     //   toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-diagnose.png"),"辅助诊断建议",data.initialDiagnosisVO)
        //     //  }else{
        //     //   toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-nutrition.png"),"心身因素",data.psychosomaticFactors)
        //     //  }
        //      for(let item of toatalData){
        //        rowNum+=this.computeRowNum(item.content)
        //        if(rowNum>maxRowNum){
        //          rowNum=this.computeRowNum(item.content);
        //          pageNum++;
        //           page[pageNum]=[];
        //        }
        //        page[pageNum].push(item)
        //      }
        //     this.page=page;
        //     this.contentsData[4].pageNum=this.contentsData[3].pageNum+this.page.length;//治疗方案参考
        //     console.log(this.contentsData[3].pageNum)
        //     console.log(this.page.length)
        //     console.log(this.contentsData[4].pageNum)
        // },
      },
     
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
