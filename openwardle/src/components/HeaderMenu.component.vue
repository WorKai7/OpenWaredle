<template>
    <header>
        <div>
            <img src="/assets/logo.png" alt="Logo">
            <p id="logo-title">OpenWaredle</p>
        </div>

        <div>
            <n-button quaternary size="large">
                Se connecter
            </n-button>

            <n-button quaternary size="large">
                S'inscrire
            </n-button>
        </div>
    </header>
</template>




<script lang="ts" setup>

</script>




<style scoped>
    header {
        display: flex;
        justify-content: space-between;
        border-bottom: 2px solid lightgray;
        padding: 0 10px;
    }

    div {
        display: flex;
        align-items: center;
    }

    img {
        width: 75px;
    }

    #logo-title {
        font-size: 20px;
    }
</style>