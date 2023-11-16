import DOMPurify from "dompurify";
import firebase from "firebase";

export const formatNumbers = (views: number): string => {
  const viewsString = views.toString();
  const viewsArray = viewsString.split("");
  if (
    viewsString.length === 4 ||
    viewsString.length === 5 ||
    viewsString.length === 6
  ) {
    viewsArray.pop();
    viewsArray.pop();
    viewsArray.pop();
    return `${viewsArray.join("")}k`;
  } else if (viewsString.length >= 7) {
    const limit =
      viewsString.length === 7
        ? viewsString.length - 1
        : viewsString.length === 8
        ? viewsString.length - 2
        : viewsString.length - 3;
    for (let i = 0; i < limit; i++) viewsArray.pop();
    return `${viewsArray.join("")}M`;
  } else {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
};

export const shortenText = (text: string, limiter: number): string => {
  const regex = new RegExp(`^(.{${limiter}}[^ ]*).*`);
  const newText = text.replace(regex, "$1");
  return newText;
};

export const getTextFromHTML = (
  htmlString: string,
  limiter?: number
): string => {
  const container = document.createElement("div");
  container.innerHTML = limiter ? shortenText(htmlString, limiter) : htmlString;
  if (!container.textContent) return "";
  const newText = container.textContent.trim() || container.innerText.trim();
  return newText;
};

export const removeExtraSpaces = (text: string): string => {
  const trimmedValue = text.replace(/\s+/g, " ");
  return trimmedValue;
};

export const getTimeFromSeconds = (seconds: number): string => {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  const dString = days > 0 ? `${days}d` : "";
  const hString = hours > 0 ? `${hours}hr` : "";
  const mString = `${minutes}m`;
  return `${dString} ${hString} ${mString}`;
};

export const getDateDifferenceString = (
  pastMilliseconds: number,
  compareToMilliseconds: number
): string => {
  const seconds = Math.floor((compareToMilliseconds - pastMilliseconds) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);
  const stringArray = ["ago"];

  const stringFromArray = (stringArray: string[]): string =>
    stringArray.toString().replaceAll(",", " ");

  if (years !== 0) {
    years === 1
      ? stringArray.unshift("1 year")
      : stringArray.unshift(`${years} years`);
    return stringFromArray(stringArray);
  }

  if (months !== 0) {
    months === 1
      ? stringArray.unshift("1 month")
      : stringArray.unshift(`${months} months`);
    return stringFromArray(stringArray);
  }

  if (days !== 0) {
    days === 1
      ? stringArray.unshift("1 day")
      : stringArray.unshift(`${days} days`);
    return stringFromArray(stringArray);
  }

  if (hours !== 0) {
    hours === 1
      ? stringArray.unshift("1 hour")
      : stringArray.unshift(`${hours} hours`);
    return stringFromArray(stringArray);
  }

  if (minutes > 0) {
    minutes === 1
      ? stringArray.unshift("1 minute")
      : stringArray.unshift(`${minutes} minutes`);
    return stringFromArray(stringArray);
  } else return "now";
};

const getDateFromFirestoreTimestamp = (timestamp: {
  seconds: number;
  nanoseconds: number;
}) => {
  const time = new firebase.firestore.Timestamp(
    timestamp.seconds,
    timestamp.nanoseconds
  );
  return time.toDate();
};

export const getFormattedDateString = (
  time: { seconds: number; nanoseconds: number } | number,
  dateType: "profileDate" | "cardDate" | "recentActivity" | "editPost"
) => {
  let dateString: string = "";
  let date: Date =
    typeof time === "number"
      ? new Date(time)
      : getDateFromFirestoreTimestamp(time);
  switch (dateType) {
    case "profileDate":
      dateString = `${date.toLocaleString("en-US", {
        month: "short",
      })} ${date.getFullYear()}`;
      break;

    case "cardDate":
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      dateString = `${month}/${day}/${year}`;
      break;

    case "recentActivity":
      dateString =
        typeof time === "number"
          ? getDateDifferenceString(time, Date.now())
          : "";
      break;

    case "editPost": {
      const day = date.getDate();
      const month = date.toLocaleString("en-US", {
        month: "short",
      });
      const year = date.getFullYear();
      dateString = `${month} ${day}, ${year}`;
      break;
    }
  }
  return dateString;
};

export const sanitizePostContent = (postContent: string): string => {
  const ALLOWED_TAGS = [
    "p",
    "h1",
    "h2",
    "h3",
    "em",
    "span",
    "strong",
    "ol",
    "ul",
    "li",
    "br",
    "i",
    "u",
  ];
  const ALLOWED_ATTR = ["style", "data-question-id"];
  return DOMPurify.sanitize(postContent, { ALLOWED_TAGS, ALLOWED_ATTR });
};

export const trimStringArray = (stringArray: string[]): string[] => {
  return stringArray.filter((s) => (s !== "#" || !s) && s.trim());
};

// Splits a large string into an array whoes each item fits the desired byte size
export const splitStringByByteSize = (
  string: string,
  byteSizeLimit: number = 100000
): string[] => {
  let stringBytes = new Blob([string]).size;
  let stringArray = [string];
  let splitStringArray: string[] = [];

  if (stringBytes < byteSizeLimit) return stringArray;

  while (stringBytes > byteSizeLimit) {
    splitStringArray = [];
    let itteration = 0;
    for (let i = 0; i < stringArray.length; i++) {
      const splitStringArrayIndex = i + itteration;
      itteration++;

      splitStringArray[splitStringArrayIndex] = stringArray[i].slice(
        0,
        stringArray[i].length / 2
      );

      splitStringArray[splitStringArrayIndex + 1] = stringArray[i].slice(
        stringArray[i].length / 2,
        stringArray[i].length
      );
    }

    stringArray = [...splitStringArray];
    stringBytes = new Blob([splitStringArray[0]]).size;
  }

  return stringArray;
};
