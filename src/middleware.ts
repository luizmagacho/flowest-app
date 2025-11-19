import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("flowest-token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Defina quais são suas rotas públicas
  const publicPaths = [
    "/",
    "/login",
    "/recuperar-senha",
    "/redefinir-senha",
    "/criar-conta",
    "/inscricao",
  ]; // A página principal agora é pública!

  // 2. Verifique se a rota atual é pública
  const isPublicPath = publicPaths.includes(pathname);

  // --- LÓGICA ATUALIZADA ---

  // CASO 1: Usuário JÁ ESTÁ LOGADO e tenta acessar uma página pública (landing page ou login)
  if (token && isPublicPath) {
    // Redirecionamos para o dashboard para uma melhor experiência do usuário.
    return NextResponse.redirect(new URL("/portfolio", request.url));
  }

  // CASO 2: Usuário NÃO ESTÁ LOGADO e tenta acessar uma rota PROTEGIDA
  if (!token && !isPublicPath) {
    // Redirecionamos para a página de login.
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Se nenhuma das condições acima for atendida, permite o acesso.
  // (Ex: usuário logado em rota protegida, ou usuário não logado em rota pública)
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Corresponde a todos os caminhos de requisição, EXCETO para:
     * - /api (rotas de API)
     * - /_next/static (arquivos estáticos, como CSS e JS)
     * - /_next/image (arquivos de otimização de imagem)
     * - /favicon.ico (o ícone do site)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
