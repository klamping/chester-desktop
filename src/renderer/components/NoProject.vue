<template>
  <Layout :style="{minHeight: '100vh', padding: '16px'}">
    <Content>
      <p>No Project Selected.</p>

      <SystemInformation/>
    </Content>
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
