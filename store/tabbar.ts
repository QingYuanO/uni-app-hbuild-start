export interface TabbarItem {
  path: string;
  value?: number;
  active: boolean;
  title: string;
  icon: string;
}

const tabbarItems = ref<TabbarItem[]>([
  { path: "pages/index/index", active: true, title: "首页", icon: "home" },
  { path: "pages/my/index", active: false, title: "我的", icon: "user" },
]);

export function useTabbar() {
  const tabbarList = computed(() => tabbarItems.value);

  const activeTabbar = computed(() => {
    const item = tabbarItems.value.find(item => item.active);
    return item || tabbarItems.value[0];
  });

  const getTabbarItemValue = (path: string) => {
    const item = tabbarItems.value.find(item => item.path === path);
    return item?.value;
  };

  const setTabbarItem = (path: string, value: number) => {
    const tabbarItem = tabbarItems.value.find(item => item.path === path);
    if (tabbarItem) {
      tabbarItem.value = value;
    }
  };

  const setTabbarItemActive = (path: string) => {
    tabbarItems.value.forEach((item) => {
      if (item.path === path) {
        item.active = true;
      }
      else {
        item.active = false;
      }
    });
  };

  return {
    tabbarList,
    activeTabbar,
    getTabbarItemValue,
    setTabbarItem,
    setTabbarItemActive,
  };
}
