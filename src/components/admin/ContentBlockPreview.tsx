"use client";
import React from "react";
import Image from "next/image";
import { ContentBlock } from "@/types/Blog";

interface ContentBlockPreviewProps {
  item: ContentBlock;
}

const ContentBlockPreview = ({ item }: ContentBlockPreviewProps) => {
  // Function to convert URLs to links in text
  const convertUrlsToLinks = (text: string): JSX.Element => {
    if (!text) return <></>;

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = text.split(urlRegex);

    return (
      <>
        {parts.map((part, index) => {
          if (urlRegex.test(part)) {
            return (
              <a
                key={index}
                href={part}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                {part}
              </a>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </>
    );
  };

  switch (item.type) {
    case "heading":
      return <h3 className="text-lg font-bold">{item.text}</h3>;
    case "code":
      return (
        <pre className="p-3 overflow-x-auto text-xs text-green-400 bg-gray-800 rounded">
          <code>{item.text}</code>
        </pre>
      );
    case "list":
      return (
        <ul className="space-y-1 list-disc list-inside">
          {item.items?.map((listItem, i) => (
            <li key={i} className="text-sm">
              {convertUrlsToLinks(listItem)}
            </li>
          ))}
        </ul>
      );
    case "image":
      return item.imageUrl ? (
        <div className="relative">
          <Image
            src={item.imageUrl}
            alt={item.text || "Content image"}
            width={400}
            height={300}
            className="w-full h-auto rounded-lg"
            unoptimized={true}
          />
          {item.text && (
            <p className="mt-2 text-sm italic text-gray-600">
              {convertUrlsToLinks(item.text)}
            </p>
          )}
        </div>
      ) : null;
    default:
      return <p className="text-sm">{convertUrlsToLinks(item.text || "")}</p>;
  }
};

export default ContentBlockPreview;
