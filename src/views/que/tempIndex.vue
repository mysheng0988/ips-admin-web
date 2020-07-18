<template>
  <div class="app-container">
    <div class="table-container">
      <el-table
        ref="productCateTable"
        style="width: 100%"
        :data="list"
        v-loading="listLoading"
        stripe
        border
      >
        <el-table-column label="模板编号" align="center" width="120">
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="模板名称" align="center" width="200">
          <template slot-scope="scope">{{scope.row.name}}</template>
        </el-table-column>
         <el-table-column label="模板指导语" align="center" >
          <template slot-scope="scope">{{scope.row.instruction }}</template>
        </el-table-column>
         <el-table-column label="限制条件" align="center" width="180">
          <template slot-scope="scope">{{scope.row.condition }}</template>
        </el-table-column>
        <el-table-column label="类型" align="center" width="120">
          <template slot-scope="scope">{{scope.row.type |formatType }}</template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="200">
          <template slot-scope="scope">{{scope.row.createTime }}</template>
        </el-table-column>
        <el-table-column width="200" label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              icon="el-icon-edit-outline"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              icon="el-icon-time"
              type="primary"
              plain
              @click="handleRead(scope.row)"
            >查看</el-button>
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
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { fetchListTemp}  from '@/api/questionnaireBank'
export default {
  name: "que-list",
  data() {
    return {
        list:[],
        listLoading:false,
        total:0,
        listQuery: {
        pageNum:1,
        pageSize: 10
      }
    };
  },
  created() {
      this.getList()
  },
  filters: {
   
    formatType(val) {
       switch (val) {
        case 0:
            return "正常";
        case 1:
            return "单选";
        case 2:
            return "答案多选";
        case 3:
            return "题目单选+单选";
        case 4:
            return "分类四";
        }
      return "";
    },
  },
  methods: {
    handleRead(data){
       this.$router.push({
        path: "/que/detail",
        query: {
          id: data.number,
          name:"查看"
        }
      });
    },
    handleEdit(data){
         this.$router.push({
        path: "/que/temp",
        query: {
          id: data.id,
          name:"修改"
        }
      });
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
    getList() {
        this.listLoading = true;
      fetchListTemp(this.listQuery)
        .then(res => {
          this.listLoading = false;
          if (res.code == 200) {
            this.list = res.dataList;
            this.total = res.pageInfo.total;
          } else {
            this.$message.warning("没有查到数据");
            this.list = [];
            this.total = 0;
          }
        })
        .catch(error => {
          this.listLoading = false;
        });
    }
  }
};
</script>
<style>
</style>