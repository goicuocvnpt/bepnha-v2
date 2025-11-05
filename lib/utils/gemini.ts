import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');

export async function generateRecipeSuggestions(
  ingredients: string[],
  preferences?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
Bạn là một đầu bếp chuyên nghiệp. Dựa trên các nguyên liệu sau, hãy gợi ý 3 món ăn Việt Nam phù hợp:

Nguyên liệu có sẵn:
${ingredients.join(', ')}

${preferences ? `Sở thích: ${preferences}` : ''}

Hãy trả lời theo định dạng sau cho mỗi món:

## [Tên món ăn]
**Mô tả**: [Mô tả ngắn gọn về món ăn]
**Thời gian**: [Thời gian chuẩn bị và nấu]
**Độ khó**: [Dễ/Trung bình/Khó]
**Nguyên liệu chính**:
- [Nguyên liệu 1]
- [Nguyên liệu 2]
- ...

**Các bước cơ bản**:
1. [Bước 1]
2. [Bước 2]
...

---

Hãy tập trung vào các món ăn truyền thống Việt Nam, dễ thực hiện và phù hợp với gia đình.
  `.trim();

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function generateMealPlan(
  numberOfDays: number,
  peopleCount: number,
  preferences?: string
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
Bạn là một chuyên gia dinh dưỡng. Hãy lập thực đơn ${numberOfDays} ngày cho gia đình ${peopleCount} người.

${preferences ? `Yêu cầu đặc biệt: ${preferences}` : ''}

Hãy trả lời theo định dạng sau:

## Ngày 1
**Sáng**: [Món ăn sáng]
**Trưa**: [Món ăn trưa]
**Tối**: [Món ăn tối]

## Ngày 2
...

Lưu ý:
- Đảm bảo cân bằng dinh dưỡng
- Đa dạng các loại thực phẩm
- Phù hợp với khẩu vị Việt Nam
- Dễ thực hiện
  `.trim();

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export async function analyzeNutrition(
  ingredients: { name: string; amount: number; unit: string }[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const ingredientsList = ingredients
    .map((ing) => `- ${ing.name}: ${ing.amount} ${ing.unit}`)
    .join('\n');

  const prompt = `
Phân tích giá trị dinh dưỡng của các nguyên liệu sau:

${ingredientsList}

Hãy ước tính:
1. Tổng calories
2. Protein (g)
3. Carbohydrates (g)
4. Fat (g)
5. Các vitamin và khoáng chất chính

Trả lời ngắn gọn, rõ ràng và chính xác.
  `.trim();

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
