import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Heading2,
  Heading3,
  Undo,
  Redo,
} from "lucide-react";

function ToolbarButton({
  onClick,
  active,
  children,
  title,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={`btn btn-xs btn-ghost ${active ? "btn-active bg-base-200" : ""}`}
    >
      {children}
    </button>
  );
}

export function RichTextEditor({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (val: string) => void;
  error?: string;
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Placeholder.configure({
        placeholder: "Write the full terms and conditions content here…",
      }),
    ],
    content: value,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none min-h-[280px] p-4 focus:outline-none",
      },
    },
  });

  // Sync external value once when it first becomes non-empty (e.g. after async reset)
  const initialized = useRef(false);
  useEffect(() => {
    if (editor && value && !initialized.current) {
      editor.commands.setContent(value, false);
      initialized.current = true;
    }
  }, [editor, value]);

  if (!editor) return null;

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-semibold">
        Content <span className="text-error">*</span>
      </label>
      <div
        className={`border rounded-xl overflow-hidden ${error ? "border-error" : "border-base-300"}`}
      >
        <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-base-200 bg-base-50">
          <ToolbarButton
            title="Bold"
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
          >
            <Bold size={13} />
          </ToolbarButton>
          <ToolbarButton
            title="Italic"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
          >
            <Italic size={13} />
          </ToolbarButton>
          <ToolbarButton
            title="Underline"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
          >
            <UnderlineIcon size={13} />
          </ToolbarButton>

          <div className="w-px h-5 bg-base-300 mx-1" />

          <ToolbarButton
            title="Heading 2"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            active={editor.isActive("heading", { level: 2 })}
          >
            <Heading2 size={13} />
          </ToolbarButton>
          <ToolbarButton
            title="Heading 3"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            active={editor.isActive("heading", { level: 3 })}
          >
            <Heading3 size={13} />
          </ToolbarButton>

          <div className="w-px h-5 bg-base-300 mx-1" />

          <ToolbarButton
            title="Bullet List"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
          >
            <List size={13} />
          </ToolbarButton>
          <ToolbarButton
            title="Numbered List"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
          >
            <ListOrdered size={13} />
          </ToolbarButton>

          <div className="w-px h-5 bg-base-300 mx-1" />

          <ToolbarButton
            title="Align Left"
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
          >
            <AlignLeft size={13} />
          </ToolbarButton>
          <ToolbarButton
            title="Align Center"
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
          >
            <AlignCenter size={13} />
          </ToolbarButton>
          <ToolbarButton
            title="Align Right"
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
          >
            <AlignRight size={13} />
          </ToolbarButton>

          <div className="w-px h-5 bg-base-300 mx-1" />

          <ToolbarButton
            title="Undo"
            onClick={() => editor.chain().focus().undo().run()}
          >
            <Undo size={13} />
          </ToolbarButton>
          <ToolbarButton
            title="Redo"
            onClick={() => editor.chain().focus().redo().run()}
          >
            <Redo size={13} />
          </ToolbarButton>
        </div>

        <EditorContent editor={editor} />
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </div>
  );
}
