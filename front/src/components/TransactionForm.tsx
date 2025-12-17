import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pessoa, Categoria } from '../types';

/**
 * Componente TransactionForm
 * Formulário responsável pelo lançamento de novas receitas e despesas.
 * * Funcionalidades principais:
 * 1. Busca Pessoas e Categorias para preencher os menus de seleção (Dropdowns).
 * 2. Envia os dados para a API processar.
 * 3. Exibe mensagens de erro vindas do Back-end caso alguma Regra de Negócio seja violada
 * (ex: Menor de idade lançando Receita).
 * * @param onSuccess Callback disparado quando uma transação é salva com êxito.
 * Usado para avisar o componente pai que o Dashboard deve ser recarregado.
 */
const TransactionForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
    // --- ESTADOS DE DADOS AUXILIARES ---
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);
    
    // Estado para feedback visual (Mensagens de sucesso ou erro)
    const [msg, setMsg] = useState('');
    
    // --- ESTADO DO FORMULÁRIO ---
    // Agrupando todos os inputs em um único objeto para facilitar a manipulação
    const [form, setForm] = useState({
        descricao: '', valor: 0, tipo: 0, pessoaId: 0, categoriaId: 0
    });

    /**
     * useEffect: Carregamento Inicial.
     * Busca as listas de Pessoas e Categorias assim que o componente monta,
     * garantindo que o usuário tenha opções para selecionar nos dropdowns.
     */
    useEffect(() => {
        axios.get('http://localhost:5147/api/pessoas').then(res => setPessoas(res.data));
        axios.get('http://localhost:5147/api/categorias').then(res => setCategorias(res.data));
    }, []);

    /**
     * Envia os dados do formulário para a API.
     * Inclui tratamento de erro (try/catch) específico para exibir
     * as mensagens de validação retornadas pelo C# (BadRequest).
     */
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Evita o recarregamento da página padrão do HTML
        setMsg('');
        
        try {
            await axios.post('http://localhost:5147/api/transacoes', form);
            setMsg('✅ Sucesso!');
            onSuccess(); // Gatilho para atualizar o Dashboard e os Totais
        } catch (error: any) {
            // Captura a mensagem de erro enviada pelo Back-end.
            // Se não houver mensagem específica, exibe erro genérico.
            setMsg(`Erro: ${error.response?.data || 'Erro desconhecido'}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{border: '1px solid #ccc', padding: '10px', marginTop: '20px'}}>
            <h3>3. Lançar Transação</h3>
            
            {/* Exibição condicional de mensagens de erro/sucesso */}
            {msg && <p>{msg}</p>}
            
            <div style={{display: 'flex', gap: '10px', flexWrap: 'wrap'}}>
                {/* Inputs de Texto e Valor */}
                <input placeholder="Descrição" required onChange={e => setForm({...form, descricao: e.target.value})} />
                <input placeholder="Valor" type="number" step="0.01" required onChange={e => setForm({...form, valor: Number(e.target.value)})} />
                
                {/* Select de Tipo (0: Despesa, 1: Receita) */}
                <select onChange={e => setForm({...form, tipo: Number(e.target.value)})}>
                    <option value={0}>Despesa</option>
                    <option value={1}>Receita</option>
                </select>

                {/* Select de Pessoas (Populada pela API) */}
                <select required onChange={e => setForm({...form, pessoaId: Number(e.target.value)})}>
                    <option value="">Selecione a Pessoa</option>
                    {pessoas.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                </select>

                {/* Select de Categorias (Populada pela API) */}
                <select required onChange={e => setForm({...form, categoriaId: Number(e.target.value)})}>
                    <option value="">Selecione a Categoria</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
                </select>

                <button type="submit">Lançar</button>
            </div>
        </form>
    );
};

export default TransactionForm;