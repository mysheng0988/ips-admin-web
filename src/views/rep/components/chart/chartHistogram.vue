<template> 
  <div class="item-box">
      <div class="chart">
        <ve-histogram :data="chartData" width="100%" height="100%"
        :extend="extend"></ve-histogram>
      </div>
      <div class="content">
          <div class="content-title">{{data.questionnaireName}}</div>
          <div>得分：{{data.score}}分</div>
          <div>{{data.conclusion}}</div>
          <div v-for="(item,index) in data.explanation" :key="index">{{item}}</div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'chart-histogram',
    props: {
      data: {
          type: Object,
          default:{}
        },
    },
    data(){

      return {
        // chartSettings:{
        //  xAxisType:"value"
        // },
        extend :{
          grid:{
            top:20,
            left:10,
            right:10,
            bottom:30,
            containLabel: true
          },
          legend: {
            itemWidth: 16,
            itemHeight: 10,
            bottom:"0",
            textStyle:{
              fontSize:8
            }
          },
          tooltip : {
            trigger: 'axis',
            axisPointer: {
              type: 'none'
            }
          },
          yAxis:{
            show:true,
          },
          series: {
             label: { show: true, position: "top" }
          }
        },
        chartData: {
          columns: [ "项目"],
          rows: [

          ]
        }
      }
    },
     mounted(){
       let index=0;
      for(let item of this.data.chartData){
        index++;
        this.chartData.columns.push(item.name);
        let param={
          "项目":""
        }
        param[item.name]=item.score;
        this.chartData.rows.push(param);
      }
    }
  }
</script>
<style  scoped>
  .item-box{
    padding: 10px 0;
    width: 626px;
  }
  .content{
    flex:1;
    color: #666;
     margin: 5px 0;
     font-size: 15px;
     text-align: justify;
    line-height: 30px;
  }
  .content .content-title{
     font-size: 20px;
     color: #48A3DA;
  }
   .chart{
     width: 100%;
     height: 250px;
     margin-right: 20px;
   }
   .indent{
     text-indent: 2em
   }
</style>


