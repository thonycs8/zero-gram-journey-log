-- Inserir configurações do botão da loja externa na tabela page_content
INSERT INTO page_content (page_key, content_type, content, description) VALUES
('store_button_url', 'text', 'https://example.com/store', 'URL da loja externa'),
('store_button_name_pt', 'text', 'Visitar Loja', 'Nome do botão da loja em português'),
('store_button_name_en', 'text', 'Visit Store', 'Nome do botão da loja em inglês');