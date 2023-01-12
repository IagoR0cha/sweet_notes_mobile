import { useContext, createContext, ReactElement, useRef } from "react";
import { RootSiblingParent } from 'react-native-root-siblings';
import Toast from "react-native-root-toast";

import { useTheme } from "./theme";

type LayoutType = 'error' | 'warning' | 'info' | 'success';
type Duration = 'long' | 'short';

type Layout = {
  backgroundColor: string;
  color: string;
}

type LayoutMap = {
  [key in LayoutType]: Layout;
}

type ToastProviderData = {
  show: (label: string, type: LayoutType, duration?: Duration, position?: number) => void;
}

type Props = {
  children: ReactElement;
}

type ToastQueue = {
  label: string
  type: LayoutType
  duration?: Duration
  position?: number
}

export const ToastContext = createContext({} as ToastProviderData);

function ToastProvider({ children }: Props) {
  const currentToast = useRef();
  const toastQueue = useRef<ToastQueue[]>([]);

  const { theme } = useTheme();

  const mapLayoutType: LayoutMap = {
    error: { backgroundColor: '#F44336', color: theme.primaryTextLight },
    info: { backgroundColor: '#3649F4', color: theme.primaryTextLight },
    warning: { backgroundColor: '#E4A400', color: theme.primaryTextLight },
    success: { backgroundColor: '#009834', color: theme.primaryTextLight }
  };

  function layoutControl(type: LayoutType) {
    return mapLayoutType[type];
  }

  function handleDuration(value?: Duration) {
    switch (value) {
      case 'long':
        return Toast.durations.LONG;
      case 'short':
        return Toast.durations.SHORT;
      default:
        return Toast.durations.SHORT;
    }
  }

  function show(label: string, type: LayoutType, duration?: Duration, position?: number) {
    const newToast: ToastQueue = { label, type, duration, position };
    const currentToastQueue = [...toastQueue.current, newToast];
    toastQueue.current = currentToastQueue;

    if (toastQueue.current.length === 1) {
      showToast();
    }
  }

  function handleProcessQueue() {
    const currentToastQueue = [...toastQueue.current];
    currentToastQueue.shift();
    toastQueue.current = currentToastQueue;

    if (currentToastQueue.length) {
      showToast();
    }
  }

  function showToast() {
    const { label, type, duration, position } = toastQueue.current[0];
    const currentDuration = handleDuration(duration);

    currentToast.current = Toast.show(label, {
      backgroundColor: layoutControl(type).backgroundColor,
      textColor: layoutControl(type).color,
      duration: currentDuration,
      position: position ?? Toast.positions.TOP,
      onHide: () => {
        handleProcessQueue()
      }
    })
  }

  return (
    <RootSiblingParent>
      <ToastContext.Provider value={{ show }}>
        { children }
      </ToastContext.Provider>
    </RootSiblingParent>
  )
}

function useToast() {
  return useContext(ToastContext);
}

export { ToastProvider, useToast };