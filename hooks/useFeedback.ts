import type FeedbackProvider from "@/components/provider/feedback-provider/index.vue";
import { useParent } from "./useParent";

export function useFeedback(name: string = "ContainerZPaging") {
  const toast = useToast("global-toast");
  const messageBox = useMessage("global-message-box");

  const feedbackProviderRef = ref<InstanceType<typeof FeedbackProvider>>();

  useParent(name, feedbackProviderRef);

  const getToast = () => {
    return feedbackProviderRef.value?.toast() ?? toast;
  };

  const getMessageBox = () => {
    return feedbackProviderRef.value?.messageBox() ?? messageBox;
  };

  return {
    toast: getToast(),
    messageBox: getMessageBox(),
  };
}
