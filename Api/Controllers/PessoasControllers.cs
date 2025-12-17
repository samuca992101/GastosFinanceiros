using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestaoGastos.API.Data;
using GestaoGastos.API.Models;

namespace GestaoGastos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PessoasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PessoasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/pessoas
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _context.Pessoas.ToListAsync());
        }

        // POST: api/pessoas
        [HttpPost]
        public async Task<IActionResult> Create(Pessoa pessoa)
        {
            _context.Pessoas.Add(pessoa);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetAll), new { id = pessoa.Id }, pessoa);
        }

        // DELETE: api/pessoas/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var pessoa = await _context.Pessoas.FindAsync(id);
            if (pessoa == null) return NotFound();

            _context.Pessoas.Remove(pessoa);
            await _context.SaveChangesAsync();
            return NoContent();
        } 

        // GET: api/pessoas/totais
        [HttpGet("totais")]
        public async Task<IActionResult> GetTotais()
        {
            var pessoas = await _context.Pessoas.Include(p => p.Transacoes).ToListAsync();

            var relatorio = pessoas.Select(p => new
            {
                p.Id,
                p.Nome,
                TotalReceitas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor),
                TotalDespesas = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor),
                Saldo = p.Transacoes.Where(t => t.Tipo == TipoTransacao.Receita).Sum(t => t.Valor) 
                        - p.Transacoes.Where(t => t.Tipo == TipoTransacao.Despesa).Sum(t => t.Valor)
            }).ToList();

            var totalGeral = new
            {
                TotalReceitasGeral = relatorio.Sum(r => r.TotalReceitas),
                TotalDespesasGeral = relatorio.Sum(r => r.TotalDespesas),
                SaldoLiquidoGeral = relatorio.Sum(r => r.Saldo)
            };

            return Ok(new { Pessoas = relatorio, TotalGeral = totalGeral });
        }
    }
}