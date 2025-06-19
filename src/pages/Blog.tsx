
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";
import { Calendar, User, Plus, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author: string;
  createdAt: string;
}

const Blog = () => {
  const { isAdmin } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: ""
  });

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    setPosts(savedPosts);
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    localStorage.setItem("blogPosts", JSON.stringify(newPosts));
    setPosts(newPosts);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPost) {
      // Editando post existente
      const updatedPosts = posts.map(post => 
        post.id === editingPost.id 
          ? { ...editingPost, ...formData }
          : post
      );
      savePosts(updatedPosts);
      toast.success("Post atualizado com sucesso!");
      setEditingPost(null);
    } else {
      // Criando novo post
      const newPost: BlogPost = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      savePosts([newPost, ...posts]);
      toast.success("Post criado com sucesso!");
      setIsCreating(false);
    }
    
    setFormData({ title: "", content: "", excerpt: "", author: "" });
  };

  const handleDelete = (postId: string) => {
    const updatedPosts = posts.filter(post => post.id !== postId);
    savePosts(updatedPosts);
    toast.success("Post excluído com sucesso!");
  };

  const startEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content,
      excerpt: post.excerpt,
      author: post.author
    });
    setIsCreating(true);
  };

  const cancelEdit = () => {
    setIsCreating(false);
    setEditingPost(null);
    setFormData({ title: "", content: "", excerpt: "", author: "" });
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/6e4f1017-6bad-4cc1-a450-27f5919b2498.png" 
                alt="Connected Partners & Business Logo" 
                className="h-12 w-12 object-contain drop-shadow-lg filter brightness-110 contrast-125"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                Blog - Connected Partners & Business
              </h1>
            </Link>
            <div className="flex space-x-4">
              {isAdmin && (
                <Button 
                  onClick={() => setIsCreating(!isCreating)}
                  className="gradient-primary text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Post
                </Button>
              )}
              <Link to="/">
                <Button variant="outline">Voltar ao Início</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Formulário de Criação/Edição (apenas para admin) */}
        {isAdmin && isCreating && (
          <Card className="mb-8 gradient-card">
            <CardHeader>
              <CardTitle className="text-primary">
                {editingPost ? "Editar Post" : "Criar Novo Post"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title">Título *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="author">Autor *</Label>
                  <Input
                    id="author"
                    value={formData.author}
                    onChange={(e) => setFormData({...formData, author: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="excerpt">Resumo *</Label>
                  <Textarea
                    id="excerpt"
                    value={formData.excerpt}
                    onChange={(e) => setFormData({...formData, excerpt: e.target.value})}
                    placeholder="Breve resumo do post..."
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="content">Conteúdo *</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Conteúdo completo do post..."
                    rows={10}
                    required
                  />
                </div>
                
                <div className="flex space-x-4">
                  <Button type="submit" className="gradient-primary text-white">
                    {editingPost ? "Atualizar Post" : "Publicar Post"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelEdit}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Lista de Posts */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card className="gradient-card text-center py-12">
              <CardContent>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum post publicado ainda
                </h3>
                <p className="text-gray-600">
                  {isAdmin 
                    ? "Clique em 'Novo Post' para criar o primeiro post do blog."
                    : "Volte em breve para conferir nossos conteúdos educacionais!"
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="gradient-card hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(post.createdAt).toLocaleDateString()}
                        <User className="h-4 w-4 ml-4 mr-1" />
                        {post.author}
                      </div>
                      <CardTitle className="text-primary mb-2">{post.title}</CardTitle>
                      <CardDescription className="text-base">{post.excerpt}</CardDescription>
                    </div>
                    {isAdmin && (
                      <div className="flex space-x-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(post)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{post.content}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Blog;
