import { ref } from "vue";

export const ModalDialogState = ref<{
  shown: boolean;
  title: string;
  text?: string;
  callbackPositive?:() => void;
  buttonTextPositive?: string;
  callbackNegative?: () => void;
  buttonTextNegative?: string;
    }>({
      shown: false,
      title: "",
      callbackPositive: () => {
        console.log("not Implemented");
      },
      buttonTextPositive: "",
    });

export function showModalDialog(
  title: string,
  text: string,
  callbackPositive?: () => void,
  buttonTextPositive?: string,
  callbackNegative?: () => void,
  buttonTextNegative?: string,
) {
  console.log("show Modal", title, buttonTextPositive);
  ModalDialogState.value.shown = true;
  ModalDialogState.value.title = title;
  ModalDialogState.value.text = text;
  ModalDialogState.value.callbackPositive = callbackPositive;
  ModalDialogState.value.buttonTextPositive = buttonTextPositive;
  ModalDialogState.value.callbackNegative = callbackNegative;
  ModalDialogState.value.buttonTextNegative = buttonTextNegative;
}
