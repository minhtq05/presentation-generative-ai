"use client";

import { rgbaColorToString } from "@/lib/colors";
import useOverlayStore from "@/store/overlay-store";
import useScenesStore from "@/store/scenes-store";
import { SceneMedia, SceneText } from "@/types/scenes";
import { useDebounce } from "@uidotdev/usehooks";
import React, { useEffect, useRef } from "react";
import Moveable, {
  OnDrag,
  OnDragEnd,
  OnResize,
  OnResizeEnd,
} from "react-moveable";
import { Img, OffthreadVideo } from "remotion";

export default function ObjectOverlay() {
  const visibleOverlayId = useOverlayStore((state) => state.visibleOverlayId);
  const overlayObject = useOverlayStore((state) => state.overlayObject);
  const commitOverlayChanges = useScenesStore(
    (state) => state.commitOverlayChanges
  );
  const debouncedOverlayObject = useDebounce(overlayObject, 1000);

  useEffect(() => {
    commitOverlayChanges();
  }, [debouncedOverlayObject, commitOverlayChanges]);

  if (!visibleOverlayId || !overlayObject) {
    return null;
  }

  // Handle different types of objects
  switch (overlayObject.type) {
    case "scene-text":
      return (
        <TextOverlay
          key={overlayObject.id}
          textObject={overlayObject as SceneText}
        />
      );
    case "scene-media":
      return (
        <MediaOverlay
          key={overlayObject.id}
          mediaObject={overlayObject as SceneMedia}
        />
      );
    default:
      return null;
  }
}

function TextOverlay({ textObject }: { textObject: SceneText }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  const textStyle: React.CSSProperties = {
    position: "absolute",
    top: `${textObject.top}px`,
    left: `${textObject.left}px`,
    fontSize: `${textObject.fontSize}px`,
    fontFamily: textObject.fontFamily,
    color: rgbaColorToString(textObject.color),
    backgroundColor: rgbaColorToString(textObject.backgroundColor),
    textAlign: textObject.textAlign,
    fontWeight: textObject.fontWeight,
    fontStyle: textObject.fontStyle,
    textDecoration: textObject.textDecoration,
    textTransform: textObject.textTransform,
    width: `${textObject.width}px`,
    height: `${textObject.height}px`,
    display: "flex",
    justifyContent:
      textObject.textAlign === "left"
        ? "flex-start"
        : textObject.textAlign === "right"
        ? "flex-end"
        : "center",
    alignItems:
      textObject.textAlignVertical === "top"
        ? "flex-start"
        : textObject.textAlignVertical === "bottom"
        ? "flex-end"
        : "center",
    // padding: "8px",
    boxShadow: "0 0 0 2px rgba(30, 144, 255, 0.5)",
    borderRadius: "4px",
    zIndex: 1000,
    userSelect: "none", // Prevent text selection
    // transition: "all 0.1s ease", // Smooth transition for changes
  };

  return (
    <>
      <div
        ref={overlayRef}
        style={textStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {textObject.text || <p className="text-zinc-500">Enter text here...</p>}
      </div>
      <Moveable
        target={overlayRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        startDragRotate={0}
        throttleDragRotate={0}
        zoom={1.5}
        // dragging handler
        onDrag={(e: OnDrag) => {
          // Apply transform during drag for smooth visual feedback
          e.target.style.top = `${e.top}px`;
          e.target.style.left = `${e.left}px`;
        }}
        onDragEnd={(e: OnDragEnd) => {
          // Reset transform
          if (!e.lastEvent) return;
          // Calculate the new position based on the drag movement
          const newTop = (e.lastEvent as OnDrag).top;
          const newLeft = (e.lastEvent as OnDrag).left;
          // Update the overlay object's position in the store
          updateOverlayProperty("top", newTop);
          updateOverlayProperty("left", newLeft);
        }}
        // resize handler
        resizable={true}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        onResize={(e: OnResize) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.top = `${e.drag.top}px`;
          e.target.style.left = `${e.drag.left}px`;
        }}
        onResizeEnd={(e: OnResizeEnd) => {
          if (!e.lastEvent) return;
          // Calculate the new size based on the resize event
          const newWidth = (e.lastEvent as OnResize).width;
          const newHeight = (e.lastEvent as OnResize).height;
          const newTop = (e.lastEvent as OnResize).drag.top;
          const newLeft = (e.lastEvent as OnResize).drag.left;
          // Update the overlay object's size in the store
          updateOverlayProperty("width", newWidth);
          updateOverlayProperty("height", newHeight);
          updateOverlayProperty("top", newTop);
          updateOverlayProperty("left", newLeft);
        }}
        // grid snapping handler
        snappable={true}
        verticalGuidelines={[0, 480, 960, 1440, 1920]}
        horizontalGuidelines={[0, 270, 540, 810, 1080]}
      />
    </>
  );
}

function MediaOverlay({ mediaObject }: { mediaObject: SceneMedia }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const updateOverlayProperty = useOverlayStore(
    (state) => state.updateOverlayProperty
  );

  const mediaStyle: React.CSSProperties = {
    position: "absolute",
    top: `${mediaObject.top}px`,
    left: `${mediaObject.left}px`,
    width: `${mediaObject.width}px`,
    height: `${mediaObject.height}px`,
    boxShadow: "0 0 0 2px rgba(30, 144, 255, 0.5)",
    borderRadius: "4px",
    zIndex: 1000,
    userSelect: "none", // Prevent selection
    overflow: "hidden", // Ensure content fits within bounds
    // transition: "all 0.1s ease", // Smooth transition for changes
  };

  // Render media content based on type
  const renderMediaContent = () => {
    switch (mediaObject.mediaType) {
      case "image":
        return (
          <Img
            src={mediaObject.src}
            alt={mediaObject.alt}
            style={{
              width: "100%",
              height: "100%",
              objectFit: mediaObject.fit,
            }}
          />
        );
      case "video":
        return (
          <OffthreadVideo
            src={mediaObject.src}
            style={{
              width: "100%",
              height: "100%",
              objectFit: mediaObject.fit,
            }}
            muted
          />
        );
      case "audio":
        return (
          <div className="flex items-center justify-center w-full h-full bg-black/10">
            <div className="text-center">
              <p>Audio</p>
              <p className="text-xs text-muted-foreground">{mediaObject.alt}</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-full h-full bg-black/10">
            <p>Unsupported media</p>
          </div>
        );
    }
  };

  return (
    <>
      <div
        ref={overlayRef}
        style={mediaStyle}
        onClick={(e) => e.stopPropagation()}
      >
        {renderMediaContent()}
      </div>
      <Moveable
        target={overlayRef}
        draggable={true}
        throttleDrag={1}
        edgeDraggable={false}
        startDragRotate={0}
        throttleDragRotate={0}
        zoom={1.5}
        // dragging handler
        onDrag={(e: OnDrag) => {
          // Apply transform during drag for smooth visual feedback
          e.target.style.top = `${e.top}px`;
          e.target.style.left = `${e.left}px`;
        }}
        onDragEnd={(e: OnDragEnd) => {
          // Reset transform
          if (!e.lastEvent) return;
          // Calculate the new position based on the drag movement
          const newTop = (e.lastEvent as OnDrag).top;
          const newLeft = (e.lastEvent as OnDrag).left;
          // Update the overlay object's position in the store
          updateOverlayProperty("top", newTop);
          updateOverlayProperty("left", newLeft);
        }}
        // resize handler with scalable=true for media
        resizable={true}
        // scalable={true} // Enable scaling for media elements
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        onResize={(e: OnResize) => {
          e.target.style.width = `${e.width}px`;
          e.target.style.height = `${e.height}px`;
          e.target.style.top = `${e.drag.top}px`;
          e.target.style.left = `${e.drag.left}px`;
        }}
        onResizeEnd={(e: OnResizeEnd) => {
          if (!e.lastEvent) return;
          // Calculate the new size based on the resize event
          const newWidth = (e.lastEvent as OnResize).width;
          const newHeight = (e.lastEvent as OnResize).height;
          const newTop = (e.lastEvent as OnResize).drag.top;
          const newLeft = (e.lastEvent as OnResize).drag.left;
          // Update the overlay object's size in the store
          updateOverlayProperty("width", newWidth);
          updateOverlayProperty("height", newHeight);
          updateOverlayProperty("top", newTop);
          updateOverlayProperty("left", newLeft);
        }}
        // grid snapping handler
        snappable={true}
        verticalGuidelines={[0, 480, 960, 1440, 1920]}
        horizontalGuidelines={[0, 270, 540, 810, 1080]}
      />
    </>
  );
}
