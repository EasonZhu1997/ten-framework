"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  RemotePropertyCfgSheet,
} from "@/components/Chat/ChatCfgPropertySelect";
import PdfSelect from "@/components/Chat/PdfSelect";
import {
  genRandomChatList,
  useAppDispatch,
  useAutoScroll,
  LANGUAGE_OPTIONS,
  useAppSelector,
  GRAPH_OPTIONS,
  isRagGraph,
  isEditModeOn,
} from "@/common";
import {
  setRtmConnected,
  addChatItem,
  setSelectedGraphId,
  setLanguage,
} from "@/store/reducers/global";
import MessageList from "@/components/Chat/MessageList";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { rtmManager } from "@/manager/rtm";
import { type IRTMTextItem, EMessageDataType, EMessageType, ERTMTextType } from "@/types";
import { RemoteGraphSelect } from "@/components/Chat/ChatCfgGraphSelect";
import { RemoteModuleCfgSheet } from "@/components/Chat/ChatCfgModuleSelect";
import { useEffect } from "react";

export default function ChatCard(props: { className?: string }) {
  const { className } = props;
  const [modal2Open, setModal2Open] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const rtmConnected = useAppSelector((state) => state.global.rtmConnected);
  const dispatch = useAppDispatch();
  const graphName = useAppSelector((state) => state.global.selectedGraphId);
  const agentConnected = useAppSelector((state) => state.global.agentConnected);
  const options = useAppSelector((state) => state.global.options);

  // const chatItems = genRandomChatList(10)
  const chatRef = React.useRef(null);

  useAutoScroll(chatRef);

  useEffect(() => {
    // 主动初始化 RTM
    if (options.channel && options.userId && options.appId && options.token) {
      console.log('[RTM] init with', options);
      rtmManager.init({
        channel: options.channel,
        userId: options.userId,
        appId: options.appId,
        token: options.token,
      });
    }
    const handler = (msg: IRTMTextItem) => {
      console.log('[RTM] rtmMessage event', msg);
      onTextChanged(msg);
      // 只要是 AI 回复（AGENT），就触发 ai-talking 事件
      if (msg.type === ERTMTextType.TRANSCRIBE && msg.stream_id !== String(options.userId)) {
        window.dispatchEvent(new Event('ai-talking'));
      }
      // 兼容：如果 type 是 AGENT 回复也触发
      if (msg.type === ERTMTextType.INPUT_TEXT && msg.stream_id !== String(options.userId)) {
        window.dispatchEvent(new Event('ai-talking'));
      }
    };
    rtmManager.on("rtmMessage", handler);
    return () => {
      rtmManager.off("rtmMessage", handler);
    };
  }, [options]);

  const onTextChanged = (text: IRTMTextItem) => {
    console.log("[rtm] onTextChanged", text);
    if (text.type == ERTMTextType.TRANSCRIBE) {
      // const isAgent = Number(text.uid) != Number(options.userId)
      dispatch(
        addChatItem({
          userId: options.userId,
          text: text.text,
          type: text.stream_id === "0" ? EMessageType.AGENT : EMessageType.USER,
          data_type: EMessageDataType.TEXT,
          isFinal: text.is_final,
          time: text.ts,
        })
      );
    }
    if (text.type == ERTMTextType.INPUT_TEXT) {
      dispatch(
        addChatItem({
          userId: options.userId,
          text: text.text,
          type: EMessageType.USER,
          data_type: EMessageDataType.TEXT,
          isFinal: true,
          time: text.ts,
        })
      );
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue) {
      return;
    }
    const msg = {
      userId: options.userId,
      text: inputValue,
      type: EMessageType.USER,
      data_type: EMessageDataType.TEXT,
      isFinal: true,
      time: Date.now(),
    };
    console.log('[RTM] sendText', inputValue, msg);
    rtmManager.sendText(inputValue, ERTMTextType.TRANSCRIBE);
    // 本地立即显示
    dispatch(addChatItem(msg));
    setInputValue("");
  };

  return (
    <>
      {/* Chat Card */}
      <div className={cn("h-full overflow-hidden min-h-0 flex", className)}>
        <div className="flex w-full flex-col p-4 flex-1">
          {/* Scrollable messages container */}
          <div className="flex-1 overflow-y-auto" ref={chatRef}>
            <MessageList />
          </div>
          {/* Input area */}
          <div className="border-t pt-4">
            <form onSubmit={handleInputSubmit} className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Type a message..."
                value={inputValue}
                onChange={handleInputChange}
                className="flex-grow rounded-md border bg-background p-1.5 focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                type="submit"
                disabled={inputValue.length === 0}
                size="icon"
                variant="outline"
                className="bg-transparent"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </form>
          </div>
        </div>
      </div>
    </>
  );

}
