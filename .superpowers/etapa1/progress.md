# SDD ledger — plan: etapa 1 (análise do módulo de gestão, itens "dá para implantar já")

Spec: lista "Dá para implantar já" da análise do prompt Louzada, aplicada ao ERP Admycar.

Tarefas:
1. Simulador com três cenários (à vista, financiado, com troca), CET, alerta de 30% da renda, aviso de estimativa.
2. Funil com 8 etapas e regras de bloqueio; Vendido marca o veículo como vendido.
3. Tarefas calculadas na leitura (lead sem contato, agendamento, não compareceu, pós test drive, 48 h sem resposta).
4. Prazo de 30 dias da transferência com alerta a 5 dias.
5. Checklist de documentos por veículo.
6. Margem por veículo (custo, despesas vinculadas, comissão).
7. Impressão A4 (proposta, ficha do cliente, termo de entrega, recibo).
8. Avisos legais fixos.
9. Validação de CPF/CNPJ, máscaras e CEP via ViaCEP.
10. Indicadores novos no dashboard.

Ruling: sem repositório git — sem worktree e sem commits; o ledger é o registro — custo se errado: nenhum histórico por tarefa.
Ruling: sem framework de teste no projeto — lógica pura em `src/lib/negocio/*.ts` testada com `node --test` (Node 24 roda TypeScript); arquivos `*.test.ts` excluídos do tsconfig — custo se errado: componentes React sem teste automatizado, verificados no browser.
Ruling: dados novos (simulações, checklist, transferências) ficam nos extras em localStorage, como os outros módulos — custo se errado: não compartilham entre usuários até a migração para o Supabase.
Task 1: complete — `src/lib/negocio/simulacao.ts` (+16 testes), `avisos.ts`, `AvisoLegal`, `SimulacaoCenarioCard`, `CalculadoraPage` reescrita, extra `simulacoes`; browser: validação, 3 cenários, alerta de renda e gravação conferidos.
Task 2: código pronto — `funil.ts` (+9 testes), `FunilTransicaoDialog`, `KanbanColumn`/`KanbanPage` com 8 etapas, seed migrado; browser: mapeamento das colunas antigas e abertura do diálogo de venda conferidos; venda (MT-07 → vendido) e perda (motivo + Reabrir) conferidas no browser após autorização. Uma venda acidental do Pulse (pré-seleção antiga) foi desfeita nos dados demo.
Task 3: complete — `tarefas.ts` (+11 testes), `DashboardTarefas` no dashboard.
Task 4: complete — `transferencia.ts`, painel na ficha do veículo vendido, tarefas de alerta.
Task 5: complete — `checklist.ts`, extra `checklists`, `VeiculoChecklist` em `/veiculos/[id]`.
Task 6: complete — `margem.ts`, card na ficha e colunas no relatório de veículos.
Task 7: complete — rotas `/imprimir/{proposta,ficha,recibo,entrega}/[id]` sem sidebar.
Task 8: complete — `AvisoLegal` no simulador, dashboard, ficha, relatório e impressos.
Task 9: complete — `documento.ts`, máscaras e ViaCEP no `ClienteForm`; CPF/CNPJ do seed corrigidos.
Task 10: complete — `indicadores.ts` e `DashboardIndicadores` no `/sistema`.
Pre-flight: tarefas 3, 4 e 10 consomem as funções puras das tarefas 2, 4 e 6 (etapas do funil, prazo, margem); tarefa 7 consome a simulação salva da tarefa 1 e os avisos da tarefa 8.
