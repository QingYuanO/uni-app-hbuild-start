// 业务相关的类型

declare global {
  export interface IUser {
    id: string;
    name: string;
    phone: string;
    country: string;
    countryName?: string;
    city: string;
    provinceName: string;
    cityName: string;
    address: string;
    email: string;
    currentState: string;
    createdTime: string;
    province: string;
    updateBy: string;
    updateByName?: string;
    updateTime: string;
    pddWarehouseCode: string;
    pddWarehouseName: string;
    customerId: string;
    passportNum: string;
    isFirstReferrer: boolean;
  }
}

// 声明导出
export {};
