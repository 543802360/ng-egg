export function tree2array(node: any[], id, name, parentNode) {
  const stack = node;
  const data = [];
  while (stack.length !== 0) {
    const pop = stack.pop();
    data.push({
      id: pop[id],
      name: pop[name],
      parent_id: pop[parentNode] ? pop[parentNode][id] : null,
      parent_name: pop[parentNode] ? pop[parentNode][name] : null,
    });
    const children = pop.children
    if (children) {
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }
  return data;
};

