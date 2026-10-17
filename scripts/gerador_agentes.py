# =============================================================================
# Gerador multi-agente (CrewAI) — ferramenta auxiliar do repositório Admycar
# (Next.js/TypeScript). Não faz parte do build do app; rode manualmente quando
# quiser gerar/refinar código Python com IA.
#
# Instalação (PowerShell, na raiz do projeto):
#
#   python -m venv .venv-crewai
#   .\.venv-crewai\Scripts\Activate.ps1
#   pip install -U pip
#   pip install -r scripts/requirements-agentes.txt
#
# Pacotes principais: crewai, langchain-openai, python-dotenv
#
# Variáveis de ambiente (crie/edite .env na raiz do projeto):
#
#   OPENAI_API_KEY=sk-...
#   OPENAI_MODEL_NAME=gpt-4o-mini   # opcional; padrão abaixo
#
# Execução:
#
#   python scripts/gerador_agentes.py
#
# Saída: scripts/funcao_criada.py
# =============================================================================

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

from crewai import Agent, Crew, LLM, Process, Task
from dotenv import load_dotenv

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent
OUTPUT_FILE = SCRIPT_DIR / "funcao_criada.py"
DEFAULT_MODEL = "gpt-4o-mini"

# =============================================================================
# ALTERE AQUI: especificação da função que a equipe deve criar
# =============================================================================
TAREFA_CODIGO = """
Crie uma função Python `calcular_preco_sugerido(preco_base: float, ano: int, km: int) -> float`
para contexto de revenda de veículos:
- Rejeite valores inválidos (preco_base <= 0, ano < 1980, km < 0) levantando ValueError.
- Depreciação por idade: 8% ao ano nos primeiros 5 anos; depois disso, 4% por ano
  adicional (idade = ano atual do sistema - ano do veículo), com teto total de 55%.
- Ajuste por quilometragem: acima de 60_000 km, desconto extra de 1% a cada 10_000 km
  (após os 60k), com teto de 12% neste componente.
- Retorne o preço final arredondado em 2 casas decimais.
Inclua docstring em português, type hints e um bloco `if __name__ == "__main__":`
com 2 exemplos de uso impressos.
"""


def _extrair_python(texto: str) -> str:
    """Remove cercas markdown e ruído comum na resposta do LLM."""
    texto = texto.strip()
    match = re.search(r"```(?:python)?\s*(.*?)```", texto, re.DOTALL | re.IGNORECASE)
    if match:
        return match.group(1).strip() + "\n"
    return texto + ("\n" if not texto.endswith("\n") else "")


def _configurar_llm() -> LLM:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        print(
            "Erro: defina OPENAI_API_KEY no arquivo .env (raiz do projeto) ou no ambiente.",
            file=sys.stderr,
        )
        sys.exit(1)

    model = os.getenv("OPENAI_MODEL_NAME", DEFAULT_MODEL)
    return LLM(model=model, api_key=api_key, temperature=0.2)


def main() -> None:
    load_dotenv(PROJECT_ROOT / ".env")

    llm = _configurar_llm()

    programador = Agent(
        role="Programador Sênior",
        goal=(
            "Implementar código Python correto, legível e alinhado à especificação, "
            "seguindo boas práticas (PEP 8, tipos, docstrings)."
        ),
        backstory=(
            "Você é um engenheiro Python sênior acostumado a entregar funções pequenas "
            "e bem testáveis para ferramentas internas de automação."
        ),
        llm=llm,
        verbose=True,
    )

    revisor = Agent(
        role="Revisor de Código / QA",
        goal=(
            "Encontrar bugs, inconsistências de lógica e problemas de estilo; "
            "entregar a versão final pronta para salvar em arquivo .py."
        ),
        backstory=(
            "Você revisa pull requests com rigor, prioriza casos de borda e garante "
            "que o código rode sem ajustes manuais."
        ),
        llm=llm,
        verbose=True,
    )

    task_implementar = Task(
        description=(
            "Implemente a especificação abaixo em Python 3.11+.\n\n"
            f"{TAREFA_CODIGO.strip()}\n\n"
            "Entregue um único módulo Python coeso (sem dependências externas além da stdlib)."
        ),
        expected_output=(
            "Rascunho completo do módulo Python com a função solicitada, validações, "
            "docstring e exemplos no bloco __main__."
        ),
        agent=programador,
    )

    task_revisar = Task(
        description=(
            "Revise o código produzido na tarefa anterior.\n"
            "- Corrija bugs e edge cases.\n"
            "- Garanta que o módulo é executável (`python funcao_criada.py`).\n"
            "- Remova explicações em prosa; a saída deve ser SOMENTE código Python válido.\n"
            f"- Este código será gravado em `{OUTPUT_FILE.name}`."
        ),
        expected_output=(
            "Código Python final, completo e validado, sem markdown, pronto para execução."
        ),
        agent=revisor,
        context=[task_implementar],
        output_file=str(OUTPUT_FILE),
    )

    crew = Crew(
        agents=[programador, revisor],
        tasks=[task_implementar, task_revisar],
        process=Process.sequential,
        verbose=True,
    )

    print(f"Modelo: {os.getenv('OPENAI_MODEL_NAME', DEFAULT_MODEL)}")
    print(f"Arquivo de saída: {OUTPUT_FILE}\n")

    result = crew.kickoff()

    if OUTPUT_FILE.is_file():
        bruto = OUTPUT_FILE.read_text(encoding="utf-8")
        limpo = _extrair_python(bruto)
        if limpo != bruto:
            OUTPUT_FILE.write_text(limpo, encoding="utf-8")
    else:
        OUTPUT_FILE.write_text(_extrair_python(str(result)), encoding="utf-8")

    print(f"\nConcluído. Código salvo em: {OUTPUT_FILE}")


if __name__ == "__main__":
    main()
