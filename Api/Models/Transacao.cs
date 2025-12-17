namespace GestaoGastos.API.Models
{
    public enum TipoTransacao { Despesa = 0, Receita = 1 }
    //Entidade ORM transação
    public class Transacao
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public decimal Valor { get; set; }
        public TipoTransacao Tipo { get; set; }

        public int CategoriaId { get; set; }
        public Categoria? Categoria { get; set; }

        public int PessoaId { get; set; }
        public Pessoa? Pessoa { get; set; }
    }
}