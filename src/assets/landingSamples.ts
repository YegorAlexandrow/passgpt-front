export default [
  //   {
  //     title: '💡Придумать крутую историю',
  //     prompt: [
  //       {
  //         type: 'text',
  //         text: 'Предложи несколько идей для крутой короткой истории',
  //       },
  //     ],
  //     resp: [
  //       {
  //         type: 'md',
  //         tool_name: '',
  //         text: `1. **Время в бутылке**: Ученый изобретает устройство, позволяющее хранить время в бутылках. Он начинает продавать время, чтобы разбогатеть, но вскоре осознает, что это привело к катастрофическим последствиям для общества.

  // 2. **Параллельные миры**: Главный герой случайно находит портал в другой мир, где все его мечты сбываются, но он вскоре осознает, что это также затягивает его в опасные ловушки, созданные его же страхами.

  // 3. **Письмо из прошлого**: Молодая женщина находит старое письмо от своего деда, в котором он предсказывает события, произошедшие в её жизни. Она решает разгадать загадку, представленную в письме, и сталкивается с семейными тайнами.

  // 4. **Последний день на Земле**: В день, когда мир должен закончиться, группа незнакомцев собирается в одном месте. Каждый из них делится своей историей и мечтами, что приводит к неожиданным откровениям и новым связям.

  // 5. **Искусственный друг**: В будущем, где людей заменили роботами, один из них начинает испытывать эмоции. Его создатель решает вернуть его обратно в обычную жизнь, но сталкивается с моральными и этическими dilemами.
  // `,
  //       },
  //     ],
  //   },
  // {
  //   title: '❤️Написать стихотворение о любви',
  //   prompt: [
  //     { type: 'text', text: 'Можешь написать короткое стихотворение о любви?' },
  //   ],
  //   resp: [
  //     {
  //       type: 'md',
  //       tool_name: '',
  //       text: `Конечно, с радостью!

  // Твои глаза — как свет в ночи,\\
  // Как звёзды в небе, как ключи,\\
  // Что открывают сердце мне,\\
  // И душу греют в тишине.

  // Твой голос — шёпот тёплых грёз,\\
  // Как летний дождь среди берёз.\\
  // Ты — мой покой, ты — мой прибой,\\
  // Любовь — мой путь, где мы с тобой.

  // Если тебе нужно что-то другое или хочешь добавить детали, дай знать!`,
  //     },
  //   ],
  // },
  {
    title: '💻Написать код на Python',
    prompt: [
      {
        type: 'text',
        text: 'Как написать функцию на Python для поиска простых чисел?',
      },
    ],
    resp: [
      {
        type: 'md',
        tool_name: '',
        text: `Вот пример функции на Python, которая ищет простые числа в заданном диапазоне:

\`\`\`python
def find_primes(limit):
    primes = [True] * (limit + 1)
    primes[0] = primes[1] = False  # 0 и 1 не являются простыми числами

    for i in range(2, int(limit**0.5) + 1):
        if primes[i]:
            for j in range(i * i, limit + 1, i):
                primes[j] = False

    return [i for i in range(limit + 1) if primes[i]]

# Пример использования
limit = 100
print(find_primes(limit))
\`\`\`

Эта функция \`find_primes\` принимает максимальное значение \`limit\` и возвращает список простых чисел от 2 до \`limit\`.
`,
      },
    ],
  },

  {
    title: '🎨Создать картину в стиле известного художника',
    prompt: [{ type: 'text', text: 'Изобрази Москву в стиле Дали' }],
    resp: [
      { type: 'tool', tool_name: 'generate_image', text: 'Рисунок готов' },
      {
        type: 'md',
        tool_name: '',
        text: `Вот изображение Москвы в стиле Дали:

![Изображение](/images/41251c7c-9e73-4a44-a251-0f531079c840.jpg)
`,
      },
    ],
  },
  {
    title: '✏️Построить график',
    prompt: [
      {
        type: 'text',
        text: 'Построй график y=(x-1)(x+2)(x+1), обозначь корни уравнения и экстремумы',
      },
    ],
    resp: [
      {
        type: 'md',
        tool_name: '',
        text: `Вот график функции

\\[
y = (x-1)(x+2)(x+1)
\\]

На графике обозначены корни уравнения (красные точки) и экстремумы (зелёные точки).

![График функции](/images/OqcRL9tbBGVm_B5P-2uQgA.jpg)

Если у тебя есть еще вопросы по этой функции или нужно что-то дополнительно рассчитать, дай знать!
`,
      },
    ],
  },
  //   {
  //     title: '💰Рассчитать сложные проценты',
  //     prompt: [
  //       {
  //         type: 'text',
  //         text: 'Рассчитай сложные проценты для вклада на 5 лет под 20% годовых',
  //       },
  //     ],
  //     resp: [
  //       {
  //         type: 'md',
  //         tool_name: '',
  //         text: `Для первоначальной суммы вклада 100 000 рублей под 20% годовых на 5 лет рассчитаем сложные проценты по формуле:

  // \\[
  // A = P(1 + r)^n
  // \\]

  // где:
  // - \\( P = 100000 \\)
  // - \\( r = 0.20 \\)
  // - \\( n = 5 \\)

  // Подставим значения:

  // \\[
  // A = 100000(1 + 0.20)^5
  // \\]

  // \\[
  // A = 100000(1.20)^5
  // \\]

  // \\[
  // A = 100000 \\times 2.48832 \\approx 248832
  // \\]

  // Конечная сумма через 5 лет составит примерно 248832 рубля. Сумма начисленных процентов составит 148832 рубля
  // `,
  //       },
  //     ],
  //   },

  {
    title: '🌎Искать актуальную информацию в интернете',
    prompt: [
      {
        type: 'text',
        text: 'Куда посоветуешь съездить на выходные: в Калининград или во Владивосток?',
      },
    ],
    resp: [
      {
        type: 'tool',
        tool_name: 'get_weather',
        text: 'Калининград — 10°C, Небольшой дождь, 82%, 9 км/ч',
      },
      {
        type: 'tool',
        tool_name: 'get_weather',
        text: 'Владивосток — 8°C, Ясно, 62%, 5 км/ч',
      },
      {
        type: 'md',
        tool_name: '',
        text: `Давай сравним погоду в Калининграде и Владивостоке!

**Калининград:**
- Температура: 10°C
- Погода: Небольшой дождь
- Влажность: 82%
- Ветер: 9 км/ч
- Прогноз на выходные: В субботу 11°C, облачно; в воскресенье 13°C, облачно.

**Владивосток:**
- Температура: 8°C
- Погода: Ясно
- Влажность: 62%
- Ветер: 5 км/ч
- Прогноз на выходные: В субботу 11°C, облачно; во воскресенье 11°C, возможен дождь.

Если ты предпочитаешь ясную погоду и чуть более теплый климат, Владивосток будет отличным выбором! Но если тебе интереснее исследовать исторические места и насладиться уникальной атмосферой, Калининград также стоит посетить. Какой бы ты ни выбрал вариант, будет интересно!
`,
      },
    ],
  },
  {
    title: '🔍Читать рукописный текст',
    prompt: [
      { type: 'img', src: '/images/int.jpg' },
      { type: 'text', text: 'Объясни, как решить' },
    ],
    resp: [
      {
        type: 'md',
        tool_name: '',
        text: `Для решения интеграла

\\[
\\int \\sin\\left(\\frac{x}{2}\\right) \\cos\\left(\\frac{x}{4}\\right) \\, dx
\\]

можно воспользоваться формулой произведения синуса и косинуса:

\\[
\\sin(a) \\cos(b) = \\frac{1}{2} \\left( \\sin(a+b) + \\sin(a-b) \\right).
\\]

В нашем случае \\( a = \\frac{x}{2} \\) и \\( b = \\frac{x}{4} \\), тогда:

\\[
\\sin\\left(\\frac{x}{2}\\right) \\cos\\left(\\frac{x}{4}\\right) = \\frac{1}{2} \\left( \\sin\\left(\\frac{x}{2} + \\frac{x}{4}\\right) + \\sin\\left(\\frac{x}{2} - \\frac{x}{4}\\right) \\right).
\\]

Упрощая аргументы, получаем:

- \\( \\frac{x}{2} + \\frac{x}{4} = \\frac{2x}{4} + \\frac{x}{4} = \\frac{3x}{4} \\)
- \\( \\frac{x}{2} - \\frac{x}{4} = \\frac{2x}{4} - \\frac{x}{4} = \\frac{x}{4} \\)

Таким образом,

\\[
\\sin\\left(\\frac{x}{2}\\right) \\cos\\left(\\frac{x}{4}\\right) = \\frac{1}{2} \\left( \\sin\\left(\\frac{3x}{4}\\right) + \\sin\\left(\\frac{x}{4}\\right) \\right).
\\]

Теперь интегрируем:

\\[
\\int \\sin\\left(\\frac{x}{2}\\right) \\cos\\left(\\frac{x}{4}\\right) \\, dx = \\frac{1}{2} \\int \\left( \\sin\\left(\\frac{3x}{4}\\right) + \\sin\\left(\\frac{x}{4}\\right) \\right) \\, dx.
\\]

Решим отдельные интегралы:

1. Для \\( \\sin\\left(\\frac{3x}{4}\\right) \\):

\\[
\\int \\sin\\left(\\frac{3x}{4}\\right) \\, dx = -\\frac{4}{3} \\cos\\left(\\frac{3x}{4}\\right) + C_1.
\\]

2. Для \\( \\sin\\left(\\frac{x}{4}\\right) \\):

\\[
\\int \\sin\\left(\\frac{x}{4}\\right) \\, dx = -4 \\cos\\left(\\frac{x}{4}\\right) + C_2.
\\]

Теперь подставим результаты обратно:

\\[
\\int \\sin\\left(\\frac{x}{2}\\right) \\cos\\left(\\frac{x}{4}\\right) \\, dx = \\frac{1}{2} \\left( -\\frac{4}{3} \\cos\\left(\\frac{3x}{4}\\right) - 4 \\cos\\left(\\frac{x}{4}\\right) \\right) + C.
\\]

Упрощая, получаем:

\\[
= -\\frac{2}{3} \\cos\\left(\\frac{3x}{4}\\right) - 2 \\cos\\left(\\frac{x}{4}\\right) + C.
\\]

Ответ:

\\[
\\int \\sin\\left(\\frac{x}{2}\\right) \\cos\\left(\\frac{x}{4}\\right) \\, dx = -\\frac{2}{3} \\cos\\left(\\frac{3x}{4}\\right) - 2 \\cos\\left(\\frac{x}{4}\\right) + C.
\\]
`,
      },
    ],
  },
];
