import { Agent, callable, routeAgentRequest } from "agents";
import { generateText } from "ai";
import { createWorkersAI } from "workers-ai-provider";
import { createRemoteJWKSet, jwtVerify } from "jose";

interface Env { AI: Ai; ACCESS_TEAM_DOMAIN?: string; ACCESS_AUD?: string; }
type Speaker = "user" | "architect" | "critic" | "verifier" | "synthesis" | "system";
type Entry = { id: string; speaker: Speaker; stage: string; text: string; createdAt: number };
type CouncilState = { status: "idle" | "running" | "complete" | "error"; task: string; entries: Entry[]; finalAnswer: string; updatedAt: number };

const MODELS = {
  architect: "@cf/zai-org/glm-4.7-flash",
  critic: "@cf/qwen/qwen3-30b-a3b-fp8",
  verifier: "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
  synthesis: "@cf/zai-org/glm-4.7-flash"
} as const;
const MAX_TASK_LENGTH = 8_000;
const MAX_ENTRIES = 80;
const makeEntry = (speaker: Speaker, stage: string, text: string): Entry => ({ id: crypto.randomUUID(), speaker, stage, text, createdAt: Date.now() });

export class CouncilAgent extends Agent<Env, CouncilState> {
  initialState: CouncilState = { status: "idle", task: "", entries: [], finalAnswer: "", updatedAt: Date.now() };

  private async ask(model: string, system: string, prompt: string): Promise<string> {
    const workersai = createWorkersAI({ binding: (this as unknown as { env: Env }).env.AI });
    const result = await generateText({ model: workersai(model), system, prompt, maxOutputTokens: 1_200, temperature: 0.35 });
    return result.text.trim();
  }

  private append(...items: Entry[]) {
    this.setState({ ...this.state, entries: [...this.state.entries, ...items].slice(-MAX_ENTRIES), updatedAt: Date.now() });
  }

  @callable()
  async runCouncil(rawTask: string) {
    const task = rawTask.trim();
    if (!task) throw new Error("Опиши задачу.");
    if (task.length > MAX_TASK_LENGTH) throw new Error("Максимум 8000 символов.");
    if (this.state.status === "running") throw new Error("Совет уже работает. Дождись завершения.");

    this.setState({ ...this.state, status: "running", task, finalAnswer: "", entries: [makeEntry("user", "Задача", task)], updatedAt: Date.now() });
    try {
      const [architect, critic] = await Promise.all([
        this.ask(MODELS.architect, "Ты архитектор и ведущий инженер. Самостоятельно реши задачу. Дай конкретный план, технические решения, риски и проверяемые критерии результата. Не выдумывай факты.", task),
        this.ask(MODELS.critic, "Ты независимый критик. Самостоятельно разбери задачу с нуля. Ищи более сильные решения, скрытые ограничения, угрозы безопасности, стоимость и причины провала очевидного плана. Не подстраивайся под предполагаемый ответ.", task)
      ]);
      this.append(makeEntry("architect", "Независимый анализ · GLM-4.7-Flash", architect), makeEntry("critic", "Независимая критика · Qwen3-30B", critic));

      const rebuttal = await this.ask(
        MODELS.verifier,
        "Ты технический арбитр. Прочитай два независимых мнения. Укажи противоречия, что критик опроверг убедительно, что архитектор защитил убедительно, и какие утверждения требуют проверки. Не сглаживай реальные разногласия.",
        "ЗАДАЧА:\n" + task + "\n\nАНАЛИЗ АРХИТЕКТОРА:\n" + architect + "\n\nКРИТИКА:\n" + critic
      );
      this.append(makeEntry("verifier", "Раунд возражений · Llama 3.3 70B", rebuttal));

      const finalAnswer = await this.ask(
        MODELS.synthesis,
        "Ты главный синтезатор. Подготовь единый практический ответ. Используй только обоснованные выводы. Отделяй подтверждённое от предположений. Если данных не хватает — прямо скажи. В конце дай ближайший конкретный шаг.",
        "ЗАДАЧА:\n" + task + "\n\nАРХИТЕКТОР:\n" + architect + "\n\nКРИТИК:\n" + critic + "\n\nАРБИТР И ВОЗРАЖЕНИЯ:\n" + rebuttal
      );
      this.append(makeEntry("synthesis", "Итог совета · GLM-4.7-Flash", finalAnswer));
      this.setState({ ...this.state, status: "complete", finalAnswer, updatedAt: Date.now() });
      return finalAnswer;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Неизвестная ошибка";
      this.append(makeEntry("system", "Ошибка", message));
      this.setState({ ...this.state, status: "error", updatedAt: Date.now() });
      throw error;
    }
  }

  @callable()
  clearHistory() {
    if (this.state.status === "running") throw new Error("Нельзя очистить историю во время выполнения.");
    this.setState({ status: "idle", task: "", entries: [], finalAnswer: "", updatedAt: Date.now() });
  }
}

async function hasValidAccessToken(request: Request, env: Env): Promise<boolean> {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return false;
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return false;
  try {
    const issuer = env.ACCESS_TEAM_DOMAIN.replace(/\\/$/, "");
    const jwks = createRemoteJWKSet(new URL(issuer + "/cdn-cgi/access/certs"));
    await jwtVerify(token, jwks, { audience: env.ACCESS_AUD, issuer });
    return true;
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: Env) {
    if (!(await hasValidAccessToken(request, env))) {
      const status = env.ACCESS_TEAM_DOMAIN && env.ACCESS_AUD ? 401 : 503;
      return Response.json({ error: status === 401 ? "Access denied" : "Cloudflare Access is not configured" }, { status });
    }
    return (await routeAgentRequest(request, env)) ?? new Response("Not found", { status: 404 });
  }
} satisfies ExportedHandler<Env>;
