import React from 'react'

import Game, {AutopilotGame} from './Components/Game'

export default function MainText() {
  return <article>
    <p>
      Недавно я допомагала племінниці з математикою. Зазвичай, у нас все йде добре, але інколи вона перечепляється через якусь задачу не може її розв’язати. Чим довше триває ця боротьба із завданням, тим більше її питання змінюються зі «що дано в умові?» і «як це порахувати?» на «навіщо ми цим займаємося?» і «чим мені ця арифметична прогресія допоможе в житті?». Якби я була вчителькою математики, то, певне, би мала наготований список найрізноманітніших способів, як арифметична прогресія помагає нам виживати у цьому світі. Але я не вчителька математиматики, тому замість цього я придумала свій окремий світ. Його єдине призначення — винагороджувати тих, хто знає дещо про арифметичну прогресію. Цей світ має форму малесенької відеогри, для якої ми створимо «штучний інтелект».
    </p>
    <p>
      Знайомся — це гра «Якась назва». Тут оселилася одна істота — Бойл. Він любить гарно попоїсти. Більше того, без смачних страв Бойлове життя починає згасати. Тому щодня йому треба збирати продукти на борщ, голубці чи авокадо-тости. Коли у нього є всі необхідні складові — він може наїстися і поповнити запаси енергії. Але, якщо енергія закінчиться передчасно — це кінець. Тому в деякі дні, коли за продуктами ходити занадто далеко, Бойлові ліпше поспати до завтра. Сон на голодний шлунок все одно його виснажує, і він прокидається ще млявішим. Залишається сподіватися, що новий день принесе швидкий перекус.
    </p>
    <p>
      Допоможи Бойлові вижити впродовж п’яти днів
    </p>
    <Game/>
    <p>
      Керувати ним, можливо, не така аж захоплива справа. Добре було би, якби він мав трохи власного розуму. Напишемо для нього дуже малесенький штучний інтелект, який буде робити всього дві речі. По-перше, визначати, наскільки далеко треба бігти за кожним продуктом. По-друге, вирішувати, чи варта взагалі братися за сьогоднішню страву, чи ліпше поспати.
    </p>

    <h2>Автопілот</h2>
    <p>
      Для початку навчимо Бойла самого бігати з продуктами. На цьому етапі, тобі все ще треба буде приймати рішення спати чи готувати їжу, а все решта він зробить сам.
    </p>
    <p>
      Ця частина Бойлового «розуму» буде складатися з однієї формули. На початку кожного дня в неї підставлятимуться три числа:
    </p>
    <ul>
<li>кількість компонентів</li>
<li>відстань від Бойловго дому до першого з них</li>
<li>відстань між двома сусідніми компонентами (вона завжди однакова)</li>
    </ul>
----------------------  рисунок ----------------------<br/>

<p>
На виході ми матимемо список відстаней, які треба пробігти до першого продукту, до другого і так далі.
</p>
--------------- рисунок ----------------<br/>
<p>
Склади формулу, щоби порахувати, наскільки далеко треба бігти за n-ним продуктом:
<ul>
<li>n - це порядковий номер компонента (за віддаленістю від дому)</li>
<li>d - відстань між двома сусідніми компонентами</li>
<li>a1 - відстань від дому до першого продукта</li>
</ul>
Внизу ти можеш бачити список відстаней, який генерує твоя формула. Якщо ти хочеш подивитися, як Бойл буде поводитися, керований такою формулою, натисни «Запустити»
</p>

------------- віджет для вводу формули -----------------------<br/>
<AutopilotGame/>
<br/>
--------- коли буде успіх, гіфка або відео it’s alive!!! -------------<br/>
<p>
Вітаю! Ти навчив/ла Бойла самостійно пересуватися і, мабуть, вже знаєш, до чого тут арифметична прогресія а, якщо — ні, то зараз дізнаєшся. Список відстаней, які ми отримали на виході — це і є якраз ця сама прогресія. Або, математичною мовою:
</p>

<p>
Послідовність чисел, кожний член якої, починаючи з другого, дорівнює попередньому члену, до якого додано одне й те саме число.
</p>
<p>
Це число (яке треба додати до попереднього члена, щоби отримати наступний) називається різницею арифметичної прогресії. Ми позначали його, як роблять всі математики, літерою d. У нашому випадку це було ціле додатне число, але такі обмеження зовсім не обов’язкові, різниця може бути від’ємною, дробовою, ірраціональною чи ще якоюсь. А може бути і нулем, тоді арифметична прогресія буде просто повторювати одне й те саме нескінченно, як
</p>
<p>
Також, щоби створити Бойловий автопілот, ти використав/ла формулу енного члена прогресії. Впізнаєш її?
</p>
--------- формула n-ного члена прогресії ---------------------------
<p>
Але не повернімося до Бойла, якому досі бракує частини мозку.
</p>

<h2>Вибори, вибори</h2>
<p>
Нова відділ Бойлового мозку має вирішувати, чи варта взагалі братися за куховарство. Він знає, що, якщо проспить день, то втратить 50 енергії. Йому також відомо, яка буде винагорода за приготовану страву, залишилось порахувати її ціну. Якщо різниця між ціною і винагородою менша за 50, то слід постаратися, а ні — чекати ліпшого дня.
</p>
----------- картинка, на якій має бути три варіки: спати, бігти, розвести руками ---------------------<br/>
<p>
Те, наскільки багато енергії слід витратити на приготування якоїсь страви, залежить від відстані, яку треба пробігти. Ми знаємо, що проходження однієї клітинки кошує 0.02 енергії, помноживши це значення на відстань, отримаємо ціну страви.
</p>
<pre>
S * 0.02 - r > 50  -так--> спати
                   -ні---> бігти
</pre>
<p>
Щоби прийняти правильне рішення треба лише дізнатися значення S. Інша частина мозку нашого персонажа вже вміє рахувати відстані до кожного з продуктів, можна було би кожну з них помножити на 2 (бо треба бігти туди і назад) і додати все разом.
</p>
-------- рисунок з відстанями, які треба пробігти ------------<br/>
<p>
Це нормальний варіант, який дасть правильну відповідь. Але, якби раптом Бойлові довелося готувати який-небудь французький буябез, що може містити 15 і більше складових, то це додавання стане трохи марудним. Є легший шлях.
</p>

------ степпер з тим самим рисунком, який допомагає знайти легший шлях -------<br/>

<p>
Тепер ти готова/ий знайти загальну відстань, яку треба пробігти
</p>
------------ віджет для введення формули ----------------<br/>
------------ автокерована гра ----------------<br/>
<AutopilotGame decisionMaker={(level) => level !== 2}/>
<p>
Ну ось, тепер завдяки арифметичній прогресії Бойл має найліпші шанси на життя. А ти винайшов/ла майже формулу суми n перших членів арифметичної прогресії. Чому майже? Бо твоя формула показує подвоєну суму n перших членів арифметичної прогресії — кожну відстань персонаж пробігав двічі. Щоб отримати просто суму, треба ще поділити на 2:
</p>
----------- 2 формули -----------<br/>
<p>
Крім тебе, ці формули винаходили інші люди. Вперше письмово її згадував індійський математик і астроном Аріабхата у 499 році. Також, кажуть, що у школі вчитель заставив майбутнього математика Фрідріха Гаусса рахувати суму чисел від 1 до 100. Замість того, щоб чемно додавати, малий Фрітц перевідкрив оцю формулу. Мій вчитель математики спробував повторити цей трюк, хотів виявити якихось нових Гауссів. Обіцяв 12 балів тому, хто знайде відповідь, поки він сходить до туалету. Замість того, щоб чемно додавати, ми бігали по класу і били одне одного книжками по голові. Ніхто з нас не став великим математиком, до речі.
</p>
------- можливо, малюнок Аріабхати, який плескає по голові малого Гауса ----------<br/>

<h2>Все пов’язано</h2>

------------- conspiracy charlie ----------- <br/>

Можливо, якщо залишиться час:
<ul>
<li>Лінійна функція</li>
<li>Інтегрування</li>
<li></li>
<li>Трикутні числа</li>
<li>Арифметична прогресія другого порядку і квадратні числа</li>
<li>Комбінаторика: кількість рукостискань</li>
</ul>
  </article>
}