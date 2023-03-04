import { TItems } from './use-pyx-react-grid-layout.types';

export interface ILayout {
  x: number,
  y: number,
  w: number,
  h: number,
  i: string
}

export interface IOptions {
  height: number,
  col: number,
  rows: number,
  items?: TItems,
  skipInit?: boolean,
  layout?: ILayout[],
  hiddenItems?: TItems
}