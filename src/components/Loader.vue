<script setup>
import useLoading from './useLoading'

const loader = useLoading()

// 
</script>

<template>
  <div
    v-show="loader.isLoading"
    id="loading-bg"
  >
    <div class="loading-logo">
      <!-- SVG Logo -->
      <svg
        width="86"
        height="48"
        viewBox="0 0 34 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M0.00183571 0.3125V7.59485C0.00183571 7.59485 -0.141502 9.88783 2.10473 11.8288L14.5469 23.6837L21.0172 23.6005L19.9794 10.8126L17.5261 7.93369L9.81536 0.3125H0.00183571Z"
          fill="var(--initial-loader-color)"
        />
        <path
          opacity="0.06"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.17969 17.7762L13.3027 3.75173L17.589 8.02192L8.17969 17.7762Z"
          fill="#161616"
        />
        <path
          opacity="0.06"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.58203 17.2248L14.8129 5.24231L17.6211 8.05247L8.58203 17.2248Z"
          fill="#161616"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M8.25781 17.6914L25.1339 0.3125H33.9991V7.62657C33.9991 7.62657 33.8144 10.0645 32.5743 11.3686L21.0179 23.6875H14.5487L8.25781 17.6914Z"
          fill="var(--initial-loader-color)"
        />
      </svg>
    </div>
    <div class=" loading">
      <div class="effect-1 effects" />
      <div class="effect-2 effects" />
      <div class="effect-3 effects" />
    </div>
  </div>
</template>


<style scoped>
  body {
    margin: 0;
  }

  html {
    overflow-x: hidden;
    overflow-y: scroll;
  }

  #loading-bg {
    position: absolute;
    z-index: 1000000;
    display: block;
    backdrop-filter: blur(2px);
    background: transparent !important;
    block-size: 100%;
    inline-size: 100%;
  }

  .loading-logo {
    position: absolute;
    inset-block-start: 40%;
    inset-inline-start: calc(50% - 45px);
  }

  .loading {
    position: absolute;
    box-sizing: border-box;
    border: 3px solid transparent;
    border-radius: 50%;
    block-size: 55px;
    inline-size: 55px;
    inset-block-start: 50%;
    inset-inline-start: calc(50% - 35px);
  }

  .loading .effect-1,
  .loading .effect-2,
  .loading .effect-3 {
    position: absolute;
    box-sizing: border-box;
    border: 3px solid transparent;
    border-radius: 50%;
    block-size: 100%;
    border-inline-start: 3px solid var(--initial-loader-color, #eee);
    inline-size: 100%;
  }

  .loading .effect-1 {
    animation: rotate 1s ease infinite;
  }

  .loading .effect-2 {
    animation: rotate-opacity 1s ease infinite 0.1s;
  }

  .loading .effect-3 {
    animation: rotate-opacity 1s ease infinite 0.2s;
  }

  .loading .effects {
    transition: all 0.3s ease;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(1turn);
    }
  }

  @keyframes rotate-opacity {
    0% {
      opacity: 0.1;
      transform: rotate(0deg);
    }

    100% {
      opacity: 1;
      transform: rotate(1turn);
    }
  }
</style>
