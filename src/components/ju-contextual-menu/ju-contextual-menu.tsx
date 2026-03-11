import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import './ju-contextual-menu.css';

/* ============================================
   Types
   ============================================ */

export interface JUContextualMenuItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Icon (React node, e.g. Lucide icon) */
  icon?: React.ReactNode;
  /** Keyboard shortcut label (e.g. "⌘K") */
  shortcut?: string;
  /** Section header above this item */
  section?: string;
  /** Danger style (red text, red hover) */
  danger?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Sub-items — opens a submenu panel */
  children?: JUContextualMenuSubItem[];
  /** Callback on click */
  onClick?: () => void;
}

export interface JUContextualMenuSubItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export interface JUContextualMenuProps {
  /** Menu items */
  items: JUContextualMenuItem[];
  /** Trigger element — the menu opens on click */
  trigger: React.ReactElement;
  /** Show search bar at top */
  searchable?: boolean;
  /** Search placeholder */
  searchPlaceholder?: string;
  /** Submenu search placeholder */
  subSearchPlaceholder?: string;
  /** Placement relative to trigger */
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  /** Close menu on item click (default true) */
  closeOnSelect?: boolean;
  /** Controlled open state */
  open?: boolean;
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void;
  /** Additional CSS class */
  className?: string;
}

/* ============================================
   Helpers
   ============================================ */

function getMenuPosition(
  triggerRect: DOMRect,
  placement: JUContextualMenuProps['placement'],
  menuWidth: number,
  menuHeight: number,
) {
  const gap = 6;
  let top: number;
  let left: number;

  switch (placement) {
    case 'top-start':
      top = triggerRect.top - menuHeight - gap;
      left = triggerRect.left;
      break;
    case 'top-end':
      top = triggerRect.top - menuHeight - gap;
      left = triggerRect.right - menuWidth;
      break;
    case 'bottom-end':
      top = triggerRect.bottom + gap;
      left = triggerRect.right - menuWidth;
      break;
    case 'bottom-start':
    default:
      top = triggerRect.bottom + gap;
      left = triggerRect.left;
      break;
  }

  // Clamp within viewport
  if (top + menuHeight > window.innerHeight - 8) top = triggerRect.top - menuHeight - gap;
  if (top < 8) top = 8;
  if (left + menuWidth > window.innerWidth - 8) left = window.innerWidth - menuWidth - 8;
  if (left < 8) left = 8;

  return { top, left };
}

/* ============================================
   Component
   ============================================ */

export const JUContextualMenu: React.FC<JUContextualMenuProps> = ({
  items,
  trigger,
  searchable = false,
  searchPlaceholder = 'Search actions...',
  subSearchPlaceholder = 'Search...',
  placement = 'bottom-start',
  closeOnSelect = true,
  open: controlledOpen,
  onOpenChange,
  className,
}) => {
  const isControlled = controlledOpen !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const [search, setSearch] = useState('');
  const [subSearch, setSubSearch] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [activeSubmenuId, setActiveSubmenuId] = useState<string | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const subSearchRef = useRef<HTMLInputElement>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const setOpen = useCallback((value: boolean) => {
    if (!isControlled) setInternalOpen(value);
    onOpenChange?.(value);
  }, [isControlled, onOpenChange]);

  // Filtered items
  const filteredItems = useMemo(() => {
    if (!search) return items;
    const q = search.toLowerCase();
    return items.filter((item) => item.label.toLowerCase().includes(q));
  }, [items, search]);

  // Flat list for keyboard nav (skip sections)
  const focusableItems = filteredItems;

  // Open handler — compute position from trigger rect
  const handleOpen = useCallback(() => {
    if (isOpen) {
      setOpen(false);
      return;
    }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (rect) {
      // Estimate menu size for initial position
      setPosition(getMenuPosition(rect, placement, 260, 360));
    }
    setOpen(true);
    setSearch('');
    setSubSearch('');
    setFocusedIndex(-1);
    setActiveSubmenuId(null);
  }, [isOpen, placement, setOpen]);

  // Reposition after menu mounts (with real size)
  useEffect(() => {
    if (isOpen && menuRef.current && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const menuRect = menuRef.current.getBoundingClientRect();
      setPosition(getMenuPosition(rect, placement, menuRect.width, menuRect.height));
    }
  }, [isOpen, placement, filteredItems.length]);

  // Focus search on open
  useEffect(() => {
    if (isOpen && searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [isOpen, searchable]);

  // Focus sub-search when submenu opens
  useEffect(() => {
    if (activeSubmenuId) {
      requestAnimationFrame(() => subSearchRef.current?.focus());
    }
  }, [activeSubmenuId]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        subMenuRef.current && !subMenuRef.current.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
      // Close if clicking outside menu but not on submenu
      if (
        menuRef.current && !menuRef.current.contains(target) &&
        !subMenuRef.current?.contains(target) &&
        triggerRef.current && !triggerRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, setOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeSubmenuId) {
          setActiveSubmenuId(null);
        } else {
          setOpen(false);
        }
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, activeSubmenuId, setOpen]);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const count = focusableItems.length;
    if (!count) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev + 1;
          while (next < count && focusableItems[next].disabled) next++;
          return next >= count ? prev : next;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && focusableItems[next].disabled) next--;
          return next < 0 ? prev : next;
        });
        break;
      case 'ArrowRight': {
        const item = focusableItems[focusedIndex];
        if (item?.children?.length) {
          setActiveSubmenuId(item.id);
        }
        break;
      }
      case 'ArrowLeft':
        if (activeSubmenuId) setActiveSubmenuId(null);
        break;
      case 'Enter': {
        e.preventDefault();
        const item = focusableItems[focusedIndex];
        if (item && !item.disabled) {
          if (item.children?.length) {
            setActiveSubmenuId(item.id);
          } else {
            item.onClick?.();
            if (closeOnSelect) setOpen(false);
          }
        }
        break;
      }
    }
  }, [focusableItems, focusedIndex, activeSubmenuId, closeOnSelect, setOpen]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusedIndex >= 0) {
      itemRefs.current.get(focusedIndex)?.scrollIntoView({ block: 'nearest' });
    }
  }, [focusedIndex]);

  // Compute submenu position
  const getSubMenuStyle = (): React.CSSProperties => {
    if (!menuRef.current) return {};
    const menuRect = menuRef.current.getBoundingClientRect();
    const subWidth = 240;
    const spaceRight = window.innerWidth - menuRect.right;

    if (spaceRight >= subWidth + 8) {
      return { top: menuRect.top, left: menuRect.right + 6 };
    }
    return { top: menuRect.top, left: menuRect.left - subWidth - 6 };
  };

  // Get active submenu item
  const activeSubmenuItem = activeSubmenuId ? items.find((i) => i.id === activeSubmenuId) : null;
  const filteredSubItems = useMemo(() => {
    if (!activeSubmenuItem?.children) return [];
    if (!subSearch) return activeSubmenuItem.children;
    const q = subSearch.toLowerCase();
    return activeSubmenuItem.children.filter((c) => c.label.toLowerCase().includes(q));
  }, [activeSubmenuItem, subSearch]);

  // Build section groups for rendering
  const renderItems = () => {
    let lastSection: string | undefined;
    return filteredItems.map((item, index) => {
      const showSection = item.section && item.section !== lastSection;
      if (item.section) lastSection = item.section;

      return (
        <React.Fragment key={item.id}>
          {showSection && (
            <>
              {index > 0 && <div className="ju-ctx__divider" />}
              <div className="ju-ctx__section">{item.section}</div>
            </>
          )}
          <button
            ref={(el) => { if (el) itemRefs.current.set(index, el); }}
            className={[
              'ju-ctx__item',
              item.danger ? 'ju-ctx__item--danger' : '',
              item.disabled ? 'ju-ctx__item--disabled' : '',
              focusedIndex === index ? 'ju-ctx__item--focused' : '',
              activeSubmenuId === item.id ? 'ju-ctx__item--active' : '',
            ].filter(Boolean).join(' ')}
            role="menuitem"
            disabled={item.disabled}
            tabIndex={-1}
            onMouseEnter={() => {
              setFocusedIndex(index);
              if (item.children?.length) {
                setActiveSubmenuId(item.id);
                setSubSearch('');
              } else {
                setActiveSubmenuId(null);
              }
            }}
            onClick={() => {
              if (item.disabled) return;
              if (item.children?.length) {
                setActiveSubmenuId(item.id);
                return;
              }
              item.onClick?.();
              if (closeOnSelect) setOpen(false);
            }}
          >
            {item.icon && <span className="ju-ctx__item-icon" aria-hidden="true">{item.icon}</span>}
            <span className="ju-ctx__item-label">{item.label}</span>
            {item.shortcut && <kbd className="ju-ctx__item-shortcut">{item.shortcut}</kbd>}
            {item.children && (
              <svg className="ju-ctx__item-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            )}
          </button>
        </React.Fragment>
      );
    });
  };

  const menuContent = isOpen ? (
    <>
      {/* Main menu */}
      <div
        ref={menuRef}
        className={['ju-ctx', className ?? ''].filter(Boolean).join(' ')}
        role="menu"
        style={{ top: position.top, left: position.left }}
        onKeyDown={handleKeyDown}
      >
        {searchable && (
          <div className="ju-ctx__search">
            <svg className="ju-ctx__search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={searchRef}
              type="text"
              className="ju-ctx__search-input"
              placeholder={searchPlaceholder}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setFocusedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              aria-label="Search menu actions"
            />
          </div>
        )}
        <div className="ju-ctx__list">
          {filteredItems.length === 0 ? (
            <div className="ju-ctx__empty">No results</div>
          ) : (
            renderItems()
          )}
        </div>
      </div>

      {/* Submenu */}
      {activeSubmenuItem?.children && (
        <div
          ref={subMenuRef}
          className="ju-ctx ju-ctx--sub"
          role="menu"
          style={getSubMenuStyle()}
        >
          {activeSubmenuItem.children.length > 4 && (
            <div className="ju-ctx__search">
              <svg className="ju-ctx__search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                ref={subSearchRef}
                type="text"
                className="ju-ctx__search-input"
                placeholder={subSearchPlaceholder}
                value={subSearch}
                onChange={(e) => setSubSearch(e.target.value)}
                aria-label="Search submenu"
              />
            </div>
          )}
          <div className="ju-ctx__list">
            {filteredSubItems.map((child) => (
              <button
                key={child.id}
                className="ju-ctx__item"
                role="menuitem"
                tabIndex={-1}
                onClick={() => {
                  child.onClick?.();
                  if (closeOnSelect) setOpen(false);
                }}
              >
                {child.icon && <span className="ju-ctx__item-icon" aria-hidden="true">{child.icon}</span>}
                <span className="ju-ctx__item-label">{child.label}</span>
              </button>
            ))}
            {filteredSubItems.length === 0 && (
              <div className="ju-ctx__empty">No results</div>
            )}
          </div>
        </div>
      )}

      {/* Backdrop (invisible) */}
      <div className="ju-ctx__backdrop" aria-hidden="true" onClick={() => setOpen(false)} />
    </>
  ) : null;

  return (
    <>
      <div
        ref={triggerRef}
        className="ju-ctx__trigger"
        onClick={handleOpen}
        style={{ display: 'inline-flex' }}
      >
        {trigger}
      </div>
      {menuContent && createPortal(menuContent, document.body)}
    </>
  );
};

JUContextualMenu.displayName = 'JUContextualMenu';
