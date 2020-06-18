<template> 
  <div class="item-box flex-center">
      <div class="chart"> 
         <ve-radar :data="chartData" :settings="chartSettings" :extend="extend"  width="100%" height="100%"></ve-radar>
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
    name: 'chart-radar',
    props: {
      data: {
          type: Object,
          default:{}
        },
    },
    data(){
      return {
        extend: {
          legend: {
            show:false,
          },
          radar:{
            radius: 60,
             indicator: [
            ]
          },
          series: {
            label: {
              normal: {
                show: true
              }
            }
          }
        },
        chartSettings:{
            label:{
              positon:"top"
            }
        },
        chartData: {
          columns: ['日期'],
          rows: [
            { '日期': '1' }
          ]
        }
      }
    },
    mounted(){
      for(let item of this.data.chartData){
        let param={
          name:item.name,
          max:item.max
        }
        this.extend.radar.indicator.push(param);
        this.chartData.columns.push(item.name);
        this.chartData.rows[0][item.name]=item.score;
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
     width: 250px;
     height: 180px;
     margin-right: 20px;
   }
</style>


