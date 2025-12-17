using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using GestaoGastos.API.Data;
using GestaoGastos.API.Models;
using GestaoGastos.API.Services;

namespace GestaoGastos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransacoesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TransacaoService _service;

        // Injeção de dependência do Banco e do Serviço de validação
        public TransacoesController(AppDbContext context, TransacaoService service)
        {
            _context = context;
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            // Traz os dados da transação preenchendo o Nome da Pessoa e a Descrição da Categoria
            var lista = await _context.Transacoes
                .Include(t => t.Pessoa)
                .Include(t => t.Categoria)
                .ToListAsync();
            
            return Ok(lista);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Transacao transacao)
        {
            var erro = await _service.ValidarTransacao(transacao);
            if (erro != null)
            {
                return BadRequest(erro);
            }

            _context.Transacoes.Add(transacao);
            await _context.SaveChangesAsync();

            // Limpa referência para evitar loop infinito no JSON
            transacao.Pessoa = null;
            transacao.Categoria = null;

            return CreatedAtAction(nameof(GetAll), new { id = transacao.Id }, transacao);
        }
    }
}