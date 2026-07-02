"use client";
import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useCallback,
  useMemo,
  useEffect,
  useRef,
  memo,
} from "react";
import {
  DndContext,
  closestCenter,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
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
import {
  HiPencil,
  HiTrash,
  HiMenu,
  HiSearch,
  HiX,
  HiChevronLeft,
  HiChevronRight,
  HiArrowUp,
  HiArrowDown,
} from "react-icons/hi";
import ContentBlockEditor from "./ContentBlockEditor";
import ContentBlockPreview from "./ContentBlockPreview";
import { NewContentItem } from "./../../types/Blog";
import {
  getContentBlockSummary,
  getMatchingBlockIndices,
} from "@/utils/contentBlockSearch";

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

const DragPreviewCard = ({
  item,
  index,
}: {
  item: ContentBlock;
  index: number;
}) => (
  <div className="p-4 border-2 shadow-2xl rounded-xl border-secondary-indigo bg-white ring-4 ring-secondary-indigo/20 w-[min(100vw-2rem,42rem)]">
    <div className="flex items-center gap-2 mb-2">
      <HiMenu className="w-4 h-4 text-secondary-indigo" />
      <span className="px-2 py-1 text-xs font-medium text-white rounded bg-secondary-indigo">
        {item.type}
      </span>
      <span className="text-sm font-semibold text-gray-700">
        Block {index + 1}
      </span>
    </div>
    <p className="text-sm text-gray-600 line-clamp-3">
      {getContentBlockSummary(item)}
    </p>
  </div>
);

interface SortableBlockItemProps {
  id: string;
  index: number;
  item: ContentBlock;
  isEditing: boolean;
  isDragActive: boolean;
  editingContent: NewContentItem;
  setEditingContent: React.Dispatch<React.SetStateAction<NewContentItem>>;
  hasExistingH1: boolean;
  isSearchMatch: boolean;
  isActiveSearchMatch: boolean;
  isDimmed: boolean;
  totalCount: number;
  blockRef: (node: HTMLDivElement | null) => void;
  onStartEditing: (index: number) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  onRemove: (index: number) => void;
  onMove: (index: number, direction: "up" | "down") => void;
}

const SortableBlockItem = memo(function SortableBlockItem({
  id,
  index,
  item,
  isEditing,
  isDragActive,
  editingContent,
  setEditingContent,
  hasExistingH1,
  isSearchMatch,
  isActiveSearchMatch,
  isDimmed,
  totalCount,
  blockRef,
  onStartEditing,
  onSaveEdit,
  onCancelEdit,
  onRemove,
  onMove,
}: SortableBlockItemProps) {
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
    transition: isDragActive ? undefined : transition,
  };

  const setRefs = (node: HTMLDivElement | null): void => {
    setNodeRef(node);
    blockRef(node);
  };

  const showCompactPreview = isDragActive && !isEditing;

  return (
    <div
      ref={setRefs}
      id={`content-block-${index}`}
      style={style}
      className={`p-4 border rounded-xl ${
        isDragging
          ? "border-dashed border-secondary-indigo/50 bg-indigo-50/40"
          : isActiveSearchMatch
            ? "border-secondary-indigo bg-indigo-50 ring-2 ring-secondary-indigo shadow-md"
            : isSearchMatch
              ? "border-amber-400 bg-amber-50 ring-2 ring-amber-300"
              : "border-gray-200 bg-gray-50"
      } ${isDimmed && !isDragActive ? "opacity-50" : ""} ${
        !isDragActive ? "transition-colors duration-150" : ""
      }`}
    >
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            ref={setActivatorNodeRef}
            type="button"
            className="p-1.5 text-gray-400 rounded cursor-grab hover:text-gray-600 hover:bg-gray-200 active:cursor-grabbing shrink-0 touch-none"
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
          <span
            className={`text-sm truncate ${
              isSearchMatch ? "font-semibold text-amber-800" : "text-gray-500"
            }`}
          >
            Block {index + 1}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onStartEditing(index)}
            disabled={isDragActive}
            className="p-1 text-blue-400 hover:text-blue-600 disabled:opacity-40"
            title="Edit block"
          >
            <HiPencil className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, "up")}
            disabled={isDragActive || index === 0}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-40"
            title="Move up"
          >
            <HiArrowUp className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onMove(index, "down")}
            disabled={isDragActive || index === totalCount - 1}
            className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-40"
            title="Move down"
          >
            <HiArrowDown className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onRemove(index)}
            disabled={isDragActive}
            className="p-1 text-red-400 hover:text-red-600 disabled:opacity-40"
            title="Delete block"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isDragging ? (
        <div className="flex items-center justify-center h-14 text-sm font-medium rounded-lg border-2 border-dashed text-secondary-indigo border-secondary-indigo/30 bg-white/70">
          Drop here
        </div>
      ) : isEditing ? (
        <ContentBlockEditor
          content={editingContent}
          setContent={setEditingContent}
          onSave={onSaveEdit}
          onCancel={onCancelEdit}
          isEditing={true}
          hasExistingH1={hasExistingH1}
        />
      ) : showCompactPreview ? (
        <p className="text-sm text-gray-600 line-clamp-2">
          {getContentBlockSummary(item)}
        </p>
      ) : (
        <ContentBlockPreview item={item} />
      )}
    </div>
  );
});

const ContentBlockList = forwardRef<ContentBlockListRef, ContentBlockListProps>(
  ({ content, setFormData }, ref) => {
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeMatchPosition, setActiveMatchPosition] = useState(0);
    const [activeDragId, setActiveDragId] = useState<string | null>(null);
    const [editingContent, setEditingContent] = useState<NewContentItem>({
      type: "paragraph",
      text: "",
      items: [],
      imageUrl: "",
      videoUrl: "",
    });
    const blockRefs = useRef<Map<number, HTMLDivElement>>(new Map());
    const isDraggingRef = useRef(false);

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: { distance: 8 },
      }),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    const sortableIds = content.map((_, index) => `block-${index}`);
    const isDragActive = activeDragId !== null;
    const activeDragIndex = activeDragId
      ? sortableIds.indexOf(activeDragId)
      : -1;
    const activeDragItem =
      activeDragIndex >= 0 ? content[activeDragIndex] : null;

    const matchingIndices = useMemo(
      () => getMatchingBlockIndices(content, searchQuery),
      [content, searchQuery]
    );
    const hasSearch = searchQuery.trim().length > 0;
    const activeBlockIndex = matchingIndices[activeMatchPosition] ?? null;

    const scrollToBlock = useCallback((index: number): void => {
      const block = blockRefs.current.get(index);
      block?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, []);

    useEffect(() => {
      setActiveMatchPosition(0);
    }, [searchQuery, content.length]);

    useEffect(() => {
      if (isDraggingRef.current) return;
      if (hasSearch && activeBlockIndex !== null) {
        scrollToBlock(activeBlockIndex);
      }
    }, [activeBlockIndex, hasSearch, scrollToBlock]);

    const goToPreviousMatch = (): void => {
      if (matchingIndices.length === 0) return;
      setActiveMatchPosition(
        (prev) => (prev - 1 + matchingIndices.length) % matchingIndices.length
      );
    };

    const goToNextMatch = (): void => {
      if (matchingIndices.length === 0) return;
      setActiveMatchPosition((prev) => (prev + 1) % matchingIndices.length);
    };

    const startEditing = useCallback((index: number): void => {
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
    }, [content]);

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

    const cancelEdit = useCallback((): void => {
      setEditingIndex(null);
      setEditingContent({
        type: "paragraph",
        text: "",
        items: [],
        imageUrl: "",
        videoUrl: "",
      });
    }, []);

    const removeContentItem = useCallback((index: number): void => {
      setFormData((prev: any) => ({
        ...prev,
        content: (prev.content || []).filter((_: any, i: number) => i !== index),
      }));

      setEditingIndex((current) => {
        if (current === null) return null;
        if (current === index) {
          setEditingContent({
            type: "paragraph",
            text: "",
            items: [],
            imageUrl: "",
            videoUrl: "",
          });
          return null;
        }
        if (current > index) return current - 1;
        return current;
      });
    }, [setFormData]);

    const handleDragStart = (event: DragStartEvent): void => {
      isDraggingRef.current = true;
      setActiveDragId(String(event.active.id));
    };

    const handleDragEnd = (event: DragEndEvent): void => {
      isDraggingRef.current = false;
      setActiveDragId(null);

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

      setEditingIndex((current) =>
        current === null
          ? null
          : getIndexAfterMove(current, oldIndex, newIndex)
      );
    };

    const handleDragCancel = (): void => {
      isDraggingRef.current = false;
      setActiveDragId(null);
    };

    const moveContentItem = useCallback(
      (index: number, direction: "up" | "down"): void => {
        const newIndex = direction === "up" ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= content.length) return;

        const reorderedContent = arrayMove(content, index, newIndex);

        setFormData((prev: any) => ({
          ...prev,
          content: reorderedContent,
        }));

        setEditingIndex((current) =>
          current === null ? null : getIndexAfterMove(current, index, newIndex)
        );
      },
      [content, setFormData]
    );

    const setBlockRef = useCallback(
      (index: number) => (node: HTMLDivElement | null) => {
        if (node) {
          blockRefs.current.set(index, node);
        } else {
          blockRefs.current.delete(index);
        }
      },
      []
    );

    if (content.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="sticky top-0 z-20 p-4 space-y-3 border border-gray-200 rounded-xl bg-white shadow-sm">
          <div className="relative">
            <HiSearch className="absolute w-4 h-4 -translate-y-1/2 left-3 top-1/2 text-gray-400" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  goToNextMatch();
                }
              }}
              placeholder="Search blocks by text, heading, list item, code, image or video URL..."
              className="w-full py-2.5 pr-10 pl-10 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary-indigo/30 focus:border-secondary-indigo"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute -translate-y-1/2 right-3 top-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                <HiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {hasSearch && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-gray-600">
                {matchingIndices.length === 0 ? (
                  <span className="text-red-600">No matching blocks found.</span>
                ) : (
                  <>
                    <span className="font-medium text-secondary-indigo">
                      {matchingIndices.length}
                    </span>{" "}
                    match{matchingIndices.length === 1 ? "" : "es"} in blocks{" "}
                    <span className="font-medium">
                      {matchingIndices.map((index) => index + 1).join(", ")}
                    </span>
                    {activeBlockIndex !== null && (
                      <span className="text-gray-500">
                        {" "}
                        · viewing block {activeBlockIndex + 1}
                      </span>
                    )}
                  </>
                )}
              </p>

              {matchingIndices.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={goToPreviousMatch}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    <HiChevronLeft className="w-4 h-4" />
                    Prev
                  </button>
                  <span className="text-xs text-gray-500">
                    {activeMatchPosition + 1} / {matchingIndices.length}
                  </span>
                  <button
                    type="button"
                    onClick={goToNextMatch}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Next
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {isDragActive && (
            <p className="text-xs font-medium text-secondary-indigo">
              Dragging block{" "}
              {activeDragIndex >= 0 ? activeDragIndex + 1 : ""} — previews are
              collapsed for performance. Release to drop.
            </p>
          )}

          <p className="text-xs text-gray-500">
            Matches are highlighted in amber. Use the drag handle to reorder any
            block. Press Enter to jump to the next match.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
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
                  isDragActive={isDragActive}
                  isEditing={editingIndex === index}
                  editingContent={editingContent}
                  setEditingContent={setEditingContent}
                  hasExistingH1={content.some(
                    (block, blockIndex) =>
                      block.type === "h1" && blockIndex !== index
                  )}
                  isSearchMatch={matchingIndices.includes(index)}
                  isActiveSearchMatch={activeBlockIndex === index}
                  isDimmed={hasSearch && !matchingIndices.includes(index)}
                  totalCount={content.length}
                  blockRef={setBlockRef(index)}
                  onStartEditing={startEditing}
                  onSaveEdit={saveEdit}
                  onCancelEdit={cancelEdit}
                  onRemove={removeContentItem}
                  onMove={moveContentItem}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay dropAnimation={null}>
            {activeDragItem ? (
              <DragPreviewCard item={activeDragItem} index={activeDragIndex} />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    );
  }
);

ContentBlockList.displayName = "ContentBlockList";

export default ContentBlockList;
