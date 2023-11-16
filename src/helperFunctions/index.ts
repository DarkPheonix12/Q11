import { Procedure } from "../types";

export * from "./textFormatting";

export const getRequestLimitByWindowWidth = (
  limitFor: "posts" | "questions" | "answers" | "postQuestionAnswers"
): number => {
  const windowWidth = window.visualViewport && window.visualViewport.width;
  const breakpoints = [600, 960, 1200, 1600, 2560] as const;
  const breakpoint: typeof breakpoints[number] =
    breakpoints.find((breakpoint) => windowWidth <= breakpoint) ||
    breakpoints[breakpoints.length - 1];
  let limit: number;

  if (limitFor === "posts") {
    switch (breakpoint) {
      case 600:
        limit = 10;
        break;
      case 960:
        limit = 15;
        break;
      case 1200:
        limit = 20;
        break;
      case 1600:
        limit = 25;
        break;
      case 2560:
        limit = 40;
        break;
      default:
        limit = 10;
        break;
    }
  } else if (limitFor === "questions") limit = 10;
  else if (limitFor === "postQuestionAnswers") {
    switch (breakpoint) {
      case 600:
        limit = 10;
        break;
      case 960:
        limit = 15;
        break;
      case 1200:
        limit = 20;
        break;
      default:
        limit = 10;
        break;
    }
  } else limit = 10;
  return limit;
};
// Gets the name of the page from current URL path
export const getPageName = (currentPath: string): string => {
  const pathArray = currentPath.split("/");

  if (currentPath.match("/your-creations")) return "Your Creations";
  else if (currentPath.match("/discuss"))
    return pathArray[pathArray.length - 2];
  else return pathArray[pathArray.length - 1];
};
// Takes an array of objects and returns an array of objects that have unique values of the 'uniqueProperty'
export const makeArrayOfObjectsUnique = <T, K extends keyof T>(
  arr: T[],
  key: K
) => {
  return arr.filter((v, i, a) => a.findIndex((t) => t[key] === v[key]) === i);
};
// Adds the object to the array if the value of the unique property is not present in any other object in an array
export const addObjectToArrayIfUnique = <T, K extends keyof T>(
  arr: T[],
  obj: T,
  key: K
): T[] => {
  const keys = new Set(arr.map((item) => item[key]));
  return !keys.has(obj[key]) ? [obj, ...arr] : arr;
};

export const debounce = <F extends Procedure>(
  func: F,
  wait: number = 400
): ((...args: Parameters<F>) => void) => {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<F>) => {
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const throttle = <F extends Procedure>(
  func: F,
  wait: number = 100
): ((...args: Parameters<F>) => void) => {
  var waiting = false;
  return (...args: Parameters<F>) => {
    if (!waiting) {
      waiting = true;
      setTimeout(() => {
        func(...args);
        waiting = false;
      }, wait);
    }
  };
};
