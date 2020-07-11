<template> 
  <div class="item-box">
      <div class="content">
          <div class="content-title">{{data.questionnaireName}}</div>
          <el-table
            :data="data.chartData"
            :show-header="false"
            style="width: 100%">
            <el-table-column v-for="(item,index) in dataKeys.length" :key="index" :width="index<2?100:''" align="center" >
              <template slot-scope="scope">{{scope.row['item'+[index]]}}</template>
            </el-table-column>
            <!-- <el-table-column>
              <template slot-scope="scope">{{scope.row.item1}}</template>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">{{scope.row.item2}}</template>
            </el-table-column> -->
          </el-table>
           <div v-for="(item,index) in data.explanation" :key="index">{{item}}</div>
      </div>
  </div>
</template>
<script>
  export default {
    name: 'scaleText',
    props: {
      data: {
          type: Object,
          default:{}
        },
    },
    data(){

      return {
        dataKeys:[],
      }
    },
    mounted(){

    this.dataKeys= Object.keys(this.data.chartData[0]);
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
     width: 240px;
     height: 200px;
     margin-right: 20px;
   }
   /* /deep/  */
</style>


