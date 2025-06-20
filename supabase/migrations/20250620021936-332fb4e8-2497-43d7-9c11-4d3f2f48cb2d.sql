
-- Create user profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_empresa TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  nome_responsavel TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  area_atuacao TEXT NOT NULL,
  tipo_estabelecimento TEXT NOT NULL,
  regiao TEXT NOT NULL,
  descricao TEXT,
  parcerias_desejadas TEXT NOT NULL,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create companies table for business directory
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_empresa TEXT NOT NULL,
  cnpj TEXT NOT NULL UNIQUE,
  nome_responsavel TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  area_atuacao TEXT NOT NULL,
  tipo_estabelecimento TEXT NOT NULL,
  regiao TEXT NOT NULL,
  descricao TEXT,
  parcerias_desejadas TEXT NOT NULL,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco DECIMAL(10,2),
  categoria TEXT,
  disponivel BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quotes table
CREATE TABLE public.quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  setor TEXT NOT NULL,
  orcamento TEXT,
  prazo TEXT,
  status TEXT DEFAULT 'aberta' CHECK (status IN ('aberta', 'em_analise', 'fechada')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create quote responses table
CREATE TABLE public.quote_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id UUID REFERENCES public.quotes(id) ON DELETE CASCADE NOT NULL,
  fornecedor_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  proposta TEXT NOT NULL,
  valor TEXT,
  prazo_entrega TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create messages table for chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  read_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create matches table for partnership matching
CREATE TABLE public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  user2_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  score INTEGER NOT NULL,
  motivo TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'aceito', 'rejeitado')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for companies
CREATE POLICY "Users can view all companies" ON public.companies FOR SELECT USING (true);
CREATE POLICY "Users can insert their own company" ON public.companies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own company" ON public.companies FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for products
CREATE POLICY "Users can view all products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can manage their own products" ON public.products FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for quotes
CREATE POLICY "Users can view all quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own quotes" ON public.quotes FOR ALL USING (auth.uid() = solicitante_id);

-- RLS Policies for quote responses
CREATE POLICY "Users can view quote responses" ON public.quote_responses FOR SELECT USING (true);
CREATE POLICY "Users can create quote responses" ON public.quote_responses FOR INSERT WITH CHECK (auth.uid() = fornecedor_id);
CREATE POLICY "Users can update their own responses" ON public.quote_responses FOR UPDATE USING (auth.uid() = fornecedor_id);

-- RLS Policies for messages
CREATE POLICY "Users can view their messages" ON public.messages 
  FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages 
  FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their received messages" ON public.messages 
  FOR UPDATE USING (auth.uid() = receiver_id);

-- RLS Policies for matches
CREATE POLICY "Users can view their matches" ON public.matches 
  FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);
CREATE POLICY "System can create matches" ON public.matches FOR INSERT WITH CHECK (true);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_empresa, cnpj, nome_responsavel, email, telefone, area_atuacao, tipo_estabelecimento, regiao, descricao, parcerias_desejadas)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nome_empresa', ''),
    COALESCE(NEW.raw_user_meta_data->>'cnpj', ''),
    COALESCE(NEW.raw_user_meta_data->>'nome_responsavel', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'telefone', ''),
    COALESCE(NEW.raw_user_meta_data->>'area_atuacao', ''),
    COALESCE(NEW.raw_user_meta_data->>'tipo_estabelecimento', ''),
    COALESCE(NEW.raw_user_meta_data->>'regiao', ''),
    COALESCE(NEW.raw_user_meta_data->>'descricao', ''),
    COALESCE(NEW.raw_user_meta_data->>'parcerias_desejadas', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to calculate partnership matches
CREATE OR REPLACE FUNCTION public.calculate_matches(user_id UUID)
RETURNS TABLE (
  match_user_id UUID,
  score INTEGER,
  motivo TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p2.id,
    CASE 
      WHEN p1.area_atuacao = p2.parcerias_desejadas AND p1.parcerias_desejadas = p2.area_atuacao THEN 90
      WHEN p1.parcerias_desejadas = p2.area_atuacao THEN 70
      WHEN p1.area_atuacao = p2.parcerias_desejadas THEN 60
      ELSE 30
    END +
    CASE 
      WHEN p1.regiao = p2.regiao THEN 20
      WHEN p1.regiao LIKE '%nacional%' OR p2.regiao LIKE '%nacional%' THEN 15
      ELSE 0
    END +
    CASE 
      WHEN p1.tipo_estabelecimento != p2.tipo_estabelecimento THEN 10
      ELSE 0
    END AS match_score,
    CASE 
      WHEN p1.area_atuacao = p2.parcerias_desejadas AND p1.parcerias_desejadas = p2.area_atuacao THEN 'Match perfeito de setores'
      WHEN p1.parcerias_desejadas = p2.area_atuacao THEN 'Interessado no seu setor'
      WHEN p1.area_atuacao = p2.parcerias_desejadas THEN 'Atua no setor de seu interesse'
      ELSE 'Potencial parceria'
    END AS match_reason
  FROM public.profiles p1
  CROSS JOIN public.profiles p2
  WHERE p1.id = user_id AND p2.id != user_id
  ORDER BY match_score DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
