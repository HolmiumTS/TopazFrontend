<template>
  <el-main>
    <div class="rich" v-html="content"></div>
    <p class="comment"></p>
    <mavon-editor
      :value="value"
      :subfield="false"
      defaultOpen="preview"
      :toolbarsFlag="false"
      :editable="false"
      :scrollStyle="true"
      :ishljs="true"
      previewBackground="#eeeeff"
    ></mavon-editor>
  </el-main>
</template>
<script>
  export default {
    data() {
      return {
        id: "",
        content: "",
        comment: [{time: "8/14 11:45", name: "www", content: "123"}],
      };
    },
    methods: {},
    mounted() {
    },
  };
</script>
<style>
</style>
