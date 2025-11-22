declare global {
  interface CustomResponseData<D = any> {
    code: number;
    msg: string;
    data: D;
  }

  interface PaginationData<D = any> {
    items: D[];
    page: number;
    size: number;
    total: number;
  }

  interface CommonParams { data: Record<string, any> }

  type PromiseResponse<D = any> = Promise<CustomResponseData<D>>;

  interface IOption {
    label: string;
    value: string | number;
  }
  interface IDictOption {
    label: string;
    value: string;
    englishValue: string;
    dataGroup: string;
  }

  type SearchType = Record<string, any>;

  interface ListParams {
    pageNum: number;
    pageSize: number;
    search?: SearchType;
  }

  interface ListData<D> {
    items: D[];
    total: number;
  }

  interface MetaData {
    showLoading?: boolean;
    loadingText?: string;
    showErrorToast?: boolean;
    delay?: number;
    [key: string]: any;
  }

  /**
   * 请求数据类型
   */
  interface AipRequest {

  }

  /**
   * 返回数据类型
   */
  interface AipResponse {
    getSingleImg: any;
  }
}

declare module "@uni-helper/uni-network" {
  interface UnConfig {
    meta?: MetaData;
  }
}

// 声明导出
export {};
