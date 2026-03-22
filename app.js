const express = require('express');

const app = express();
const PORT = 3000;

const escapeHtml = (value) => value
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&#39;');

const books = [
	{ title: 'Кайдашева сім\'я', author: 'Іван Нечуй-Левицький', genre: 'Класика' },
	{ title: 'Лісова пісня', author: 'Леся Українка', genre: 'Драма' },
	{ title: 'Тигролови', author: 'Іван Багряний', genre: 'Роман' },
	{ title: 'Захар Беркут', author: 'Іван Франко', genre: 'Історичний роман' },
	{ title: 'Місто', author: 'Валер\'ян Підмогильний', genre: 'Урбаністичний роман' },
	{ title: 'Тіні забутих предків', author: 'Михайло Коцюбинський', genre: 'Повість' },
];

app.get('/', (req, res) => {
	const query = (req.query.q || '').toString().trim().toLowerCase();
	const safeQuery = escapeHtml(query);
	const filteredBooks = books.filter((book) => {
		const haystack = `${book.title} ${book.author} ${book.genre}`.toLowerCase();
		return !query || haystack.includes(query);
	});

	const booksMarkup = filteredBooks.length
		? filteredBooks.map((book, index) => `
			<li class="book-item">
				<span class="book-index">${index + 1}</span>
				<div>
					<h3>${book.title}</h3>
					<p>${book.author} · ${book.genre}</p>
				</div>
			</li>
		`).join('')
		: '<p class="empty">Нічого не знайдено за вашим запитом.</p>';

	res.send(`
	<!doctype html>
	<html lang="uk">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Міська бібліотека</title>
		<style>
			:root {
				--bg: #f4efe6;
				--paper: #fffaf2;
				--ink: #2a1f1a;
				--accent: #ad2e24;
				--accent-2: #284b63;
				--line: #dccfbf;
			}
			* { box-sizing: border-box; }
			body {
				margin: 0;
				font-family: Georgia, 'Times New Roman', serif;
				color: var(--ink);
				background:
					radial-gradient(circle at 10% 10%, #f9f3e6 0, transparent 35%),
					radial-gradient(circle at 90% 20%, #efe3d0 0, transparent 30%),
					var(--bg);
			}
			main {
				max-width: 980px;
				margin: 30px auto;
				padding: 20px;
				display: grid;
				gap: 18px;
			}
			.hero, .panel {
				background: var(--paper);
				border: 1px solid var(--line);
				border-radius: 16px;
				padding: 22px;
				box-shadow: 0 8px 20px rgba(42, 31, 26, 0.08);
			}
			h1 {
				margin: 0 0 8px;
				font-size: clamp(30px, 5vw, 46px);
				letter-spacing: 0.5px;
			}
			.tag {
				display: inline-block;
				padding: 6px 10px;
				border-radius: 999px;
				background: #f7d8d4;
				color: var(--accent);
				font-weight: 700;
				font-size: 13px;
			}
			form {
				display: flex;
				gap: 10px;
				margin-top: 14px;
				flex-wrap: wrap;
			}
			input {
				flex: 1;
				min-width: 230px;
				padding: 11px 12px;
				border: 1px solid #cfbdab;
				border-radius: 10px;
				font-size: 15px;
			}
			button {
				background: linear-gradient(135deg, var(--accent), #cf4f43);
				color: white;
				border: none;
				padding: 11px 16px;
				border-radius: 10px;
				font-weight: 700;
				cursor: pointer;
			}
			ul {
				list-style: none;
				padding: 0;
				margin: 0;
				display: grid;
				gap: 10px;
			}
			.book-item {
				display: grid;
				grid-template-columns: 36px 1fr;
				align-items: center;
				gap: 10px;
				padding: 12px;
				border: 1px solid var(--line);
				border-radius: 12px;
				background: #fff;
			}
			.book-index {
				display: inline-grid;
				place-items: center;
				width: 30px;
				height: 30px;
				border-radius: 50%;
				background: var(--accent-2);
				color: white;
				font-weight: 700;
			}
			h3 { margin: 0; font-size: 18px; }
			p { margin: 4px 0 0; opacity: 0.85; }
			.grid {
				display: grid;
				grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
				gap: 14px;
			}
			.empty { margin: 6px 0 0; color: var(--accent); font-weight: 700; }
		</style>
	</head>
	<body>
		<main>
			<section class="hero">
				<span class="tag">Міська бібліотека</span>
				<h1>Каталог та події громади</h1>
				<p>Шукайте книги за назвою, автором або жанром.</p>
				<form action="/" method="get">
					<input type="text" name="q" value="${safeQuery}" placeholder="Наприклад: Франко або роман" />
					<button type="submit">Пошук</button>
				</form>
			</section>

			<section class="panel">
				<h2>Доступні книги</h2>
				<ul>${booksMarkup}</ul>
			</section>

			<section class="grid">
				<div class="panel">
					<h2>Години роботи</h2>
					<p>Пн-Пт: 09:00 - 19:00</p>
					<p>Сб: 10:00 - 16:00</p>
					<p>Нд: вихідний</p>
				</div>
				<div class="panel">
					<h2>Контакти</h2>
					<p>м. Ваша громада, вул. Центральна, 12</p>
					<p>+380 (00) 123-45-67</p>
					<p>library@community.ua</p>
				</div>
			</section>
		</main>
	</body>
	</html>
	`);
});

app.listen(PORT, () => {
	console.log(`Library app listening on http://localhost:${PORT}`);
});
