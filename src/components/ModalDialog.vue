<template>
  <teleport to="body">
    <div
      v-if="ModalDialogState.shown"
      class="blocker"
      @click="toggleDialog()"
    />
    <div
      v-if="ModalDialogState.shown"
      class="dialog"
    >
      <h2>{{ ModalDialogState.title }}</h2>
      <div v-if="ModalDialogState.text">
        {{ ModalDialogState.text }}
      </div>
      <slot />
      <div id="buttons">
        <button
          v-if="ModalDialogState.buttonTextPositive"
          class="dialog-close"
          @click="
            () => {
              toggleDialog();
              if (ModalDialogState.callbackPositive) ModalDialogState.callbackPositive();
            }
          "
        >
          {{ ModalDialogState.buttonTextPositive }}
        </button>
        <button
          v-if="ModalDialogState.buttonTextNegative"
          class="dialog-close"
          @click="()=>{
            toggleDialog()
            if (ModalDialogState.callbackNegative) ModalDialogState.callbackNegative();
          }"
        >
          {{ ModalDialogState.buttonTextNegative }}
        </button>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ModalDialogState } from "../modalDialogStatic";

function toggleDialog() {
  ModalDialogState.value.shown =! ModalDialogState.value.shown;
}

</script>

<style lang="scss" scoped>
  .blocker{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    width: 100%;
    height: 100%;

    z-index: 1;
    background-color: #1111;
  }
  .dialog {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    background-color: #6d6d6d;
    border: solid 4px #1c1c1c;

    border-radius: 2rem;
    padding: 1rem;
    margin: auto;

    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    width: min-content;
    height: min-content;
    min-width: 20rem;
    min-height: 10rem;

    #buttons{
      margin-top: 2rem;
      button{
        margin-inline: 1rem;
      }
    }
  }
</style>

