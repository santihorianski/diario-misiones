'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { Bold, Italic, Strikethrough, Heading2, Heading3, List, ListOrdered, Quote, Link as LinkIcon, ImageIcon, Undo, Redo } from 'lucide-react';
import { useEffect } from 'react';
import { UploadButton } from '../utils/uploadthing';
import { toast } from 'sonner';

const MenuBar = ({ editor }) => {
  if (!editor) return null;

  // El botón ahora usa UploadButton en el JSX


  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL del enlace:', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const btnClass = "p-2 rounded hover:bg-neutral-800 transition-colors text-neutral-400 hover:text-neutral-100 disabled:opacity-30";
  const activeClass = "bg-neutral-800 text-neutral-100";

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 bg-neutral-950 border-b border-neutral-800 sticky top-0 z-10">
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={`${btnClass} ${editor.isActive('bold') ? activeClass : ''}`}><Bold className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={`${btnClass} ${editor.isActive('italic') ? activeClass : ''}`}><Italic className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={`${btnClass} ${editor.isActive('strike') ? activeClass : ''}`}><Strikethrough className="w-4 h-4" /></button>
      
      <div className="w-px h-5 bg-neutral-800 mx-2"></div>
      
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 2 }) ? activeClass : ''}`}><Heading2 className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={`${btnClass} ${editor.isActive('heading', { level: 3 }) ? activeClass : ''}`}><Heading3 className="w-4 h-4" /></button>
      
      <div className="w-px h-5 bg-neutral-800 mx-2"></div>

      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={`${btnClass} ${editor.isActive('bulletList') ? activeClass : ''}`}><List className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={`${btnClass} ${editor.isActive('orderedList') ? activeClass : ''}`}><ListOrdered className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`${btnClass} ${editor.isActive('blockquote') ? activeClass : ''}`}><Quote className="w-4 h-4" /></button>
      
      <div className="w-px h-5 bg-neutral-800 mx-2"></div>

      <button type="button" onClick={setLink} className={`${btnClass} ${editor.isActive('link') ? activeClass : ''}`}><LinkIcon className="w-4 h-4" /></button>
      
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res && res[0]) {
            const imageUrl = res[0].url;
            editor.chain().focus().setImage({ src: imageUrl }).run();
            toast.success('Imagen insertada en el texto');
          }
        }}
        onUploadError={(error) => {
          toast.error(`Error: ${error.message}`);
        }}
        appearance={{
          button: "bg-neutral-800 text-neutral-300 hover:text-white hover:bg-neutral-700 px-2 py-1 text-[10px] uppercase font-bold rounded",
          allowedContent: "hidden"
        }}
        content={{ button: "SUBIR FOTO" }}
      />

      <div className="w-px h-5 bg-neutral-800 mx-2"></div>

      <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btnClass}><Undo className="w-4 h-4" /></button>
      <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btnClass}><Redo className="w-4 h-4" /></button>
    </div>
  );
};

export default function TiptapEditor({ content, onChange }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({ inline: true, HTMLAttributes: { class: 'rounded max-w-full h-auto my-6' } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: 'text-neutral-300 underline cursor-pointer' } })
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-neutral max-w-none min-h-[400px] py-6 focus:outline-none text-neutral-300',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && content && editor.getHTML() !== content && editor.getHTML() === '<p></p>') {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  return (
    <div className="flex flex-col bg-neutral-950 border border-neutral-800 rounded-lg overflow-hidden">
      <MenuBar editor={editor} />
      <div className="px-6 md:px-12 bg-neutral-950">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
