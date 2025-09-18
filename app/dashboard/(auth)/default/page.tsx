"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Trash2, Edit, Plus, User, LogOut } from "lucide-react";
import { getUsers, createUser, updateUser, deleteUser, User as UserType, CreateUserData } from "@/lib/api";


export default function Page() {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [formData, setFormData] = useState<CreateUserData>({ email: "", name: "" });

  // Load users and check auth on component mount
  useEffect(() => {
    checkAuth();
    loadUsers();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('auth-token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('auth-token');
        window.location.href = '/login';
      }
    } catch (error) {
      localStorage.removeItem('auth-token');
      window.location.href = '/login';
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const usersData = await getUsers();
      setUsers(usersData);
    } catch (err) {
      setError("Failed to load users. Make sure the backend is running on port 3000.");
      console.error("Error loading users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newUser = await createUser(formData);
      setUsers([...users, newUser]);
      setFormData({ email: "", name: "" });
      setIsCreateOpen(false);
    } catch (err) {
      setError("Failed to create user");
      console.error("Error creating user:", err);
    }
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    
    try {
      const updatedUser = await updateUser(editingUser.id, formData);
      setUsers(users.map(user => user.id === editingUser.id ? updatedUser : user));
      setFormData({ email: "", name: "" });
      setEditingUser(null);
      setIsEditOpen(false);
    } catch (err) {
      setError("Failed to update user");
      console.error("Error updating user:", err);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (err) {
      setError("Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  const openEditDialog = (user: UserType) => {
    setEditingUser(user);
    setFormData({ email: user.email, name: user.name || "" });
    setIsEditOpen(true);
  };

  const resetForm = () => {
    setFormData({ email: "", name: "" });
    setEditingUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage users in your system with full CRUD operations
          </p>
          {user && (
            <div className="mt-2 flex items-center space-x-2">
              <img 
                src={user.avatar || ''} 
                alt="Profile" 
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">
                Welcome, {user.name || user.email}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Add a new user to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
          <Button 
            variant="outline" 
            size="sm" 
            className="ml-2" 
            onClick={loadUsers}
          >
            Retry
          </Button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <CardTitle className="text-sm font-medium">
                  {user.name || "Unnamed User"}
                </CardTitle>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openEditDialog(user)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No users</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new user.
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-email" className="text-right">
                  Email *
                </Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
