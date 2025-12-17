import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pessoa, Categoria } from '../types';

const Cadastros: React.FC = () => {
    // Armazenam a lista vinda do banco e os inputs controlados do formulário
    const [pessoas, setPessoas] = useState<Pessoa[]>([]);
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');

    const [categorias, setCategorias] = useState<Categoria[]>([]);
    const [catDesc, setCatDesc] = useState('');
    const [catFin, setCatFin] = useState(0);

    // URL da API (Ajustada para sua porta 5147)
    const API_URL = 'http://localhost:5147/api';
    //Executa uma vez ao montar o componente para buscar os dados iniciais na API.
    useEffect(() => {
        carregarPessoas();
        carregarCategorias();
    }, []);
    // Funções auxiliares para buscar dados atualizados do Back-end
    const carregarPessoas = () => axios.get(`${API_URL}/pessoas`).then(res => setPessoas(res.data));
    const carregarCategorias = () => axios.get(`${API_URL}/categorias`).then(res => setCategorias(res.data));

    // --- FUNÇÕES DE PESSOA ---
    /**
     * Envia uma nova pessoa para o banco de dados.
     * Valida dos dados.
     */
    const salvarPessoa = async () => {
        if(!nome || !idade) return alert("Preencha nome e idade");
        await axios.post(`${API_URL}/pessoas`, { nome, idade: Number(idade) });
        setNome(''); setIdade('');
        carregarPessoas();
    };

    const deletarPessoa = async (id: number) => {
        if(window.confirm("Tem certeza? Isso apagará todas as transações desta pessoa.")) {
            await axios.delete(`${API_URL}/pessoas/${id}`);
            carregarPessoas();
        }
    };

    // --- FUNÇÕES DE CATEGORIA ---
    /**
     * Cria uma nova categoria financeira (Receita, Despesa ou Ambas).
     */
    const salvarCategoria = async () => {
        if(!catDesc) return alert("Preencha a descrição");
        await axios.post(`${API_URL}/categorias`, { descricao: catDesc, finalidade: Number(catFin) });
        setCatDesc('');
        carregarCategorias();
    };

    // NOVA FUNÇÃO: DELETAR CATEGORIA
    /**
     * Remove uma pessoa pelo ID.
     * Exibe um alerta de confirmação pois essa ação deleta em cascata
     * todas as transações financeiras vinculadas a essa pessoa.
     */
    const deletarCategoria = async (id: number) => {
        const msg = "Atenção: Se houver transações usando esta categoria, elas também serão apagadas. Deseja continuar?";
        if(window.confirm(msg)) {
            try {
                await axios.delete(`${API_URL}/categorias/${id}`);
                carregarCategorias();
            } catch (error) {
                alert("Erro ao deletar categoria.");
            }
        }
    };

    return (
        <div style={{ display: 'flex', gap: '50px' }}>
            {/* Coluna Pessoas */}
            <div>
                <h3>1. Cadastrar Pessoa</h3>
                <input placeholder="Nome" value={nome} onChange={e => setNome(e.target.value)} />
                <input placeholder="Idade" type="number" value={idade} onChange={e => setIdade(e.target.value)} />
                <button onClick={salvarPessoa}>Salvar Pessoa</button>

                <ul>
                    {pessoas.map(p => (
                        <li key={p.id}>
                            {p.nome} ({p.idade} anos) 
                            <button onClick={() => deletarPessoa(p.id)} style={{marginLeft: '10px', color: 'red', cursor: 'pointer'}}>X</button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Coluna Categorias */}
            <div>
                <h3>2. Cadastrar Categoria</h3>
                <input placeholder="Descrição (ex: Salário)" value={catDesc} onChange={e => setCatDesc(e.target.value)} />
                <select value={catFin} onChange={e => setCatFin(Number(e.target.value))}>
                    <option value={0}>Despesa</option>
                    <option value={1}>Receita</option>
                    <option value={2}>Ambas</option>
                </select>
                <button onClick={salvarCategoria}>Salvar Categoria</button>
                
                <ul>
                    {categorias.map(c => (
                        <li key={c.id}>
                            {c.descricao} 
                            {/* NOVO BOTÃO DELETAR CATEGORIA */}
                            <button onClick={() => deletarCategoria(c.id)} style={{marginLeft: '10px', color: 'red', cursor: 'pointer'}}>X</button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Cadastros;