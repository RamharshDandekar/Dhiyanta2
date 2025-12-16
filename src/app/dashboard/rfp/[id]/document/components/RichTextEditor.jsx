'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import { useEffect } from 'react';
import EditorToolbar from './EditorToolbar';

export default function RichTextEditor({ initialContent, onContentChange }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
        allowTableNodeSelection: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initialContent || '',
    editorProps: {
      attributes: {
        class:
          'prose prose-sm sm:prose lg:prose-lg xl:prose-xl max-w-none focus:outline-none min-h-screen p-8 document-editor',
      },
    },
    onUpdate: ({ editor }) => {
      if (onContentChange) {
        onContentChange(editor.getHTML());
      }
    },
    parseOptions: {
      preserveWhitespace: 'full',
    },
  });

  useEffect(() => {
    if (editor && initialContent) {
      // Set content as HTML, preserving structure
      editor.commands.setContent(initialContent, false, {
        preserveWhitespace: 'full',
      });
    }
  }, [editor, initialContent]);

  if (!editor) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white shadow-lg">
      <EditorToolbar editor={editor} />
      <div
        className="bg-white overflow-auto"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
