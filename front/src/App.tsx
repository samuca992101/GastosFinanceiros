import React, { useState } from 'react';
import Cadastros from './components/Cadastros';
import TransactionForm from './components/TransactionForm';
import Dashboard from './components/Dashboard';

function App() {
  // Estado para atualizar o dashboard quando uma transação for criada
  const [updateDash, setUpdateDash] = useState(false);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h1>💰 Sistema de Controle de Gastos</h1>
      <hr />
      
      {/* 1. Área de Cadastros */}
      <Cadastros />
      
      <hr />
      
      {/* 2. Área de Transações */}
      <TransactionForm onSuccess={() => setUpdateDash(!updateDash)} />
      
      <hr />
      
      {/* 3. Área de Relatórios */}
      <Dashboard refresh={updateDash} />
    </div>
  );
}

export default App;