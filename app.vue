<template>
  <div>
    <label>Using the proxy</label>
    <input
      ref="fileInput"
      class="d-none"
      type="file"
      multiple
      @change="onFileChange"
    />
  </div>
  <div>
    <label>Without the proxy</label>
    <input
      ref="fileInput"
      class="d-none"
      type="file"
      multiple
      @change="onFileChangeNoProxy"
    />
  </div>
</template>
<script lang="ts" setup>
console.log('test4 ');
async function onFileChange(e) {
  console.log('test');
  const formData = new FormData();
  formData.append('file', e.target.files[0]);
  try {
    await $fetch<any>(`/api/upload`, {
      method: 'post',
      body: formData,
    });
  } catch (error) {
  } finally {
  }
}

async function onFileChangeNoProxy(e) {
  console.log('test');
  const formData = new FormData();
  formData.append('file', e.target.files[0]);
  try {
    await $fetch<any>(`/backend/api/upload`, {
      method: 'post',
      body: formData,
    });
  } catch (error) {
  } finally {
  }
}
</script>
