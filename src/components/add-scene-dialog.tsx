"use client";

import { useState, JSX } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui//dialog";
import { Button } from "./ui//button";
import {
  createTitleLayout,
  createTitleAndContentLayout,
  createSectionTitleLayout,
  createTitleAndTwoImagesLayout,
  createTitleAndVideoLayout,
} from "@/lib/scenes-layout";
import { Scene, SceneMedia } from "@/types/scenes";
import { rgbaColorToString } from "@/lib/colors";
import {
  Image as ImageIcon,
  Video as VideoIcon,
  Music as MusicIcon,
} from "lucide-react";

interface AddSceneDialogProps {
  onAddScene: (scene: Scene) => void;
  children: React.ReactNode;
}

export default function AddSceneDialog({
  onAddScene,
  children,
}: AddSceneDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleAddScene = () => {
    let scene: Scene;

    switch (selectedTemplate) {
      case "title":
        scene = createTitleLayout();
        break;
      case "titleAndContent":
        scene = createTitleAndContentLayout();
        break;
      case "sectionTitle":
        scene = createSectionTitleLayout();
        break;
      case "titleAndTwoImages":
        scene = createTitleAndTwoImagesLayout();
        break;
      case "titleAndVideo":
        scene = createTitleAndVideoLayout();
        break;
      default:
        setOpen(false);
        return;
    }

    onAddScene(scene);
    setOpen(false);
  };

  // Helper to render a scaled-down template preview
  const renderTemplatePreview = (
    type: string,
    name: string,
    renderFunction: () => JSX.Element
  ) => {
    const isSelected = selectedTemplate === type;

    return (
      <div
        className={`cursor-pointer rounded-md border-2 p-2 transition-all ${
          isSelected
            ? "border-primary"
            : "border-border hover:border-primary/50"
        }`}
        onClick={() => setSelectedTemplate(type)}
      >
        <p className="mb-2 text-center text-sm font-medium">{name}</p>
        <div
          className="relative mx-auto aspect-video"
          style={{ width: "240px", height: "135px" }}
        >
          <div
            className="absolute inset-0 overflow-hidden"
            style={{
              transform: "scale(0.125)", // Scale from 1920x1080 to 240x135
              transformOrigin: "top left",
              width: "1920px",
              height: "1080px",
            }}
          >
            {renderFunction()}
          </div>
        </div>
      </div>
    );
  };

  // Generic scene renderer that maps actual components from a scene template
  const renderSceneTemplate = (scene: Scene) => {
    return (
      <div
        style={{
          width: "1920px",
          height: "1080px",
          background: "white",
          position: "relative",
        }}
      >
        {scene.components.map((component) => {
          // Currently only handling SceneText components
          if (component.type === "scene-text") {
            const textComponent = component;
            return (
              <div
                key={textComponent.id}
                style={{
                  position: "absolute",
                  top: `${textComponent.top}px`,
                  left: `${textComponent.left}px`,
                  width: `${textComponent.width}px`,
                  height: `${textComponent.height}px`,
                  fontSize: `${textComponent.fontSize}px`,
                  fontFamily: textComponent.fontFamily,
                  color: rgbaColorToString(textComponent.color),
                  backgroundColor: rgbaColorToString(
                    textComponent.backgroundColor
                  ),
                  textAlign: textComponent.textAlign,
                  fontWeight: textComponent.fontWeight,
                  fontStyle: textComponent.fontStyle,
                  textDecoration: textComponent.textDecoration,
                  textTransform: textComponent.textTransform,
                  overflow: "hidden",
                  display: "flex",
                  alignItems:
                    textComponent.textAlignVertical === "top"
                      ? "flex-start"
                      : textComponent.textAlignVertical === "bottom"
                      ? "flex-end"
                      : "center",
                  justifyContent:
                    textComponent.textAlign === "left"
                      ? "flex-start"
                      : textComponent.textAlign === "right"
                      ? "flex-end"
                      : "center",
                }}
              >
                {textComponent.text}
              </div>
            );
          } else if (component.type === "scene-media") {
            const mediaComponent = component as SceneMedia;
            return (
              <div
                key={mediaComponent.id}
                style={{
                  position: "absolute",
                  top: `${mediaComponent.top}px`,
                  left: `${mediaComponent.left}px`,
                  width: `${mediaComponent.width}px`,
                  height: `${mediaComponent.height}px`,
                  backgroundColor: "rgba(240, 240, 240, 0.5)",
                  border: "1px dashed #aaa",
                  borderRadius: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {mediaComponent.mediaType === "image" && (
                  <ImageIcon size={48} color="#666" />
                )}
                {mediaComponent.mediaType === "video" && (
                  <VideoIcon size={48} color="#666" />
                )}
                {mediaComponent.mediaType === "audio" && (
                  <MusicIcon size={48} color="#666" />
                )}
              </div>
            );
          }
          return null;
        })}
      </div>
    );
  };

  // Template preview renderers using the actual scene templates
  const renderTitleTemplate = () => {
    const titleScene = createTitleLayout();
    return renderSceneTemplate(titleScene);
  };

  const renderTitleAndContentTemplate = () => {
    const titleAndContentScene = createTitleAndContentLayout();
    return renderSceneTemplate(titleAndContentScene);
  };

  const renderSectionTitleTemplate = () => {
    const sectionTitleScene = createSectionTitleLayout();
    return renderSceneTemplate(sectionTitleScene);
  };

  const renderTitleAndTwoImagesTemplate = () => {
    const titleAndTwoImagesScene = createTitleAndTwoImagesLayout();
    return renderSceneTemplate(titleAndTwoImagesScene);
  };

  const renderTitleAndVideoTemplate = () => {
    const titleAndVideoScene = createTitleAndVideoLayout();
    return renderSceneTemplate(titleAndVideoScene);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="min-w-4xl flex flex-col items-center">
        <DialogHeader>
          <DialogTitle>Choose Template</DialogTitle>
        </DialogHeader>

        <div className="py-4 flex flex-row flex-wrap gap-4">
          {renderTemplatePreview("title", "Title", renderTitleTemplate)}
          {renderTemplatePreview(
            "titleAndContent",
            "Title and Content",
            renderTitleAndContentTemplate
          )}
          {renderTemplatePreview(
            "sectionTitle",
            "Section Title",
            renderSectionTitleTemplate
          )}
          {renderTemplatePreview(
            "titleAndTwoImages",
            "Compare Images",
            renderTitleAndTwoImagesTemplate
          )}
          {renderTemplatePreview(
            "titleAndVideo",
            "Video Slide",
            renderTitleAndVideoTemplate
          )}
        </div>

        <DialogFooter>
          <Button onClick={handleAddScene} disabled={!selectedTemplate}>
            Create Scene
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
