SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('carrinhos', 'itens_carrinho')
ORDER BY table_name;