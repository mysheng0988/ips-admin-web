<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" size="small">
      <div>
        <el-form-item label="测评内容">
          <el-select  placeholder="全部" v-model="listQuery.examinationId" clearable class="input-width">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button icon="el-icon-search" type="success"  @click="queeryList">查  询</el-button>
        </el-form-item>
      </div>

    </el-form>
    <div class="table-container">
      <el-table ref="productCateTable"
                style="width: 100%"
                :data="list"
                v-loading="listLoading" border>
        <el-table-column label="序号" width="100" align="center">
          <template slot-scope="scope">{{scope.$index+1}}</template>
        </el-table-column>
         <el-table-column label="患者姓名" align="center">
          <template slot-scope="scope">{{scope.row.patientVO.realName}}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.createTime}}</template>
        </el-table-column>
        <el-table-column label="测评内容" align="center">
          <template slot-scope="scope">{{scope.row.examinationTypeCode|formatName }}</template>
        </el-table-column>
        <el-table-column label="测评状态"  align="center">
          <template slot-scope="scope">{{scope.row.examinationStatus|formatStatus }}</template>
        </el-table-column>
        <el-table-column label="测评师"  align="center">
          <template slot-scope="scope">
            {{scope.row.currentRealName}}
          </template>
        </el-table-column>

        <el-table-column label="测评科室" align="center">
          <template slot-scope="scope">{{scope.row.currentDeptName }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              class="active"
              @click="readReport(scope.row)">
               <svg-icon icon-class="see-icon" class-name="search-icon"></svg-icon>查看报告
            </el-button>

          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        layout="total, sizes,prev, pager, next,jumper"
        :page-size="listQuery.pageSize"
        :page-sizes="[5,10,15]"
        :current-page.sync="listQuery.pageNum"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {medicalRecordPatientList} from '@/api/medicalRecord'
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: "assessRecord",
    data() {
      return {
        list: [],
        listLoading: false,
        total:0,
        options:[{
          label:"筛查测评",
          value:1,
        },{
          label:"专科测评",
          value:2,
        },{
          label:"综合测评",
          value:3,
        }],
        listQuery: {
          examinationId: "",
          examinationStatus: "100",
          patientId: "",
          pageNum: 1,
          pageSize: 10
        },
      }
    },
    created() {

      this.getList()
    },
    filters:{
      formatStatus(val){
        let str="待完成"
        if(val==100){
          str="已完成"
        }else if(val==0){
           str="待测评"
        }
        return str
      },
      formatName(val){
        let str="筛查测评"
        if(val==20002){
          str="专科测评"
        }else if(val==20003){
          str="综合测评"
        }
        return str
      }
    },
    methods: {
      readReport(data){
       
        let path=data.examinationTypeCode=="20001"?"siftPdf":"pdf";
        this.$router.push({
          path: '/rep/'+path,
          query: {
            id: data.id,
            name:data.patientVO.realName,
            createTime:data.createTime.substring(0,10)+" 00:00:00"
          }
        })
      },
      queeryList(){
        this.getList();
      },
      getList(){
        this.listLoading=true;
        this.listQuery.patientId=this.$route.query.id;
        medicalRecordPatientList(this.listQuery).then(res=>{
          this.listLoading=false;
          if(res.code==200){
            this.list=res.dataList;
            this.total=res.pageInfo.total;
          }else{
             this.list=[]
             this.$message.warning("没有查到历史记录")
          }

         }).catch(error => {
            this.listLoading=false;
         })
      },
      handleSizeChange(val) {
        this.listQuery.pageNum = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNum = val;
        this.getList();
      },


    },

  }
</script>

<style scoped>
  .active{
    border:1px solid #1197D6;
    color: #1197D6;
  }
</style>
