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
    isCheckingAuth,
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
    handleTogglePublish,
  } = useAdminPageController();

  // Wait for session check so the login form does not flash for logged-in users.
  if (isCheckingAuth) {
    return (
      <AdminPageShell>
        <AdminLoadingState message="Checking session..." />
      </AdminPageShell>
    );
  }

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
        <AdminLoadingState message="Loading posts..." />
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
        onTogglePublish={handleTogglePublish}
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
