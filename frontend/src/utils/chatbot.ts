export const CHAT_OPEN_EVENT = "remit:open-chat";

export function openChatbot(prompt?: string) {
  window.dispatchEvent(new CustomEvent(CHAT_OPEN_EVENT, { detail: { prompt } }));
}
