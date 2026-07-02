"use client";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ContentBlock } from "@/types/Blog";
import { HiPencil, HiTrash, HiMenu } from "react-icons/hi";
import ContentBlockEditor from "./ContentBlockEditor";
import ContentBlockPreview from "./ContentBlockPreview";
import { NewContentItem } from "./../../types/Blog";

interface ContentBlockListProps {
  content: ContentBlock[];
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

export interface ContentBlockListRef {
  flushEditingChanges: () => void;
}

function getIndexAfterMove(
  currentIndex: number,
  fromIndex: number,
  toIndex: number
): number {
  if (currentIndex === fromIndex) return toIndex;
  if (fromIndex < toIndex) {
    if (currentIndex > fromIndex && currentIndex <= toIndex) {
      return currentIndex - 1;
    }
  } else if (fromIndex > toIndex) {
    if (currentIndex >= toIndex && currentIndex < fromIndex) {
      return currentIndex + 1;
    }
  }
  return currentIndex;
}

interface SortableBlockItemProps {
  id: string;
  index: number;
  item: ContentBlock;
  isEditing: boolean;
  editingContent: NewContentItem;
  setEditingContent: React.Dispatch<React.SetStateAction<NewContentItem>>;
  hasExistingH1: boolean;
  onStartEditing: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemove: (index: number) => void;
}

const SortableBlockItem = ({
  id,
  index,
  item,
  isEditing,
  editingContent,
  setEditingContent,
  hasExistingH1,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onRemove,
}: SortableBlockItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`p-4 border border-gray-200 bg-gray-50 rounded-xl ${
        isDragging ? "z-10 opacity-80 shadow-lg ring-2 ring-secondary-indigo/30" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="p-1.5 text-gray-400 rounded cursor-grab hover:text-gray-600 hover:bg-gray-200 active:cursor-grabbing shrink-0"
            title="Drag to reorder"
            aria-label={`Drag block ${index + 1} to reorder`}
            {...attributes}
            {...listeners}
          >
            <HiMenu className="w-4 h-4" />
          </button>
          <span className="px-2 py-1 text-xs font-medium text-white rounded bg-secondary-indigo shrink-0">
            {item.type}
          </span>
          <span className="text-sm text-gray-500 truncate">
            Block {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onStartEditing(index)}
            className="p-1 text-blue-400 hover:text-blue-600"
            title="Edit block"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-1 text-red-400 hover:text-red-600"
            title="Delete block"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isEditing ? (
        <ContentBlockEditor
          content={editingContent}
          setContent={setEditingContent}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          isEditing={true}
          hasExistingH1={hasExistingH1}
        />
      ) : (
        <ContentBlockPreview item={item} />
      )}
    </div>
  );
};

const ContentBlockList = forwardRef<ContentBlockListRef, ContentBlockListProps>(
  ({ content, setFormData }, ref) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [editingContent, setEditingContent] = useState<NewContentItem>({
      type: "paragraph",
      text: "",
      items: [],
      imageUrl: "",
      videoUrl: "",
    });

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const sortableIds = content.map((_, index) => `block-${index}`);

    const startEditing = (index: number): void => {
      const contentBlock = content[index];
      if (contentBlock) {
        setEditingIndex(index);
        setEditingContent({
          type: contentBlock.type,
          text: contentBlock.text || "",
          items: contentBlock.items || [],
          imageUrl: contentBlock.imageUrl || "",
          videoUrl: contentBlock.videoUrl || "",
        });
      }
    };

    const saveEdit = useCallback((): void => {
      if (editingIndex !== null) {
        const hasOtherH1 = content.some(
          (block, index) => block.type === "h1" && index !== editingIndex
        );

        if (editingContent.type === "h1" && hasOtherH1) {
          alert("Only one H1 is allowed per post.");
          return;
        }

        const contentBlock: ContentBlock = {
          type: editingContent.type,
          text: editingContent.text,
          items: editingContent.items,
          ...(editingContent.imageUrl && {
            imageUrl: editingContent.imageUrl,
          }),
          ...(editingContent.videoUrl && {
            videoUrl: editingContent.videoUrl,
          }),
        };

        setFormData((prev: any) => ({
          ...prev,
          content: (prev.content || []).map(
            (item: ContentBlock, index: number) =>
              index === editingIndex ? contentBlock : item
          ),
        }));

        setEditingIndex(null);
        setEditingContent({
          type: "paragraph",
          text: "",
          items: [],
          imageUrl: "",
          videoUrl: "",
        });
      }
    }, [content, editingContent, editingIndex, setFormData]);

    useImperativeHandle(
      ref,
      () => ({
        flushEditingChanges: saveEdit,
      }),
      [saveEdit]
    );

    const cancelEdit = (): void => {
      setEditingIndex(null);
      setEditingContent({
        type: "paragraph",
        text: "",
        items: [],
        imageUrl: "",
        videoUrl: "",
      });
    };

    const removeContentItem = (index: number): void => {
      setFormData((prev: any) => ({
        ...prev,
        content: (prev.content || []).filter((_: any, i: number) => i !== index),
      }));

      if (editingIndex !== null) {
        if (editingIndex === index) {
          cancelEdit();
        } else if (editingIndex > index) {
          setEditingIndex(editingIndex - 1);
        }
      }
    };

    const handleDragEnd = (event: DragEndEvent): void => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = sortableIds.indexOf(String(active.id));
      const newIndex = sortableIds.indexOf(String(over.id));

      if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) return;

      const reorderedContent = arrayMove(content, oldIndex, newIndex);

      setFormData((prev: any) => ({
        ...prev,
        content: reorderedContent,
      }));

      if (editingIndex !== null) {
        setEditingIndex(getIndexAfterMove(editingIndex, oldIndex, newIndex));
      }
    };

    if (content.length === 0) return null;

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={sortableIds}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {content.map((item, index) => (
              <SortableBlockItem
                key={`block-${index}`}
                id={`block-${index}`}
                index={index}
                item={item}
                isEditing={editingIndex === index}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                hasExistingH1={content.some(
                  (block, blockIndex) =>
                    block.type === "h1" && blockIndex !== index
                )}
                onStartEditing={startEditing}
                onSaveEdit={saveEdit}
                onCancelEdit={cancelEdit}
                onRemove={removeContentItem}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }
);

ContentBlockList.displayName = "ContentBlockList";

export default ContentBlockList;
