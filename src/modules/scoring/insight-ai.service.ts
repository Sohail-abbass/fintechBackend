import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import type { BehaviorAnalysis } from './behavior.service';

export type InsightItem = {
  type: 'warning' | 'advice' | 'insight';
  message: string;
};

type AIResponse = {
  choices: {
    message: {
      content: string;
    };
  }[];
};

@Injectable()
export class InsightAIService {
  private readonly logger = new Logger(InsightAIService.name);
  private readonly apiKey: string = process.env.OPENROUTER_API_KEY ?? '';

  private isInsightItem(item: unknown): item is InsightItem {
    if (!item || typeof item !== 'object') return false;

    const obj = item as Record<string, unknown>;

    return (
      (obj.type === 'warning' ||
        obj.type === 'advice' ||
        obj.type === 'insight') &&
      typeof obj.message === 'string'
    );
  }

  async generateInsight(data: BehaviorAnalysis): Promise<InsightItem[]> {
    // Try AI first, fallback to mock
    try {
      const aiResult = await this.generateAIInsight(data);
      if (aiResult.length > 0 && aiResult[0].type !== 'warning') {
        return aiResult;
      }
    } catch (error) {
      this.logger.warn('AI insight failed, using mock', error);
    }

    // Mock insights based on data
    return this.generateMockInsights(data);
  }

  private async generateAIInsight(data: BehaviorAnalysis): Promise<InsightItem[]> {
    if (!this.apiKey) {
      throw new Error('API key missing');
    }
    const prompt = `
    You are a professional fintech financial advisor.
    
    Return ONLY a valid JSON array (no explanation, no extra text).
    
    STRICT RULES:
    - EXACTLY 3 items
    - MUST include:
      1 warning
      1 advice
      1 insight
    - No duplicate types
    - Each message should be 2–3 lines (clear + slightly detailed)
    - Be specific to the user's financial data
    - Avoid generic advice like "save money"
    
    Format:
    [
      {"type":"warning","message":"..."},
      {"type":"advice","message":"..."},
      {"type":"insight","message":"..."}
    ]
    
    Guidelines:
    - WARNING → highlight a serious financial risk
    - ADVICE → give actionable step user can take
    - INSIGHT → explain behavior pattern or spending trend
    
    User Data:
    - Income: ${data.monthlyIncome}
    - Spending: ${data.totalSpend}
    - Top Category: ${data.topCategory}
    - Savings: ${data.savings}
    - Risk Level: ${data.riskLevel}
    - Score: ${data.behaviorScore}
    `;
    try {
      const response = await axios.post<AIResponse>(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:3001',
            'X-Title': 'fintech-app',
          },
        },
      );

      const text = response.data.choices?.[0]?.message?.content ?? '';

      // 🔥 extract JSON safely
      const match = text.match(/\[[\s\S]*\]/);

      if (!match) {
        return [
          {
            type: 'warning',
            message: 'AI format error',
          },
        ];
      }

      let parsed: unknown;

      try {
        parsed = JSON.parse(match[0]);
      } catch {
        return [
          {
            type: 'warning',
            message: 'Invalid AI response',
          },
        ];
      }

      if (!Array.isArray(parsed)) {
        return [
          {
            type: 'warning',
            message: 'Bad AI format',
          },
        ];
      }

      const result: InsightItem[] = parsed
        .filter((item): item is InsightItem => this.isInsightItem(item))
        .slice(0, 3);

      return result.length
        ? result
        : [
            {
              type: 'insight',
              message: 'No insights found',
            },
          ];
    } catch (err) {
      if (axios.isAxiosError(err)) {
        this.logger.error(`API Error: ${err.response?.data || err.message}`);
      } else {
        this.logger.error('Unknown error', err);
      }

      return [
        {
          type: 'warning',
          message: 'AI not working',
        },
      ];
    }
  }

  private generateMockInsights(data: BehaviorAnalysis): InsightItem[] {
    const insights: InsightItem[] = [];

    // Warning based on risk level
    if (data.riskLevel === 'high') {
      insights.push({
        type: 'warning',
        message: `Your spending of ${data.totalSpend} PKR exceeds your income of ${data.monthlyIncome} PKR significantly. This puts you at high financial risk.`,
      });
    } else if (data.riskLevel === 'medium') {
      insights.push({
        type: 'warning',
        message: `Your spending ratio is moderate but could be optimized. Consider reducing expenses in ${data.topCategory} category.`,
      });
    } else {
      insights.push({
        type: 'warning',
        message: `Your financial behavior is strong, but always maintain an emergency fund of at least 3 months' expenses.`,
      });
    }

    // Advice based on savings and assets
    if (data.savings < data.monthlyIncome * 0.1) {
      insights.push({
        type: 'advice',
        message: `Build your savings by setting aside at least 10% of your income monthly. Current savings: ${data.savings} PKR.`,
      });
    } else {
      insights.push({
        type: 'advice',
        message: `Consider investing your savings of ${data.savings} PKR in diversified assets to grow your wealth over time.`,
      });
    }

    // Insight based on spending patterns
    insights.push({
      type: 'insight',
      message: `Your highest spending category is ${data.topCategory}, representing a significant portion of your expenses. This suggests ${data.topCategory === 'food' ? 'focus on meal planning' : data.topCategory === 'transport' ? 'consider more efficient transportation options' : 'potential for cost optimization in this area'}.`,
    });

    return insights;
  }
}
