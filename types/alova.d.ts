import "alova";

declare module "alova" {
  export interface AlovaCustomTypes {
    meta: {
      hasLoading?: boolean;
      hasErrorTip?: boolean;
      loadingText?: string;
    };
  }
}
