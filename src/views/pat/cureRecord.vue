<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" size="small">
      <div>
        <el-form-item label="测评内容">
          <el-select  placeholder="全部" clearable class="input-width">
            <option></option>
          </el-select>
        </el-form-item>
        <el-form-item label="测评状态">
          <el-select  placeholder="全部" clearable class="input-width">
            <option>未治疗</option>
            <option>治疗中</option>
            <option>已完成</option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" round>查  询</el-button>
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
        <el-table-column label="创建时间" align="center">
          <template slot-scope="scope">{{scope.row.className}}</template>
        </el-table-column>
        <el-table-column label="治疗项目" align="center">
          <template slot-scope="scope">{{scope.row.goodsAmount }}</template>
        </el-table-column>
        <el-table-column label="治疗状态"  align="center">
          <template slot-scope="scope">{{scope.row.goodsUnit }}</template>
        </el-table-column>
        <el-table-column label="治疗师"  align="center">
          <template slot-scope="scope">
            {{scope.row.navState}}
          </template>
        </el-table-column>

        <el-table-column label="治疗科室" align="center">
          <template slot-scope="scope">{{scope.row.classSort }}</template>
        </el-table-column>
        <el-table-column label="操作" width="200"  align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              round
              class="active"
              @click="handleUpdate(scope.$index, scope.row)">查看记录
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
        :current-page.sync="listQuery.currentPage"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {queryCustomClass,
          deleteCustomClass,
          saveCustomClass} from '@/api/classify'
  import { Message, MessageBox } from 'element-ui'
  export default {
    name: "customClass",
    data() {
      return {
        contentState:null,
        radio:null,
        list: null,
        shopList:[],
        listLoading: false,
        total:0,
        listQuery: {
          shopId:null,
          currentPage: 1,
          pageSize: 10
        },
      }
    },
    created() {
    },

    methods: {
      clearState(){
        this.listQuery.shopId=null;
        //this.getList();
      },
      shopSelect(){
        this.getList();
      },
      resetParentId(){
        if (this.$route.query.parentId != null) {
          this.parentId = this.$route.query.parentId;
        } else {
          this.parentId = 0;
        }
      },
      getList(){
        queryCustomClass(this.listQuery).then(res=>{
          if(res.code!=0){
            Message.warning(res.code)
          }
          this.list=res.data.items;
          this.total=res.data.totalNum;
        })
      },
      handleAddProductCate() {
        this.$router.push('/pms/addCustomClass');
      },
      handleSizeChange(val) {
        this.listQuery.currentPage = 1;
        this.listQuery.pageSize = val;
        this.getList();
      },
      handleCurrentChange(val) {
        this.listQuery.currentPage = val;
        this.getList();
      },
      handleNavStatusChange(index, row) {
        saveCustomClass(row).then(res=>{
          this.getList();
        })
      },
      handleTransferProduct(index, row) {
        console.log('handleAddProductCate');
      },
      handleUpdate(index, row) {
        this.$router.push({path:'/pms/updateCustomClass',query:{id:row.id}});
      },
      handleDelete(index, row) {
        this.$confirm('是否要删除该品牌', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteCustomClass(row.id).then(response => {
            this.$message({
              message: '删除成功',
              type: 'success',
              duration: 1000
            });
            this.getList();
          });
        });
      }
    },

  }
</script>

<style scoped>
  .active{
    border:1px solid #1197D6;
    color: #1197D6;
  }
</style>
