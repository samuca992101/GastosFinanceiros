// Interface da Entidade
export interface Pessoa {
    id: number;
    nome: string;
    idade: number;
}
// Interface da Categoria
export interface Categoria {
    id: number;
    descricao: string;
    finalidade: 0 | 1 | 2; 
}
// Interface da Transação
export interface Transacao {
    id?: number;
    descricao: string;
    valor: number;
    tipo: 0 | 1; 
    pessoaId: number;
    categoriaId: number;
}
// Interface do RelatorioItem
export interface RelatorioItem {
    id: number; 
    nome: string;
    totalReceitas: number;
    totalDespesas: number;
    saldo: number;
}