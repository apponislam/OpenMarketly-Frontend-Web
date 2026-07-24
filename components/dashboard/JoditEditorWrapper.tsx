"use client";

import React, { useMemo, useRef } from "react";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor to prevent Next.js SSR hydration errors
const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => (
        <div className="h-[380px] w-full border border-gray-200 rounded-xl flex items-center justify-center bg-gray-50 text-xs font-semibold text-gray-400">
            Loading Editor...
        </div>
    ),
});

interface JoditEditorWrapperProps {
    value: string;
    onBlur: (newContent: string) => void;
    placeholder?: string;
}

export function JoditEditorWrapper({
    value,
    onBlur,
    placeholder = "Start typing document content...",
}: JoditEditorWrapperProps) {
    const editorRef = useRef(null);

    // Jodit Configuration: Disable uploaders, filebrowsers, and provide clean toolbar
    const config = useMemo(
        () => ({
            readonly: false,
            placeholder,
            height: 420,
            iframe: false,
            editorCssClass: "jodit-wysiwyg-content",
            uploader: {
                insertImageAsBase64URI: false,
            },
            filebrowser: {
                ajax: {
                    url: "",
                },
            },
            toolbarAdaptive: false,
            buttons: [
                "source",
                "|",
                "bold",
                "italic",
                "underline",
                "strikethrough",
                "|",
                "superscript",
                "subscript",
                "|",
                "ul",
                "ol",
                "|",
                "outdent",
                "indent",
                "|",
                "font",
                "fontsize",
                "brush",
                "paragraph",
                "|",
                "align",
                "undo",
                "redo",
                "|",
                "hr",
                "table",
                "link",
                "|",
                "fullsize",
            ],
            askBeforePasteHTML: false,
            askBeforePasteFromWord: false,
            defaultActionOnPaste: "insert_clear_html",
        }),
        [placeholder]
    );

    return (
        <div className="jodit-wysiwyg-container">
            <JoditEditor
                ref={editorRef}
                value={value}
                config={config as any}
                onBlur={(newContent) => onBlur(newContent)}
            />
        </div>
    );
}
