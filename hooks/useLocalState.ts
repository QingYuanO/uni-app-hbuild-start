export default function useLocalState<D = unknown>(key: string, defaultValue?: D): Ref<D> {
  const value = customRef<D>((track, trigger) => {
    return {
      get() {
        track();
        return uni.getStorageSync<D>(key) || defaultValue!;
      },
      set(newValue) {
        uni.setStorageSync(key, newValue);
        trigger();
      },
    };
  });

  onShow(() => {
    value.value = uni.getStorageSync<D>(key) || defaultValue!;
  });

  return value;
}
