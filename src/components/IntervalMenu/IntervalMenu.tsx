import React, { useState } from 'react';
import { find } from 'lodash';

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
}

export const IntervalMenu = (props: IntervalMenuProps) => {
  const { items } = props;
  const [openSubmenuName, setOpenSubmenuName] = useState<string|null>(null);

  const onItemClick = (item: IntervalMenuItem) => {
    const { action, submenu, name } = item;
    if (!submenu) {
      action!();
      return;
    }

    setOpenSubmenuName(name);
  };

  let currentItems = items;
  if (openSubmenuName) {
    currentItems = find(items, { name: openSubmenuName })!.submenu!;
  }

  const handleClick = (event: React.PointerEvent) => {
    event.stopPropagation();
  };

  return (
    <ul className={styles.IntervalContextMenu} onPointerDown={handleClick}>
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
                className={styles.IntervalContextMenuColor}
                style={{ backgroundColor: attrs.color }}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};
