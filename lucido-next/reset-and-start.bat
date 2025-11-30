@echo off
echo ========================================
echo Lucido - Reset e Start do Sistema
echo ========================================
echo.

echo [1/3] Limpando cache do Next.js...
if exist .next (
    rmdir /s /q .next
    echo Cache removido!
) else (
    echo Cache ja estava limpo.
)
echo.

echo [2/3] Verificando node_modules...
if not exist node_modules (
    echo Instalando dependencias...
    call npm install
) else (
    echo Dependencias OK.
)
echo.

echo [3/3] Iniciando servidor de desenvolvimento...
echo.
echo ========================================
echo Servidor rodando em: http://localhost:3000
echo Acesse: http://localhost:3000/auth/login
echo ========================================
echo.
echo Pressione Ctrl+C para parar o servidor
echo.

call npm run dev
