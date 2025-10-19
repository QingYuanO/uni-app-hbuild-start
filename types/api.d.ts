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

  /**
   * 请求数据类型
   */
  interface AipRequest {
    useLoginCustomer: {
      country: string;
      phone: string;
      password?: string;
      businessesCode: number;
      verificationCode?: string;
      notificationCode?: string;
    };
  }

  /**
   * 返回数据类型
   */
  interface AipResponse {
    useLoginCustomer: IUser;
  }
}

// 声明导出
export {};
