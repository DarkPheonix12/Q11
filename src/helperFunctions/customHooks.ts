import { useCallback, useEffect, useRef, useState } from "react";
import { isMobile, isTablet } from "react-device-detect";

export const useOnKeyboardOpen = () => {
  const [keyboardState, changeKeyboardState] = useState(false);
  const initialViewHeight = useRef(
    window.visualViewport && window.visualViewport.height
  );

  useEffect(() => {
    if ((isMobile || isTablet) && window && window.visualViewport) {
      const updateViewHeight = () => {
        const newViewHeight = window.visualViewport.height;
        if (initialViewHeight.current - newViewHeight > 30) {
          changeKeyboardState(true);
        } else if (initialViewHeight.current - newViewHeight <= 0) {
          changeKeyboardState(false);
        }
      };
      window.visualViewport.addEventListener("resize", updateViewHeight);

      return () =>
        window.visualViewport.removeEventListener("resize", updateViewHeight);
    }
  }, [initialViewHeight]);

  return [keyboardState];
};

export const useObserveIntersection = (
  funcToExec: (...params: any) => any | Promise<any>,
  functionParams?: any
) => {
  const observer = useRef<IntersectionObserver | null>(null);
  const refCallback = useCallback(
    (node: HTMLDivElement) => {
      // Should be passed as the desired elemnts ref
      observer.current && observer.current.disconnect();
      observer.current = new IntersectionObserver((observables) => {
        if (observables[0].isIntersecting)
          functionParams ? funcToExec(...functionParams) : funcToExec();
      });
      if (node) observer.current.observe(node);
    },
    [funcToExec, functionParams]
  );

  return [refCallback];
};

export const useHideOnOutsideElementClick = (
  elementRef: React.MutableRefObject<HTMLDivElement | null>,
  hideFunction?: React.Dispatch<React.SetStateAction<boolean>>
): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const [hide, setHide] = useState<boolean>(true);

  useEffect(() => {
    const hideLoginOnOutsideClick = (e: any) => {
      elementRef &&
      elementRef.current &&
      !elementRef.current.contains(e.target) &&
      hideFunction
        ? hideFunction(true)
        : setHide(true);
    };

    document.addEventListener("mousedown", hideLoginOnOutsideClick);

    return () => {
      document.removeEventListener("mousedown", hideLoginOnOutsideClick);
      hideFunction ? hideFunction(true) : setHide(true);
    };
  }, [elementRef, hideFunction]);

  return [hide, setHide];
};
