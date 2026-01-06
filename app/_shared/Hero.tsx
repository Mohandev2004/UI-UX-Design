"use client";

import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { ChevronRight, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { suggestions } from "../data/suggestions";
import { useState } from "react";
import { Value } from "@radix-ui/react-select";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { set } from "mongoose";
import axios from "axios";

export default function Hero() {

  const [userInput, setUserInput] = useState<string>()
  const [device, setDevice] = useState<string>('website')
  const { user } = useUser();
  const router = useRouter();
  const [loading, setLoading] = useState(false);


  const onCreateProject = async () => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!userInput) return;

    try {
      setLoading(true);
      const projectId = crypto?.randomUUID?.() ?? Math.random().toString(36).substring(2, 10);

      await axios.post("/api/project", {
        userInput,
        device,
        projectId,
      });

      router.push("/project/" + projectId);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative h-screen w-full overflow-hidden">
      <BackgroundRippleEffect />

      <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 overflow-hidden">
        <div className="flex w-full max-w-6xl flex-col items-center gap-8 text-center">

          <div
            className={cn(
              "group rounded-full border border-black/5 bg-neutral-100 text-base text-white transition-all ease-in hover:cursor-pointer hover:bg-neutral-200 dark:border-white/5 dark:bg-neutral-900 dark:hover:bg-neutral-800"
            )}
          >
            <AnimatedShinyText className="inline-flex items-center justify-center px-4 py-1 transition ease-out hover:text-neutral-600 hover:duration-300 hover:dark:text-neutral-400">
              <span>✨ Introducing Magic UI</span>
              <ChevronRight className="ml-1 size-3 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
            </AnimatedShinyText>
          </div>

          <div className="w-full max-w-6xl">
            <h2 className="text-5xl font-bold leading-tight md:text-6xl">
              Design High Quality Website and
              <span className="block">Mobile App Designs</span>
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-muted-foreground">
              From websites to mobile apps, we turn ideas into intuitive,
              high-impact digital experiences.
            </p>
          </div>

          <div className="grid w-full max-w-md gap-6">
            <InputGroup>
              <InputGroupTextarea
                data-slot="input-group-control"
                className="flex field-sizing-content min-h-16  w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                placeholder="Enter what design you want to create"
                value={userInput}
                onChange={(event) => setUserInput(event.target?.value)}
              />
              <InputGroupAddon align="block-end">
                <Select defaultValue="website" onValueChange={(Value) => setDevice(Value)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                  </SelectContent>
                </Select>
                <InputGroupButton className="ml-auto" size="sm" variant="default"
                  onClick={() => onCreateProject()}>
                  <Send />
                </InputGroupButton>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <div className="flex gap-4 mt-2 flex-wrap justify-center">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="p-3 border rounded-2xl flex flex-col items-center bg-white dark:bg-neutral-800 z-10 max-w-[140px] text-center cursor-pointer"
                onClick={() => setUserInput(suggestion?.description)}
              >
                <span className="text-lg">{suggestion?.icon}</span>
                <span className="text-sm line-clamp-2">{suggestion?.name}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
