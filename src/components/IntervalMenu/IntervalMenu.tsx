import { useState } from 'react';
import { find } from 'lodash';

import styles from './ScheduleIntervalContextMenu.module.css';

export interface IntervalMenuItem {
  name: string;
  label: string;
  onClick?: () => void;
  submenu?: IntervalMenuItem[];
  attrs?: {
    color: string;
  };
}
455 + 674 // 1185
export interface IntervalMenuProps {
  items: IntervalMenuItem[]
}

export const IntervalMenu = (props: IntervalMenuProps) => {
  const { items } = props;
  const [openSubmenuName, setOpenSubmenuName] = useState<string|null>(null);

  const onItemClick = (item: IntervalMenuItem) => {
    const { onClick, submenu, name } = item;
    if (!submenu) {
      onClick!();
      return;
    }

    setOpenSubmenuName(name);
  };

  let currentItems: IntervalMenuItem[] = items;
  if (openSubmenuName) {
    currentItems = find(items, { name: openSubmenuName })!.submenu!;
  }

  return <ul
    className={styles.ScheduleIntervalContextMenu}
  >
    {currentItems.map((item: IntervalMenuItem) => {
      // TODO rename attrs
      // TODO refactor
      const { onClick, label, name, attrs, submenu } = item;
      return <li
        onClick={() => onItemClick(item)}
        key={name}
      >
        {label}
        {attrs &&
          <span
            className={styles.ScheduleIntervalContextMenuColor}
            style={{ backgroundColor: attrs.color }}
          ></span>
        }
      </li>;
    })}
  </ul>;
};
