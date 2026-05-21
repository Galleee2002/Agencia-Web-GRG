"use client";

import { ChevronDown } from "lucide-react";
import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
import { createPortal } from "react-dom";

import { useIsClient } from "@/hooks/useIsClient";

import type { ContactSelectOption } from "./contactFormData";
import styles from "./ContactSection.module.scss";

const ICON_STROKE = 1.75;
const MENU_GAP_PX = 6;

type ServiceSelectProps = {
  id: string;
  name: string;
  value: string;
  options: ContactSelectOption[];
  placeholder: string;
  required?: boolean;
  onChange: (value: string) => void;
};

type MenuPosition = {
  top: number;
  left: number;
  width: number;
};

export function ServiceSelect({
  id,
  name,
  value,
  options,
  placeholder,
  required,
  onChange,
}: ServiceSelectProps) {
  const listboxId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [menuPosition, setMenuPosition] = useState<MenuPosition | null>(null);
  const mounted = useIsClient();

  const selected = options.find((opt) => opt.value === value);
  const displayLabel = selected?.label ?? placeholder;
  const isPlaceholder = !selected;

  const close = useCallback(() => {
    setOpen(false);
    setActiveIndex(-1);
    setMenuPosition(null);
  }, []);

  const updateMenuPosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;

    const rect = trigger.getBoundingClientRect();
    setMenuPosition({
      top: rect.bottom + MENU_GAP_PX,
      left: rect.left,
      width: rect.width,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;
    updateMenuPosition();
  }, [open, updateMenuPosition]);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const root = rootRef.current;
      const menu = menuRef.current;
      if (root?.contains(target) || menu?.contains(target)) return;
      close();
    };

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };

    const onLayoutChange = () => updateMenuPosition();

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onLayoutChange);
    window.addEventListener("scroll", onLayoutChange, true);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onLayoutChange);
      window.removeEventListener("scroll", onLayoutChange, true);
    };
  }, [open, close, updateMenuPosition]);

  const selectOption = (option: ContactSelectOption) => {
    onChange(option.value);
    close();
  };

  const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen((prev) => !prev);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1,
      );
    }
  };

  const handleListKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev < options.length - 1 ? prev + 1 : 0,
      );
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((prev) =>
        prev > 0 ? prev - 1 : options.length - 1,
      );
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      const option = options[activeIndex];
      if (option) selectOption(option);
    }
  };

  const menuStyle: CSSProperties | undefined = menuPosition
    ? {
        top: menuPosition.top,
        left: menuPosition.left,
        width: menuPosition.width,
      }
    : undefined;

  const menu =
    open && menuPosition && mounted ? (
      <ul
        ref={menuRef}
        id={listboxId}
        role="listbox"
        aria-labelledby={id}
        className={styles.customSelectMenu}
        style={menuStyle}
        onKeyDown={handleListKeyDown}
      >
        {options.map((option, index) => {
          const isSelected = option.value === value;
          const isActive = index === activeIndex;

          return (
            <li
              key={option.value}
              role="presentation"
              className={styles.customSelectOptionItem}
              style={{ animationDelay: `${0.05 + index * 0.04}s` }}
            >
              <button
                type="button"
                role="option"
                aria-selected={isSelected}
                className={styles.customSelectOption}
                data-active={isActive ? "true" : "false"}
                data-selected={isSelected ? "true" : "false"}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => selectOption(option)}
              >
                {option.label}
              </button>
            </li>
          );
        })}
      </ul>
    ) : null;

  return (
    <div
      ref={rootRef}
      className={styles.customSelect}
      data-open={open ? "true" : "false"}
    >
      <input
        type="hidden"
        name={name}
        value={value}
        required={required}
        tabIndex={-1}
        aria-hidden
      />

      <button
        ref={triggerRef}
        type="button"
        id={id}
        className={styles.customSelectTrigger}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        data-placeholder={isPlaceholder ? "true" : "false"}
        onClick={() => setOpen((prev) => !prev)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span className={styles.customSelectValue}>{displayLabel}</span>
        <ChevronDown
          className={styles.customSelectChevron}
          size={18}
          strokeWidth={ICON_STROKE}
          aria-hidden
        />
      </button>

      {menu && mounted ? createPortal(menu, document.body) : null}
    </div>
  );
}
