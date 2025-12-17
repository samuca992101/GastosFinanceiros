using GestaoGastos.API.Data;
using GestaoGastos.API.Models;

namespace GestaoGastos.API.Services
{
    public class TransacaoService
    {
        private readonly AppDbContext _context;
    //Regras de negócios
        public TransacaoService(AppDbContext context)
        {
            _context = context;
        }
    // Validar se uma transação é válida ou não
        public async Task<string?> ValidarTransacao(Transacao transacao)
        {
            var pessoa = await _context.Pessoas.FindAsync(transacao.PessoaId);
            var categoria = await _context.Categorias.FindAsync(transacao.CategoriaId);

            if (pessoa == null || categoria == null) return "Pessoa ou Categoria não encontradas.";

            // Regra: Menor de 18 anos não pode ter Receita
            if (pessoa.Idade < 18 && transacao.Tipo == TipoTransacao.Receita)
            {
                return "Menores de 18 anos só podem cadastrar despesas.";
            }

            // Regra: Categoria deve bater com o Tipo (Despesa/Receita)
            if (categoria.Finalidade != FinalidadeCategoria.Ambas)
            {
                // Converte para int para comparar os Enums
                if ((int)categoria.Finalidade != (int)transacao.Tipo)
                {
                    return $"A categoria '{categoria.Descricao}' não permite esse tipo de lançamento.";
                }
            }

            return null; // Null significa que não houve erro
        }
    }
}