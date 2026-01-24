import { NextFunction, Response, Request } from "express";

// Função anonima que recebe uma funcao, no caso o controller
// Retorna uma funcao com o padrao de um controller do express
export const asyncHandler =
  (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
    // Caso a funcao na o seja enviada como async, criamos uma Promise
    // Se a Promise falhar, chamamos o next com o erro
    Promise.resolve(fn(req, res, next)).catch(next);

    // Fico agurardadno a funcao fn(req, res, next), que foi a envida resolver,
    // Caso de um erro usa o catch e da um next para a rota de erro
  };
