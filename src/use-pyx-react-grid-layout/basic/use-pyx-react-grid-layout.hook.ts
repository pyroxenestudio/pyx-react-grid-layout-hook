import React from "react";
import { ILayout, IOptions } from '../use-pyx-react-grid-layout.interface'
import { TItems } from "../use-pyx-react-grid-layout.types";

const usePyxReactGridLayout = (options: IOptions) => {
  const loggerName: string = '[usePyxReactGridLayout] ';
  const {
    height,
    col,
    rows,
    items,
    skipInit = false,
  } = options;
  const sizeItem: number = Math.floor(col/rows);

  // STATES
  const [layout, setLayout] = React.useState<ILayout[]>(options.layout ?? []);
  const [hiddenItems, setHiddenItems] = React.useState<TItems>(options.hiddenItems ?? []);

  const getLastItem = () => {
    if (layout.length) {
      const sortedLayout = layout.slice();
      sortedLayout.sort((a: any, b: any) => b.y - a.y || b.x - a.x);
      return sortedLayout[0];
    }
    return false;
  }

  /**
   * Add a new item for the layout
   * @param name string
   * @returns void
   */
  const addItem = (name: string): void => {
    const draftLayout = layout.slice();
    if (draftLayout.find((item: ILayout) => item.i === name)) {
      console.error(loggerName, 'Name repeated');
      return;
    }
    draftLayout.push(createItemLayout(name, draftLayout.length));
    setLayout(draftLayout);
  }

  /**
   * Remove a item of the layout
   * @param name string
   * @returns void
   */
  const removeItem = (name: string): void => {
    if (name) {
      const draftLayout = layout.filter((item: ILayout) => item.i !== name);
      setLayout(draftLayout);
    }
  }

  /**
   * Hide an item
   * @param name string
   * @returns void
   */
  const hideItem = (name: string): void => {
    if (name) {
      const draftHiddenItems = hiddenItems.slice();
      draftHiddenItems.push(name);
      setHiddenItems(draftHiddenItems);
      removeItem(name);
    }
  }

  /**
   * Show a item by the name that is hidden
   * @param name string
   * @returns void
   */
  const showHiddenItem = (name: string) => {
    if (name) {
      const draftHiddenItems = hiddenItems.filter((item: string) => item !== name);
      setHiddenItems(draftHiddenItems);
      addItem(name);
    }
  }

  const getSizeItem = (col: number, rows: number): number => Math.floor(col/rows);

  /**
   * Create a item for the layout
   * @param name string
   * @param position number
   * @returns ILayout
   */
  const createItemLayout = (name: string, position: number): ILayout => {
    return {
      x: (position * sizeItem) % col,
      y: Math.floor((position / rows)) * height,
      w: sizeItem,
      h: height,
      i: name
    }
  }

  /**
   * Create the layout
   * @param items TItems
   * @returns void
   */
  const createLayout = (items: TItems): void => {
    if (items.length) {
      const draftLayout = items.map((item: string, index: number) => createItemLayout(item, index));
      console.log(draftLayout);
      setLayout(draftLayout);
    }
  }

  /**
   * Reset the layout
   * @returns void
   */
  const resetLayout = () => {
    if (layout?.length) {
      const newLayout = layout.map((item: any, index: number) => createItemLayout(item.i, index));
      setLayout(newLayout);
    }
  }

  // const sortByZ = (layout: any) => {
  //   layout.sort((a: any,b: any) => a.z - b.z);
  // }

  // const zIndexUp = (index: number) => {
  //   const draftLayout = layout.slice();
  //   draftLayout[index].z += 1;
  //   sortByZ(draftLayout);
  //   setLayout(draftLayout);
  // }

  // const zIndexDown = (index: number) => {
  //   const draftLayout = layout.slice();
  //   draftLayout[index].z -= 1;
  //   if (draftLayout[index].z < 0) {
  //     draftLayout[index].z = 0;
  //   }
  //   sortByZ(draftLayout);
  //   setLayout(draftLayout);
  // }

  // const setFirst = (name: string, index?: number) => {
  //   const draftLayout = layout.slice();
  //   if (!index) {
  //     index = draftLayout.findIndex((item: any) => item.i === name);
  //   }
  //   const item = draftLayout.splice(index, 1)[0];
  //   draftLayout.push(item);
  //   setLayout(draftLayout);
  // }

  const checkErrors = (): boolean => {
    let ok = true;
    if (col && col % 2 !== 0) {
      console.error(loggerName, 'Col must be par');
      ok = false;
    }

    if (col && col/rows - getSizeItem(col, rows) !== 0){
      console.error(loggerName, 'Col and Rows error');
      ok = false;
    }

    return ok;
  }

  /**
   * Insert an already created layout
   * @param layout The layout
   * @param items an array with the names
   * @returns void
   */
  const insertLayout = (layout: any, items: any) => {
    if (layout && items) {
      let flatLayout: any = layout.map((item: any) => items.i);
      const draftHiddenItems = items.filter((item: any) => flatLayout.indexOf(item) === -1);
      setHiddenItems(draftHiddenItems);
      setLayout(layout);
    }
  }

  const insertItems = (items: TItems): void => {
    if (items?.length) {
      createLayout(items);
    }
  }

  // Constructor
  React.useEffect(() => {
    if (!checkErrors()) return;
    if (!layout?.length && !skipInit && items) {
      createLayout(items);
    }
  }, []);

  return {
    layout,
    items: {
      addItem,
      hideItem,
      getLastItem,
      showHiddenItem,
      hiddenItems,
      insertItems
    },
    resetLayout,
    updateLayout: setLayout,
    insertLayout,
  }
}

export default usePyxReactGridLayout;