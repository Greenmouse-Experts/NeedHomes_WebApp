import { Menu } from "lucide-react";
import { useEffect, useState, useRef, type ReactNode } from "react";
import { usePopper } from "react-popper";
import Portal from "./Portal";
import { useNavigate } from "@tanstack/react-router"; // Import useNavigate
import ThemeProvider from "@/simpleComps/ThemeProvider";
export type Actions<T = any> = {
  key: string;
  label: string;
  action: (item: T, nav: ReturnType<typeof useNavigate>) => any;
  render?: (item: T) => ReactNode | string;
  disabled?: boolean;
};
type currentIndex = number;
export default function PopUp<T>(props: {
  actions: Actions<T>[];
  item: any;
  currentIndex: currentIndex | null;
  setIndex: (index: number | null) => void;
  itemIndex: number;
}) {
  const [referenceElement, setReferenceElement] =
    useState<HTMLDivElement | null>(null);
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );
  const [isOpen, setIsOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const nav = useNavigate(); // Get the useNavigate instance

  const togglePopup = () => {
    if (props.itemIndex === props.currentIndex) {
      return setIsOpen(true);
    }
    return setIsOpen(false);
  };

  useEffect(() => {
    togglePopup();
  }, [props.currentIndex]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        referenceElement &&
        !referenceElement.contains(event.target as Node)
      ) {
        props.setIndex(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, props.setIndex, referenceElement]);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-end",
    modifiers: [
      {
        name: "offset",
        options: {
          offset: [0, 8],
        },
      },
    ],
  });
  const openPopup = () => {
    props.setIndex(props.itemIndex);
  };
  return (
    <>
      <div
        data-theme="nh-light"
        ref={setReferenceElement}
        onClick={openPopup}
        className="btn btn-circle btn-ghost "
      >
        <Menu size={20} className="label" />
      </div>
      <Portal>
        {isOpen && (
          <div
            data-theme="nh-light"
            ref={(el) => {
              setPopperElement(el);
              popupRef.current = el;
            }}
            className="shadow-lg border border-current/20 rounded-xl bg-base-100 z-50 "
            style={{
              ...styles.popper,
              width: "150px",
            }}
            {...attributes.popper}
          >
            <div className="menu w-full">
              {props?.actions?.map((action) => {
                if (action.disabled) {
                  return null;
                }
                return (
                  <>
                    {" "}
                    <li key={action.key}>
                      <a
                        onClick={() => action.action(props.item, nav)}
                        className="text-xs"
                      >
                        {action.render
                          ? action.render(props.item)
                          : action.label}
                      </a>
                    </li>
                  </>
                );
              })}
            </div>
          </div>
        )}
      </Portal>
    </>
  );
}
