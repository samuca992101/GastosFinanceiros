namespace GestaoGastos.API.Models
{
    public enum FinalidadeCategoria { Despesa = 0, Receita = 1, Ambas = 2 }
    // Entidade ORM Categoria
    public class Categoria
    {
        public int Id { get; set; }
        public string Descricao { get; set; } = string.Empty;
        public FinalidadeCategoria Finalidade { get; set; }
    }
}