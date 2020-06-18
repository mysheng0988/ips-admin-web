<template>
  <div  class="app-container">
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
        <div v-for="(item,index) in drugData" :key="'drug'+index">
            <suggest-drug :data="item" :page-num="contentsData[3].pageNum-0+index" ></suggest-drug>
        </div>
        <div v-for="(item,index) in suggestData" :key="'ni'+index">
          <patient-ni :data="item" :page-num="contentsData[4].pageNum-0+index" ></patient-ni>
        </div>
        <nerve-examine  :medical-record-id="medicalRecordId+''" :page-num="contentsData[5].pageNum" ></nerve-examine>
        <eeg-examine v-if="eegData"  :medical-record-id="medicalRecordId+''" :page-num="contentsData[6].pageNum" ></eeg-examine>
        <div v-for="(item,index) in scaleData" :key="'scale'+index">
           <scale-assess :data="item" :page-num="contentsData[7].pageNum-0+index" ></scale-assess>
        </div>
        <assessment v-if="pressureData" :data="pressureData" :page-num="contentsData[8].pageNum" ></assessment>
        <assessment2 v-if="pressureData2" :data="pressureData2" :page-num="contentsData[8].pageNum-0+1"></assessment2>
        <rep-end></rep-end>
    </div>
        <el-button type="danger" @click="getPdf('pdfCentent',patientVo.realName)">导出PDF</el-button>
        <!-- <el-button type="danger" @click="outPut">浏览器导出PDF</el-button> -->
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import {getRecordPatient} from "@/api/patient"
import {getPursue,queryExperienceList} from "@/api/ips"
import{getEEG} from "@/api/HRV"
import {analysisData} from "@/api/analysis"
 import{scaleResult,getReportMsg,scaleResultNum} from "@/api/report"
      import repIndex from './components/rep-index'
      import contents from './components/contents'
      import patientMsg from './components/patientMsg'
      import experience from './components/experience'
      import assess from './components/assess'
      import repAnalysis from './components/rep-analysis'
      import suggestDrug from './components/suggestDrug'
      import followSuggest from './components/followSuggest'
      import patientEdu from './components/patient-edu'
      import patientNi from './components/patientNi'
      import nerveExamine from './components/nerveExamine'
      import eegExamine from './components/eegExamine'
      import scaleAssess from './components/scaleAssess'
      import assessment from './components/assessment'
      import assessment2 from './components/assessment2'
      import repEnd from './components/repEnd'

    export default {
      name: "pdf",
      components: {
          repIndex,
          contents,
          patientMsg,
          experience,
          assess,
          repAnalysis,
          suggestDrug,
          followSuggest,
          patientEdu,
          patientNi,
          nerveExamine,
          eegExamine,
          scaleAssess,
          assessment,
          assessment2,
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
          eegData:false,
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
              pageName:"治疗方案参考",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"附录1:患者教育",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"附录2:自主神经检查",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"附录3:EEG检测",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"附录4:量表评估",
              pageNum:0,
               hidden:false,
            },
             {
              pageName:"附录5:压力量表评估",
              pageNum:0,
              hidden:true,
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
        this.createTime=this.$route.query.createTime;
        if(this.medicalRecordId==""||this.medicalRecordId==undefined){
          this.medicalRecordId=36;
        }

         this.contentsData[0].pageNum=1;//患者信息
          this.initData();
      },
      mounted(){
          this.$store.commit("CLOSE_TBA")
          
      },
      
      methods: {
          async initData(){
             await this.getPursueData();
          let patient=await this.getPatientData();
          
          await this.getExperienceList(patient.patientId,this.createTime)
           await this.getReportMsgData();
          await this.getEEGData();
          await this.getScaleResult();
          await this.getScaleNumResult();
        },
        getEEGData(){
          return getEEG(this.medicalRecordId).then(res=>{
              if(res.code==200){
                this.eegData=true;
              }else{
                this.eegData=false;
              }
          })
        },
        getScaleNumResult(){
           return scaleResultNum(this.medicalRecordId,{questionnaireNumbers:12}).then(res=>{
              let rowNum=0;
              let maxRow=15;
              if(res.code==200){
                let pressureData=res.dataList[0];
                pressureData.conclusion=JSON.parse(pressureData.conclusion);
                pressureData.chartData=JSON.parse(pressureData.chartData);
                let explanation=pressureData.explanation;
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
         return getReportMsg(this.medicalRecordId).then(res=>{
              if(res.code==200){
                  let pageNum=0;
                  let rowNum=0;
                  let maxRowNum=25;
                  let data=res.dataList[0];
                 this.getAnalysisData(data);//报告分析总结模块
                   this.doctorDrugPlan(data);//医生治疗建议
                  let patientMedicationPlan={};
                  patientMedicationPlan.title="用药注意事项";
                  patientMedicationPlan.data=[];
                   let dataPlan=data.patientMedicationPlan;
                    if(dataPlan.length==0){
                        data.noneMedicationPlanPrompt=data.noneMedicationPlanPrompt?data.noneMedicationPlanPrompt:"无"
                      dataPlan.push(data.noneMedicationPlanPrompt)
                    }
                      patientMedicationPlan.data.push(dataPlan)

                    //躯体化药物方案
                   // let somatizationSymptomsDrugRegimen=JSON.parse(data.somatizationSymptomsDrugRegimen);
                    let suggestData=[];
                    let totalData=[];
                    totalData=this.pageThenDrugData(totalData,patientMedicationPlan,0);
                    totalData.splice(2,0,{content:"请医生勾选患者使用的药物，患者仅需查看医生勾选药物的注意事项",type:1})
                    //  console.log(totalData)
                    // if(somatizationSymptomsDrugRegimen){
                    //    totalData=this.pageThenData(totalData,somatizationSymptomsDrugRegimen,0);
                    // }
                  let exercisePrescription=JSON.parse(data.exercisePrescription);//运动处方
                 let nutritionPrescription=JSON.parse(data.nutritionPrescription);//营养处方
                 let functionalMedicineAdvice=JSON.parse(data.functionalMedicineAdvice);//功能医学建议
                 let otherSuggestion=JSON.parse(data.otherSuggestion);
                if(exercisePrescription){
                  totalData=this.pageThenData(totalData,exercisePrescription,0);
                }
                if(nutritionPrescription){
                    totalData=this.pageThenData(totalData,nutritionPrescription,0);
                }
                if(functionalMedicineAdvice){
                   totalData=this.pageThenData(totalData,functionalMedicineAdvice,0);
                }
                if(otherSuggestion){
                  totalData=this.pageThenData(totalData,otherSuggestion,0);
                }
                 if(data.neurotransmitterRegulators&&data.neurotransmitterRegulators!=""){
                     let neurotransmitterRegulators=JSON.parse(data.neurotransmitterRegulators)
                    totalData=this.pageThenData(totalData,neurotransmitterRegulators,0);
                 }
                //totalData=this.pageThenData(totalData,followUpRecommendations,0);
                suggestData[pageNum]=[];
                for(let item of totalData){
                  //todo
                  // let num=this.computeRowNum(item.content);
                  //  rowNum+=num;
                  //   if(rowNum>maxRowNum){
                  //     rowNum=this.computeRowNum(item.content)+1;
                  //     pageNum++;
                  //     suggestData[pageNum]=[];
                  //   }
                  //   suggestData[pageNum].push(item)
                   let surplus=maxRowNum-rowNum;
                  let contentNum=this.computeRowNum(item.content);
                    if(contentNum-surplus==1){
                      rowNum=1;
                      pageNum++;
                      suggestData[pageNum]=[];
                        suggestData[pageNum].push(item)
                    }else if(contentNum-surplus>1){
                      let content1=item.content.substring(0,surplus*40);
                      let dataObj1={
                        imgPath:"",
                        content:content1
                      }
                      suggestData[pageNum].push(dataObj1)
                      rowNum=contentNum-surplus;
                      let content2=item.content.substring(surplus*40);
                      let dataObj2={
                        imgPath:"",
                        content:content2
                      }
                      pageNum++;
                      suggestData[pageNum]=[];
                      
                        suggestData[pageNum].push(dataObj2)
                        
                    }else{
                        rowNum+=contentNum;
                        suggestData[pageNum].push(item)
                    }
                }
                this.suggestData=suggestData;
                 this.contentsData[3].pageNum=this.contentsData[2].pageNum+this.page.length;//治疗方案参考
                this.contentsData[4].pageNum=this.contentsData[3].pageNum+this.drugData.length;
                this.contentsData[5].pageNum=this.contentsData[4].pageNum+this.suggestData.length;//附录2:自主神经检查
                if(this.eegData){
                  this.contentsData[6].pageNum=this.contentsData[7].pageNum+1;//附录3:EEG检测--有
                  this.contentsData[7].pageName="附录4:量表评估"
                   this.contentsData[8].pageName="附录5:压力量表评估"
                }else{
                   this.contentsData[6].pageNum=this.contentsData[5].pageNum;//附录3:EEG检测--没有
                   this.contentsData[6].hidden=true;
                    this.contentsData[7].pageName="附录3:量表评估"
                     this.contentsData[8].pageName="附录4:压力量表评估"
                }
                 this.contentsData[7].pageNum=this.contentsData[6].pageNum+1;
               

              }


            })
        },
        //医生药物治疗方案
        doctorDrugPlan(data){
           let pageNum=0;
           let rowNum=1;
           let maxRowNum=26;
           let drugData=[];
           let totalData=[];
           let doctorMedicationPlan={};
           doctorMedicationPlan.title="用药辅助建议";
           doctorMedicationPlan.data=[];
           let dataPlan=data.doctorMedicationPlan;
           if(!dataPlan){
             dataPlan=[];
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

        },
        //用药教育
        pageThenDrugData(data,obj,index){
            if(!obj)return;
          let str="";
          if(typeof obj==="object"){
             let param={
                content:str+obj.title,
                type:index
              }
              data.push(param)
              let index2=0;
             for(let item of obj.data){
               index2++;
               this.pageThenDrugData(data,item,index2) 
             }
          }else{
            let param={
              content:obj,
              type:10
              }
             data.push(param)
          }
          return data;
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
                  if(rowNum>=maxRowNum){
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
             this.contentsData[8].pageNum=this.contentsData[7].pageNum-0+this.scaleData.length;//附录4:压力量表评估
          })
        },
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
        getExperienceList(patientId,createTime){
         return queryExperienceList(patientId,createTime).then(res=>{
            if(res.code==200){
              this.experienceData=res.dataList;
              let exeList=[];
              let pageNum=0;
              let itemNum=0
              let pageMaxItem=3;
             if(res.dataList.length>0){
                 exeList[pageNum]={};
              }
              for(let item of res.dataList){
                let year=item.visitDate.substring(0,4);
                  let symptom=[];
                  for(let item1 of item.symptomsSet){
                      symptom.push(item1)
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
            }
             this.contentsData[1].pageNum=2;//就诊经历
             this.contentsData[1].hidden=this.experienceData.length==0?true:false;
             //this.contentsData[2].pageNum=2-0+this.experienceData.length;//三维评估
             this.contentsData[2].pageNum=this.contentsData[1].pageNum+this.experienceData.length;//报告分析总结
          }).catch(error => {
          })
        },
        computeRowNum(text){
            return Math.ceil(text.length/40)
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
                  content:obj,
                  type:10
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
              toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-analysis.png"),"综合分析",data.comprehensiveAnalysis)
              toatalData= this.copyAnalysis(toatalData,require("@/views/rep/img/icon-diagnose.png"),"辅助诊断建议",data.initialDiagnosisVO)
             for(let item of toatalData){
               let surplus=maxRowNum-rowNum;
               let contentNum=this.computeRowNum(item.content);
                if(contentNum-surplus==0){
                   rowNum=1;
                   pageNum++;
                   page[pageNum]=[];
                   page[pageNum].push(item)
                }else if(contentNum-surplus>0){
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
      height: 1092px;
      border:1px solid #eeeeee;
      overflow: hidden;
   }
</style>
