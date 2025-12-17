import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RelatorioItem } from '../types';

// Define a prop para forçar atualização quando criar nova transação
const Dashboard: React.FC<{ refresh: boolean }> = ({ refresh }) => {
    const [dados, setDados] = useState<{ pessoas: RelatorioItem[], totalGeral: any } | null>(null);

    useEffect(() => {
        axios.get('http://localhost:5147/api/pessoas/totais').then(res => setDados(res.data));
    }, [refresh]);

    if (!dados) return <p>Carregando totais...</p>;

    return (
        <div style={{marginTop: '20px'}}>
            <h2>4. Dashboard Financeiro (Totais)</h2>
            <table border={1} cellPadding={10} style={{width: '100%', borderCollapse: 'collapse'}}>
                <thead style={{backgroundColor: '#f0f0f0'}}>
                    <tr>
                        <th>Pessoa</th>
                        <th>Receitas</th>
                        <th>Despesas</th>
                        <th>Saldo Líquido</th>
                    </tr>
                </thead>
                <tbody>
                    {dados.pessoas.map(p => (
                        <tr key={p.id}>
                            <td>{p.nome}</td>
                            <td style={{color: 'green'}}>R$ {p.totalReceitas.toFixed(2)}</td>
                            <td style={{color: 'red'}}>R$ {p.totalDespesas.toFixed(2)}</td>
                            <td style={{fontWeight: 'bold'}}>R$ {p.saldo.toFixed(2)}</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr style={{backgroundColor: '#333', color: '#fff'}}>
                        <td>TOTAL GERAL</td>
                        <td>R$ {dados.totalGeral.totalReceitasGeral.toFixed(2)}</td>
                        <td>R$ {dados.totalGeral.totalDespesasGeral.toFixed(2)}</td>
                        <td>R$ {dados.totalGeral.saldoLiquidoGeral.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default Dashboard;