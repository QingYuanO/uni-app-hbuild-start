export function useFeedback() {
  const toast = useToast("global-toast");
  const messageBox = useMessage("global-message-box");

  return {
    toast,
    messageBox,
  };
}
