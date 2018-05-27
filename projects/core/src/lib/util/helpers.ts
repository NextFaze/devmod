export const toTitle = (item: string) =>
  item[0].toUpperCase() + item.slice(1).replace(/([A-Z])/g, ' $1');

export const functionName = (fn: Function): string => {
  const extract = (value: string) => value.match(/^function ([^\(]*)\(/);

  const name: string = (<any>fn).name;
  if (name == null || name.length === 0) {
    const match = extract(fn.toString());
    if (match != null && match.length > 1) {
      return match[1];
    }
    return fn.toString();
  }
  return name;
};
