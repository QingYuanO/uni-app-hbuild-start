// 获取指定名称的父组件实例，并将其暴露的属性赋值给传入的 Ref
export function useParent(name: string, r: Ref) {
  const instance = getCurrentInstance();
  console.log(instance);

  if (instance) {
    let parent = instance.proxy?.$.parent;

    // 遍历父组件链，直到找到匹配的组件名称
    while (parent && parent.type?.name !== name) {
      parent = parent?.parent;
    }

    // 如果找到匹配的父组件，将其暴露的属性赋值给 Ref
    if (parent && parent.type.name === name) {
      r.value = parent.exposed;
    }
  }

  return r;
}
