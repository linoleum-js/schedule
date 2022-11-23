import React, { useEffect, useRef, useState } from 'react';
import { CSSProperties } from 'styled-components';

import { Point } from '@/models';

import styles from './IntervalMenu.module.css';

export interface IntervalMenuItem {
  name: string;
  action?: () => void;
  submenu?: IntervalMenuItem[];
  attrs?: {
    color: string;
  };
}

export interface IntervalMenuProps {
  items: IntervalMenuItem[];
  positionGlobal: Point;
  positionRelative: Point;
}

const menuSize = 150;

export const IntervalMenu = (props: IntervalMenuProps) => {
  const { items, positionGlobal, positionRelative } = props;
  const [openSubmenuName, setOpenSubmenuName] = useState<string|null>(null);
  const domNode = useRef<HTMLUListElement>(null);

  const onItemClick = (item: IntervalMenuItem) => {
    const { action, submenu, name } = item;
    if (!submenu) {
      action?.();
      return;
    }

    setOpenSubmenuName(name);
  };

  const getPositionStyle = (): CSSProperties => {
    const css: CSSProperties = {};
    let left = positionRelative.x - menuSize / 2;
    const right = positionGlobal.x + menuSize / 2;
    const availableVSpace = document.documentElement.clientWidth - right - 20;
    if (availableVSpace < 0) {
      left += availableVSpace;
    }
    css.left = left;
    
    const bottom = positionGlobal.y + menuSize + 20;
    const availableHSpace = document.documentElement.clientHeight - bottom;
    if (availableHSpace < 0) {
      css.top = 'auto';
      css.bottom = '100%';
    }
    return css;
  };

  let currentItems = items;
  if (openSubmenuName) {
    currentItems = items.find((item) => item.name === openSubmenuName)!.submenu!;
  }

  const handleClick = (event: React.PointerEvent) => {
    event.stopPropagation();
  };

  return (
    <ul
      className={styles.intervalContextMenu}
      onPointerDown={handleClick}
      ref={domNode}
      style={getPositionStyle()}
    >
      {currentItems.map((item: IntervalMenuItem) => {
        const { name, attrs } = item;
        return (
          <li
            onClick={() => onItemClick(item)}
            key={name}
          >
            {name}
            {attrs && (
              <span
                className={styles.intervalContextMenuColor}
                style={{ backgroundColor: attrs.color }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};
