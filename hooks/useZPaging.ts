import type ContainerPaging from "@/components/container-paging/index.vue";

interface UseZPagingProps<D> {
  fetchListApi: (data: ListParams & { from: ZPagingEnums.QueryFrom }) => Promise<ListData<D>>;
}

function useZPaging<D = unknown>(option: UseZPagingProps<D>) {
  const { fetchListApi } = option;
  const containerPagingRef = ref<InstanceType<typeof ContainerPaging>>();

  const list = ref<D[]>([]);
  const total = ref<number>(0);
  const isLoading = ref<boolean>(false);

  // @query所绑定的方法不要自己调用！！需要刷新列表数据时，只需要调用paging.value.reload()即可
  const queryList = (pageNo: number, pageSize: number, from: ZPagingEnums.QueryFrom) => {
    // 组件加载时会自动触发此方法，因此默认页面加载时会自动触发，无需手动调用
    // 这里的pageNo和pageSize会自动计算好，直接传给服务器即可
    // 模拟请求服务器获取分页数据，请替换成自己的网络请求
    isLoading.value = true;
    fetchListApi({
      pageNum: pageNo,
      pageSize,
      from,
    }).then((res) => {
      // 将请求的结果数组传递给z-paging
      total.value = res.total;
      containerPagingRef.value?.getPagingRef()?.complete(res.items);
    }).catch((res) => {
      // 如果请求失败写paging.value.complete(false);
      // 注意，每次都需要在catch中写这句话很麻烦，z-paging提供了方案可以全局统一处理
      // 在底层的网络请求抛出异常时，写uni.$emit('z-paging-error-emit');即可
      containerPagingRef.value?.getPagingRef()?.complete(false);
    }).finally(() => {
      isLoading.value = false;
    });
  };

  return {
    list,
    total,
    isLoading,
    containerPagingRef,
    queryList,
  };
}

export default useZPaging;
