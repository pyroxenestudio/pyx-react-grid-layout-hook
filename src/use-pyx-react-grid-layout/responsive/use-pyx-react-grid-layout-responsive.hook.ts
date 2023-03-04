import React from "react";

const usePyxReactGridLayoutResponsive = (options: any) => {
  const loggerName = '[usePyxReactGridLayout] ';
  const {
    height,
    col,
    rows,
    breakpoints,
    breakpointsCol,
    skipInit = false
  } = options;
  // STATES
  const [layout, setLayout] = React.useState(options.layout ?? undefined);
  const [hiddenItems, setHiddenItems] = React.useState(options.hiddenItems ?? []);
  const [items, setItems] = React.useState(options.items ?? []);
  const [currentBreakpoint, setCurrentBreakpoint] = React.useState<string>('lg');

  const getLastItem = () => {
    if (layout.length) {
      const sortedLayout = layout.slice();
      sortedLayout.sort((a: any, b: any) => b.y - a.y || b.x - a.x);
      return sortedLayout[0];
    }
    return false;
  }

  const addItem = (name: string) => {
    const draftLayout = breakpoints ? Object.assign({}, layout) : layout.slice();
    const currentLayout = breakpoints ? draftLayout[currentBreakpoint] : draftLayout;
    if (currentLayout.find((item: any) => item.i === name)) {
      console.error(loggerName, 'Name repeated');
      return;
    }
    if (breakpoints) {
      Object.keys(breakpoints).forEach((bp) => {
        const draftLayoutArray = draftLayout[bp].slice();
        draftLayoutArray.push(createItemLayout(name, currentLayout.length, breakpointsCol[bp]));
        draftLayout[bp] = draftLayoutArray;
      });
    } else {
      draftLayout.push(createItemLayout(name, currentLayout.length));
    }
    setLayout(draftLayout);
  }

  const removeItem = (name: string) => {
    if (name) {
      if (breakpoints) {
        const draftLayout = Object.assign({}, layout)
        Object.keys(draftLayout).forEach((bp) => {
          draftLayout[bp] = draftLayout[bp].filter((item: any) => item.i !== name);
        });
        setLayout(draftLayout);
      } else {
        const draftLayout = layout.filter((item: any) => item.i !== name);
        setLayout(draftLayout);
      }
    }
  }

  const hideItem = (name: string) => {
    if (name) {
      const draftHiddenItems = hiddenItems.slice();
      draftHiddenItems.push(name);
      setHiddenItems(draftHiddenItems);
      removeItem(name);
    }
  }

  const showHiddenItem = (name: string) => {
    if (name) {
      const draftHiddenItems = hiddenItems.filter((item: any) => item !== name);
      setHiddenItems(draftHiddenItems);
      addItem(name);
    }
  }

  const getSizeItem = (col: number, rows: number) => Math.floor(col/rows);

  const createItemLayout = (name: string, position: number, bpCol?: any) => {
    const tempCol = bpCol?.col ?? col;
    const tempRows = bpCol?.rows ?? rows;
    const sizeItem = getSizeItem(tempCol, tempRows);
    return {
      x: (position * sizeItem) % tempCol,
      y: Math.floor((position / tempRows)) * height,
      w: sizeItem,
      h: height,
      i: name
    }
  }

  const createLayout = () => {
    if (items.length) {
      const draftLayout = items.map((item: any, index: number) => createItemLayout(item, index));
      console.log(draftLayout);
      setLayout(draftLayout);
    }
  }

  const createResponsiveLayout = () => {
    const draftLayout: any = {};
    Object.keys(breakpoints).forEach((breakpoint) => {
      draftLayout[breakpoint] = items.map((item: any, index: number) => createItemLayout(item, index, breakpointsCol[breakpoint]));
    });
    setLayout(draftLayout);
  }

  const resetLayout = () => {
    if (Array.isArray(layout) && layout?.length) {
      const newLayout: any = [];
      layout.forEach((item: any, index: number) => newLayout.push(createItemLayout(item.i, index)));
      setLayout(newLayout);
    } else {
      const draftLayout = Object.assign({}, layout);
      Object.keys(draftLayout).forEach((bp) => {
        draftLayout[bp] = draftLayout[bp].map((item: any, index: number) => createItemLayout(item.i, index, breakpointsCol[bp]));
      });
      setLayout(draftLayout);
    }
  }

  const sortByZ = (layout: any) => {
    layout.sort((a: any,b: any) => a.z - b.z);
  }

  const zIndexUp = (index: number) => {
    const draftLayout = layout.slice();
    draftLayout[index].z += 1;
    sortByZ(draftLayout);
    setLayout(draftLayout);
  }

  const zIndexDown = (index: number) => {
    const draftLayout = layout.slice();
    draftLayout[index].z -= 1;
    if (draftLayout[index].z < 0) {
      draftLayout[index].z = 0;
    }
    sortByZ(draftLayout);
    setLayout(draftLayout);
  }

  const setFirst = (name: string, index?: number) => {
    if (breakpoints) {

    } else {
      const draftLayout = layout.slice();
      if (!index) {
        index = draftLayout.findIndex((item: any) => item.i === name);
      }
      const item = draftLayout.splice(index, 1)[0];
      draftLayout.push(item);
      setLayout(draftLayout);
    }
  }

  const checkErrors = () => {
    let ok = true;
    if (col && col % 2 !== 0) {
      console.error(loggerName, 'Col must be par');
      ok = false;
    }

    if (col && col/rows - getSizeItem(col, rows) !== 0){
      console.error(loggerName, 'Col and Rows error');
      ok = false;
    }

    if (breakpoints && !breakpointsCol) {
      // Check here if it is a breakpointsCol
      console.error(loggerName, 'You have breakpoints but not columns');
      ok = false;
    }
    return ok;
  }

  /**
   * Insert an already created layout
   * @param layout The layout
   * @param items an array with the names
   */
  const insertLayout = (layout: any, items: any) => {
    if (layout && items) {
      let flatLayout: any = [];
      if (breakpoints) {
        const breakpoint = Object.keys(layout)[0]
        flatLayout = layout[breakpoint].map((item: any) => item.i);
      } else {
        flatLayout = layout.map((item: any) => items.i);
      }
      const draftHiddenItems = items.filter((item: any) => flatLayout.indexOf(item) === -1);
      setHiddenItems(draftHiddenItems);
      setLayout(layout);
    }
  }

  const insertItems = (items: any) => {
    if (items?.length) {
      setItems(items);
    }
  }

  // INIT
  React.useEffect(() => {
    if (!checkErrors()) return;
    if (!layout?.length && !skipInit) {
      if (breakpoints) {
        createResponsiveLayout();
      } else {
        createLayout();
      }
    }
  }, []);

  // INIT with new items
  React.useEffect(() => {
    if (breakpoints) {
      createResponsiveLayout();
    } else {
      createLayout();
    }
  }, [items]);

  // {
  //   layout,
  //   items: {
  //     addItem,
  //     hideItems,
  //     getLastItem,
  //     showHiddenItem,
  //     hiddenItems,
  //   },
  //   resetLayout,
  //   updateLayout,
  //   breakpoints: {
      
  //   }


  // }

  return {
    layout,
    currentBreakpoint,
    hiddenItems,
    addItem,
    getLastItem,
    updateLayout: setLayout,
    hideItem,
    showHiddenItem,
    resetLayout,
    setBreakpoint: setCurrentBreakpoint,
    setFirst,
    zIndexUp,
    zIndexDown,
    insertLayout,
    insertItems
  }
}

export default usePyxReactGridLayoutResponsive;