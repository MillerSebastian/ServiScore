import { useEffect } from "react";

declare global {
  interface Window {
    chatbase?: any;
  }
}

const ChatbaseWidget = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.chatbase && window.chatbase("getState") === "initialized") return;

    window.chatbase = (...args: any[]) => {
      if (!window.chatbase.q) window.chatbase.q = [];
      window.chatbase.q.push(args);
    };
    window.chatbase = new Proxy(window.chatbase, {
      get(target, prop) {
        if (prop === "q") return target.q;
        return (...args: any[]) => target(prop, ...args);
      },
    });

    const onLoad = function () {
      const script = document.createElement("script");
      script.src = "https://www.chatbase.co/embed.min.js";
      script.id = "9f4V2jar9Q9_gB85DhJq1";
      // @ts-ignore: domain no es una propiedad estándar, pero el script original lo incluye
      (script as any).domain = "www.chatbase.co";
      document.body.appendChild(script);
    };
    if (document.readyState === "complete") {
      onLoad();
    } else {
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);
  return null;
};

export default ChatbaseWidget;
