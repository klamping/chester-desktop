<template>
  <Layout :style="{minHeight: '100vh'}">
    No Project Selected.<br><br>

    Create a project!

    <SystemInformation/>
  </Layout>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'

  export default {
    name: 'noproject',
    components: { SystemInformation }
  }
</script>

<style>
</style>
