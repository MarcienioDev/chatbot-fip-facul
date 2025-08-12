"use client";

import { SendIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useState, useEffect, useRef } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

export function Chat() {
  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <Card className="w-96 h-150 grid grid-rows-[min-content_1fr_min-content]">
      <CardHeader>
        <CardTitle>FIPIA</CardTitle>
        <CardDescription>
          Seu orientador vocacional
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="flex gap-2 text-slate-600 text-sm">
            {message.role === "user" && (
              <Avatar>
                <AvatarFallback>AL</AvatarFallback>
                <AvatarImage />
              </Avatar>
            )}
            {message.role === "assistant" && (
              <Avatar>
                <AvatarFallback>FIPIA</AvatarFallback>
                <AvatarImage src={"/fipinho.png"} />
              </Avatar>
            )}
            <p className="leading-relaxed mt-1">
              <span className="block font-bold text-slate-700">
                {message.role === "user" ? "Aluno:" : "FIPIA:"}
              </span>
              {message.parts.map((part, i) =>
                part.type === "text" ? <span key={i}>{part.text}</span> : null
              )}
            </p>
          </div>
        ))}

        {(status === "submitted" || status === "streaming") && (
          <div className="flex gap-2 items-center">
            {status === "submitted" && (
              <span className="text-xs text-gray-500">Carregando...</span>
            )}
            <Button
              type="button"
              size="sm"
              variant="destructive"
              onClick={stop}
            >
              Parar
            </Button>
          </div>
        )}

        <div ref={chatEndRef} />
      </CardContent>

      <CardFooter>
        <form className="w-full flex gap-2" onSubmit={handleSubmit}>
          <Input
            placeholder="Digite sua mensagem"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== "ready"}
          />
          <Button type="submit" disabled={status !== "ready"}>
            <SendIcon />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
