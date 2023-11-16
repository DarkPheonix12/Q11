import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useRef, useState } from "react";
import { sanitizePostContent, throttle } from "../../../../helperFunctions";

interface TinyEditorProps {
  value: string;
  onContentChange: (newValue: string) => void;
  isOverlayHidden: boolean;
  setIsOverlayHidden: React.Dispatch<React.SetStateAction<boolean>>;
}

const TinyEditor: React.FC<TinyEditorProps> = ({
  value,
  isOverlayHidden,
  onContentChange,
  setIsOverlayHidden,
}) => {
  const tinyEditorRef = useRef<Editor | null>(null);
  const [touchStartX, setTouchStartX] = useState<number>(0);
  const [currentTouchX, setCurrentTouchX] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

  const editorSetup = (editor: Editor["editor"]) => {
    if (!editor) return;
    editor.ui.registry.addButton("Q", {
      text: "Q",
      onAction: (_) => {
        editor.focus();
        editor.execCommand(
          "mceInsertContent",
          false,
          `${editor.selection.getSel()}<p>Q:&nbsp;<span id="insert-caret" />?</p>`
        );

        editor.selection.select(editor.dom.select("#insert-caret")[0]);
        editor.selection.collapse();
        editor.dom.remove("insert-caret");
      },
    });
  };

  useEffect(() => {
    if (!tinyEditorRef.current) return;
    if (!tinyEditorRef.current.editor) return;
    if (!isInitialized) return;
    if (!isOverlayHidden) return;

    const editorContainer = tinyEditorRef.current.editor.contentAreaContainer;

    // MOUSE
    const handleMouseDown = (e: MouseEvent) => {
      setIsMouseDown(true);
      setTouchStartX(e.clientX);
      setCurrentTouchX(e.clientX);
    };

    const handleMouseUp = () => setIsMouseDown(false);

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!isMouseDown) return;
      if (currentTouchX > touchStartX + 20) {
        setIsOverlayHidden(false);
        setIsMouseDown(false);
      }
      setCurrentTouchX(e.clientX);
    }, 10);

    // TOUCH
    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartX(e.touches[0].clientX);
      setCurrentTouchX(e.touches[0].clientX);
    };

    const handleTouchMove = throttle((e: TouchEvent) => {
      if (currentTouchX > touchStartX + 20) return setIsOverlayHidden(false);
      setCurrentTouchX(e.touches[0].clientX);
    }, 10);

    editorContainer.addEventListener("mousedown", handleMouseDown);
    editorContainer.addEventListener("mousemove", handleMouseMove);
    editorContainer.addEventListener("mouseup", handleMouseUp);

    editorContainer.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });
    editorContainer.addEventListener("touchmove", handleTouchMove, {
      passive: true,
    });

    return () => {
      editorContainer.removeEventListener("mousedown", handleMouseDown);
      editorContainer.removeEventListener("mousemove", handleMouseMove);
      editorContainer.removeEventListener("mouseup", handleMouseUp);

      editorContainer.removeEventListener("touchstart", handleTouchStart, {
        passive: true,
      } as EventListenerOptions);
      editorContainer.removeEventListener("touchmove", handleTouchMove, {
        passive: true,
      } as EventListenerOptions);
    };
  }, [
    setIsOverlayHidden,
    isInitialized,
    currentTouchX,
    touchStartX,
    isOverlayHidden,
    isMouseDown,
  ]);

  return (
    <Editor
      apiKey={process.env.REACT_APP_TINYMCE_API_KEY}
      init={{
        autoComplete: false,
        plugins: "lists quickbars paste",
        placeholder: "Main Content...",
        paste_block_drop: false,
        paste_data_images: false,
        paste_preprocess: (_: any, args: any) => {
          args.content = sanitizePostContent(args.content);
        },
        paste_webkit_styles: "font-size, text-align",
        toolbar: false,
        menubar: false,
        height: "20em",
        statusbar: false,
        quickbars_image_toolbar: false,
        quickbars_insert_toolbar: false,
        quickbars_selection_toolbar:
          "Q bold underline italic | h1 h2 h3 | undo redo | alignleft aligncenter alignright alignjustify | numlist bullist",
        setup: (editor) => editorSetup(editor),
        paste_auto_cleanup_on_paste: true,
        paste_postprocess: (_: any, args: any) =>
          (args.node.innerHTML = args.node.innerHTML.replace(/&nbsp;/gi, " ")),
      }}
      value={value}
      onEditorChange={(newValue) => onContentChange(newValue)}
      inline={true}
      ref={tinyEditorRef}
      onInit={() => setIsInitialized(true)}
    />
  );
};

export default TinyEditor;
