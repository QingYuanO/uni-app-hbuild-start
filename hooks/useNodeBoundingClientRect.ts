export function useNodeBoundingClientRect(selectors: string[]) {
  const results = ref<Record<string, UniApp.NodeInfo>>({});

  const getNodes = () => {
    const query = uni.createSelectorQuery();
    selectors.forEach((selector) => {
      query.select(`#${selector}`).boundingClientRect((data) => {
        results.value[selector] = data as UniApp.NodeInfo;
      }).exec();
    });
  };
  onMounted(() => {
    nextTick(() => {
      getNodes();
    });
  });

  return { nodeInfos: results, getNodes };
}
