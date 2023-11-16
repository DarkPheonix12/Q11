import { setNotification } from "../redux";
import store from "../redux/store";
import { getNotificationMessage } from "./customNotificationMessages";

export const shareLink = async (
  options: {
    addToUrl?: string;
    customUrl?: string;
    shareTitle?: string;
    shareText?: string;
  } = {}
) => {
  const href = window.location.href;
  const { addToUrl, customUrl, shareTitle, shareText } = options;
  const link = customUrl ? customUrl : addToUrl ? `${href}${addToUrl}` : href;

  try {
    await navigator.share({
      title: shareTitle,
      text: shareText,
      url: link,
    });
  } catch (err) {
    if (err.message !== "navigator.share is not a function")
      return console.error(err);
    navigator.clipboard.writeText(link);
    store.dispatch(
      setNotification({ text: getNotificationMessage("link-copied") })
    );
  }
};
