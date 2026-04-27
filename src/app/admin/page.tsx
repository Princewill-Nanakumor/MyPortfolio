"use client";
import AdminPageShell from "@/components/admin/page/AdminPageShell";
import AdminAuthCard from "@/components/admin/page/AdminAuthCard";
import AdminLoadingState from "@/components/admin/page/AdminLoadingState";
import AdminDashboardContent from "@/components/admin/page/AdminDashboardContent";
import AdminPostFormModal from "@/components/admin/page/AdminPostFormModal";
import { useAdminPageController } from "@/hooks/useAdminPageController";

const AdminPage = () => {
  const {
    error,
    setError,
    posts,
    displayedPosts,
    filterStatus,
    setFilterStatus,
    isAuthenticated,
    isLocked,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    authError,
    isAuthenticating,
    loading,
    isFormOpen,
    setIsFormOpen,
    editingPost,
    setLiveDraftPreview,
    handleLogin,
    handleLogout,
    openEditForm,
    closeForm,
    handleDeletePost,
    handleAddPost,
    handleEditPost,
    handleAutoSaveDraft,
  } = useAdminPageController();

  // Show authentication modal if not authenticated
  if (!isAuthenticated) {
    return (
      <AdminPageShell>
        <AdminAuthCard
          isLocked={isLocked}
          password={password}
          showPassword={showPassword}
          authError={authError}
          isAuthenticating={isAuthenticating}
          onPasswordChange={setPassword}
          onToggleShowPassword={() => setShowPassword(!showPassword)}
          onSubmit={handleLogin}
        />
      </AdminPageShell>
    );
  }

  if (loading) {
    return (
      <AdminPageShell>
        <AdminLoadingState />
      </AdminPageShell>
    );
  }

  return (
    <AdminPageShell>
      <AdminDashboardContent
        error={error}
        setError={setError}
        posts={posts}
        displayedPosts={displayedPosts}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        setIsFormOpen={setIsFormOpen}
        onLogout={handleLogout}
        onEdit={openEditForm}
        onDelete={handleDeletePost}
      />

      <AdminPostFormModal
        isOpen={isFormOpen}
        editingPost={editingPost}
        onSaveCreate={handleAddPost}
        onSaveEdit={handleEditPost}
        onAutoSaveDraft={handleAutoSaveDraft}
        onDraftChange={setLiveDraftPreview}
        onCancel={closeForm}
      />
    </AdminPageShell>
  );
};

export default AdminPage;
