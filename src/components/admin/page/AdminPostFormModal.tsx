"use client";
import React from "react";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { BlogPost } from "@/types/Blog";

interface AdminPostFormModalProps {
  isOpen: boolean;
  editingPost: BlogPost | null;
  onSaveCreate: (formData: Partial<BlogPost>) => Promise<void>;
  onSaveEdit: (formData: Partial<BlogPost>) => Promise<void>;
  onAutoSaveDraft: (formData: Partial<BlogPost>) => Promise<BlogPost | null>;
  onDraftChange: (formData: Partial<BlogPost>) => void;
  onCancel: () => void;
}

const AdminPostFormModal: React.FC<AdminPostFormModalProps> = ({
  isOpen,
  editingPost,
  onSaveCreate,
  onSaveEdit,
  onAutoSaveDraft,
  onDraftChange,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <BlogPostForm
      post={editingPost}
      onSave={editingPost ? onSaveEdit : onSaveCreate}
      onAutoSaveDraft={onAutoSaveDraft}
      onDraftChange={onDraftChange}
      onCancel={onCancel}
    />
  );
};

export default AdminPostFormModal;
