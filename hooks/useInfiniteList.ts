interface UseInfiniteListParams<D> {
  fetchListApi: (data: ListParams) => Promise<ListData<D>>;
  id?: string;
  defaultPageSize?: number;
  isAutoInitLoad?: boolean;
  isAutoFetchNext?: boolean;
}

function useInfiniteList<D = unknown>(option: UseInfiniteListParams<D>) {
  const { fetchListApi, defaultPageSize = 10, isAutoInitLoad, isAutoFetchNext } = option;
  const listParams = ref<ListParams>({
    pageNum: 1,
    pageSize: defaultPageSize,
  });
  const listData = shallowRef<ListData<D>>({
    items: [],
    total: 0,
  });
  const isInitLoading = ref<boolean>(false);
  const isFetchNext = ref<boolean>(false);
  const isFirstLoading = ref(true);

  const hasNextPage = computed(() => listData.value.total > listData.value.items.length);

  onLoad(() => {
    if (isAutoInitLoad) {
      initLoadList();
    }
  });

  onReachBottom(() => {
    if (isAutoFetchNext) {
      fetchNextPage();
    }
  });

  const initLoadList = async (externalSearch: SearchType = {}) => {
    if (isInitLoading.value)
      return;
    try {
      isInitLoading.value = true;
      const { search } = listParams.value;
      const realSearch = { ...(search ?? {}), ...externalSearch };

      listParams.value.pageNum = 1;

      const data = await fetchListApi({
        pageNum: 1,
        pageSize: defaultPageSize,
        ...realSearch,
      });

      listData.value = data;
      listParams.value = {
        pageNum: listParams.value.pageNum + 1,
        pageSize: listParams.value.pageSize,
        search: realSearch,
      };
    }
    catch (error) {
      console.log(error);
    }
    finally {
      isFirstLoading.value = false;
      isInitLoading.value = false;
    }
  };
  const fetchNextPage = async (externalSearch: SearchType = {}) => {
    if (!hasNextPage.value || isFetchNext.value)
      return;
    try {
      isFetchNext.value = true;
      const { pageNum, pageSize, search } = listParams.value;
      const realSearch = { ...(search ?? {}), ...externalSearch };
      const data = await fetchListApi({
        pageNum,
        pageSize,
        ...realSearch,
      });
      isFetchNext.value = false;
      listData.value = {
        ...data,
        items: listData.value.items.concat(data.items),
      };
      listParams.value = {
        pageNum: pageNum + 1,
        pageSize,
        search: realSearch,
      };
    }
    catch (error) {
      isFetchNext.value = false;
      console.log(error);
    }
  };

  return {
    listData,
    isFetchNext,
    listParams,
    isInitLoading,
    isFirstLoading,
    hasNextPage,
    fetchNextPage,
    initLoadList,
  };
}

export default useInfiniteList;
