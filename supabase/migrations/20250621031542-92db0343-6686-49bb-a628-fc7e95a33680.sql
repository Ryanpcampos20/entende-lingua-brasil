
-- Drop all existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view all products" ON public.products;
DROP POLICY IF EXISTS "Users can insert their own products" ON public.products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.products;
DROP POLICY IF EXISTS "Users can delete their own products" ON public.products;
DROP POLICY IF EXISTS "Users can manage their own products" ON public.products;

DROP POLICY IF EXISTS "Users can view all quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can insert their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can update their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can delete their own quotes" ON public.quotes;
DROP POLICY IF EXISTS "Users can manage their own quotes" ON public.quotes;

-- Add admin role support to profiles table (only if column doesn't exist)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='profiles' AND column_name='role') THEN
        ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));
    END IF;
END $$;

-- Update RLS policies with proper WITH CHECK clauses
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own company" ON public.companies;
CREATE POLICY "Users can insert their own company" ON public.companies 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Recreate all product policies
CREATE POLICY "Users can view all products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Users can insert their own products" ON public.products 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own products" ON public.products 
  FOR UPDATE 
  USING (auth.uid() = user_id) 
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own products" ON public.products 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Recreate all quote policies
CREATE POLICY "Users can view all quotes" ON public.quotes FOR SELECT USING (true);
CREATE POLICY "Users can insert their own quotes" ON public.quotes 
  FOR INSERT 
  WITH CHECK (auth.uid() = solicitante_id);
CREATE POLICY "Users can update their own quotes" ON public.quotes 
  FOR UPDATE 
  USING (auth.uid() = solicitante_id) 
  WITH CHECK (auth.uid() = solicitante_id);
CREATE POLICY "Users can delete their own quotes" ON public.quotes 
  FOR DELETE 
  USING (auth.uid() = solicitante_id);

DROP POLICY IF EXISTS "Users can create quote responses" ON public.quote_responses;
CREATE POLICY "Users can create quote responses" ON public.quote_responses 
  FOR INSERT 
  WITH CHECK (auth.uid() = fornecedor_id);

DROP POLICY IF EXISTS "Users can send messages" ON public.messages;
CREATE POLICY "Users can send messages" ON public.messages 
  FOR INSERT 
  WITH CHECK (auth.uid() = sender_id);

-- Create security definer function to check admin role
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = user_id AND role = 'admin'
  );
$$;

-- Update the handle_new_user function to include role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, nome_empresa, cnpj, nome_responsavel, email, telefone, area_atuacao, tipo_estabelecimento, regiao, descricao, parcerias_desejadas, role)
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
    COALESCE(NEW.raw_user_meta_data->>'parcerias_desejadas', ''),
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
